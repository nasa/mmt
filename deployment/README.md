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

Populate secrets.

```bash
export STAGE=dev
aws secretsmanager create-secret --name maap-earthdata-password-${STAGE} \
    --description "MAAP Earthdata Password" \
    --secret-string "<the password>"

aws secretsmanager create-secret --name maap-cmr-urs-password-${STAGE} \
    --description "MAAP CMR URS Password" \
    --secret-string "<the password>"
```

Populate config parameters

```bash
export STAGE=dev

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/maap/cmr-root/${STAGE}" \
    --value "cmr.dit.maap-project.org"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/maap/mmt-root/${STAGE}" \
    --value "mmt.dit.maap-project.org"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/maap/cumulus-rest-api/${STAGE}" \
    --value "https://1i4283wnch.execute-api.us-east-1.amazonaws.com/dev/"
```

3. Generate CloudFormation template

This step isn't required, but can be useful to just validate that the configuration.

```bash
$ npm run cdk synth  # Synthesizes and prints the CloudFormation template for this stack
```

```bash
# Set CDK variables to allow Hosted Zone lookup
export CDK_DEPLOY_ACCOUNT=$(aws sts get-caller-identity | jq .Account -r)
export CDK_DEPLOY_REGION $(aws configure get region)

# Deploys the stack(s) mmt-ecs-dev in cdk/app.py
$ npm run cdk deploy mmt-ecs-dev  # or whatever MMT_STACK_STAGE is set to
```