import { s3Client, handleError, checkPermission } from "#s3";
import { defineEventHandler } from "h3";
import {
  ListBucketsCommand,
  ListBucketsCommandOutput,
} from "@aws-sdk/client-s3";

export default defineEventHandler(async (event) => {
  try {
    checkPermission(event, "bucket", "list")
    
    const command = new ListBucketsCommand({});

    const data: ListBucketsCommandOutput = await s3Client.send(command);

    return data;
  } catch (error) {
    handleError(error);
  }
});
