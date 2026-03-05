import fs from 'fs'
import path from 'path'

/**
 * Reads and parses a nested CloudFormation template JSON file.
 *
 * @param {string} file
 * @returns {Record<string, any>}
 */
const getNestedStack = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

/**
 * Resolves a nested stack output reference from a `Fn::GetAtt` value.
 *
 * @param {[string, string]} getAtt
 * @param {Record<string, any>} template
 * @param {string} templateFilePath
 * @returns {string}
 */
const getResourceFromGetAtt = (getAtt, template, templateFilePath) => {
  const [resourceName, attribute] = getAtt
  const nestedStackResource = template.Resources[resourceName]

  if (nestedStackResource.Type === 'AWS::ApiGateway::RestApi') return ''

  const nestedStackPath = nestedStackResource.Metadata['aws:asset:path']
  const nestedStack = getNestedStack(path.resolve(path.dirname(templateFilePath), nestedStackPath))
  const [, outputValue] = attribute.split('.')

  return nestedStack.Outputs[outputValue].Value.Ref
}

/**
 * Resolves a `referenceto...` placeholder by scanning nested stack parameters.
 *
 * @param {string} ref
 * @param {Record<string, any>} template
 * @param {string} templateFilePath
 * @returns {string|undefined}
 */
const getReferenceToResource = (ref, template, templateFilePath) => {
  let value

  Object.keys(template.Resources).forEach((resourceKey) => {
    const templateResource = template.Resources[resourceKey]

    if (templateResource.Type === 'AWS::CloudFormation::Stack') {
      const { Parameters: parameters } = templateResource.Properties

      if (parameters && parameters[ref]) {
        const { Ref: paramRef, 'Fn::GetAtt': paramGetAtt } = parameters[ref]
        if (paramGetAtt) {
          value = getResourceFromGetAtt(paramGetAtt, template, templateFilePath)
        } else {
          value = paramRef
        }
      }
    }
  })

  return value
}

/**
 * Recursively builds the full API path for an `AWS::ApiGateway::Resource`.
 *
 * @param {Record<string, any>} resource
 * @param {Record<string, any>} template
 * @param {string} templateFilePath
 * @returns {string}
 */
const getPathForResource = (resource, template, templateFilePath) => {
  const { PathPart: pathPart, ParentId: parentId } = resource.Properties
  if (!parentId) return pathPart

  let { Ref: parentRef = '' } = parentId
  const { 'Fn::GetAtt': parentGetAtt = [] } = parentId

  if (parentGetAtt.length) {
    parentRef = getResourceFromGetAtt(parentGetAtt, template, templateFilePath)
  }

  if (typeof parentRef === 'string' && parentRef.startsWith('referenceto')) {
    parentRef = getReferenceToResource(parentRef, template, templateFilePath)
  }

  if (!parentRef) return pathPart

  const parentResource = template.Resources[parentRef]

  return `${getPathForResource(parentResource, template, templateFilePath)}/${pathPart}`
}

/**
 * Converts a CDK Lambda logical id to the matching serverless folder name.
 *
 * @param {string} functionName
 * @returns {string}
 */
const getLambdaName = (functionName) => {
  const [trimmedName] = functionName.split('Lambda')

  return trimmedName.charAt(0).toLowerCase() + trimmedName.slice(1)
}

/**
 * Recursively finds the first `Fn::GetAtt` entry in a CFN expression object.
 *
 * @param {unknown} value
 * @returns {any[]|undefined}
 */
const findFnGetAtt = (value) => {
  if (!value || typeof value !== 'object') return undefined

  if (Array.isArray(value)) {
    const found = value.map((item) => findFnGetAtt(item)).find(Boolean)

    if (found) return found

    return undefined
  }

  if (value['Fn::GetAtt']) return value['Fn::GetAtt']

  const found = Object.values(value).map((nested) => findFnGetAtt(nested)).find(Boolean)

  if (found) return found

  return undefined
}

/**
 * Extracts the Lambda logical id from an API Gateway integration URI object.
 *
 * @param {Record<string, any>} uri
 * @returns {string|undefined}
 */
const getFunctionNameFromIntegrationUri = (uri) => {
  const getAtt = findFnGetAtt(uri)

  if (!getAtt || !Array.isArray(getAtt) || getAtt.length === 0) return undefined

  return getAtt[0]
}

/**
 * Normalizes API resource names so keys match merged resource identifiers.
 *
 * @param {string} apiGatewayResource
 * @param {Record<string, any>} resources
 * @returns {string}
 */
const normalizeApiResourceName = (apiGatewayResource, resources) => {
  if (resources[apiGatewayResource]) return apiGatewayResource

  const stripped = apiGatewayResource.replace(/^referenceto[a-z0-9]+/i, '')
  if (resources[stripped]) return stripped

  return apiGatewayResource
}

/**
 * Resolves a Lambda logical id to the bundled CDK asset handler path.
 *
 * @param {string} functionName
 * @param {Record<string, any>} template
 * @param {string} templateFilePath
 * @returns {string}
 */
const getLambdaHandlerPath = (functionName, template, templateFilePath) => {
  const functionResource = template.Resources[functionName]
  const assetPath = functionResource?.Metadata?.['aws:asset:path']
  if (assetPath) {
    return path.resolve(path.dirname(templateFilePath), assetPath, 'index.js')
  }

  return `../serverless/src/${getLambdaName(functionName)}/handler.js`
}

/**
 * Reads a synthesized CDK template and returns API Gateway resources mapped to
 * HTTP methods, Lambda handlers, and optional authorizers for local execution.
 *
 * @param {string} templateFilePath - Path to the synthesized root template file.
 * @returns {Record<string, { fullPath: string, methods: Array<{ httpMethod: string, authorizer: { functionName?: string, path?: string }, lambdaFunction: { functionName: string, path: string } }> }>}
 */
export const getApiResources = (templateFilePath) => {
  const template = JSON.parse(fs.readFileSync(templateFilePath, 'utf8'))

  const nestedStackPaths = []
  Object.keys(template.Resources).forEach((resourceKey) => {
    const resource = template.Resources[resourceKey]
    if (resource.Type === 'AWS::ApiGateway::Deployment' && resource.DependsOn) {
      resource.DependsOn.forEach((dep) => {
        if (template.Resources[dep] && template.Resources[dep].Type === 'AWS::CloudFormation::Stack') {
          nestedStackPaths.push(template.Resources[dep].Metadata['aws:asset:path'])
        }
      })
    }
  })

  const combinedTemplate = template
  nestedStackPaths.forEach((nestedStackPath) => {
    const nestedTemplatePath = path.resolve(path.dirname(templateFilePath), nestedStackPath)
    const nestedTemplate = getNestedStack(nestedTemplatePath)
    combinedTemplate.Resources = {
      ...combinedTemplate.Resources,
      ...nestedTemplate.Resources
    }
  })

  const apiResources = {}
  Object.keys(combinedTemplate.Resources).forEach((resourceKey) => {
    const resource = combinedTemplate.Resources[resourceKey]
    if (resource.Type === 'AWS::ApiGateway::Resource') {
      apiResources[resourceKey] = {
        fullPath: getPathForResource(resource, combinedTemplate, templateFilePath),
        methods: []
      }
    }
  })

  Object.keys(combinedTemplate.Resources).forEach((resourceKey) => {
    const resource = combinedTemplate.Resources[resourceKey]
    if (resource.Type !== 'AWS::ApiGateway::Method') return

    const {
      HttpMethod: httpMethod,
      ResourceId: resourceId,
      AuthorizerId: authorizerId
    } = resource.Properties

    let apiGatewayResource = resourceId.Ref
    if (apiGatewayResource.startsWith('referenceto')) {
      apiGatewayResource = getReferenceToResource(apiGatewayResource, template, templateFilePath)
    }

    const authorizer = {}
    const authorizerRef = authorizerId?.Ref
    if (authorizerRef) {
      const authorizerFunctionName = getReferenceToResource(
        authorizerRef,
        template,
        templateFilePath
      )
      authorizer.functionName = authorizerFunctionName
      authorizer.path = getLambdaHandlerPath(
        authorizerFunctionName,
        combinedTemplate,
        templateFilePath
      )
    }

    const lambdaIntegration = resource.Properties.Integration
    if (lambdaIntegration.Type !== 'AWS_PROXY' || !lambdaIntegration.Uri) return

    const functionName = getFunctionNameFromIntegrationUri(lambdaIntegration.Uri)
    if (!functionName) return

    const lambdaFunction = {
      functionName,
      path: getLambdaHandlerPath(functionName, combinedTemplate, templateFilePath)
    }

    const name = normalizeApiResourceName(apiGatewayResource, apiResources)
    if (!apiResources[name]) return

    apiResources[name].methods.push({
      httpMethod,
      authorizer,
      lambdaFunction
    })
  })

  return apiResources
}
