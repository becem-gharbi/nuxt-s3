import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin({
  hooks: {
    "s3:auth": async (headers) => {
      headers.authorization = "bearer 123";
    },
  },
});
