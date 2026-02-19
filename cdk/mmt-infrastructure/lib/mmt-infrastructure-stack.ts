import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

import { infrastructure } from '@edsc/cdk-utils'

export interface MmtInfrastructureStackProps extends cdk.StackProps {}

const {
  INFRA_EXPORT_PREFIX = 'cdk',
  STAGE_NAME = 'dev',
  VPC_ID = 'local-vpc'
} = process.env

/**
 * Provisions shared infrastructure consumed by the MMT application stack,
 * including Lambda networking and the cross-stack execution role exports.
 */
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
  }
}
