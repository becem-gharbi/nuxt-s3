import { ListBucketsCommandOutput } from "@aws-sdk/client-s3";
import { useFetch } from "#imports";

import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function useS3Bucket() {
  async function create(name: string): FetchReturn<{}> {
    return useFetch("/api/s3/bucket/create", {
      method: "post",
      body: {
        name,
      },
    });
  }

  async function remove(name: string): FetchReturn<{}> {
    return useFetch("/api/s3/bucket/delete", {
      method: "delete",
      body: {
        name,
      },
    });
  }

  async function list(): FetchReturn<ListBucketsCommandOutput> {
    return useFetch<ListBucketsCommandOutput>("/api/s3/bucket");
  }

  return { create, remove, list };
}
