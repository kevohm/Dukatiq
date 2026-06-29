import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { config } from './env.config.js'
const opts = {
    endpoint: config.b2.endpoint,
    region: config.b2.region,
    credentials: {
        accessKeyId: config.b2.credentials.accessKeyId,
        secretAccessKey: config.b2.credentials.secretAccessKey,
    },
    forcePathStyle: true,
}


// console.log(opts)
export const s3 = new S3Client(opts)

