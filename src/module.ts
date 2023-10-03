import {
  defineNuxtModule,
  createResolver,
  logger,
  addImportsDir,
  addServerHandler,
  addTemplate,
} from "@nuxt/kit";
import { defu } from "defu";
import { fileURLToPath } from "url";

// Module options TypeScript interface definition
export interface ModuleOptions {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
  accept?: string;
  driver: "s3" | "fs";
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-s3",
    configKey: "s3",
  },

  defaults: {
    driver: "s3",
    accessKeyId: "",
    bucket: "",
    endpoint: "",
    region: "",
    secretAccessKey: "",
  },

  setup(options, nuxt) {
    Object.entries(options).forEach(([key, value]) => {
      if (!value && !["accept", "driver"].includes(key))
        logger.warn("[nuxt-s3] Please make sure to set", key);
    });

    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    addImportsDir(resolve(runtimeDir, "composables"));

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      s3: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        endpoint: options.endpoint,
        region: options.region,
        bucket: options.bucket,
        driver: options.driver,
      },
      public: {
        s3: {
          accept: options.accept,
        },
      },
    });

    // Add server utils
    nuxt.options.nitro = defu(
      {
        alias: {
          "#s3": resolve(runtimeDir, "server/utils"),
        },
      },
      nuxt.options.nitro
    );

    addTemplate({
      filename: "types/s3.d.ts",
      getContents: () =>
        [
          "declare module '#s3' {",
          `const s3Storage: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').s3Storage`,
          `const normalizeKey: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').normalizeKey`,
          `const denormalizeKey: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').denormalizeKey`,
          `const getKey: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').getKey`,
          `const storage: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').storage`,
          "}",
        ].join("\n"),
    });

    // Get object
    addServerHandler({
      route: "/api/s3/query/**",
      method: "get",
      handler: resolve(runtimeDir, "server/api/query/read"),
    });

    // Create object
    addServerHandler({
      route: "/api/s3/mutation/**",
      method: "post",
      handler: resolve(runtimeDir, "server/api/mutation/create"),
    });

    // Delete object
    addServerHandler({
      route: "/api/s3/mutation/**",
      method: "delete",
      handler: resolve(runtimeDir, "server/api/mutation/delete"),
    });
  },
});

declare module "#app" {
  interface RuntimeNuxtHooks {
    "s3:auth": (headers: { authorization: string }) => void;
  }
}
