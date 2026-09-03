#!/bin/bash

# Local environment variables for running MMT (API + local S3) locally.
#
# This must be SOURCED, not executed, so the exports apply to your current
# shell (and any child processes like serverless-offline/SAM you start from it):
#
#   source ./local-env.sh
#   # or
#   . ./local-env.sh
#
# Defaults below mirror the fallback values already baked into mmt-stack.ts,
# startS3.js, and fetchProviders.js - override any of them by exporting the
# var yourself before sourcing, or by editing this file directly.

export STAGE_NAME="${STAGE_NAME:-dev}"
export IS_OFFLINE="${IS_OFFLINE:-true}"
export NODE_ENV="${NODE_ENV:-development}"

# S3 buckets (local S3 server via s3rver, see startS3.js)
export COLLECTION_TEMPLATES_BUCKET_NAME="${COLLECTION_TEMPLATES_BUCKET_NAME:-mmt-template-bucket-local}"
export CONCEPTS_BUCKET_NAME="${CONCEPTS_BUCKET_NAME:-mmt-concepts-bucket-local}"
# mmt-stack.ts currently reads this name for the concepts bucket - keep both
# in sync until/unless the stack is updated to use CONCEPTS_BUCKET_NAME
export STAGING_CONCEPTS_BUCKET_NAME="${STAGING_CONCEPTS_BUCKET_NAME:-$CONCEPTS_BUCKET_NAME}"

# Local API Gateway endpoint (serverless-offline), used by test/seed scripts
export API_BASE_URL="${API_BASE_URL:-http://localhost:4001}"

# Auth
# 'local-staging-api-key' must match the Staging-Api-Key header sent by
# test/seed scripts (test-get-concepts-endpoint.sh, seed-concepts.sh, etc.)
export STAGING_API_KEY="${STAGING_API_KEY:-local-staging-api-key}"
export JWT_SECRET="${JWT_SECRET:-local-secret}"
export JWT_VALID_TIME="${JWT_VALID_TIME:-900}"
export EDL_CLIENT_ID="${EDL_CLIENT_ID:-}"
export EDL_PASSWORD="${EDL_PASSWORD:-}"

# App config
export MMT_HOST="${MMT_HOST:-http://localhost:5173}"
export COOKIE_DOMAIN="${COOKIE_DOMAIN:-.localhost}"
export GTM_PROPERTY_ID="${GTM_PROPERTY_ID:-}"
export DISPLAY_PROD_WARNING="${DISPLAY_PROD_WARNING:-false}"

# Lambda/infra placeholders (only meaningful in a real AWS deploy, but
# mmt-stack.ts reads them unconditionally so they need *some* value locally)
export LAMBDA_TIMEOUT="${LAMBDA_TIMEOUT:-30}"
export LOG_DESTINATION_ARN="${LOG_DESTINATION_ARN:-local-arn}"
export SUBNET_ID_A="${SUBNET_ID_A:-subnetIdA}"
export SUBNET_ID_B="${SUBNET_ID_B:-subnetIdB}"
export SUBNET_ID_C="${SUBNET_ID_C:-subnetIdC}"
export VPC_ID="${VPC_ID:-local-vpc}"

echo "Local env vars set:"
echo "  STAGE_NAME=$STAGE_NAME"
echo "  IS_OFFLINE=$IS_OFFLINE"
echo "  COLLECTION_TEMPLATES_BUCKET_NAME=$COLLECTION_TEMPLATES_BUCKET_NAME"
echo "  CONCEPTS_BUCKET_NAME=$CONCEPTS_BUCKET_NAME"
echo "  STAGING_CONCEPTS_BUCKET_NAME=$STAGING_CONCEPTS_BUCKET_NAME"
echo "  API_BASE_URL=$API_BASE_URL"
echo "  STAGING_API_KEY=$STAGING_API_KEY"
echo "  MMT_HOST=$MMT_HOST"