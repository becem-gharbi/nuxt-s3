import { defineNitroPlugin } from "#imports";
import { s3Storage } from "#s3";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event) => {
    event.context.s3 = s3Storage;
  });
});
