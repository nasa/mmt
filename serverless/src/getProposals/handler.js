import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3BucketContents } from '../utils/s3BucketContents'
import { getS3Client } from '../utils/getS3Client'

// Initialize S3 client
let s3Client

const getProposals = async (event) => {
  // Get default response headers from application config
  const { defaultResponseHeaders } = getApplicationConfig()
  // Extract query parameters from the event
  const { queryStringParameters = {} } = event
  const { providerId } = queryStringParameters

  // Initialize S3 client if not already done
  if (s3Client == null) {
    s3Client = getS3Client()
  }

  try {
    // Get the S3 bucket name from environment variables
    const { COLLECTION_PROPOSALS_BUCKET_NAME: collectionProposalsBucketName } = process.env

    // Get the list of objects in the S3 bucket with the 'proposals/' prefix
    const objectList = await s3BucketContents({
      s3Client,
      bucketName: collectionProposalsBucketName,
      prefix: 'proposals/'
    })

    // Retrieve and process each proposal
    let proposals = await Promise.all(objectList.map(async (object) => {
      // Extract id from the object key
      const id = object.Key.split('/')[1]

      // Retrieve the proposal object from S3
      const { Body: responseBody } = await s3Client.send(new GetObjectCommand({
        Bucket: collectionProposalsBucketName,
        Key: object.Key
      }))

      // Parse the proposal data
      const proposal = JSON.parse(await responseBody.transformToString())

      // Return relevant proposal details
      return {
        id,
        providerId: proposal.providerId,
        shortName: proposal.shortName,
        entryTitle: proposal.entryTitle,
        proposalStatus: proposal.proposalStatus
      }
    }))

    // Filter proposals if providerId is provided in the query parameters
    if (providerId) {
      proposals = proposals.filter((proposal) => proposal.providerId === providerId)
    }

    // Return successful response with proposals data
    return {
      body: JSON.stringify(proposals),
      statusCode: 200,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    // Log error and return error response
    console.log('getProposals Error:', error)

    // Determine the status code
    const statusCode = error.$metadata?.httpStatusCode || 500

    // Get the error message
    const errorMessage = error.message || 'Internal server error'

    return {
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        message: errorMessage
      })
    }
  }
}

export default getProposals
