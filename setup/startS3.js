const S3rver = require('s3rver')
const { S3Client, CreateBucketCommand, HeadBucketCommand } = require('@aws-sdk/client-s3')

// Allow overriding this value but, this script is only need to be run in dev
const bucketName = process.env.COLLECTION_TEMPLATES_BUCKET_NAME || 'mmt-template-bucket-local'
const port = 4569

const startS3 = async () => {
  console.log(`Starting local S3 server on port ${port}...`)

  const instance = new S3rver({
    port,
    address: 'localhost',
    silent: false,
    directory: './tmp/s3rver'
  })

  await instance.run()

  console.log('Local S3 server started.')

  const s3Client = new S3Client({
    forcePathStyle: true,
    endpoint: `http://localhost:${port}`,
    credentials: {
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER'
    },
    region: 'us-east-1'
  })

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
    console.log(`Bucket "${bucketName}" already exists.`)
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      console.log(`Creating bucket "${bucketName}"...`)
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }))
      console.log(`Bucket "${bucketName}" created.`)
    } else {
      console.error('Error checking/creating bucket:', error)
    }
  }
}

startS3().catch((error) => {
  console.error('Failed to start local S3 server:', error)
  process.exit(1)
})
