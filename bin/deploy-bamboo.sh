#!/bin/bash

# Bail on unset variables, errors and trace execution
set -eux

# Deployment configuration/variables
####################################

# read in static.config.json
config="`cat static.config.json`"

# update keys for deployment
config="`jq '.application.version = $newValue' --arg newValue ${RELEASE_VERSION} <<< $config`"
config="`jq '.application.env = $newValue' --arg newValue $bamboo_STAGE_NAME <<< $config`"
# Remove in MMT-4059
config="`jq '.application.viewCitations = $newValue' --arg newValue $bamboo_VIEW_CITATIONS <<< $config`"
config="`jq '.application.graphQlHost = $newValue' --arg newValue $bamboo_GRAPHQL_HOST <<< $config`"
config="`jq '.application.mmtHost = $newValue' --arg newValue $bamboo_MMT_HOST <<< $config`"
config="`jq '.application.apiHost = $newValue' --arg newValue $bamboo_API_HOST <<< $config`"
config="`jq '.application.cmrHost = $newValue' --arg newValue $bamboo_CMR_HOST <<< $config`"
config="`jq '.application.edscHost = $newValue' --arg newValue $bamboo_EDSC_HOST <<< $config`"
config="`jq '.application.gkrHost = $newValue' --arg newValue $bamboo_GKR_HOST <<< $config`"
config="`jq '.application.kmsHost = $newValue' --arg newValue $bamboo_KMS_HOST <<< $config`"
config="`jq '.application.cookieDomain = $newValue' --arg newValue $bamboo_COOKIE_DOMAIN <<< $config`"
config="`jq '.application.displayProdWarning = $newValue' --arg newValue $bamboo_DISPLAY_PROD_WARNING <<< $config`"
config="`jq '.application.tokenValidTime = $newValue' --arg newValue $bamboo_JWT_VALID_TIME <<< $config`"
config="`jq '.application.analytics.gtmPropertyId = $newValue' --arg newValue $bamboo_GTM_PROPERTY_ID <<< $config`"
config="`jq '.edl.host = $newValue' --arg newValue $bamboo_EDL_HOST <<< $config`"
config="`jq '.edl.uid = $newValue' --arg newValue $bamboo_EDL_UID <<< $config`"

# overwrite static.config.json with new values
echo $config > tmp.$$.json && mv tmp.$$.json static.config.json

# Download schema files
bin/download_schemas.sh
if [ $? -ne 0 ]; then
  echo "Failed downloading schema files"
  exit 1
fi

# Set up Docker image
#####################

cat <<EOF > .dockerignore
node_modules
.DS_Store
.git
.github
.serverless
cmr
coverage
dist
node_modules
tmp
EOF

cat <<EOF > Dockerfile
FROM node:20.18.1
COPY . /build
WORKDIR /build
RUN npm ci --omit=dev && npm run build
EOF

dockerTag=mmt-$bamboo_STAGE_NAME
docker build -t $dockerTag .

# Convenience function to invoke `docker run` with appropriate env vars instead of baking them into image
dockerRun() {
    docker run \
        -e "AWS_ACCESS_KEY_ID=$bamboo_AWS_ACCESS_KEY_ID" \
        -e "AWS_ACCOUNT=$bamboo_AWS_ACCOUNT" \
        -e "AWS_REGION=${bamboo_AWS_REGION:-us-east-1}" \
        -e "AWS_SECRET_ACCESS_KEY=$bamboo_AWS_SECRET_ACCESS_KEY" \
        -e "COLLECTION_TEMPLATES_BUCKET_NAME=${bamboo_COLLECTION_TEMPLATES_BUCKET_NAME:-mmt-$bamboo_STAGE_NAME-collection-templates}" \
        -e "COOKIE_DOMAIN=$bamboo_COOKIE_DOMAIN" \
        -e "DISPLAY_PROD_WARNING=$bamboo_DISPLAY_PROD_WARNING" \
        -e "EDL_CLIENT_ID=$bamboo_EDL_CLIENT_ID" \
        -e "EDL_PASSWORD=$bamboo_EDL_PASSWORD" \
        -e "INFRA_EXPORT_PREFIX=${bamboo_INFRA_EXPORT_PREFIX:-cdk}" \
        -e "JWT_SECRET=$bamboo_JWT_SECRET" \
        -e "JWT_VALID_TIME=$bamboo_JWT_VALID_TIME" \
        -e "LAMBDA_TIMEOUT=$bamboo_LAMBDA_TIMEOUT" \
        -e "LOG_DESTINATION_ARN=$bamboo_LOG_DESTINATION_ARN" \
        -e "MMT_HOST=$bamboo_MMT_HOST" \
        -e "NODE_ENV=production" \
        -e "NODE_OPTIONS=--max_old_space_size=4096" \
        -e "SITE_BUCKET=${bamboo_SITE_BUCKET:-mmt-$bamboo_STAGE_NAME}" \
        -e "STAGE_NAME=$bamboo_STAGE_NAME" \
        -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
        -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
        -e "SUBNET_ID_C=$bamboo_SUBNET_ID_C" \
        -e "VPC_ID=$bamboo_VPC_ID" \
        $dockerTag "$@"
}

# Execute CDK commands in Docker
#######################################

# Deploy AWS Infrastructure Resources
echo 'Deploying AWS Infrastructure Resources...'
dockerRun npm run deploy-infrastructure

# Deploy AWS Application Resources
echo 'Deploying AWS Application Resources...'
dockerRun npm run deploy-application

# Deploy static assets
echo 'Deploying static assets to S3...'
dockerRun npm run deploy-static
