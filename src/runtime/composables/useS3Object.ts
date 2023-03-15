import { S3Object, S3Url } from "../types";
import { useFetch, useRuntimeConfig } from "#imports";
import { withQuery, resolveURL, parseURL, getQuery } from "ufo";

import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.s3;

  function composeKey(base: string, breakpoint?: string) {
    return breakpoint ? `${breakpoint}_${base}` : base;
  }

  function decomposeKey(key: string) {
    if (key.includes("_")) {
      return {
        breakpoint: key.split("_")[0],
        base: key.split("_")[1],
      };
    }
    return {
      breakpoint: undefined,
      base: key,
    };
  }

  function composeUrl(options: S3Url): string {
    const key = composeKey(options.key, options.breakpoint);
    return withQuery(
      resolveURL("/api/s3/object", options.bucket, key),
      options.query || {}
    );
  }

  function decomposeUrl(url: string): S3Url | undefined {
    if (url.startsWith("/")) {
      const paths = parseURL(url).pathname.split("/");

      const bucket = paths[paths.length - 2];

      const completeKey = paths[paths.length - 1];

      const query = getQuery(url);

      const breakpoint = decomposeKey(completeKey).breakpoint;

      const key = decomposeKey(completeKey).base;

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

  /**
   * Return the public url of an object from it's private url.
   * If the object's url is not valid then returns it's private url.
   */
  function getPublicUrl(url: string): string {
    const decomposedUrl = decomposeUrl(url);

    if (!decomposedUrl) {
      return url;
    }

    return withQuery(
      resolveURL(
        publicConfig.publicBucketUrl,
        composeKey(decomposedUrl.key, decomposedUrl.breakpoint)
      ),
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
        key: composeKey(decomposedUrl.key, decomposedUrl.breakpoint),
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
