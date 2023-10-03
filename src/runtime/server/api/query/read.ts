import { defineEventHandler } from "#imports";
import { s3Storage, getKey, normalizeKey } from "#s3";
import type { H3Event } from "h3";

export default defineEventHandler((event: H3Event) => {
  const key = getKey(event);

  const normalizedKey = normalizeKey(key);

  return s3Storage.getItemRaw(normalizedKey, { event });
});
