const fs = require('fs')
const childProcess = require('child_process')
const concurrently = require('concurrently')

if (!fs.existsSync('./cdk/mmt/cdk.out/mmt-cdk-dev.template.json')) {
  console.log('The CDK template file does not exist. Running `npm run run-synth` to generate it...')
  childProcess.execSync('npm run run-synth', { stdio: 'inherit' })
}

const isFastMode = process.argv.includes('--fast')

const commands = [
  {
    command: 'npm run cmr:start_and_setup',
    name: 'cmr',
    skipInFast: true
  },
  {
    command: 'npm run start:app',
    name: 'vite'
  },
  {
    command: 'npm run start:api',
    name: 'api'
  },
  {
    command: 'npm run s3:start',
    name: 's3'
  },
  {
    command: 'npm run start:proxy',
    name: 'proxy',
    skipInFast: true
  }
].filter((cmd) => (isFastMode ? !cmd.skipInFast : true))

concurrently(commands, {
  prefix: 'name',
  padPrefix: true,
  prefixColors: 'auto',
  handleInput: true
})
