import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'

import { application } from '@edsc/cdk-utils'

import { MmtAuthorizers } from './mmt-authorizers'
import { MmtFunctions } from './mmt-functions'

export interface MmtStackProps extends cdk.StackProps {}

const {
  STAGE_NAME = 'dev',
  COLLECTION_TEMPLATES_BUCKET_NAME = `mmt-${STAGE_NAME}-collection-templates`,
  STAGING_CONCEPTS_BUCKET_NAME = `mmt-${STAGE_NAME}-staging-concepts`,
  STAGING_API_KEY = 'local-staging-api-key',
  // Cross-environment "stage for production" forwarding: where this environment's
  // `stageConceptForProduction` Lambda forwards staged concepts to. The typical
  // target is Production (set for the UAT deployment), but it can be any MMT
  // environment. Empty elsewhere (the forwarding Lambda returns 500 if invoked).
  STAGING_TARGET_API_HOST = '',
  STAGING_TARGET_MMT_HOST = '',
  STAGING_TARGET_API_KEY = 'local-staging-api-key',
  COOKIE_DOMAIN = '.localhost',
  EDL_CLIENT_ID = '',
  EDL_PASSWORD = '',
  GTM_PROPERTY_ID = '',
  JWT_SECRET = 'local-secret',
  JWT_VALID_TIME = '900',
  LAMBDA_TIMEOUT = '30',
  LOG_DESTINATION_ARN = 'local-arn',
  MMT_HOST = 'http://localhost:5173',
  NODE_ENV = 'development',
  SUBNET_ID_A = 'subnetIdA',
  SUBNET_ID_B = 'subnetIdB',
  SUBNET_ID_C = 'subnetIdC',
  VPC_ID = 'local-vpc'
} = process.env

const runtime = lambda.Runtime.NODEJS_20_X
const INFRA_EXPORT_PREFIX = 'cdk'

// Well-known placeholder used for local dev / offline runs. It is committed to
// the repo, so it must never reach a deployed environment.
const LOCAL_STAGING_API_KEY_PLACEHOLDER = 'local-staging-api-key'

// bin/deploy-bamboo.sh sets NODE_ENV=production for every deployed stage; local
// `run-synth` (prestart:api) does not, so this only fails real deployments.
const isDeployedEnvironment = NODE_ENV === 'production'

const isMissingOrPlaceholder = (value: string) => !value || value === LOCAL_STAGING_API_KEY_PLACEHOLDER

if (isDeployedEnvironment) {
  // The staging API key is the only credential in front of the
  // machine-to-machine createOrUpdateStagedConcept route. Fail the synth rather than
  // ship the source-controlled placeholder if the Bamboo variable is missing.
  if (isMissingOrPlaceholder(STAGING_API_KEY)) {
    throw new Error('STAGING_API_KEY must be set to a non-placeholder value for deployed environments')
  }

  // STAGING_TARGET_API_KEY is only used by the "stage for production" forwarding
  // Lambda, i.e. when STAGING_TARGET_API_HOST is configured.
  if (STAGING_TARGET_API_HOST && isMissingOrPlaceholder(STAGING_TARGET_API_KEY)) {
    throw new Error('STAGING_TARGET_API_KEY must be set to a non-placeholder value when STAGING_TARGET_API_HOST is configured')
  }
}

const allowHeaders = [
  'Access-Control-Allow-Origin',
  'Access-Control-Allow-Credentials',
  'Access-Control-Request-Headers',
  'Access-Control-Request-Methods',
  'Authorization',
  'Origin',
  'Staging-Api-Key',
  'User-Agent'
]

/**
 * Main MMT application stack that composes the private API Gateway, authorizer,
 * Lambda handlers, and IAM/VPC wiring used by the API tier.
 */
export class MmtStack extends cdk.Stack {
  public readonly serviceEndpoint: string

  constructor(scope: cdk.App, id: string, props: MmtStackProps = {}) {
    super(scope, id, props)


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

    // Shared environment for every Lambda. The staging API keys are deliberately
    // NOT here - they are the credentials guarding the machine-to-machine
    // concept routes, so they are passed only to the handlers that need them
    // (see `stagingApiKey` and `stagingTargetConfig` below).
    const environment = {
      COLLECTION_TEMPLATES_BUCKET_NAME,
      STAGING_CONCEPTS_BUCKET_NAME,
      COOKIE_DOMAIN,
      EDL_CLIENT_ID,
      EDL_PASSWORD,
      GTM_PROPERTY_ID,
      JWT_SECRET,
      JWT_VALID_TIME,
      NODE_OPTIONS: '--enable-source-maps'
    }

    // Secret the `stagingApiKeyAuthorizer` compares the inbound `Staging-Api-Key`
    // header against. Not in the shared Lambda environment.
    const stagingApiKey = STAGING_API_KEY

    // Config for the `stageConceptForProduction` forwarding Lambda: the MMT
    // environment it forwards staged concepts to. Typically only set for the UAT
    // deployment (target = Production).
    const stagingTargetConfig = {
      STAGING_TARGET_API_HOST,
      STAGING_TARGET_MMT_HOST,
      STAGING_TARGET_API_KEY
    }

    const defaultLambdaConfig: application.NodeJsFunctionProps = {
      bundling: {
        // Bundle runtime dependencies into the Lambda artifact.
        // Externalizing all packages causes Runtime.ImportModuleError in Lambda
        // (for example: missing `jsonwebtoken`).
        minify: NODE_ENV === 'production',
        externalModules: ['@aws-sdk/*']
      },
      entry: '',
      environment,
      functionName: '',
      logDestinationArn: LOG_DESTINATION_ARN,
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

    // Staging concepts bucket. Objects are transient promotion artifacts, so
    // they expire 30 days after creation. RETAIN keeps staged data if the stack
    // is ever destroyed.
    // eslint-disable-next-line no-new
    new s3.Bucket(this, 'StagingConceptsBucket', {
      bucketName: STAGING_CONCEPTS_BUCKET_NAME,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      lifecycleRules: [{
        id: 'expire-staged-concepts',
        enabled: true,
        expiration: cdk.Duration.days(30)
      }]
    })

    const authorizers = new MmtAuthorizers(this, 'Authorizers', {
      apiGatewayRestApi,
      defaultLambdaConfig,
      stagingApiKey
    })

    // eslint-disable-next-line no-new
    new MmtFunctions(this, 'Functions', {
      apiGatewayDeployment,
      apiGatewayRestApi,
      authorizers: {
        edlAuthorizer: authorizers.edlAuthorizer,
        stagingApiKeyAuthorizer: authorizers.stagingApiKeyAuthorizer
      },
      corsConfig: {
        allowCredentials: true,
        allowHeaders,
        allowOrigin: MMT_HOST
      },
      defaultLambdaConfig,
      stagingTargetConfig,
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
