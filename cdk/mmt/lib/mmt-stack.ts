import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'

import { application } from '@edsc/cdk-utils'

import { MmtAuthorizers } from './mmt-authorizers'
import { MmtFunctions } from './mmt-functions'

export interface MmtStackProps extends cdk.StackProps {}

const {
  COLLECTION_PROPOSALS_BUCKET_NAME,
  COLLECTION_TEMPLATES_BUCKET_NAME,
  COOKIE_DOMAIN = '.localhost',
  EDL_CLIENT_ID = '',
  EDL_PASSWORD = '',
  GTM_PROPERTY_ID = '',
  INFRA_EXPORT_PREFIX = 'cdk',
  JWT_SECRET = 'local-secret',
  JWT_VALID_TIME = '900',
  LAMBDA_TIMEOUT = '30',
  LOG_DESTINATION_ARN = 'local-arn',
  MMT_HOST = 'http://localhost:5173',
  STAGE_NAME = 'dev',
  SUBNET_ID_A = 'subnetIdA',
  SUBNET_ID_B = 'subnetIdB',
  SUBNET_ID_C = 'subnetIdC',
  VPC_ID = 'local-vpc'
} = process.env

const runtime = lambda.Runtime.NODEJS_20_X

const allowHeaders = [
  'Access-Control-Allow-Origin',
  'Access-Control-Allow-Credentials',
  'Access-Control-Request-Headers',
  'Access-Control-Request-Methods',
  'Authorization',
  'Origin',
  'User-Agent'
]

export class MmtStack extends cdk.Stack {
  public readonly serviceEndpoint: string

  constructor(scope: cdk.App, id: string, props: MmtStackProps = {}) {
    super(scope, id, props)

    // Ensure LogGroup/Lambda names don't collide with pre-existing resources from earlier attempts.
    // Derive a short unique suffix from the CloudFormation StackId GUID (stable for a given stack instance).
    // This avoids collisions when a failed stack leaves behind log groups, without requiring a manual env var.
    const stackGuid = cdk.Fn.select(2, cdk.Fn.split('/', cdk.Stack.of(this).stackId))
    const stackGuidPrefix = cdk.Fn.select(0, cdk.Fn.split('-', stackGuid))
    const logGroupSuffix = `-${stackGuidPrefix}`

    const importExport = (name: string) => cdk.Fn.importValue(`${INFRA_EXPORT_PREFIX}-${STAGE_NAME}-${name}`)

    // Import from the CDK infrastructure stack (exported with INFRA_EXPORT_PREFIX)
    const applicationRoleArn = importExport('MMTServerlessAppRole')
    const lambdaSecurityGroupId = importExport('LambdaSecurityGroup')

    const lambdaRole = iam.Role.fromRoleArn(this, 'MmtLambdaRole', applicationRoleArn)
    const lambdaSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'MmtLambdaSecurityGroup', lambdaSecurityGroupId)

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
      privateSubnetIds: [SUBNET_ID_A, SUBNET_ID_B, SUBNET_ID_C],
      vpcId: VPC_ID
    })

    const apiNestedStack = new cdk.NestedStack(this, 'ApiNestedStack')
    const apiGateway = new application.ApiGateway(this, 'ApiGateway', {
      apiScope: apiNestedStack,
      apiName: this.stackName,
      stageName: STAGE_NAME
    })

    const { apiGatewayDeployment, apiGatewayRestApi } = apiGateway

    if (!COLLECTION_TEMPLATES_BUCKET_NAME || !COLLECTION_PROPOSALS_BUCKET_NAME) {
      throw new Error('COLLECTION_TEMPLATES_BUCKET_NAME and COLLECTION_PROPOSALS_BUCKET_NAME must be set for MmtStack')
    }

    const environment = {
      COLLECTION_TEMPLATES_BUCKET_NAME,
      COLLECTION_PROPOSALS_BUCKET_NAME,
      COOKIE_DOMAIN,
      EDL_CLIENT_ID,
      EDL_PASSWORD,
      GTM_PROPERTY_ID,
      JWT_SECRET,
      JWT_VALID_TIME,
      NODE_OPTIONS: '--enable-source-maps'
    }

    const defaultLambdaConfig: application.NodeJsFunctionProps = {
      bundling: {
        // Bundle runtime dependencies into the Lambda artifact.
        // Externalizing all packages causes Runtime.ImportModuleError in Lambda
        // (for example: missing `jsonwebtoken`).
        minify: STAGE_NAME !== 'dev',
        externalModules: ['@aws-sdk/*']
      },
      entry: '',
      environment,
      functionName: '',
      logDestinationArn: LOG_DESTINATION_ARN,
      logGroupSuffix,
      memorySize: 256,
      role: lambdaRole,
      runtime,
      securityGroups: [lambdaSecurityGroup],
      stageName: STAGE_NAME,
      timeout: cdk.Duration.seconds(parseInt(LAMBDA_TIMEOUT, 10)),
      vpc
    }

    // Custom role used by lambdas that need broad S3 permissions (parity with Serverless `IamRoleCustomResourcesLambdaExecution`)
    const iamRoleCustomResourcesLambdaExecution = new iam.Role(this, 'IamRoleCustomResourcesLambdaExecution', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'AwsLambdaVpcAccessExecutionRole', 'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole')
      ],
      permissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(this, 'PermissionBoundary', [
        'arn:aws:iam::',
        this.account,
        ':policy/NGAPShRoleBoundary'
      ].join(''))
    })

    iamRoleCustomResourcesLambdaExecution.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetBucketLocation',
        's3:ListBucket',
        's3:ListAllMyBuckets',
        's3:GetObject',
        's3:PutObject',
        's3:DeleteObject'
      ],
      resources: ['*']
    }))

    const authorizers = new MmtAuthorizers(this, 'Authorizers', {
      apiGatewayRestApi,
      defaultLambdaConfig
    })

    // eslint-disable-next-line no-new
    new MmtFunctions(this, 'Functions', {
      apiGatewayDeployment,
      apiGatewayRestApi,
      authorizers: {
        edlAuthorizer: authorizers.edlAuthorizer
      },
      corsConfig: {
        allowCredentials: true,
        allowHeaders,
        allowOrigin: MMT_HOST
      },
      defaultLambdaConfig,
      s3LambdaRole: iamRoleCustomResourcesLambdaExecution
    })

    this.serviceEndpoint = [
      'https://',
      apiGatewayRestApi.ref,
      '.execute-api.',
      this.region,
      '.',
      this.urlSuffix,
      `/${STAGE_NAME}`
    ].join('')

    new cdk.CfnOutput(this, 'CfnOutputServiceEndpoint', {
      key: 'ServiceEndpoint',
      description: 'URL of the service endpoint',
      exportName: `sls-${this.stackName}-ServiceEndpoint`,
      value: this.serviceEndpoint.toString()
    })
  }
}
