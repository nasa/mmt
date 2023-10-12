const fs = require('fs')
const { mkdir } = require('fs/promises')
const { Readable } = require('stream')
const { finished } = require('stream/promises')
const path = require('path')

// Download CMR JAR file
const downloadJar = async () => {
  const jarDirectory = 'cmr'
  const jarName = 'cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar'
  const jarUrl = `https://maven.earthdata.nasa.gov/repository/mmt/${jarName}`

  if (!fs.existsSync(jarDirectory)) {
    await mkdir(jarDirectory)
  }

  const destination = path.resolve(jarDirectory, jarName)

  // Make a backup copy of the old jar if it exists
  if (fs.existsSync(destination)) {
    fs.renameSync(destination, `${destination}.old`)
  }

  try {
    console.log('CMR JAR file downloading')

    // Download the jar file
    const response = await fetch(jarUrl)

    const fileStream = fs.createWriteStream(destination, { flags: 'wx' })
    await finished(Readable.fromWeb(response.body).pipe(fileStream))
  } catch (error) {
    console.log('Error fetching JAR file', error)

    // Restore the backup file if it exists
    if (fs.existsSync(`${destination}.old`)) {
      console.log('Reverting back to previously downloaded JAR file')

      fs.renameSync(`${destination}.old`, destination)
    }
  }

  console.log('Done')
}

downloadJar()
// If (!fs.existsSync)

// Run the JAR file

// Load data into local CMR
