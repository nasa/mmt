import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'

import { MmtApiResources } from './mmt-shared-api-gateway-resources'

export interface MmtFunctionsProps {
  apiGatewayDeployment: cdk.aws_apigateway.CfnDeployment;
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
  authorizers: {
    edlAuthorizer: apigateway.CfnAuthorizer;
  };
  // MMT keeps explicit CORS config so API Gateway OPTIONS responses can control:
  // - allowOrigin: which browser origin can call the API
  // - allowCredentials: whether auth/cookie-based requests are allowed
  // - allowHeaders: which request headers are permitted
  // EDSC uses cdk-utils defaults, but in MMT these defaults are not currently adjustable
  // through the consumed library version. Removing this custom config can break browser
  // auth/cookie and header behavior unless @edsc/cdk-utils is upgraded/patched.
  corsConfig: {
    allowOrigin: string;
    allowCredentials: boolean;
    allowHeaders: string[];
  };
  defaultLambdaConfig: application.NodeJsFunctionProps;
  s3LambdaRole: iam.IRole;
}

/**
 * Provisions MMT API Lambda functions and attaches them to API Gateway
 * resources/methods, including protected template and provider endpoints.
 */
export class MmtFunctions extends Construct {
  constructor(scope: cdk.Stack, id: string, props: MmtFunctionsProps) {
    super(scope, id)

    const {
      apiGatewayDeployment,
      apiGatewayRestApi,
      authorizers,
      corsConfig,
      defaultLambdaConfig,
      s3LambdaRole
    } = props

    const functionNamePrefix = scope.stackName

    const resources = new MmtApiResources(scope, 'ApiResources', {
      apiGatewayDeployment,
      apiGatewayRestApi,
      corsConfig
    })

    // errorLogger - POST /error-logger
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'ErrorLoggerNestedStack'), 'ErrorLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.errorLoggerResource,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'error-logger'
      },
      entry: '../../serverless/src/errorLogger/handler.js',
      functionName: 'errorLogger',
      functionNamePrefix
    })

    // edlLogin - GET /login
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'EdlLoginNestedStack'), 'EdlLoginLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.edlLoginResource,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'login'
      },
      entry: '../../serverless/src/edlLogin/handler.js',
      functionName: 'edlLogin',
      functionNamePrefix
    })

    // edlCallback - GET /urs_callback
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'EdlCallbackNestedStack'), 'EdlCallbackLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.edlCallbackResource,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'urs_callback'
      },
      entry: '../../serverless/src/edlCallback/handler.js',
      functionName: 'edlCallback',
      functionNamePrefix
    })

    // edlRefreshToken - POST /edl-refresh-token
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'EdlRefreshTokenNestedStack'), 'EdlRefreshTokenLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.edlRefreshTokenResource,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'edl-refresh-token'
      },
      entry: '../../serverless/src/edlRefreshToken/handler.js',
      functionName: 'edlRefreshToken',
      functionNamePrefix
    })

    // gkrKeywordRecommendations - POST /gkr-keyword-recommendations
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'GkrKeywordRecommendationsNestedStack'), 'GkrKeywordRecommendationsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.gkrKeywordRecommendationsResource,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'gkr-keyword-recommendations'
      },
      entry: '../../serverless/src/gkrKeywordRecommendations/handler.js',
      functionName: 'gkrKeywordRecommendations',
      functionNamePrefix
    })

    // gkrSendFeedback - PUT /gkr-send-feedback
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'GkrSendFeedbackNestedStack'), 'GkrSendFeedbackLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.gkrSendFeedbackResource,
        apiGatewayRestApi,
        methods: ['PUT'],
        path: 'gkr-send-feedback'
      },
      entry: '../../serverless/src/gkrSendFeedback/handler.js',
      functionName: 'gkrSendFeedback',
      functionNamePrefix
    })

    // users - GET /users
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'GetEdlUsersNestedStack'), 'GetEdlUsersLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.usersResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'users'
      },
      entry: '../../serverless/src/getEdlUsers/handler.js',
      functionName: 'getEdlUsers',
      functionNamePrefix,
      role: s3LambdaRole
    })


    // getTemplates - GET /templates
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'GetTemplatesNestedStack'), 'GetTemplatesLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.templatesResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'templates'
      },
      entry: '../../serverless/src/getTemplates/handler.js',
      functionName: 'getTemplates',
      functionNamePrefix,
      role: s3LambdaRole
    })

    // getTemplate - GET /templates/{id}
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'GetTemplateNestedStack'), 'GetTemplateLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.templatesIdResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        parentPath: 'templates',
        path: '{id}'
      },
      entry: '../../serverless/src/getTemplate/handler.js',
      functionName: 'getTemplate',
      functionNamePrefix,
      role: s3LambdaRole
    })

    // createTemplate - POST /providers/{providerId}/templates
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'CreateTemplateNestedStack'), 'CreateTemplateLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.providersTemplatesResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        parentPath: 'providersProviderIdVar',
        path: 'templates'
      },
      entry: '../../serverless/src/createTemplate/handler.js',
      functionName: 'createTemplate',
      functionNamePrefix,
      role: s3LambdaRole
    })

    // updateTemplate - PUT /providers/{providerId}/templates/{id}
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'UpdateTemplateNestedStack'), 'UpdateTemplateLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.providersTemplatesIdResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['PUT'],
        parentPath: 'providersProviderIdVarTemplates',
        path: '{id}'
      },
      entry: '../../serverless/src/updateTemplate/handler.js',
      functionName: 'updateTemplate',
      functionNamePrefix,
      role: s3LambdaRole
    })

    // deleteTemplate - DELETE /providers/{providerId}/templates/{id}
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'DeleteTemplateNestedStack'), 'DeleteTemplateLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.providersTemplatesIdResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['DELETE'],
        parentPath: 'providersProviderIdVarTemplates',
        path: '{id}'
      },
      entry: '../../serverless/src/deleteTemplate/handler.js',
      functionName: 'deleteTemplate',
      functionNamePrefix,
      role: s3LambdaRole
    })
  }
}
