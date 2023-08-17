import { useRuntimeConfig } from "#imports";
import { AwsClient } from "aws4fetch";
import { createError } from "h3";
import crypto from "crypto";

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

const config = useRuntimeConfig();

const client = new AwsClient({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  region: config.s3.region,
  service: "s3",
});

async function deleteObject(key: string, bucket = config.s3.bucket) {
  const res = await client.fetch(`${config.s3.endpoint}/${bucket}/${key}`, {
    method: "DELETE",
  });

  if (res.ok === false) {
    throw createError("delete-failed");
  }
  return res;
}

async function getObject(key: string, bucket = config.s3.bucket) {
  const res = await client.fetch(`${config.s3.endpoint}/${bucket}/${key}`, {
    method: "GET",
  });

  if (res.ok === false) {
    throw createError({
      message: "get-failed",
      status: 404,
    });
  }

  return res;
}

async function putObject(
  key: string,
  data: Buffer,
  type: string,
  bucket = config.s3.bucket
) {
  checkType(type);

  const res = await client.fetch(`${config.s3.endpoint}/${bucket}/${key}`, {
    method: "PUT",
    body: data,
    headers: { "Content-Type": type },
  });

  if (res.ok === false) {
    throw createError("delete-failed");
  }
  return res;
}

function checkType(type: string) {
  const regex = new RegExp(config.public.s3.accept);

  if (!regex.test(type)) {
    throw createError({
      message: "invalid-type",
      status: 400,
    });
  }
}

export { putObject, getObject, deleteObject };
