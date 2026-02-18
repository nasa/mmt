const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({})
const apiProxyTarget = process.env.MMT_API_PROXY_TARGET || 'https://localhost:8443/cgokey-sit'
const apiProxyPort = Number(process.env.MMT_API_PROXY_PORT || 4001)
const cmrProxyPort = Number(process.env.MMT_CMR_PROXY_PORT || 4000)

// Proxy API Gateway-compatible requests on a dedicated port.
const apiServer = http.createServer((req, res) => {
  if (req.url.startsWith('/cgokey-sit')) {
    const [, rest] = req.url.split('/cgokey-sit')

    req.url = rest || '/'
    const proxyOptions = {
      target: apiProxyTarget,
      secure: false
    }

    proxyOptions.headers = {
      ...req.headers
    }

    proxyOptions.headers.host = '34lb0t2px1.execute-api.us-east-1.amazonaws.com'

    proxy.web(req, res, {
      ...proxyOptions
    })

    return
  }

  res.statusCode = 404
  res.end('No API proxy route matched request')
})

// Create a proxy server to redirect path based CMR requests to the correct local CMR ports
const cmrServer = http.createServer((req, res) => {
  // `req.url` here is the path of the requested URL
  if (req.url.includes('/search')) {
    const [, rest] = req.url.split('/search')

    // Replace the url value with everything after /search
    req.url = rest
    proxy.web(req, res, {
      target: 'http://localhost:3003'
    })

    return
  }

  if (req.url.includes('/ingest')) {
    const [, rest] = req.url.split('/ingest')

    // Replace the url value with everything after /ingest
    req.url = rest
    proxy.web(req, res, {
      target: 'http://localhost:3002'
    })

    return
  }

  if (req.url.includes('/access-control')) {
    const [, rest] = req.url.split('/access-control')

    // Replace the url value with everything after /access-control
    req.url = rest
    proxy.web(req, res, {
      target: 'http://localhost:3011'
    })

    return
  }

  res.statusCode = 404
  res.end('No proxy route matched request')
})

console.log(`CMR proxy listening on port ${cmrProxyPort}`)
console.log(`API proxy listening on port ${apiProxyPort}`)
cmrServer.listen(cmrProxyPort)
apiServer.listen(apiProxyPort)
