const concurrently = require('concurrently')

concurrently([{
  command: 'npm run cmr:start_and_setup',
  name: 'cmr'
}, {
  command: 'npm run start:app',
  name: 'vite'
},
{
  command: 'npm run offline',
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
