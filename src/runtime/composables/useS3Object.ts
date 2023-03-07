import { S3Object } from "../types";
import { ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import { FetchReturn } from "../types";
import { useFetch } from "#app";

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
    return useFetch<S3Object[]>("/api/s3/object/create", {
      method: "POST",
      body: formData,
    });
  }

  async function remove(args: {
    bucket: string;
    key: string;
  }): FetchReturn<{}> {
    return useFetch("/api/s3/object/delete", {
      method: "DELETE",
      body: args,
    });
  }

  async function update(formData: FormData): FetchReturn<{}> {
    return useFetch("/api/s3/object/update", {
      method: "PUT",
      body: formData,
    });
  }

  return { getUrl, listByBucket, create, remove, update };
}
