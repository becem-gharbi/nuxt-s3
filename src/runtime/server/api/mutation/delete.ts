import { defineEventHandler } from "#imports";
import { storage, getKey, normalizeKey } from "#s3";

export default defineEventHandler(async (event) => {
  const key = getKey(event);

  const normalizedKey = normalizeKey(key);

  await storage.removeItem(normalizedKey);

  return "ok";
});
