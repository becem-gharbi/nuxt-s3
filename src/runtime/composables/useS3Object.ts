import { S3Object } from "../types";
import { useFetch, useRuntimeConfig } from "#imports";
import imageCompression from "browser-image-compression";
import { resolveURL, parseURL } from "ufo";

import type { S3Url } from "../types";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.s3;

  async function create(args: {
    files: File[];
    bucket?: string;
    authorization?: string;
  }): FetchReturn<S3Object[]> {
    const formData = new FormData();

    formData.append("bucket", args.bucket || publicConfig.bucket);

    for (const file of args.files) {
      if (file.type.includes("image") && publicConfig.image.compression) {
        const compressedImage = await imageCompression(file, {
          maxSizeMB: publicConfig.image.compression.maxSizeMB,
          maxWidthOrHeight: publicConfig.image.compression.maxWidthOrHeight,
        });

        formData.append(file.name, compressedImage);
      } else {
        formData.append(file.name, file);
      }
    }

    return useFetch("/api/s3/object/create", {
      method: "post",
      body: formData,
      headers: {
        Authorization: args.authorization || "",
      },
    });
  }

  async function update(args: {
    key: string;
    file: File;
    bucket?: string;
    authorization?: string;
  }): FetchReturn<S3Object[]> {
    const formData = new FormData();

    formData.append("key", args.key);
    formData.append("bucket", args.bucket || publicConfig.bucket);

    if (args.file.type.includes("image") && publicConfig.image.compression) {
      const compressedImage = await imageCompression(args.file, {
        maxSizeMB: publicConfig.image.compression.maxSizeMB,
        maxWidthOrHeight: publicConfig.image.compression.maxWidthOrHeight,
      });

      formData.append(args.file.name, compressedImage);
    } else {
      formData.append(args.file.name, args.file);
    }

    return useFetch("/api/s3/object/update", {
      method: "put",
      body: formData,
      headers: {
        Authorization: args.authorization || "",
      },
    });
  }

  /**
   * Return the public url of an object from it's private url.
   * If the object's url is not valid then returns it's private url.
   */
  function getPublicUrl(url: string): string {
    const decomposedUrl = decomposeUrl(url);

    if (!decomposedUrl || !publicConfig.publicBucketUrl) {
      return url;
    }

    return resolveURL(publicConfig.publicBucketUrl, decomposedUrl.key);
  }

  async function listByBucket(args?: {
    bucket?: string;
    authorization?: string;
  }): FetchReturn<S3Object[]> {
    return useFetch<S3Object[]>(
      resolveURL("/api/s3/object", args?.bucket || publicConfig.bucket),
      {
        headers: {
          Authorization: args?.authorization || "",
        },
      }
    );
  }

  /**
   * Removes an object from bucket.
   * The object Key and Bucket are extracted from it's url
   */
  async function remove(args: {
    url: string;
    authorization?: string;
  }): FetchReturn<S3Object> {
    const decomposedUrl = decomposeUrl(args.url);

    if (!decomposedUrl) {
      throw new Error("Invalid URL");
    }

    return useFetch("/api/s3/object/delete", {
      method: "delete",
      body: {
        key: decomposedUrl.key,
        bucket: decomposedUrl.bucket,
      },
      headers: {
        Authorization: args.authorization || "",
      },
    });
  }

  /**
   * Upload an object to bucket.
   * If url exists and valid, the object key will be extracted and the existing object will be updated.
   * Otherwise new object will be created.
   */
  function upload(args: {
    files: File[];
    url?: string | null;
    bucket?: string;
    authorization?: string;
  }) {
    if (args.url) {
      const decomposedUrl = decomposeUrl(args.url);

      if (decomposedUrl) {
        return update({
          key: decomposedUrl.key,
          file: args.files[0],
          bucket: decomposedUrl.bucket,
          authorization: args.authorization,
        });
      }
    }

    return create({
      files: args.files,
      bucket: args.bucket,
      authorization: args.authorization,
    });
  }

  function decomposeUrl(url: string): S3Url | undefined {
    if (url.startsWith("/")) {
      const paths = parseURL(url).pathname.split("/");

      const bucket = paths[paths.length - 2];

      const key = paths[paths.length - 1];

      const keyWithoutExt = key.split(".")[0];

      // Checks if valid UUID
      const regexExp =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

      if (keyWithoutExt && regexExp.test(keyWithoutExt)) {
        return { bucket, key };
      }
    }
  }

  return {
    listByBucket,
    remove,
    getPublicUrl,
    upload,
  };
}
