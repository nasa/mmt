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
config="`jq '.saml.host = $newValue' --arg newValue $bamboo_SAML_HOST <<< $config`"
config="`jq '.saml.callbackUrl = $newValue' --arg newValue $bamboo_SAML_CALLBACK_URL <<< $config`"
config="`jq '.saml.keepAliveOrigin = $newValue' --arg newValue $bamboo_SAML_KEEP_ALIVE_ORIGIN <<< $config`"
config="`jq '.saml.issuer = $newValue' --arg newValue $bamboo_SAML_ISSUER <<< $config`"
config="`jq '.saml.cookieName = $newValue' --arg newValue $bamboo_SAML_COOKIE_NAME <<< $config`"
config="`jq '.saml.entryPoint = $newValue' --arg newValue $bamboo_SAML_ENTRY_POINT <<< $config`"
config="`jq '.saml.launchpadRoot = $newValue' --arg newValue $bamboo_SAML_LAUNCHPAD_ROOT <<< $config`"
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
FROM node:18-bullseye
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
        -e "AWS_SECRET_ACCESS_KEY=$bamboo_AWS_SECRET_ACCESS_KEY" \
        -e "COOKIE_DOMAIN=$bamboo_COOKIE_DOMAIN" \
        -e "DISPLAY_PROD_WARNING=$bamboo_DISPLAY_PROD_WARNING" \
        -e "EDL_PASSWORD=$bamboo_EDL_PASSWORD" \
        -e "JWT_SECRET=$bamboo_JWT_SECRET" \
        -e "JWT_VALID_TIME=$bamboo_JWT_VALID_TIME" \
        -e "LAMBDA_TIMEOUT=$bamboo_LAMBDA_TIMEOUT" \
        -e "MMT_HOST=$bamboo_MMT_HOST" \
        -e "NODE_ENV=production" \
        -e "NODE_OPTIONS=--max_old_space_size=4096" \
        -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
        -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
        -e "SUBNET_ID_C=$bamboo_SUBNET_ID_C" \
        -e "VPC_ID=$bamboo_VPC_ID" \
        $dockerTag "$@"
}

# Execute serverless commands in Docker
#######################################

stageOpts="--stage $bamboo_STAGE_NAME"

# Deploy AWS Infrastructure Resources
echo 'Deploying AWS Infrastructure Resources...'
dockerRun npx serverless deploy $stageOpts --config serverless-infrastructure.yml

# Deploy AWS Application Resources
echo 'Deploying AWS Application Resources...'
dockerRun npx serverless deploy $stageOpts

# Deploy static assets
echo 'Deploying static assets to S3...'
dockerRun npx serverless client deploy $stageOpts --no-confirm
