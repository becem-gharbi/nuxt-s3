import { S3Object } from "../types";
import { ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import { useFetch } from "#imports";

import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  function getUrl(args: { bucket: string; key: string }): string {
    return `/api/s3/object/${args.bucket}/${args.key}`;
  }

  async function listByBucket(
    bucket: string
  ): FetchReturn<ListObjectsCommandOutput> {
    return useFetch<ListObjectsCommandOutput>(`/api/s3/object/${bucket}`);
  }

  async function create(formData: FormData): FetchReturn<S3Object[]> {
    return useFetch("/api/s3/object/create", {
      method: "post",
      body: formData,
    });
  }

  async function remove(args: {
    bucket: string;
    key: string;
  }): FetchReturn<{}> {
    return useFetch("/api/s3/object/delete", {
      method: "delete",
      body: args,
    });
  }

  async function update(formData: FormData): FetchReturn<{}> {
    return useFetch("/api/s3/object/update", {
      method: "put",
      body: formData,
    });
  }

  return { getUrl, listByBucket, create, remove, update };
}
