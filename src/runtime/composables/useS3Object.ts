import { v4 as uuidv4 } from "uuid";
import { useNuxtApp, useRuntimeConfig } from "#imports";

export default function () {
  const { callHook } = useNuxtApp();
  const config = useRuntimeConfig();

  async function create(file: File, key?: string) {
    key ||= uuidv4();

    const formData = new FormData();
    formData.append("file", file);

    const headers = { authorization: "" };
    await callHook("s3:auth", headers);

    await $fetch(`/api/s3/mutation/${key}`, {
      method: "POST",
      body: formData,
      headers,
      credentials: "omit",
    });

    return getURL(key);
  }

  async function update(url: string, file: File, newKey?: string) {
    newKey ||= uuidv4();

    const headers = { authorization: "" };

    await callHook("s3:auth", headers);

    await remove(url);

    await callHook("s3:auth", headers);

    return create(file, newKey);
  }

  /**
   * Remove file from its URL
   */
  async function remove(url: string) {
    const key = getKey(url);

    const headers = { authorization: "" };
    await callHook("s3:auth", headers);

    await $fetch(`/api/s3/mutation/${key}`, {
      method: "DELETE",
      headers,
      credentials: "omit",
    });
  }

  /**
   * Upload single file
   * If url is provided and correspond to a previously uploaded object, this object will be replaced.
   * @returns URL of the uploaded file
   */
  async function upload(file: File, opts?: { url?: string; key?: string }) {
    checkType(file.type);

    if (opts?.url) {
      if (isValidURL(opts.url)) {
        return update(opts.url, file, opts.key);
      }
    }

    return create(file, opts?.key);
  }

  /**
   * Get URL from key
   */
  function getURL(key: string) {
    return `/api/s3/query/${key}`;
  }

  /**
   * Get Key from URL
   */
  function getKey(url: string) {
    return url.split("/api/s3/query/")[1];
  }

  function isValidURL(url: string) {
    const key = getKey(url) || "";

    return key.length > 0;
  }

  function checkType(type: string) {
    const regex = new RegExp(config.public.s3.accept);

    if (!regex.test(type)) {
      throw new Error("invalid-type");
    }
  }

  return { upload, remove, getURL, getKey };
}
