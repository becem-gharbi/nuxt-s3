import { defineEventHandler } from "#imports";
import { storage, getKey, normalizeKey } from "#s3";
import { lookup } from "mime-types";
import { setResponseHeader } from "h3";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const key = getKey(event);

  const normalizedKey = normalizeKey(key);

  const data = await storage.getItemRaw(normalizedKey);

  const type = lookup(key);

  if (type) {
    setResponseHeader(event, "Content-Type", type);
  }

  return data;
});
