import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as kinesis from 'aws-cdk-lib/aws-kinesis'
import * as logs from 'aws-cdk-lib/aws-logs'

import { infrastructure } from '@edsc/cdk-utils'

export interface MmtInfrastructureStackProps extends cdk.StackProps {}

const {
  INFRA_EXPORT_PREFIX = 'cdk',
  STAGE_NAME = 'dev',
  VPC_ID = 'local-vpc'
} = process.env

export class MmtInfrastructureStack extends cdk.Stack {
  public readonly mmtServerlessAppRoleArn: string

  constructor(scope: cdk.App, id: string, props: MmtInfrastructureStackProps = {}) {
    super(scope, id, props)

    // Security group used by application Lambdas
    const lambdaSecurityGroup = new infrastructure.LambdaSecurityGroup(this, 'MMTLambdaSecurityGroup', {
      appName: 'MMT',
      stageName: STAGE_NAME,
      vpcId: VPC_ID
    })

    // Export a Serverless-parity name, but prefixed for parallel deploy safety
    new cdk.CfnOutput(this, 'CfnOutputLambdaSecurityGroup', {
      key: 'LambdaSecurityGroup',
      exportName: `${INFRA_EXPORT_PREFIX}-${STAGE_NAME}-LambdaSecurityGroup`,
      value: lambdaSecurityGroup.securityGroup.ref!.toString()
    })

    // Role used by application lambdas (parity with `serverless-infrastructure.yml`)
    const serverlessAppRole = new iam.CfnRole(this, 'ServerlessAppRole', {
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
      ],
      permissionsBoundary: [
        'arn:aws:iam::',
        this.account,
        ':policy/NGAPShRoleBoundary'
      ].join(''),
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: [
                'lambda.amazonaws.com',
                'states.amazonaws.com',
                'events.amazonaws.com'
              ]
            },
            Action: 'sts:AssumeRole'
          }
        ]
      },
      policies: [
        {
          policyName: 'MMTLambdaBase',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'secretsmanager:GetSecretValue'
                ],
                Resource: '*'
              },
              {
                Effect: 'Allow',
                Action: [
                  'lambda:InvokeFunction'
                ],
                Resource: '*'
              }
            ]
          }
        }
      ]
    })

    this.mmtServerlessAppRoleArn = serverlessAppRole.attrArn

    new cdk.CfnOutput(this, 'CfnOutputMMTServerlessAppRole', {
      key: 'MMTServerlessAppRole',
      description: 'Role used to execute commands across the MMT application',
      exportName: `${INFRA_EXPORT_PREFIX}-${STAGE_NAME}-MMTServerlessAppRole`,
      value: this.mmtServerlessAppRoleArn.toString()
    })

    const destinationArn = this.createLogDestination({
      exportPrefix: INFRA_EXPORT_PREFIX,
      stageName: STAGE_NAME
    })

    new cdk.CfnOutput(this, 'CfnOutputLogDestinationArn', {
      key: 'LogDestinationArn',
      description: 'CloudWatch Logs Destination ARN used by Lambda subscription filters',
      exportName: `${INFRA_EXPORT_PREFIX}-${STAGE_NAME}-LogDestinationArn`,
      value: destinationArn
    })
  }

  private createLogDestination(props: {
    exportPrefix: string;
    stageName: string;
  }): string {
    const { exportPrefix, stageName } = props

    const logStream = new kinesis.Stream(this, 'CentralLogStream', {})

    // Use a CfnRole with inline policy to avoid CloudFormation creating the Logs Destination
    // before the role policy is attached (which can cause the destination "test message" to fail).
    const cwlogsToKinesisRole = new iam.CfnRole(this, 'CwlogsToKinesisRole', {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: `logs.${this.region}.amazonaws.com`
            },
            Action: 'sts:AssumeRole'
          }
        ]
      },
      policies: [
        {
          policyName: `${exportPrefix}-${stageName}-cwlogs-to-kinesis`,
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'kinesis:PutRecord',
                  'kinesis:PutRecords'
                ],
                Resource: logStream.streamArn
              }
            ]
          }
        }
      ]
    })

    const destinationName = `${exportPrefix}-${stageName}-log-destination`

    const destinationArn = cdk.Stack.of(this).formatArn({
      service: 'logs',
      resource: 'destination',
      resourceName: destinationName,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME
    })

    const logDestination = new logs.CfnDestination(this, 'LogDestination', {
      destinationName,
      roleArn: cwlogsToKinesisRole.attrArn,
      targetArn: logStream.streamArn,
      destinationPolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowSubscriptionFilters',
            Effect: 'Allow',
            Principal: { AWS: this.account },
            Action: 'logs:PutSubscriptionFilter',
            Resource: destinationArn
          }
        ]
      })
    })

    logDestination.addDependency(logStream.node.defaultChild as cdk.CfnResource)
    logDestination.addDependency(cwlogsToKinesisRole)

    return destinationArn
  }
}
