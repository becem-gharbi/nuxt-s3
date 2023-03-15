import { S3Object } from "../types";
import { useFetch, useRuntimeConfig } from "#imports";
import { withQuery, resolveURL, parseURL } from "ufo";

import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.s3;

  function getPublicUrl(key: string, query = {}): string {
    return withQuery(resolveURL(publicConfig.publicBucketUrl, key), query);
  }

  function getKey(url: string) {
    if (url.startsWith("/")) {
      const completeKey = parseURL(url).pathname.split("/").pop();
      const baseKey = completeKey?.split("_").pop();
      const key = baseKey || completeKey;
      const keyWithoutExt = key?.split(".")[0];

      // Checks if valid UUID
      const regexExp =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

      if (keyWithoutExt && regexExp.test(keyWithoutExt)) {
        return key;
      }
    }
  }

  async function listByBucket(
    bucket: string = publicConfig.bucket
  ): FetchReturn<S3Object[]> {
    return useFetch<S3Object[]>(resolveURL("/api/s3/object", bucket));
  }

  async function create(
    files: FileList,
    image: boolean = false,
    bucket: string = publicConfig.bucket
  ): FetchReturn<S3Object[]> {
    const formData = new FormData();

    formData.append("bucket", bucket);

    for (const file of files) {
      formData.append(file.name, file);
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
    key: string,
    file: File,
    image: boolean = false,
    bucket: string = publicConfig.bucket
  ): FetchReturn<S3Object> {
    const formData = new FormData();

    formData.append("key", key);
    formData.append("bucket", bucket);
    formData.append(file.name, file);

    const path = image ? "/api/s3/image/update" : "/api/s3/object/update";

    return useFetch(path, {
      method: "put",
      body: formData,
    });
  }

  return { listByBucket, create, remove, update, getPublicUrl, getKey };
}
