import { defineEventHandler } from "#imports";
import { getObject } from "#s3";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const key = event.path.split("/s3/query/")[1];

  return getObject(event, key);
});
