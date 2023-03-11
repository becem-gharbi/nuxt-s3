import { useFetch, useRuntimeConfig } from "#imports";
import useS3Object from "./useS3Object";
import type { S3Object } from "../types";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.s3;

  async function create(formData: FormData): FetchReturn<S3Object[]> {
    if (!formData.has("bucket")) {
      formData.append("bucket", publicConfig.bucket);
    }

    return useFetch("/api/s3/image/create", {
      method: "post",
      body: formData,
    });
  }

  async function update(formData: FormData): FetchReturn<{}> {
    if (!formData.has("bucket")) {
      formData.append("bucket", publicConfig.bucket);
    }

    return useFetch("/api/s3/image/update", {
      method: "put",
      body: formData,
    });
  }

  async function remove(
    key: string,
    bucket: string = publicConfig.bucket
  ): FetchReturn<{}> {
    return useFetch("/api/s3/image/delete", {
      method: "delete",
      body: {
        key,
        bucket,
      },
    });
  }

  const { getPublicUrl, getUrl } = useS3Object();

  return { create, update, remove, getPublicUrl, getUrl };
}
