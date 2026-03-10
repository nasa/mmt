const fs = require('fs')
const childProcess = require('child_process')
const concurrently = require('concurrently')

if (!fs.existsSync('./cdk/mmt/cdk.out/mmt-cdk-dev.template.json')) {
  console.log('The CDK template file does not exist. Running `npm run run-synth` to generate it...')
  childProcess.execSync('npm run run-synth', { stdio: 'inherit' })
}

concurrently([{
  command: 'npm run cmr:start_and_setup',
  name: 'cmr'
}, {
  command: 'npm run start:app',
  name: 'vite'
},
{
  command: 'npm run start:api',
  name: 'api'
},
{
  command: 'npm run start:proxy',
  name: 'proxy'
}], {
  prefix: 'name',
  padPrefix: true,
  prefixColors: 'auto',
  handleInput: true
})
