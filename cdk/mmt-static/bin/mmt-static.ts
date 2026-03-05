#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'

import { MmtStaticStack } from '../lib/mmt-static-stack'

/**
 * CDK app entrypoint for the MMT static asset deployment stack.
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
new MmtStaticStack(app, `mmt-static-cdk-${STAGE_NAME}`, {
  env: {
    account: AWS_ACCOUNT,
    region: AWS_REGION
  }
})
