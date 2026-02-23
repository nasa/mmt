const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({})

// Create a proxy server to redirect path based CMR requests to the correct local CMR ports
const server = http.createServer((req, res) => {
  // `req.url` here is the path of the requested URL

  if (req.url.includes('/search')) {
    const [, rest] = req.url.split('/search')

    // Replace the url value with everything after /search
    req.url = rest
    proxy.web(req, res, {
      target: 'http://localhost:3003'
    })
  }

  if (req.url.includes('/ingest')) {
    const [, rest] = req.url.split('/ingest')

    // Replace the url value with everything after /ingest
    req.url = rest
    proxy.web(req, res, {
      target: 'http://localhost:3002'
    })
  }

  if (req.url.includes('/access-control')) {
    const [, rest] = req.url.split('/access-control')

    // Replace the url value with everything after /access-control
    req.url = rest
    proxy.web(req, res, {
      target: 'http://localhost:3011'
    })
  }
})

console.log('listening on port 4000')
server.listen(4000)
