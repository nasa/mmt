import {
  PutObjectCommand,
  HeadObjectCommand,
  S3ServiceException
} from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { validateProposal } from '../utils/validateProposal'

// Initialize S3 client
let s3Client

/**
 * Update a proposal in S3
 * @param {Object} event Details about the HTTP request that it received
 */
const updateProposal = async (event) => {
  // Get default response headers from application config
  const { defaultResponseHeaders } = getApplicationConfig()
  // Get the S3 bucket name from environment variables
  const { COLLECTION_PROPOSALS_BUCKET_NAME: collectionProposalsBucketName } = process.env

  // Initialize S3 client if not already done
  if (s3Client == null) {
    s3Client = getS3Client()
  }

  // Extract proposal data and ID from the event
  const { body, pathParameters } = event
  // Check if body is provided
  if (!body) {
    return {
      statusCode: 400,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ message: 'Missing request body' })
    }
  }

  let proposal
  try {
    proposal = JSON.parse(body)
  } catch (error) {
    return {
      statusCode: 400,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ message: 'Invalid JSON in request body' })
    }
  }

  // Check if proposal data is provided
  if (!proposal) {
    return {
      statusCode: 400,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ message: 'Missing request body' })
    }
  }

  // Validate the proposal
  const { isValid, missingFields } = validateProposal(proposal)
  if (!isValid) {
    return {
      statusCode: 400,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        message: 'Invalid proposal: missing mandatory fields',
        missingFields
      })
    }
  }

  const { id } = pathParameters

  try {
    // Check if the proposal exists in S3
    const headCommand = new HeadObjectCommand({
      Bucket: collectionProposalsBucketName,
      Key: `proposals/${id}`
    })

    await s3Client.send(headCommand)

    // Object exists, proceed with update
    const putCommand = new PutObjectCommand({
      Bucket: collectionProposalsBucketName,
      Body: JSON.stringify(proposal),
      Key: `proposals/${id}`
    })

    // Send the update command to S3
    const response = await s3Client.send(putCommand)

    // Extract metadata from the response
    const { $metadata: metadata } = response
    const { httpStatusCode: statusCode } = metadata

    // Return success response
    return {
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ message: 'Proposal updated successfully' })
    }
  } catch (error) {
    console.error('Error updating proposal:', error)

    // Check if the error is due to the proposal not being found
    if (error instanceof S3ServiceException) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return {
          statusCode: 404,
          headers: defaultResponseHeaders,
          body: JSON.stringify({ message: `Proposal with id ${id} not found` })
        }
      }
    }

    // Handle other types of errors
    const statusCode = error.$metadata?.httpStatusCode || 500
    let errorMessage = error.message || 'Internal server error'

    // If it's a 500 error or we couldn't determine the status code, use generic message
    if (statusCode === 500 || !error.$metadata?.httpStatusCode) {
      errorMessage = 'Internal server error'
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

export default updateProposal
