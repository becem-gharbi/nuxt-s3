import { randomUUID } from "crypto";

export default function () {
  async function create(file: File, key = randomUUID()): Promise<string> {
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
    newKey = randomUUID()
  ): Promise<string> {
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

  function getURL(key: string) {
    return `/api/s3/query/${key}`;
  }

  function getKey(url: string) {
    return url.split("/api/s3/query/")[1];
  }

  return { create, update, remove, getURL, getKey };
}
