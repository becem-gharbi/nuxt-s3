import { defineEventHandler } from "#imports";
import { storage, getKey, normalizeKey } from "#s3";
import type { H3Event } from "h3";

export default defineEventHandler((event: H3Event) => {
  const key = getKey(event);

  const normalizedKey = normalizeKey(key);

  return storage.getItemRaw(normalizedKey, { event });
});
