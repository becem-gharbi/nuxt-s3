import type { S3ClientConfig } from "@aws-sdk/client-s3";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

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

export type FetchReturn<T> = Promise<
  AsyncData<T | null, FetchError<H3Error> | null>
>;
