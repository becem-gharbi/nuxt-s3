//@ts-ignore
import { s3Client, handleError } from "#s3";
import { defineEventHandler, readMultipartFormData } from "h3";
import type { S3Object } from "../../../../types";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
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
          const ext = el.filename.slice(el.filename.lastIndexOf(".") + 1);
          const key = `${uuidv4()}.${ext}`;

          const s3Object: S3Object = {
            bucket: bucket,
            key: key,
            // Cloudflare
            // publicUrl: `https://pub-b8e47afe2ae14f158c0a831a0c5a5d2d.r2.dev/${key}`,
            // Storj
            publicUrl: `https://link.storjshare.io/jwbpb2nz3x6l7gjiaxht3cjqdqla/${bucket}/${key}?download=1`,
          };

          const command = new PutObjectCommand({
            Bucket: s3Object.bucket,
            Body: el.data,
            Key: s3Object.key,
            ContentType: el.type,
          });

          await s3Client.send(command);

          s3Objects.push(s3Object);
        }
      }
    }

    return { s3Objects };
  } catch (error) {
    handleError(error);
  }
});
