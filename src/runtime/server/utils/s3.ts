import { S3Client } from "@aws-sdk/client-s3";
import { privateConfig } from "./config";
import type { S3Context } from "../../types";
import type { H3Event } from "h3";

const s3Client = new S3Client(privateConfig.client);

function setPermissions(event: H3Event, permissions: S3Context["permissions"]) {
  event.context.s3 = event.context.s3 || {};
  event.context.s3.permissions = permissions;
}

export { s3Client, setPermissions };
