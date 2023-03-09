//@ts-ignore
import { s3Client, handleError, checkPermission } from "#s3";
import { defineEventHandler } from "h3";
import {
  ListObjectsCommand,
  ListObjectsCommandOutput,
} from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    if (!checkPermission(event, "object", "list")) {
      throw new Error("unauthorized");
    }

    const { bucket } = event.context.params as { bucket: string };

    const schema = z.object({
      bucket: z.string(),
    });
    schema.parse({ bucket });

    const command = new ListObjectsCommand({
      Bucket: bucket,
    });

    const data: ListObjectsCommandOutput = await s3Client.send(command);

    return data;
  } catch (error) {
    handleError(error);
  }
});
