const concurrently = require('concurrently')

// Get the environment from command line arguments
const environment = process.argv[2]

let password

switch (environment) {
  case 'SIT':
    password = process.env.MMT_SIT_PASSWORD
    break
  case 'UAT':
    password = process.env.MMT_UAT_PASSWORD
    break
  case 'PROD':
    password = process.env.MMT_PROD_PASSWORD
    break
  default:
    console.error('Please provide a valid environment (SIT, UAT, or PROD)')
    process.exit(1)
}

if (!password) {
  console.error(`No password found for ${environment} environment. Please set MMT_${environment}_PASSWORD environment variable.`)
  process.exit(1)
}

console.log(`Starting ${environment} environment...`)

concurrently([
  {
    command: `EDL_PASSWORD='${password}' npm run offline`,
    name: 'api'
  },
  {
    command: 'npm run start:proxy',
    name: 'proxy'
  },
  {
    command: 'npm run start:app',
    name: 'app'
  }
], {
  prefix: 'name',
  padPrefix: true,
  prefixColors: 'auto',
  handleInput: true
})
