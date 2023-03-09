import { S3Object } from "../types";
import { ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import { useFetch, useRuntimeConfig } from "#imports";

import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.s3;

  function getPublicUrl(key: string, query?: string): string {
    return `${publicConfig.publicBucketUrl}/${key}?${query}`;
  }

  function getUrl(key: string, bucket: string = publicConfig.bucket): string {
    return `/api/s3/object/${bucket}/${key}`;
  }

  async function listByBucket(
    bucket: string = publicConfig.bucket
  ): FetchReturn<ListObjectsCommandOutput> {
    return useFetch<ListObjectsCommandOutput>(`/api/s3/object/${bucket}`);
  }

  async function create(formData: FormData): FetchReturn<S3Object[]> {
    if (!formData.has("bucket")) {
      formData.append("bucket", publicConfig.bucket);
    }

    return useFetch("/api/s3/object/create", {
      method: "post",
      body: formData,
    });
  }

  async function remove(
    key: string,
    bucket: string = publicConfig.bucket
  ): FetchReturn<{}> {
    return useFetch("/api/s3/object/delete", {
      method: "delete",
      body: {
        key,
        bucket,
      },
    });
  }

  async function update(formData: FormData): FetchReturn<{}> {
    if (!formData.has("bucket")) {
      formData.append("bucket", publicConfig.bucket);
    }

    return useFetch("/api/s3/object/update", {
      method: "put",
      body: formData,
    });
  }

  return { getUrl, listByBucket, create, remove, update, getPublicUrl };
}
