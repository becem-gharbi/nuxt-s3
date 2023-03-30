import type { S3ClientConfig } from "@aws-sdk/client-s3";

export type PrivateConfig = {
  client: S3ClientConfig;
};

export type PublicConfig = {
  bucket?: string;
  publicBucketUrl?: string;
  image?: {
    compression?:
      | {
          maxSizeMB: number;
          maxWidthOrHeight: number;
        }
      | boolean;
  };
};

export interface MultiPartData {
  data: Buffer;
  name?: string;
  filename?: string;
  type?: string;
}

export interface S3Object {
  bucket: string;
  key: string;
  type?: string;
  url: string;
}

export interface S3Bucket {
  name: string;
}

interface S3Url {
  key: string;
  bucket: string;
}

export type Entity = "bucket" | "object";

export type Permission = "read" | "create" | "update" | "delete" | "list";

export interface S3Context {
  permissions: {
    bucket: {
      create: boolean;
      delete: boolean;
      list: boolean;
    };
    object: {
      create: boolean;
      delete: boolean;
      update: boolean;
      read: boolean;
      list: boolean;
    };
  };
}
