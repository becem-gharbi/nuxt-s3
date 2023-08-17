import { defineEventHandler } from "#imports";
import { getObject } from "#s3";

export default defineEventHandler(async (event) => {
  const key = event.context.params?.key;

  return getObject(key);
});
