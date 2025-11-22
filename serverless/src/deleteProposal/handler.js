import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3ServiceException
} from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'

// Initialize S3 client
let s3Client

/**
 * Delete a proposal from S3
 * @param {Object} event Details about the HTTP request that it received
 */
const deleteProposal = async (event) => {
  // Get application configuration and environment variables
  const { defaultResponseHeaders } = getApplicationConfig()
  const { COLLECTION_PROPOSALS_BUCKET_NAME: collectionProposalsBucketName } = process.env

  // Initialize S3 client if not already done
  if (s3Client == null) {
    s3Client = getS3Client()
  }

  // Extract proposal ID from path parameters
  const { pathParameters } = event
  const { id } = pathParameters

  try {
    // Check if the object exists in S3
    const headCommand = new HeadObjectCommand({
      Bucket: collectionProposalsBucketName,
      Key: `proposals/${id}`
    })

    await s3Client.send(headCommand)

    // If object exists, delete it
    const deleteCommand = new DeleteObjectCommand({
      Bucket: collectionProposalsBucketName,
      Key: `proposals/${id}`
    })

    const response = await s3Client.send(deleteCommand)

    // Return success response
    return {
      statusCode: response.$metadata.httpStatusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ message: 'Proposal deleted successfully' })
    }
  } catch (error) {
    console.error('Error deleting proposal:', error)

    // Handle case where proposal is not found
    if (error instanceof S3ServiceException
        && (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404)) {
      return {
        statusCode: 404,
        headers: defaultResponseHeaders,
        body: JSON.stringify({ message: `Proposal with id ${id} not found` })
      }
    }

    // Handle other errors
    const statusCode = error.$metadata?.httpStatusCode || 500
    const errorMessage = statusCode === 500 ? 'Internal server error' : (error.message || 'Internal server error')

    return {
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        message: errorMessage
      })
    }
  }
}

export default deleteProposal
