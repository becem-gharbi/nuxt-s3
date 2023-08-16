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

    // Get object
    addServerHandler({
      route: "/api/s3/query/:key",
      handler: resolver.resolve("runtime/server/api/query/[key]/index.get"),
    });

    // Update object
    addServerHandler({
      route: "/api/s3/mutation/:key",
      handler: resolver.resolve("runtime/server/api/mutation/[key]/index.put"),
    });

    // Create object
    addServerHandler({
      route: "/api/s3/mutation/:key",
      handler: resolver.resolve("runtime/server/api/mutation/[key]/index.post"),
    });

    // Delete object
    addServerHandler({
      route: "/api/s3/mutation/:key",
      handler: resolver.resolve(
        "runtime/server/api/mutation/[key]/index.delete"
      ),
    });
  },
});
