import { GetObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'

// Initialize S3 client
let s3Client

/**
 * Retrieve a proposal from S3
 * @param {Object} event Details about the HTTP request that it received
 */
const getProposal = async (event) => {
  // Get default response headers from application config
  const { defaultResponseHeaders } = getApplicationConfig()

  // Initialize S3 client if not already done
  if (s3Client == null) {
    s3Client = getS3Client()
  }

  // Extract proposal ID from path parameters
  const { pathParameters } = event
  const { id } = pathParameters

  try {
    // Get the S3 bucket name from environment variables
    const { COLLECTION_PROPOSALS_BUCKET_NAME: collectionProposalsBucketName } = process.env

    // Create a GetObjectCommand to retrieve the file from S3
    const getCommand = new GetObjectCommand({
      Bucket: collectionProposalsBucketName,
      Key: `proposals/${id}`
    })

    // Send the get command to S3
    const response = await s3Client.send(getCommand)

    // Extract metadata from the response
    const { $metadata: metadata } = response

    // Get the status code from metadata
    const { httpStatusCode: statusCode } = metadata

    // Get the response body
    const { Body: responseBody } = response

    // Transform the body into a JSON object
    const body = {
      proposal: JSON.parse(await responseBody.transformToString())
    }

    // Return successful response with proposal data
    return {
      body: JSON.stringify(body),
      statusCode,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    // Log error and return error response
    console.log('getProposal Error:', error)

    // Set default status code and error message
    const statusCode = error.$metadata?.httpStatusCode || 500
    let errorMessage = 'Internal server error'

    // Handle specific error cases
    if (error.name === 'NoSuchKey' || statusCode === 404) {
      errorMessage = `Proposal with id ${id} not found`
    } else {
      // For other errors, you might want to use the AWS error message
      errorMessage = error.message || 'Internal server error'
    }

    // Return error response
    return {
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        message: errorMessage
      })
    }
  }
}

export default getProposal
