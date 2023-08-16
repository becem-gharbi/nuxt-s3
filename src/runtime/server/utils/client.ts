import { useRuntimeConfig } from "#imports";
import { AwsClient } from "aws4fetch";
import crypto from "crypto";

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

const { s3 } = useRuntimeConfig();

const client = new AwsClient({
  accessKeyId: s3.accessKeyId,
  secretAccessKey: s3.secretAccessKey,
  region: s3.region,
  service: "s3",
});

const baseURL = s3.endpoint;
const bucket = s3.bucket;

export { client, baseURL, bucket };
