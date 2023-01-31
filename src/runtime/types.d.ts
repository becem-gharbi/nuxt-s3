import type { S3ClientConfig } from "@aws-sdk/client-s3";

export type PrivateConfig = {
  client: S3ClientConfig;
};

export type PublicConfig = {
  bucket: string;
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
}

export interface S3Bucket {
  name: string;
}
