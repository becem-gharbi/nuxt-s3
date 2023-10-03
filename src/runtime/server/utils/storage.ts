import { useRuntimeConfig } from "#imports";
import { s3Storage } from "./s3";
import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";
import type { Storage } from "unstorage";

const config = useRuntimeConfig();

let storage: Storage;

if (config.s3.driver === "s3") {
  storage = s3Storage;
} else if (config.s3.driver === "fs") {
  storage = createStorage({
    driver: fsLiteDriver({ base: config.s3.base }),
  });
}

export { storage };
