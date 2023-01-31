//@ts-ignore
import { s3Client, handleError } from "#s3";
import { defineEventHandler, getQuery, sendStream } from "h3";
import type { S3Object } from "../../../../../types";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const s3Object: S3Object = event.context.params;

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });
    schema.parse(s3Object);

    const command = new GetObjectCommand({
      Key: s3Object.key,
      Bucket: s3Object.bucket,
    });

    const s3ResponseStream = (await s3Client.send(command)).Body;

    return sendStream(event, s3ResponseStream);
  } catch (error) {
    handleError(error);
  }
});
