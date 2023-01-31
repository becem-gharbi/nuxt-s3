//@ts-ignore
import { s3Client, handleError } from "#s3";
import { defineEventHandler, sendStream } from "h3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const { bucket, key } = event.context.params;

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });
    schema.parse({ bucket, key });

    const command = new GetObjectCommand({
      Key: key,
      Bucket: bucket,
    });

    const s3ResponseStream = (await s3Client.send(command)).Body;

    return sendStream(event, s3ResponseStream);
  } catch (error) {
    handleError(error);
  }
});
