import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { MmtApiOptionsMethod } from './mmt-api-gateway-options-method'

export interface MmtApiResourcesProps {
  apiGatewayDeployment: cdk.aws_apigateway.CfnDeployment;
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
  corsConfig: {
    allowOrigin: string;
    allowCredentials: boolean;
    allowHeaders: string[];
  };
}

export class MmtApiResources extends Construct {
  public readonly edlCallbackResource: apigateway.CfnResource
  public readonly edlLoginResource: apigateway.CfnResource
  public readonly edlRefreshTokenResource: apigateway.CfnResource
  public readonly errorLoggerResource: apigateway.CfnResource
  public readonly gkrKeywordRecommendationsResource: apigateway.CfnResource
  public readonly gkrSendFeedbackResource: apigateway.CfnResource
  public readonly providersTemplatesResource: apigateway.CfnResource
  public readonly providersTemplatesIdResource: apigateway.CfnResource
  public readonly templatesResource: apigateway.CfnResource
  public readonly templatesIdResource: apigateway.CfnResource
  public readonly usersResource: apigateway.CfnResource

  constructor(scope: cdk.Stack, id: string, props: MmtApiResourcesProps) {
    super(scope, id)

    const { apiGatewayDeployment, apiGatewayRestApi, corsConfig } = props

    const rootId = apiGatewayRestApi.attrRootResourceId

    const makeRootResource = (logicalIdSuffix: string, pathPart: string) => new apigateway.CfnResource(scope, `ApiGatewayResource${logicalIdSuffix}`, {
      parentId: rootId,
      pathPart,
      restApiId: apiGatewayRestApi.ref
    })

    const {
      allowCredentials,
      allowHeaders,
      allowOrigin
    } = corsConfig

    const addOptions = (optionsId: string, apiGatewayResource: apigateway.CfnResource, methods: string[]) => {
      new MmtApiOptionsMethod(scope, optionsId, {
        apiGatewayDeployment,
        apiGatewayResource,
        apiGatewayRestApi,
        allowCredentials,
        allowHeaders,
        allowOrigin,
        methods,
        name: optionsId.replace(/[^A-Za-z0-9]/g, '')
      })
    }

    // Simple root resources
    const errorLoggerResource = makeRootResource('ErrorLogger', 'error-logger')
    this.errorLoggerResource = errorLoggerResource
    addOptions('ErrorLogger', errorLoggerResource, ['POST'])

    const edlLoginResource = makeRootResource('Login', 'login')
    this.edlLoginResource = edlLoginResource
    addOptions('Login', edlLoginResource, ['GET'])

    const edlCallbackResource = makeRootResource('UrsCallback', 'urs_callback')
    this.edlCallbackResource = edlCallbackResource
    addOptions('UrsCallback', edlCallbackResource, ['GET'])

    const edlRefreshTokenResource = makeRootResource('EdlRefreshToken', 'edl-refresh-token')
    this.edlRefreshTokenResource = edlRefreshTokenResource
    addOptions('EdlRefreshToken', edlRefreshTokenResource, ['POST'])

    const gkrKeywordRecommendationsResource = makeRootResource('GkrKeywordRecommendations', 'gkr-keyword-recommendations')
    this.gkrKeywordRecommendationsResource = gkrKeywordRecommendationsResource
    addOptions('GkrKeywordRecommendations', gkrKeywordRecommendationsResource, ['POST'])

    const gkrSendFeedbackResource = makeRootResource('GkrSendFeedback', 'gkr-send-feedback')
    this.gkrSendFeedbackResource = gkrSendFeedbackResource
    addOptions('GkrSendFeedback', gkrSendFeedbackResource, ['PUT'])

    const usersResource = makeRootResource('Users', 'users')
    this.usersResource = usersResource
    addOptions('Users', usersResource, ['GET'])

    const providersResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceProviders', {
      parentId: rootId,
      pathPart: 'providers',
      restApiId: apiGatewayRestApi.ref
    })

    const providerIdResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceProvidersProviderIdVar', {
      parentId: providersResource.ref,
      pathPart: '{providerId}',
      restApiId: apiGatewayRestApi.ref
    })

    const providersTemplatesResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceProvidersProviderIdVarTemplates', {
      parentId: providerIdResource.ref,
      pathPart: 'templates',
      restApiId: apiGatewayRestApi.ref
    })
    this.providersTemplatesResource = providersTemplatesResource

    const providersTemplatesIdResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceProvidersProviderIdVarTemplatesIdVar', {
      parentId: providersTemplatesResource.ref,
      pathPart: '{id}',
      restApiId: apiGatewayRestApi.ref
    })
    this.providersTemplatesIdResource = providersTemplatesIdResource

    const templatesResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceTemplates', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'templates',
      restApiId: apiGatewayRestApi.ref
    })
    this.templatesResource = templatesResource

    const templatesIdResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceTemplatesIdVar', {
      parentId: templatesResource.ref,
      pathPart: '{id}',
      restApiId: apiGatewayRestApi.ref
    })
    this.templatesIdResource = templatesIdResource

    // OPTIONS methods for shared resources.
    addOptions('ProvidersProviderIdVarTemplates', providersTemplatesResource, ['POST'])

    addOptions('ProvidersProviderIdVarTemplatesIdVar', providersTemplatesIdResource, ['PUT', 'DELETE'])

    addOptions('TemplatesIdVar', templatesIdResource, ['GET'])

    addOptions('Templates', templatesResource, ['GET'])
  }
}
