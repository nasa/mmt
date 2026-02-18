const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({})
const apiProxyTarget = process.env.MMT_API_PROXY_TARGET || 'https://localhost:8443/cgokey-sit'
const apiProxyHostHeader = process.env.MMT_API_HOST_HEADER

// Create a proxy server to redirect path based CMR requests to the correct local CMR ports
const server = http.createServer((req, res) => {
  // `req.url` here is the path of the requested URL
  if (req.url.includes('/sit')) {
    const [, rest] = req.url.split('/sit')

    // Replace the url value with everything after /sit
    req.url = rest || '/'
    const proxyOptions = {
      target: apiProxyTarget,
      changeOrigin: true,
      secure: false
    }

    if (apiProxyHostHeader) {
      proxyOptions.headers = {
        host: apiProxyHostHeader
      }
    }

    proxy.web(req, res, {
      ...proxyOptions
    })

    return
  }

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

console.log('listening on port 4000')
server.listen(4000)
