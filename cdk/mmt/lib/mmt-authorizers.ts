import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'

export interface MmtAuthorizersProps {
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
  defaultLambdaConfig: application.NodeJsFunctionProps;
}

/**
 * Defines API Gateway Lambda authorizers used by MMT routes and exposes
 * generated authorizer resources for downstream API method bindings.
 */
export class MmtAuthorizers extends Construct {
  public readonly edlAuthorizer: apigateway.CfnAuthorizer

  constructor(scope: cdk.Stack, id: string, props: MmtAuthorizersProps) {
    super(scope, id)

    const { apiGatewayRestApi, defaultLambdaConfig } = props
    const functionNamePrefix = scope.stackName

    const edlAuthorizerNestedStack = new cdk.NestedStack(scope, 'EdlAuthorizerNestedStack')
    const { lambdaFunction: edlAuthorizerLambda } = new application.NodeJsFunction(edlAuthorizerNestedStack, 'EdlAuthorizerLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/edlAuthorizer/handler.js',
      functionName: 'edlAuthorizer',
      functionNamePrefix
    })

    new lambda.CfnPermission(scope, 'EdlAuthorizerLambdaPermissionApiGateway', {
      functionName: edlAuthorizerLambda.functionName,
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

    this.edlAuthorizer = new apigateway.CfnAuthorizer(edlAuthorizerNestedStack, 'EdlAuthorizer', {
      authorizerResultTtlInSeconds: 0,
      authorizerUri: cdk.Fn.join('', [
        'arn:',
        cdk.Aws.PARTITION,
        ':apigateway:',
        cdk.Aws.REGION,
        ':lambda:path/2015-03-31/functions/',
        edlAuthorizerLambda.functionArn,
        '/invocations'
      ]),
      identitySource: 'method.request.header.Authorization',
      name: 'edlAuthorizer',
      restApiId: apiGatewayRestApi.ref,
      type: 'REQUEST'
    })
  }
}
