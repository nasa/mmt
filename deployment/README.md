# Deployment

## AWS ECS (Fargate) + ALB (Application Load Balancer)

The example handles tasks such as generating a docker image and setting up an application load balancer (ALB) and ECS services.

1. Install CDK and connect to your AWS account. This step is only necessary once per AWS account.

```bash
# Download forked mmt repo
$ git clone https://github.com/MAAP-Project/mmt

# install cdk dependencies
$ cd mmt/deployment
$ # create python venv and activate
$ pip install -r requirements.txt
$ npm install

$ npm run cdk bootstrap # Deploys the CDK toolkit stack into an AWS environment

# or, only deploy to a specific region
$ npm run cdk bootstrap aws://${AWS_ACCOUNT_ID}/us-west-2
```

2. Populate Secrets and Parameters

These may already be populated.

Populate config parameters.

```bash
export STAGE=dit
export AWS_REGION=us-west-2

aws secretsmanager create-secret --name "/github.com/MAAP-Project/mmt" \
    --description "GitHub credentials for MAAP-Project" \
    --secret-string '{"token": "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"}'

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/EARTHDATA_PASSWORD" \
    --value "<the password>"

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/CMR_URS_PASSWORD" \
    --value "<the password>"

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/SECRET_KEY_BASE" \
    --value "<the secret key base>"

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/URS_PASSWORD" \
    --value "<the urs password>"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/EARTHDATA_USERNAME" \
    --value "devseed"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/CMR_ROOT" \
    --value "cmr.dit.maap-project.org"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/MMT_ROOT" \
    --value "mmt.dit.maap-project.org"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/${STAGE}-maap-mmt/CUMULUS_REST_API" \
    --value "https://1i4283wnch.execute-api.us-east-1.amazonaws.com/dev/"
```

3. Generate CloudFormation template

This step isn't required, but can be useful to just validate that the configuration.

```bash
$ npm run cdk synth  # Synthesizes and prints the CloudFormation template for this stack
```

4. Deploy

```bash
# Set CDK variables to allow Hosted Zone lookup
export CDK_DEPLOY_ACCOUNT=$(aws sts get-caller-identity | jq .Account -r)
export CDK_DEPLOY_REGION=$(aws configure get region)

$ npm run cdk deploy
```

4. Undeploy (optional)

```bash
# Set CDK variables to allow Hosted Zone lookup
export CDK_DEPLOY_ACCOUNT=$(aws sts get-caller-identity | jq .Account -r)
export CDK_DEPLOY_REGION=$(aws configure get region)

$ npm run cdk destroy
```