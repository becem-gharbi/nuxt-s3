import {
  defineNuxtModule,
  createResolver,
  logger,
  addImportsDir,
  addServerHandler,
} from "@nuxt/kit";
import { defu } from "defu";

// Module options TypeScript interface definition
export interface ModuleOptions {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-s3",
    configKey: "s3",
  },

  setup(options, nuxt) {
    Object.entries(options).forEach(([key, value]) => {
      if (!value) logger.warn("[nuxt-s3] Please make sure to set", key);
    });

    const resolver = createResolver(import.meta.url);

    addImportsDir(resolver.resolve("runtime/composables"));

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      s3: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        endpoint: options.endpoint,
        region: options.region,
        bucket: options.bucket,
      },
    });

    // Read object
    addServerHandler({
      route: "/api/s3/object/:key",
      handler: resolver.resolve("runtime/server/api/object/[key]/index.get"),
    });

    // List object
    addServerHandler({
      route: "/api/s3/bucket",
      handler: resolver.resolve("runtime/server/api/bucket/index.get"),
    });

    // Put object
    addServerHandler({
      route: "/api/s3/bucket/:key",
      handler: resolver.resolve("runtime/server/api/bucket/[key]/index.put"),
    });

    // Delete object
    addServerHandler({
      route: "/api/s3/bucket/:key",
      handler: resolver.resolve("runtime/server/api/bucket/[key]/index.delete"),
    });
  },
});
