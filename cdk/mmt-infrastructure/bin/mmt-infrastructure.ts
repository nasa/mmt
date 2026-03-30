#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'

import { MmtInfrastructureStack } from '../lib/mmt-infrastructure-stack'

/**
 * CDK app entrypoint for the shared MMT infrastructure stack.
 * Reads target account/region/stage from environment variables and
 * instantiates the stack with a stage-qualified name.
 */
const {
  AWS_ACCOUNT = '1234567890',
  AWS_REGION = 'us-east-1',
  STAGE_NAME = 'dev'
} = process.env

const app = new cdk.App()

// eslint-disable-next-line no-new
new MmtInfrastructureStack(app, `mmt-infrastructure-cdk-${STAGE_NAME}`, {
  env: {
    account: AWS_ACCOUNT,
    region: AWS_REGION
  }
})
