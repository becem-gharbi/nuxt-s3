import { defineEventHandler } from "#imports";
import { deleteObject } from "#s3";

export default defineEventHandler(async (event) => {
  const key = event.path.split("/s3/mutation/")[1];

  await deleteObject(key);

  return "ok";
});
