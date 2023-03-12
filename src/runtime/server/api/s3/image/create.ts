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
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import sharp from "sharp";

export default defineEventHandler(async (event) => {
  try {
    if (!checkPermission(event, "object", "create")) {
      throw new Error("unauthorized");
    }

    const multipartFormData = await readMultipartFormData(event);

    const bucket = multipartFormData
      ?.find((el) => el.name === "bucket")
      ?.data.toString();

    const schema = z.object({
      bucket: z.string(),
    });
    schema.parse({ bucket });

    const s3Objects: S3Object[] = [];

    if (multipartFormData && bucket) {
      for (let el of multipartFormData) {
        if (el.filename) {
          checkImage(el.type);

          const ext = el.filename.slice(el.filename.lastIndexOf(".") + 1);

          const baseKey = `${uuidv4()}.${ext}`;

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
                key: key,
                bucket: bucket,
                type: el.type,
              };

              const command = new PutObjectCommand({
                Bucket: bucket,
                Body: buffer,
                Key: s3Object.key,
                ContentType: el.type,
              });

              return s3Client
                .send(command)
                .then(() => s3Objects.push(s3Object));
            })
          );
        }
      }
    }

    return s3Objects;
  } catch (error) {
    handleError(error);
  }
});
