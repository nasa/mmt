import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { staticAssets } from '@edsc/cdk-utils'

const { SITE_BUCKET = 'mock-bucket' } = process.env

/**
 * Deploys built static web assets from the local dist folder into the
 * configured MMT site S3 bucket.
 */
export class MmtStaticStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // eslint-disable-next-line no-new
    new staticAssets.S3Site(this, 'MmtSite', {
      destinationBucketName: SITE_BUCKET,
      sourceFolder: '../../dist'
    })
  }
}
