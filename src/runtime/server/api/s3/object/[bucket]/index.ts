//@ts-ignore
import { s3Client, handleError, checkPermission, getUrl } from "#s3";
import { defineEventHandler } from "h3";
import {
  ListObjectsCommand,
  ListObjectsCommandOutput,
} from "@aws-sdk/client-s3";
import { z } from "zod";
import type { S3Object } from "../../../../../types";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "object", "list");

    const { bucket } = event.context.params as { bucket: string };

    const schema = z.object({
      bucket: z.string(),
    });
    schema.parse({ bucket });

    const command = new ListObjectsCommand({
      Bucket: bucket,
    });

    const data: ListObjectsCommandOutput = await s3Client.send(command);

    const s3Objects: S3Object[] =
      data.Contents?.map((item) => ({
        bucket: bucket,
        key: item.Key!,
        url: getUrl(item.Key!, bucket),
      })) || [];

    return s3Objects;
  } catch (error) {
    handleError(error);
  }
});
