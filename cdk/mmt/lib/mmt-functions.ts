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
  corsConfig: {
    allowOrigin: string;
    allowCredentials: boolean;
    allowHeaders: string[];
  };
  defaultLambdaConfig: application.NodeJsFunctionProps;
  s3LambdaRole: iam.IRole;
}

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

    // templates endpoints (top-level)
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

    // proposals - GET/POST /proposals
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'CreateProposalNestedStack'), 'CreateProposalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.proposalsResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'proposals'
      },
      entry: '../../serverless/src/createProposal/handler.js',
      functionName: 'createProposal',
      functionNamePrefix,
      role: s3LambdaRole
    })

    new application.NodeJsFunction(new cdk.NestedStack(scope, 'GetProposalsNestedStack'), 'GetProposalsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.proposalsResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'proposals'
      },
      entry: '../../serverless/src/getProposals/handler.js',
      functionName: 'getProposals',
      functionNamePrefix,
      role: s3LambdaRole
    })

    // proposal by id - GET/PUT/DELETE /proposals/{id}
    new application.NodeJsFunction(new cdk.NestedStack(scope, 'GetProposalNestedStack'), 'GetProposalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.proposalsIdResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        parentPath: 'proposals',
        path: '{id}'
      },
      entry: '../../serverless/src/getProposal/handler.js',
      functionName: 'getProposal',
      functionNamePrefix,
      role: s3LambdaRole
    })

    new application.NodeJsFunction(new cdk.NestedStack(scope, 'UpdateProposalNestedStack'), 'UpdateProposalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.proposalsIdResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['PUT'],
        parentPath: 'proposals',
        path: '{id}'
      },
      entry: '../../serverless/src/updateProposal/handler.js',
      functionName: 'updateProposal',
      functionNamePrefix,
      role: s3LambdaRole
    })

    new application.NodeJsFunction(new cdk.NestedStack(scope, 'DeleteProposalNestedStack'), 'DeleteProposalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: resources.proposalsIdResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['DELETE'],
        parentPath: 'proposals',
        path: '{id}'
      },
      entry: '../../serverless/src/deleteProposal/handler.js',
      functionName: 'deleteProposal',
      functionNamePrefix,
      role: s3LambdaRole
    })

    // provider templates - POST /providers/{providerId}/templates
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

    // provider templates - PUT/DELETE /providers/{providerId}/templates/{id}
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
