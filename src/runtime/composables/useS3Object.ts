import { S3Object } from "../types";
import { ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import { useFetch, useRuntimeConfig } from "#imports";
import { withQuery, resolveURL } from "ufo";

import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.s3;

  function getPublicUrl(key: string, query = {}): string {
    return withQuery(resolveURL(publicConfig.publicBucketUrl, key), query);
  }

  function getUrl(key: string, bucket: string = publicConfig.bucket): string {
    return resolveURL("/api/s3/object", bucket, key);
  }

  async function listByBucket(
    bucket: string = publicConfig.bucket
  ): FetchReturn<ListObjectsCommandOutput> {
    return useFetch<ListObjectsCommandOutput>(
      resolveURL("/api/s3/object", bucket)
    );
  }

  async function create(
    formData: FormData,
    image: boolean = false
  ): FetchReturn<S3Object[]> {
    if (!formData.has("bucket")) {
      formData.append("bucket", publicConfig.bucket);
    }

    const path = image ? "/api/s3/image/create" : "/api/s3/object/create";

    return useFetch(path, {
      method: "post",
      body: formData,
    });
  }

  async function remove(
    key: string,
    image: boolean = false,
    bucket: string = publicConfig.bucket
  ): FetchReturn<S3Object> {
    const path = image ? "/api/s3/image/delete" : "/api/s3/object/delete";

    return useFetch(path, {
      method: "delete",
      body: {
        key,
        bucket,
      },
    });
  }

  async function update(
    formData: FormData,
    image: boolean = false
  ): FetchReturn<S3Object> {
    if (!formData.has("bucket")) {
      formData.append("bucket", publicConfig.bucket);
    }

    const path = image ? "/api/s3/image/update" : "/api/s3/object/update";

    return useFetch(path, {
      method: "put",
      body: formData,
    });
  }

  return { getUrl, listByBucket, create, remove, update, getPublicUrl };
}
