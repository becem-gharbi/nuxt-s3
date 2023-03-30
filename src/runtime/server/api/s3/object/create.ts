import {
  s3Client,
  handleError,
  checkPermission,
  composeUrl,
  createKey,
} from "#s3";
import { defineEventHandler, readMultipartFormData } from "h3";
import type { S3Object } from "../../../../types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "object", "create");

    const multipartFormData = await readMultipartFormData(event);

    const bucket = multipartFormData
      ?.find((el) => el.name === "bucket")
      ?.data.toString();

    const schema = z.object({
      bucket: z.string(),
    });
    schema.parse({ bucket });

    const s3Objects: S3Object[] = [];

    if (multipartFormData && bucket) {
      for (let el of multipartFormData) {
        if (el.filename) {
          const key = createKey(el);

          const command = new PutObjectCommand({
            Bucket: bucket,
            Body: el.data,
            Key: key,
            ContentType: el.type,
          });

          await s3Client.send(command);

          const s3Object: S3Object = {
            bucket: bucket,
            key: key,
            type: el.type,
            url: composeUrl(key, bucket),
          };

          s3Objects.push(s3Object);
        }
      }
    }

    return s3Objects;
  } catch (error) {
    handleError(error);
  }
});
