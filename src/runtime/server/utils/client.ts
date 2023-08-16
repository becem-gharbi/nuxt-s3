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

function deleteObject(key: string, bucket = s3.bucket) {
  return client.fetch(`${s3.endpoint}/${bucket}/${key}`, {
    method: "DELETE",
  });
}

function getObject(key: string, bucket = s3.bucket) {
  return client.fetch(`${s3.endpoint}/${bucket}/${key}`, {
    method: "GET",
  });
}

function putObject(
  key: string,
  data: Buffer,
  type: string,
  bucket = s3.bucket
) {
  return client.fetch(`${s3.endpoint}/${bucket}/${key}`, {
    method: "PUT",
    body: data,
    headers: { "Content-Type": type },
  });
}

export { putObject, getObject, deleteObject };
