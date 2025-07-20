import AWS, { S3Client } from "@aws-sdk/client-s3";
import { config } from "./env.config";

export const AWS_s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key,
    secretAccessKey: config.aws.secret_key,
  },
});
