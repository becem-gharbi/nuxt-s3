import { defineEventHandler } from "#imports";
import { s3Storage, getKey, normalizeKey } from "#s3";

export default defineEventHandler(async (event) => {
  const key = getKey(event);

  const normalizedKey = normalizeKey(key);

  await s3Storage.removeItem(normalizedKey);

  return "ok";
});
