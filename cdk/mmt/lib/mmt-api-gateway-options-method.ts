import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

export interface MmtApiOptionsMethodProps {
  apiGatewayDeployment: cdk.aws_apigateway.CfnDeployment;
  apiGatewayResource: cdk.aws_apigateway.CfnResource;
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
  allowOrigin: string;
  allowCredentials: boolean;
  allowHeaders: string[];
  methods: string[];
  name: string;
}

/**
 * Encapsulates creation of a mock API Gateway OPTIONS method that returns
 * CORS headers for a specific API resource and allowed HTTP methods.
 */
export class MmtApiOptionsMethod extends Construct {
  constructor(scope: cdk.Stack, id: string, props: MmtApiOptionsMethodProps) {
    super(scope, id)

    const {
      apiGatewayDeployment,
      apiGatewayResource,
      apiGatewayRestApi,
      allowOrigin,
      allowCredentials,
      allowHeaders,
      methods,
      name
    } = props

    const apiGatewayMethodOptions = new apigateway.CfnMethod(scope, `ApiGatewayMethod${name}Options`, {
      authorizationType: 'NONE',
      httpMethod: 'OPTIONS',
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            ...(allowCredentials ? { 'method.response.header.Access-Control-Allow-Credentials': true } : {})
          },
          responseModels: {}
        }
      ],
      requestParameters: {},
      integration: {
        type: 'MOCK',
        requestTemplates: {
          'application/json': '{statusCode:200}'
        },
        contentHandling: 'CONVERT_TO_TEXT',
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': `'${allowOrigin}'`,
              'method.response.header.Access-Control-Allow-Headers': `'${allowHeaders.join(',')}'`,
              'method.response.header.Access-Control-Allow-Methods': `'OPTIONS,${methods.join(',')}'`,
              ...(allowCredentials ? { 'method.response.header.Access-Control-Allow-Credentials': "'true'" } : {})
            },
            responseTemplates: {
              'application/json': ''
            }
          }
        ]
      },
      resourceId: apiGatewayResource.ref,
      restApiId: apiGatewayRestApi.ref
    })

    apiGatewayDeployment.addDependency(apiGatewayMethodOptions)
  }
}
