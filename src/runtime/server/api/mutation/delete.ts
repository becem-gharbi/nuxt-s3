import { defineEventHandler } from "#imports";
import { getKey, normalizeKey } from "#s3";

export default defineEventHandler(async (event) => {
  const key = getKey(event);

  const normalizedKey = normalizeKey(key);

  await event.context.s3.removeItem(normalizedKey);

  return "ok";
});
