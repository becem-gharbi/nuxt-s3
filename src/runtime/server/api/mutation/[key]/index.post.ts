import { defineEventHandler } from "#imports";
import { putObject } from "../../../utils/s3";
import { readMultipartFormData, createError } from "h3";

export default defineEventHandler(async (event) => {
  const key = event.context.params?.key;

  const multipartFormData = await readMultipartFormData(event);

  const file = multipartFormData?.find((el) => el.name === "file");

  if (file && file.type) {
    await putObject(key, file.data, file.type);
    return "ok";
  }

  throw createError("invalid-file");
});
