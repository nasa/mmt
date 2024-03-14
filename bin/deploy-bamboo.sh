#!/bin/bash

# Bail on unset variables, errors and trace execution
set -eux

# Deployment configuration/variables
####################################

# read in static.config.json
config="`cat static.config.json`"

# update keys for deployment
config="`jq '.application.version = $newValue' --arg newValue ${RELEASE_VERSION} <<< $config`"
config="`jq '.application.graphQlHost = $newValue' --arg newValue $bamboo_GRAPHQL_HOST <<< $config`"
config="`jq '.application.mmtHost = $newValue' --arg newValue $bamboo_MMT_HOST <<< $config`"
config="`jq '.application.apiHost = $newValue' --arg newValue $bamboo_API_HOST <<< $config`"
config="`jq '.application.cmrHost = $newValue' --arg newValue $bamboo_CMR_HOST <<< $config`"
config="`jq '.application.searchUrl = $newValue' --arg newValue $bamboo_CMR_HOST <<< $config`"
config="`jq 'del(.application.cookie)' <<< $config`"
config="`jq '.saml.host = $newValue' --arg newValue $bamboo_SAML_HOST <<< $config`"
config="`jq '.saml.callbackUrl = $newValue' --arg newValue $bamboo_SAML_CALLBACK_URL <<< $config`"
config="`jq '.saml.issuer = $newValue' --arg newValue $bamboo_SAML_ISSUER <<< $config`"
config="`jq '.saml.cookieName = $newValue' --arg newValue $bamboo_SAML_COOKIE_NAME <<< $config`"

# overwrite static.config.json with new values
echo $config > tmp.$$.json && mv tmp.$$.json static.config.json

# setup .env
echo "EDL_PASSWORD=$bamboo_EDL_PASSWORD" > .env

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
        -e "LAMBDA_TIMEOUT=$bamboo_LAMBDA_TIMEOUT" \
        -e "NODE_ENV=production" \
        -e "NODE_OPTIONS=--max_old_space_size=4096" \
        -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
        -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
        -e "SUBNET_ID_C=$bamboo_SUBNET_ID_C" \
	    -e "LAMBDA_SECURITY_GROUP_ID=$bamboo_LAMBDA_SECURITY_GROUP_ID" \
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
