//@ts-ignore
import { privateConfig } from "#s3";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler((event) => {
  return { privateConfig };
});
