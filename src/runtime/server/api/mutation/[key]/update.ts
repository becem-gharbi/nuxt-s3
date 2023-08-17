import { defineEventHandler } from "#imports";
import { putObject, deleteObject } from "#s3";
import { readMultipartFormData, createError } from "h3";

export default defineEventHandler(async (event) => {
  const oldKey = event.context.params?.key;

  const multipartFormData = await readMultipartFormData(event);

  const file = multipartFormData?.find((el) => el.name === "file");
  const newKey = multipartFormData
    ?.find((el) => el.name === "key")
    ?.data.toString();

  if (!newKey) {
    throw createError("invalid-key");
  }

  if (file && file.type) {
    await deleteObject(oldKey);

    await putObject(newKey, file.data, file.type);

    return "ok";
  }

  throw createError("invalid-file");
});
