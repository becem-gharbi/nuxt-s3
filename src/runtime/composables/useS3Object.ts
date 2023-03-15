import { S3Object } from "../types";
import { useFetch, useRuntimeConfig } from "#imports";
import { withQuery, resolveURL, parseURL, getQuery } from "ufo";

import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

interface S3Url {
  key: string;
  bucket: string;
  breakpoint?: string;
  query?: {};
}

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.s3;

  function composeUrl(options: S3Url): string {
    const completeKey = options.breakpoint
      ? `${options.breakpoint}_${options.key}`
      : options.key;
    return withQuery(
      resolveURL("/api/s3/object", options.bucket, completeKey),
      options.query || {}
    );
  }

  function decomposeUrl(url: string): S3Url | undefined {
    if (url.startsWith("/")) {
      const paths = parseURL(url).pathname.split("/");

      const bucket = paths[paths.length - 2];

      const completeKey = paths[paths.length - 1];

      const query = getQuery(url);

      const breakpoint = completeKey?.split("_")[0];

      const baseKey = completeKey?.split("_").pop();

      const key = baseKey || completeKey;

      const keyWithoutExt = key?.split(".")[0];

      // Checks if valid UUID
      const regexExp =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

      if (keyWithoutExt && regexExp.test(keyWithoutExt)) {
        return { bucket, key, breakpoint, query };
      }
    }
  }

  async function create(
    files: File[],
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

  async function update(
    key: string,
    file: File,
    image: boolean = false,
    bucket: string = publicConfig.bucket
  ): FetchReturn<S3Object[]> {
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

  function getPublicUrl(url: string): string {
    const decomposedUrl = decomposeUrl(url);

    if (!decomposedUrl) {
      return url;
    }

    return withQuery(
      resolveURL(publicConfig.publicBucketUrl, decomposedUrl.key),
      decomposedUrl.query || {}
    );
  }

  async function listByBucket(
    bucket: string = publicConfig.bucket
  ): FetchReturn<S3Object[]> {
    return useFetch<S3Object[]>(resolveURL("/api/s3/object", bucket));
  }

  /**
   * Removes an object from bucket.
   * The object Key and Bucket are extracted from it's url
   */
  async function remove(
    url: string,
    image: boolean = false
  ): FetchReturn<S3Object> {
    const decomposedUrl = decomposeUrl(url);

    if (!decomposedUrl) {
      throw new Error("Invalid URL");
    }

    const path = image ? "/api/s3/image/delete" : "/api/s3/object/delete";

    return useFetch(path, {
      method: "delete",
      body: {
        key: decomposedUrl.key,
        bucket: decomposedUrl.bucket,
      },
    });
  }

  /**
   * Upload an object to bucket.
   * If url exists and valid, the object key will be extracted and the existing object will be updated.
   * Otherwise new object will be created.
   */
  function upload(
    files: File[],
    url?: string,
    image: boolean = false,
    bucket: string = publicConfig.bucket
  ) {
    if (url) {
      const decomposedUrl = decomposeUrl(url);

      if (decomposedUrl) {
        return update(decomposedUrl.key, files[0], image, decomposedUrl.bucket);
      }
    }

    return create(files, image, bucket);
  }

  return {
    decomposeUrl,
    composeUrl,
    listByBucket,
    remove,
    getPublicUrl,
    upload,
  };
}
