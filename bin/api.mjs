import express from 'express'

import { getApiResources } from './getApiResources.mjs'

/**
 * Local API runner that mirrors API Gateway + Lambda wiring from the
 * synthesized CDK template.
 */
const templateFilePath = process.argv[2]
if (!templateFilePath) {
  console.error('Please provide the path to the CloudFormation template as a command line argument.')
  process.exit(1)
}

const stageName = process.env.STAGE_NAME || 'dev'
const port = parseInt(process.env.API_LOCAL_PORT || '4001', 10)

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

/**
 * Wraps a parsed API method definition and invokes its authorizer (if present)
 * and Lambda handler using API Gateway-like event objects.
 *
 * @param {{ httpMethod: string, authorizer: { functionName?: string, path?: string }, lambdaFunction: { functionName: string, path: string } }} method
 * @returns {(request: import('express').Request, response: import('express').Response) => Promise<void>}
 */
const lambdaProxyWrapper = (method) => async (request, response) => {
  const {
    authorizer,
    lambdaFunction
  } = method

  const {
    path: authorizerHandlerPath
  } = authorizer

  const {
    path: handlerPath
  } = lambdaFunction

  let authorizerResponse = {}

  if (method.authorizer?.functionName) {
    try {
      const { default: authorizerHandler } = (await import(authorizerHandlerPath)).default
      const authEvent = {
        body: request.body,
        headers: request.headers,
        httpMethod: request.method,
        pathParameters: request.params,
        queryStringParameters: request.query,
        requestContext: {
          resourcePath: request.path
        }
      }

      authorizerResponse = await authorizerHandler(authEvent, {})
    } catch (error) {
      console.log(`Authorizer error: ${error}`)
      response.status(401).send({ statusCode: 401 })

      return
    }
  }

  const event = {
    body: typeof request.body === 'object' ? JSON.stringify(request.body) : request.body,
    headers: request.headers,
    httpMethod: request.method,
    pathParameters: request.params,
    queryStringParameters: request.query,
    requestContext: {}
  }

  if (authorizerResponse?.context) {
    event.requestContext.authorizer = authorizerResponse.context
  }

  const { default: handler } = (await import(handlerPath)).default
  const lambdaResponse = await handler(event, {})

  const {
    body,
    headers = {},
    isBase64Encoded,
    statusCode = 200
  } = lambdaResponse || {}

  response.status(statusCode)
  Object.entries(headers).forEach(([headerName, headerValue]) => {
    response.setHeader(headerName, headerValue)
  })

  if (isBase64Encoded) {
    response.send(Buffer.from(body, 'base64'))

    return
  }

  response.send(body)
}

/**
 * Registers a route on the Express app for the given HTTP method and path.
 *
 * @param {string} httpMethod
 * @param {string} routePath
 * @param {(request: import('express').Request, response: import('express').Response) => Promise<void>} handler
 */
const registerRoute = (httpMethod, routePath, handler) => {
  const lowerMethod = httpMethod.toLowerCase()
  app[lowerMethod](routePath, handler)
}

/**
 * Discovers API routes from the synthesized template and registers both
 * non-stage-prefixed and stage-prefixed local paths.
 *
 * @returns {Promise<void>}
 */
const addRoutes = async () => {
  const apiResources = getApiResources(templateFilePath)
  const keys = Object.keys(apiResources).sort()

  keys.forEach((resourcePath) => {
    const { fullPath, methods } = apiResources[resourcePath]

    methods.forEach((method) => {
      const path = `/${fullPath.replace(/\/\{(.*?)\}/g, '/:$1')}`
      const stagePath = `/${stageName}${path}`

      console.log(`Adding route: ${method.httpMethod.padEnd(6)} - ${path}`)
      registerRoute(method.httpMethod, path, lambdaProxyWrapper(method))

      if (stagePath !== path) {
        console.log(`Adding route: ${method.httpMethod.padEnd(6)} - ${stagePath}`)
        registerRoute(method.httpMethod, stagePath, lambdaProxyWrapper(method))
      }
    })
  })
}

/**
 * Boots the local API server after dynamically registering all routes.
 */
addRoutes().then(() => {
  app.listen(port, () => {
    console.log(`Local API listening on http://localhost:${port}`)
  })
})
