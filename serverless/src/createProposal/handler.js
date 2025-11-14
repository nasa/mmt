import { PutObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'

// Initialize S3 client
let s3Client

/**
 * Create a proposal to S3
 * @param {Object} event Details about the HTTP request that it received
 */
const createProposal = async (event) => {
  // Get default response headers from application config
  const { defaultResponseHeaders } = getApplicationConfig()

  // Initialize S3 client if not already done
  if (s3Client == null) {
    s3Client = getS3Client()
  }

  try {
    // Extract proposal from the event body
    const { body: proposal } = event
    const { id } = proposal

    // Get the S3 bucket name from environment variables
    const { COLLECTION_PROPOSALS_BUCKET_NAME: collectionProposalsBucketName } = process.env

    // Create a PutObjectCommand to store the proposal in S3
    const createCommand = new PutObjectCommand({
      Bucket: collectionProposalsBucketName,
      Body: JSON.stringify(proposal),
      Key: `proposals/${id}`
    })

    // Send the command to S3
    const response = await s3Client.send(createCommand)

    // Extract metadata from the response
    const { $metadata: metadata } = response
    const { httpStatusCode: statusCode } = metadata

    // Return successful response
    return {
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        id
      })
    }
  } catch (error) {
    // Log error and return error response
    console.error('Error creating proposal:', error)

    // Determine the status code
    const statusCode = error.$metadata?.httpStatusCode || 500

    // Get the error message
    const errorMessage = error.message || 'Internal server error'

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

export default createProposal
