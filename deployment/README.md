# Deployment

## Overview

This deployment consists of a CDK stack to deploy the MMT application.

## Pre-requisites

**Note:** You **do not** need to create `config/application.yml` or `config/database.yml` as that will be handled automatically by the `Dockerfile`.

If you create a new stage name (e.g. one with your username in it for development), you must add a configuration for it to the `config/application.yml.maap`, `config/database.yml.maap`, and `config/services.yml` files.

You must also create an environment file in `config/environments/`, e.g.:

```bash
cp config/environments/dit.rb config/environments/aimee.rb
```

## Application deployment

### 1. Initial setup

```bash
# Download forked mmt repo
$ git clone https://github.com/MAAP-Project/mmt
# install cdk dependencies
$ cd mmt/deployment
# create python venv and activate
$ pip install -r requirements.txt
$ npm install
```

### 2. CDK bootstrap

**NOTE: This step is only necessary once per AWS account / region combination.**

```bash
AWS_REGION=us-west-2
AWS_ACCOUNT_ID=$(aws sts get-caller-identity | jq .Account -r)
npm run cdk bootstrap aws://${AWS_ACCOUNT_ID}/${AWS_REGION}
```

### 3. Create URS application

**NOTE: This step is only necessary one per deployment stage (e.g. `dit`, `uat`, `production`).**

Make sure to use the correct URS environment for your stage:

- `production`: <https://urs.earthdata.nasa.gov/>
- all other stages: <https://uat.urs.earthdata.nasa.gov/>

#### Application creator permissions

You need application creator permissions for URS in order to create and manage applications. You can request this permission using the support form on the URS homepage (e.g. <https://urs.earthdata.nasa.gov/>) by clicking "Earthdata Support" near the bottom of the page.

#### Creating a URS application

Once you have logged into URS, navigate to `Applications > My Applications` and click the "Create a new application" button. Fill in the relevant details and make sure to save the application password that you used so that you can use it to configure your deployment.

Once you have created the application, make sure to note the "Client ID" to use for configuring your deployment.

### 3. Populate Secrets and Parameters

First, check if these secrets have been populated in AWS Secrets Manager (`AWS Console -> Systems Manager -> Parameter Store`). If not, create them as below.

Set the `MMT_STACK_STAGE` variable to the appropriate stage.

For context, these are the expected values for the parameters:

- `CMR_URS_PASSWORD`: The authorization token used for communicating with CMR
- `SECRET_KEY_BASE`: String of random characters (at least 30 characters) used for verifying integrity of tokens
- `URS_PASSWORD`: Password for the Earthdata application integrated with MMT (identified by `URS_USERNAME`, [possibly created in previous step](#creating-a-urs-application))
- `URS_USERNAME`: Client ID for the Earthdata application integrated with MMT ([possibly created in previous step](#creating-a-urs-application))
- `CUMULUS_REST_API`: URL of API gateway for Cumulus deployment
- `CMR_ROOT`: Root of URL for CMR in this environment (e.g. `cmr.dit.maap-project.org`)
- `MMT_ROOT`: Root of URL for MMT in this environment (e.g. `mmt.dit.maap-project.org`)

```bash
export MMT_STACK_STAGE=dit
export AWS_REGION=us-west-2

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${MMT_STACK_STAGE}-maap-mmt/CMR_URS_PASSWORD" \
    --value "<the password>"

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${MMT_STACK_STAGE}-maap-mmt/SECRET_KEY_BASE" \
    --value "<the secret key base>"

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${MMT_STACK_STAGE}-maap-mmt/URS_PASSWORD" \
    --value "<the URS application password>"

aws ssm put-parameter \
    --type "SecureString" \
    --overwrite \
    --name "/${MMT_STACK_STAGE}-maap-mmt/URS_USERNAME" \
    --value "<the URS application ID>"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/${MMT_STACK_STAGE}-maap-mmt/CUMULUS_REST_API" \
    --value "https://1i4283wnch.execute-api.us-east-1.amazonaws.com/dev/"
```

In the `production` environment, there may be no value for `MMT_STACK_STAGE` in the hostname value (e.g. `cmr.maap-project.org`) or the value may be `ops` (e.g. `mmt.ops.maap-project.org`). Consult a MAAP team member to determine the appropriate value.

```bash
aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/${MMT_STACK_STAGE}-maap-mmt/CMR_ROOT" \
    --value "cmr.${MMT_STACK_STAGE}.maap-project.org"

aws ssm put-parameter \
    --type "String" \
    --overwrite \
    --name "/${MMT_STACK_STAGE}-maap-mmt/MMT_ROOT" \
    --value "https://mmt.${MMT_STACK_STAGE}.maap-project.org"
```

### 3. Set deployment configuration

Deployment can be customized using any of the settings defined in `app/config.py`.

To set values for these settings, create an `.env` file and add a line for the value of
each setting (with the setting name prefixed by `MMT_STACK_`):

```env
MMT_STACK_certificate_arn="arn:aws:acm:us-west-2:12345:certificate/abc123"
```

#### Optional config for Mission Cloud Platform (MCP) deployments

For deploying to MCP environments managed by NASA, you will need to specify values in `.env` for the `permissions_boundary_name` and `vpc_id` that should be used:

```env
MMT_STACK_permissions_boundary_name="example-permission-boundary"
MMT_STACK_vpc_id="vpc-12345"
```

### 4. Generate CloudFormation template

This step isn't required, but can be useful to just validate that the configuration.

Synthesize the template to validate it basically works.

```bash
export CDK_DEPLOY_ACCOUNT=$(aws sts get-caller-identity | jq .Account -r)
export CDK_DEPLOY_REGION=$(aws configure get region)
npm run cdk synth
```

### 5. Deploy the application

This deploy step will deploy a CloudFormation Stack for the MMT application.

```bash
export CDK_DEPLOY_ACCOUNT=$(aws sts get-caller-identity | jq .Account -r)
export CDK_DEPLOY_REGION=$(aws configure get region)
export MMT_STACK_STAGE="dit"

$ npm run cdk deploy -- --require-approval never
```

The application stack creates a Postgres database, generates a docker image for the application, configures an ECS Task Definition and Service that uses that Task Definition, configures an application load balancer (ALB) to point to the ECS Service, and configures a custom DNS entry for the service.

### 6. Register redirect URIs with URS application

For URS/Earthdata authentication to work with MMT, the following URIs need to be added to the Redirect URIs list:

- <https://MMT_ROOT/urs_association_callback>
- <https://MMT_ROOT/urs_login_callback>

where `MMT_ROOT` is the domain name for MMT deployment (e.g. `mmt.maap-project.org`).

You can manage redirect URIs by logging in to the appropriate URS environment then going to `Applications -> My Applications -> Edit (click edit button for your application) -> Manage -> Redirect Uris`. The page for adding redirect URIs and the expected additions will look something like:

![image](https://user-images.githubusercontent.com/42478387/123997171-17114500-d99e-11eb-8d3d-0318593e9eb8.png)

### Tear down deployment (optional)

```bash
export CDK_DEPLOY_ACCOUNT=$(aws sts get-caller-identity | jq .Account -r)
export CDK_DEPLOY_REGION=$(aws configure get region)

$ npm run cdk destroy
```

## Developer notes

The route53 permission is added because we do a lookup for the custom domain. The sts:AssumeRote is added
because the Build step fails without it, but I would have
thought it would have been added by default (this issue has been filed about that https://github.com/aws/aws-cdk/issues/16105).
