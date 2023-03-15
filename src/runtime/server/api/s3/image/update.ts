import {
  s3Client,
  handleError,
  checkPermission,
  publicConfig,
  checkImage,
  createKey,
} from "#s3";
import { defineEventHandler, readMultipartFormData } from "h3";
import type { S3Object } from "../../../../types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import sharp from "sharp";
import { getUrl } from "../../../utils";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "image", "update");

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
      for (let el of multipartFormData) {
        if (el.filename) {
          checkImage(el.type);

          await $fetch("/api/s3/image/delete", {
            method: "DELETE",
            body: {
              bucket,
              key,
            },
          });

          const breakpoints = {
            ...publicConfig.image?.breakpoints,
            original: -1,
          };

          let buffer = el.data;
          let newKey = createKey(el.filename);

          await Promise.all(
            Object.keys(breakpoints).map(async (breakpointKey) => {
              const breakpoint =
                breakpoints[breakpointKey as keyof typeof breakpoints];

              if (!breakpoint) {
                return;
              }

              if (typeof breakpoint === "number" && breakpoint > 0) {
                buffer = await sharp(el.data)
                  .resize({
                    width: breakpoint,
                    fit: "contain",
                  })
                  .png({ quality: 80, force: false })
                  .jpeg({ quality: 80, force: false })
                  .toBuffer();

                newKey = `${breakpointKey}_${newKey}`;
              }

              const command = new PutObjectCommand({
                Bucket: bucket,
                Body: buffer,
                Key: newKey,
                ContentType: el.type,
              });

              return s3Client.send(command);
            })
          );

          const s3Object: S3Object = {
            key: newKey,
            bucket: bucket,
            type: el.type,
            url: getUrl(newKey, bucket),
          };

          return [s3Object];
        }
      }
    }

    throw new Error("No file found");
  } catch (error) {
    handleError(error);
  }
});
