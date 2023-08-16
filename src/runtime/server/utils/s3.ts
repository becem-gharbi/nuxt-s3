import { useRuntimeConfig } from "#imports";
import { AwsClient } from "aws4fetch";
import { createError } from "h3";
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

async function deleteObject(key: string, bucket = s3.bucket) {
  const res = await client.fetch(`${s3.endpoint}/${bucket}/${key}`, {
    method: "DELETE",
  });

  if (res.ok === false) {
    throw createError("delete-failed");
  }
  return res;
}

async function getObject(key: string, bucket = s3.bucket) {
  const res = await client.fetch(`${s3.endpoint}/${bucket}/${key}`, {
    method: "GET",
  });

  if (res.ok === false) {
    throw createError("get-failed");
  }
  return res;
}

async function putObject(
  key: string,
  data: Buffer,
  type: string,
  bucket = s3.bucket
) {
  const res = await client.fetch(`${s3.endpoint}/${bucket}/${key}`, {
    method: "PUT",
    body: data,
    headers: { "Content-Type": type },
  });

  if (res.ok === false) {
    throw createError("delete-failed");
  }
  return res;
}

export { putObject, getObject, deleteObject };
