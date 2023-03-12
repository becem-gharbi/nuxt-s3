//@ts-ignore
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

    const s3Objects: S3Object[] = [];

    if (multipartFormData && bucket && key) {
      const baseKey = key.split("_").pop() || key;

      for (let el of multipartFormData) {
        if (el.filename) {
          checkImage(el.type);

          const breakpoints = { ...publicConfig.image.breakpoints };

          breakpoints["original"] = -1;

          await Promise.all(
            Object.keys(breakpoints).map(async (breakpoint) => {
              if (!breakpoints[breakpoint]) {
                return;
              }

              let buffer = el.data;
              let key = baseKey;

              if (breakpoints[breakpoint] > 0) {
                buffer = await sharp(el.data)
                  .resize({
                    width: breakpoints[breakpoint],
                    fit: "contain",
                  })
                  .toBuffer();

                key = `${breakpoint}_${baseKey}`;
              }

              const s3Object: S3Object = {
                bucket: bucket,
                key: key,
                type: el.type,
              };

              const command = new PutObjectCommand({
                Bucket: s3Object.bucket,
                Body: buffer,
                Key: s3Object.key,
                ContentType: s3Object.type,
              });

              return s3Client
                .send(command)
                .then(() => s3Objects.push(s3Object));
            })
          );

          return s3Objects;
        }
      }
    }

    return {};
  } catch (error) {
    handleError(error);
  }
});
