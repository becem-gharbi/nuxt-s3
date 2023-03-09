//@ts-ignore
import { s3Client, handleError, checkPermission } from "#s3";
import { defineEventHandler, readBody } from "h3";
import type { S3Bucket } from "../../../../types";
import { DeleteBucketCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    if (!checkPermission(event, "bucket", "delete")) {
      throw new Error("unauthorized");
    }

    const s3Bucket = await readBody<S3Bucket>(event);

    const schema = z.object({
      name: z.string(),
    });
    schema.parse(s3Bucket);

    const command = new DeleteBucketCommand({
      Bucket: s3Bucket.name,
    });

    await s3Client.send(command);

    return {};
  } catch (error) {
    handleError(error);
  }
});
