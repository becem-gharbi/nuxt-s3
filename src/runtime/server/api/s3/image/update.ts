import {
  s3Client,
  handleError,
  checkPermission,
  publicConfig,
  checkImage,
} from "#s3";
import { defineEventHandler, readMultipartFormData } from "h3";
import type { S3Object } from "../../../../types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import sharp from "sharp";

export default defineEventHandler(async (event) => {
  try {
    if (!checkPermission(event, "image", "update")) {
      throw new Error("unauthorized");
    }

    const multipartFormData = await readMultipartFormData(event);

    const bucket = multipartFormData
      ?.find((el) => el.name === "bucket")
      ?.data.toString();

    const key = multipartFormData
      ?.find((el) => el.name === "key")
      ?.data.toString();

    const schema = z.object({
      bucket: z.string(),
      key: z.string(),
    });
    schema.parse({ bucket, key });

    if (multipartFormData && bucket && key) {
      const baseKey = key.split("_").pop() || key;

      for (let el of multipartFormData) {
        if (el.filename) {
          checkImage(el.type);

          const breakpoints = {
            ...publicConfig.image?.breakpoints,
            original: -1,
          };

          await Promise.all(
            Object.keys(breakpoints).map(async (breakpointKey) => {
              const breakpoint =
                breakpoints[breakpointKey as keyof typeof breakpoints];

              if (!breakpoint) {
                return;
              }

              let buffer = el.data;
              let key = baseKey;

              if (typeof breakpoint === "number" && breakpoint > 0) {
                buffer = await sharp(el.data)
                  .resize({
                    width: breakpoint,
                    fit: "contain",
                  })
                  .toBuffer();

                key = `${breakpointKey}_${baseKey}`;
              }

              const command = new PutObjectCommand({
                Bucket: bucket,
                Body: buffer,
                Key: key,
                ContentType: el.type,
              });

              return s3Client.send(command);
            })
          );

          const s3Object: S3Object = {
            key: baseKey,
            bucket: bucket,
            type: el.type,
          };

          return s3Object;
        }
      }
    }

    return {};
  } catch (error) {
    handleError(error);
  }
});
