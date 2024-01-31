const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({
  // ChangeOrigin: true,
  // ws: true
  // CookieDomainRewrite: 'new.domain'
})

proxy.on('error', (e) => {
  console.log('error=', e)
})

proxy.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head)
})

// Create a proxy server to redirect path based CMR requests to the correct local CMR ports
const server = http.createServer((req, res) => {
  // `req.url` here is the path of the requested URL

  if (req.url.includes('/dev')) {
    proxy.web(req, res, {
      target: 'http://localhost:4001'
    })
    // } else if (req.url.includes('/search')) {
    //   const [, rest] = req.url.split('/search')

    //   // Replace the url value with everything after /search
    //   req.url = rest
    //   proxy.web(req, res, {
    //     target: 'http://localhost:3003'
    //   })
    // } else if (req.url.includes('/ingest')) {
    //   const [, rest] = req.url.split('/ingest')

    //   // Replace the url value with everything after /ingest
    //   req.url = rest
    //   proxy.web(req, res, {
    //     target: 'http://localhost:3002'
    //   })
    // } else if (req.url.includes('/access-control')) {
    //   const [, rest] = req.url.split('/access-control')

  //   // Replace the url value with everything after /access-control
  //   req.url = rest
  //   proxy.web(req, res, {
  //     target: 'http://localhost:3011'
  //   })
  } else {
    if (req.url.includes('/auth_callback2')) {
      console.log('req=', req.headers)
    }

    proxy.web(req, res, {
      target: 'http://localhost:5173'
    })
  }
})

console.log('listening on port 4000')
server.listen(4000)
