import {
  s3Client,
  handleError,
  checkPermission,
  publicConfig,
  composeKey,
} from "#s3";
import { defineEventHandler, readBody } from "h3";
import type { S3Object } from "../../../../types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "image", "delete");

    const s3Object = await readBody<S3Object>(event);

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });

    schema.parse(s3Object);

    const baseKey = s3Object.key.split("_").pop() || s3Object.key;

    const breakpoints = { ...publicConfig.image?.breakpoints, original: -1 };

    await Promise.all(
      Object.keys(breakpoints).map(async (breakpointKey) => {
        const breakpoint =
          breakpoints[breakpointKey as keyof typeof breakpoints];

        if (!breakpoint) {
          return;
        }

        let key = baseKey;

        if (typeof breakpoint === "number" && breakpoint > 0) {
          key = composeKey(baseKey, breakpointKey);
        }

        const command = new DeleteObjectCommand({
          Bucket: s3Object.bucket,
          Key: key,
        });

        return s3Client.send(command);
      })
    );

    return s3Object;
  } catch (error) {
    handleError(error);
  }
});
