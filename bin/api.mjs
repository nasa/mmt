import express from 'express'
import fs from 'fs'
import path from 'path'

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
const staticConfigPath = path.resolve(process.cwd(), 'static.config.json')

/**
 * Resolves a local `MMT_HOST` value from env or `static.config.json`.
 * `MMT_HOST` is used for browser origin (CORS handling)
 *
 * @returns {string}
 */
const resolveMmtHost = () => {
  if (process.env.MMT_HOST) return process.env.MMT_HOST

  try {
    const file = fs.readFileSync(staticConfigPath, 'utf8')
    const staticConfig = JSON.parse(file)
    if (staticConfig?.application?.mmtHost) return staticConfig.application.mmtHost
  } catch (error) {
    console.warn(`Unable to read mmtHost from static.config.json: ${error}`)
  }

  return 'http://localhost:5173'
}

const localEnvDefaults = {
  COOKIE_DOMAIN: '.localhost',
  JWT_SECRET: 'local-secret',
  JWT_VALID_TIME: '900',
  MMT_HOST: resolveMmtHost()
}

// Local stack always runs in offline mode.
process.env.IS_OFFLINE = 'true'

Object.entries(localEnvDefaults).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value
  }
})

const app = express()

/**
 * Adds permissive local CORS behavior for API Gateway emulation.
 *
 * In offline mode we mirror the incoming browser origin so localhost and
 * tunneled origins continue to work with credentials/cookies.
 */
app.use((request, response, next) => {
  if (process.env.IS_OFFLINE !== 'true') {
    next()

    return
  }

  const requestOrigin = request.headers.origin
  const allowOrigin = requestOrigin || process.env.MMT_HOST || 'http://localhost:5173'
  const requestedHeaders = request.headers['access-control-request-headers']

  response.setHeader('Access-Control-Allow-Origin', allowOrigin)
  response.setHeader('Vary', 'Origin')
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Headers', requestedHeaders || 'Content-Type,Authorization,Origin,User-Agent,Accept')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')

  if (request.method === 'OPTIONS') {
    response.status(204).end()

    return
  }

  next()
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

/**
 * Wraps a parsed API method definition and invokes its Lambda handler using
 * API Gateway-like event objects.
 *
 * @param {{ httpMethod: string, lambdaFunction: { functionName: string, path: string } }} method
 * @returns {(request: import('express').Request, response: import('express').Response) => Promise<void>}
 */
const lambdaProxyWrapper = (method) => async (request, response) => {
  const { lambdaFunction } = method
  const {
    path: handlerPath
  } = lambdaFunction

  const event = {
    body: typeof request.body === 'object' ? JSON.stringify(request.body) : request.body,
    headers: request.headers,
    httpMethod: request.method,
    pathParameters: request.params,
    queryStringParameters: request.query,
    requestContext: {}
  }

  const { default: handler } = (await import(handlerPath)).default
  const lambdaResponse = await handler(event, {})

  const {
    body,
    headers = {},
    statusCode = 200
  } = lambdaResponse || {}

  response.status(statusCode)
  Object.entries(headers).forEach(([headerName, headerValue]) => {
    response.setHeader(headerName, headerValue)
  })

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
      const routePath = `/${fullPath.replace(/\/\{(.*?)\}/g, '/:$1')}`
      const stagePath = `/${stageName}${routePath}`

      console.log(`Adding route: ${method.httpMethod.padEnd(6)} - ${routePath}`)
      registerRoute(method.httpMethod, routePath, lambdaProxyWrapper(method))

      if (stagePath !== routePath) {
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
