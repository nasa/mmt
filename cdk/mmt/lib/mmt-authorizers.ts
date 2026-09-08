import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'

export interface MmtAuthorizersProps {
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
  defaultLambdaConfig: application.NodeJsFunctionProps;
  // Shared secret for the machine-to-machine concept routes. Injected only into
  // `stagingApiKeyAuthorizer`, not the shared Lambda environment.
  stagingApiKey: string;
}

/**
 * Defines API Gateway Lambda authorizers used by MMT routes and exposes
 * generated authorizer resources for downstream API method bindings.
 */
export class MmtAuthorizers extends Construct {
  public readonly edlAuthorizer: apigateway.CfnAuthorizer

  public readonly stagingApiKeyAuthorizer: apigateway.CfnAuthorizer

  constructor(scope: cdk.Stack, id: string, props: MmtAuthorizersProps) {
    super(scope, id)

    const { apiGatewayRestApi, defaultLambdaConfig, stagingApiKey } = props
    const functionNamePrefix = scope.stackName

    // Creates a REQUEST authorizer backed by a serverless handler, plus the
    // API Gateway invoke permission for its Lambda.
    const makeRequestAuthorizer = (
      nestedStackId: string,
      lambdaId: string,
      authorizerId: string,
      functionName: string,
      entry: string,
      identitySource: string,
      extraEnvironment: { [key: string]: string } = {}
    ) => {
      const nestedStack = new cdk.NestedStack(scope, nestedStackId)

      const { lambdaFunction } = new application.NodeJsFunction(nestedStack, lambdaId, {
        ...defaultLambdaConfig,
        entry,
        environment: {
          ...defaultLambdaConfig.environment,
          ...extraEnvironment
        },
        functionName,
        functionNamePrefix
      })

      new lambda.CfnPermission(scope, `${lambdaId}PermissionApiGateway`, {
        functionName: lambdaFunction.functionName,
        action: 'lambda:InvokeFunction',
        principal: 'apigateway.amazonaws.com',
        sourceArn: [
          'arn:',
          scope.partition,
          ':execute-api:',
          scope.region,
          ':',
          scope.account,
          ':',
          apiGatewayRestApi.ref,
          '/*/*'
        ].join('')
      })

      return new apigateway.CfnAuthorizer(nestedStack, authorizerId, {
        authorizerResultTtlInSeconds: 0,
        authorizerUri: cdk.Fn.join('', [
          'arn:',
          cdk.Aws.PARTITION,
          ':apigateway:',
          cdk.Aws.REGION,
          ':lambda:path/2015-03-31/functions/',
          lambdaFunction.functionArn,
          '/invocations'
        ]),
        identitySource,
        name: functionName,
        restApiId: apiGatewayRestApi.ref,
        type: 'REQUEST'
      })
    }

    this.edlAuthorizer = makeRequestAuthorizer(
      'EdlAuthorizerNestedStack',
      'EdlAuthorizerLambda',
      'EdlAuthorizer',
      'edlAuthorizer',
      '../../serverless/src/edlAuthorizer/handler.js',
      'method.request.header.Authorization'
    )

    // API-key authorizer for the machine-to-machine "staging concepts" routes.
    // The caller (the MMT UAT forwarding Lambda) authenticates with a shared
    // secret in the Staging-Api-Key header.
    this.stagingApiKeyAuthorizer = makeRequestAuthorizer(
      'StagingApiKeyAuthorizerNestedStack',
      'StagingApiKeyAuthorizerLambda',
      'StagingApiKeyAuthorizer',
      'stagingApiKeyAuthorizer',
      '../../serverless/src/stagingApiKeyAuthorizer/handler.js',
      'method.request.header.Staging-Api-Key',
      { STAGING_API_KEY: stagingApiKey }
    )
  }
}
