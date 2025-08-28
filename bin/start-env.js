const concurrently = require('concurrently')

// Get the password from command line arguments
// Please note that the UAT password requires single quotes around it
const password = process.argv[2]

if (!password) {
  console.error('Please provide a password as an argument')
  process.exit(1)
}

concurrently([
  {
    command: `EDL_PASSWORD=${password} npm run offline`,
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
