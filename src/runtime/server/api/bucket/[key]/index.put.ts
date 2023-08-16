import { defineEventHandler } from "#imports";

export default defineEventHandler((event) => {
  const key = event.context.params?.key;

  return `put ${key}`;
});
