import { ListBucketsCommandOutput } from "@aws-sdk/client-s3";
import { useFetch } from "#app";
import { FetchReturn } from "../types";

export default function useS3Bucket() {
  async function create(name: string): FetchReturn<{ name: string }> {
    return useFetch<{ name: string }>("/api/s3/bucket/create", {
      method: "POST",
      body: {
        name,
      },
    });
  }

  async function remove(name: string): FetchReturn<{}> {
    return useFetch<{}>("/api/s3/bucket/delete", {
      method: "DELETE",
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
