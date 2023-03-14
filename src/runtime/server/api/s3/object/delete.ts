import { s3Client, handleError, checkPermission } from "#s3";
import { defineEventHandler, readBody } from "h3";
import type { S3Object } from "../../../../types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "object", "delete");

    const s3Object = await readBody<S3Object>(event);

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });
    schema.parse(s3Object);

    const command = new DeleteObjectCommand({
      Bucket: s3Object.bucket,
      Key: s3Object.key,
    });

    await s3Client.send(command);

    return s3Object;
  } catch (error) {
    handleError(error);
  }
});
