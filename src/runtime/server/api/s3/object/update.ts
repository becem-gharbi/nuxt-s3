import {
  s3Client,
  handleError,
  checkPermission,
  composeUrl,
  createKey,
} from "#s3";
import { defineEventHandler, readMultipartFormData, getHeader } from "h3";
import type { S3Object } from "../../../../types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "object", "update");

    const multipartFormData = await readMultipartFormData(event);

    const bucket = multipartFormData
      ?.find((el) => el.name === "bucket")
      ?.data.toString();

    const key = multipartFormData
      ?.find((el) => el.name === "key")
      ?.data.toString();

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });
    schema.parse({ bucket, key });

    if (multipartFormData && bucket && key) {
      for (let el of multipartFormData) {
        if (el.filename) {
          await $fetch("/api/s3/object/delete", {
            method: "DELETE",
            body: {
              bucket,
              key,
            },
            headers: {
              Authorization: getHeader(event, "Authorization") || "",
              Cookie: getHeader(event, "Cookie") || "",
            },
          });

          const newKey = createKey(el.filename);

          const command = new PutObjectCommand({
            Bucket: bucket,
            Body: el.data,
            Key: newKey,
            ContentType: el.type,
          });

          await s3Client.send(command);

          const s3Object: S3Object = {
            bucket: bucket,
            key: newKey,
            type: el.type,
            url: composeUrl(newKey, bucket),
          };

          return [s3Object];
        }
      }
    }

    throw new Error("No file found");
  } catch (error) {
    handleError(error);
  }
});
