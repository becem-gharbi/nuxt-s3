//@ts-ignore
import { s3Client, handleError, checkPermission, publicConfig } from "#s3";
import { defineEventHandler, readBody } from "h3";
import type { S3Object } from "../../../../types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    if (!checkPermission(event, "image", "delete")) {
      throw new Error("unauthorized");
    }

    const { key, bucket, type } = await readBody<S3Object>(event);

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });

    schema.parse({ key, bucket });

    const baseKey = key.split("_").pop() || key;

    const breakpoints = { ...publicConfig.image.breakpoints };

    breakpoints["original"] = -1;

    const s3Objects: S3Object[] = [];

    await Promise.all(
      Object.keys(breakpoints).map(async (breakpoint) => {
        if (!breakpoints[breakpoint]) {
          return;
        }

        let key = baseKey;

        if (breakpoints[breakpoint] > 0) {
          key = `${breakpoint}_${baseKey}`;
        }

        const s3Object: S3Object = {
          bucket: bucket,
          key: key,
          type: type,
        };

        const command = new DeleteObjectCommand({
          Bucket: s3Object.bucket,
          Key: s3Object.key,
        });

        return s3Client.send(command).then(() => s3Objects.push(s3Object));
      })
    );

    return s3Objects;
  } catch (error) {
    handleError(error);
  }
});
