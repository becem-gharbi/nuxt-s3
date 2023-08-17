import { useRuntimeConfig } from "#imports";
import { AwsClient } from "aws4fetch";
import { createError } from "h3";
import crypto from "crypto";
import { $fetch } from "ofetch";

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
  const request = await client.sign(`${config.s3.endpoint}/${bucket}/${key}`, {
    method: "DELETE",
  });

  return $fetch(request).catch(() => {
    throw createError({
      message: "delete-failed",
      statusCode: 400,
    });
  });
}

async function getObject(key: string, bucket = config.s3.bucket) {
  const request = await client.sign(`${config.s3.endpoint}/${bucket}/${key}`, {
    method: "GET",
  });

  const res = await $fetch(request).catch(() => {
    throw createError({
      message: "get-failed",
      statusCode: 404,
    });
  });

  return res.stream();
}

async function putObject(
  key: string,
  data: Buffer,
  type: string,
  bucket = config.s3.bucket
) {
  checkType(type);

  const request = await client.sign(`${config.s3.endpoint}/${bucket}/${key}`, {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": type,
    },
  });

  return $fetch(request).catch(() => {
    throw createError({
      message: "put-failed",
      statusCode: 500,
    });
  });
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
