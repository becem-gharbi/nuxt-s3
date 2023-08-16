import { randomUUID } from "crypto";

export default function () {
  async function create(file: File, key?: string): Promise<string> {
    key ||= randomUUID();

    const formData = new FormData();
    formData.append("file", file);

    await $fetch(`/api/s3/mutation/${key}`, {
      method: "POST",
    });

    return getURL(key);
  }

  async function update(
    url: string,
    file: File,
    newKey?: string
  ): Promise<string> {
    newKey ||= randomUUID();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", newKey);

    const key = getKey(url);

    await $fetch(`/api/s3/mutation/${key}`, {
      method: "PUT",
    });

    return getURL(newKey);
  }

  async function remove(url: string) {
    const key = getKey(url);

    await $fetch(`/api/s3/mutation/${key}`, {
      method: "DELETE",
    });
  }

  async function upload(file: File, opts: { url?: string; key?: string }) {
    if (opts.url) {
      const validURL = getKey(opts.url).length > 0;

      if (validURL) {
        return update(opts.url, file, opts.key);
      }
    }

    return create(file, opts.key);
  }

  function getURL(key: string) {
    return `/api/s3/query/${key}`;
  }

  function getKey(url: string) {
    return url.split("/api/s3/query/")[1];
  }

  return { upload, remove, getURL, getKey };
}
