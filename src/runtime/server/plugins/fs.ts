import { defineNitroPlugin, useRuntimeConfig } from "#imports";
import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig();

  const fsStorage = createStorage({
    driver: fsLiteDriver({ base: config.s3.base || "./uploads" }),
  });

  nitroApp.hooks.hook("request", (event) => {
    event.context.s3 = fsStorage;
  });
});
