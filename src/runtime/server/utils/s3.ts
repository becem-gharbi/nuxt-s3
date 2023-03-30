import { S3Client } from "@aws-sdk/client-s3";
import { privateConfig } from "./config";
import type { S3Context, Entity, Permission } from "../../types";
import type { H3Event } from "h3";

const s3Client = new S3Client(privateConfig.client);

function setPermissions(event: H3Event, permissions: S3Context["permissions"]) {
  event.context.s3 = event.context.s3 || {};
  event.context.s3.permissions = permissions;
}

function checkPermission(
  event: H3Event,
  entity: Entity,
  permission: Permission
) {
  if (
    !event.context.s3?.permissions[entity] ||
    !event.context.s3?.permissions[entity][permission]
  ) {
    throw new Error("unauthorized");
  }
}

export { s3Client, setPermissions, checkPermission };
