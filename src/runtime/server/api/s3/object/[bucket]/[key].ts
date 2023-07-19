//@ts-ignore
import { s3Client, handleError, checkPermission, privateConfig } from "#s3";
import { defineEventHandler, setHeader } from "h3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "object", "read");

    const { bucket, key } = event.context.params as {
      bucket: string;
      key: string;
    };

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });
    schema.parse({ bucket, key });

    const command = new GetObjectCommand({
      Key: key,
      Bucket: bucket,
    });

    const object = await s3Client.send(command);

    const contentType = object.ContentType;

    if (contentType) {
      setHeader(event, "Content-Type", contentType);
    }

    if (privateConfig.cacheControl) {
      setHeader(event, "Cache-Control", privateConfig.cacheControl);
    }

    return object.Body;
  } catch (error) {
    handleError(error);
  }
});
