const { exec } = require('child_process')

const stopCmr = () => {
  const command = 'date && echo "Stopping applications" && (curl -s -XPOST http://localhost:2999/stop; true)'

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)

      return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)

      return
    }

    console.log(`stdout: ${stdout}`)
  })
}

stopCmr()
