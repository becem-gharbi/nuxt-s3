//@ts-ignore
import { s3Client, handleError, checkPermission } from "#s3";
import { defineEventHandler, readMultipartFormData } from "h3";
import type { S3Object } from "../../../../types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    if (!checkPermission(event, "object", "update")) {
      throw new Error("unauthorized");
    }

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
          const s3Object: S3Object = {
            bucket: bucket,
            key: key,
            type: el.type,
          };

          const command = new PutObjectCommand({
            Bucket: s3Object.bucket,
            Body: el.data,
            Key: s3Object.key,
            ContentType: s3Object.type,
          });

          await s3Client.send(command);

          return { s3Object };
        }
      }
    }

    return {};
  } catch (error) {
    handleError(error);
  }
});
