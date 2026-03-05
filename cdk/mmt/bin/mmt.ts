#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'

import { MmtStack } from '../lib/mmt-stack'

/**
 * CDK app entrypoint for the MMT application stack.
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
new MmtStack(app, `mmt-cdk-${STAGE_NAME}`, {
  env: {
    account: AWS_ACCOUNT,
    region: AWS_REGION
  }
})
