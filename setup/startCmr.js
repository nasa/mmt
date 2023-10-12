const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const jarDirectory = 'cmr'
const jarName = 'cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar'

const destination = path.resolve(jarDirectory, jarName)

const startCmr = async () => {
  if (!fs.existsSync(destination)) {
    console.log('CMR JAR does not exist.')

    return
  }

  console.log('Starting local CMR JAR.')

  const command = `cd cmr; nohup java -DCMR_DEV_SYSTEM_REDIS_TYPE=external -classpath ./${jarName} cmr.dev_system.runner > cmr.log 2>&1 &`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)

      return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)

      return
    }

    console.log(stdout)
  })

  console.log('Checking if CMR is running.')

  const wait = (delay) => new Promise((res) => {
    setTimeout(res, delay)
  })

  let isRunning = false
  while (!isRunning) {
    // eslint-disable-next-line no-await-in-loop
    await wait(5000)

    fetch('http://localhost:3003/collections.umm-json')
      // eslint-disable-next-line no-loop-func
      .then((response) => {
        if (response.ok) {
          console.log('CMR is running.')
          isRunning = true
        }
      })
      .catch(() => {
        console.log('CMR is not up yet, trying again in 5s.')
      })
  }
}

startCmr()
