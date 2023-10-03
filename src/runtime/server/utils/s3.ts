import { useRuntimeConfig } from "#imports";
import { AwsClient } from "aws4fetch";
import { createError, setResponseHeader } from "h3";
import crypto from "crypto";
import { createStorage } from "unstorage";
import { denormalizeKey } from "./key";
import { $fetch } from "ofetch";

if (!globalThis.crypto) {
  //@ts-ignore
  globalThis.crypto = crypto;
}

const config = useRuntimeConfig();

const client = new AwsClient({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  region: config.s3.region,
  service: "s3",
});

function checkType(type: string) {
  const regex = new RegExp(config.public.s3.accept);

  if (!regex.test(type)) {
    throw createError({
      message: "invalid-type",
      status: 400,
    });
  }
}

const s3Storage = createStorage({
  //@ts-ignore
  driver: {
    name: "s3",

    async getItemRaw(key, opts) {
      key = denormalizeKey(key);

      const request = await client.sign(
        `${config.s3.endpoint}/${config.s3.bucket}/${key}`,
        {
          method: "GET",
        }
      );

      const res = await $fetch.raw(request).catch(() => {
        throw createError({
          message: "get-failed",
          statusCode: 404,
        });
      });

      const contentType = res.headers.get("Content-Type");

      if (contentType) {
        setResponseHeader(opts.event, "Content-Type", contentType);
      }

      return res._data as Blob; // TODO return a stream
    },

    async setItemRaw(key, value, opts) {
      key = denormalizeKey(key);

      checkType(opts.type);

      const request = await client.sign(
        `${config.s3.endpoint}/${config.s3.bucket}/${key}`,
        {
          method: "PUT",
          body: value,
          headers: {
            "Content-Type": opts.type,
          },
        }
      );

      return $fetch(request).catch(() => {
        throw createError({
          message: "put-failed",
          statusCode: 500,
        });
      });
    },

    async removeItem(key) {
      key = denormalizeKey(key);

      const request = await client.sign(
        `${config.s3.endpoint}/${config.s3.bucket}/${key}`,
        {
          method: "DELETE",
        }
      );

      return $fetch(request).catch(() => {
        throw createError({
          message: "delete-failed",
          statusCode: 400,
        });
      });
    },
  },
});

export { s3Storage };
