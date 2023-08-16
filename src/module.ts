import {
  defineNuxtModule,
  createResolver,
  logger,
  addImportsDir,
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
    if (options.accessKeyId) {
      logger.warn("[nuxt-s3] Please make sure to set accessKeyId");
    }
    if (options.endpoint) {
      logger.warn("[nuxt-s3] Please make sure to set endpoint");
    }
    if (options.region) {
      logger.warn("[nuxt-s3] Please make sure to set region");
    }
    if (options.secretAccessKey) {
      logger.warn("[nuxt-s3] Please make sure to set secretAccessKey");
    }

    const resolver = createResolver(import.meta.url);

    addImportsDir(resolver.resolve("runtime", "composables"));

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      s3: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        endpoint: options.endpoint,
        region: options.region,
      },
      public: {
        s3: {
          bucket: options.bucket,
        },
      },
    });
  },
});
