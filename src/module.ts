import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addServerHandler,
  addTemplate,
  addServerPlugin,
} from "@nuxt/kit";
import { defu } from "defu";
import { fileURLToPath } from "url";

// Module options TypeScript interface definition
interface ModuleOptionsFS {
  driver: "fs";
  base: string;
  accept?: string;
}

interface ModuleOptionsS3 {
  driver: "s3";
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
  accept?: string;
}

export type ModuleOptions = ModuleOptionsS3 | ModuleOptionsFS;

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
    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    addImportsDir(resolve(runtimeDir, "composables"));

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      s3: options,
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

    // Register server plugins
    if (options.driver === "fs") {
      const fs = resolve(runtimeDir, "server/plugins/fs");
      addServerPlugin(fs);
    } else if (options.driver === "s3") {
      const s3 = resolve(runtimeDir, "server/plugins/s3");
      addServerPlugin(s3);
    }
  },
});

declare module "#app" {
  interface RuntimeNuxtHooks {
    "s3:auth": (headers: { authorization: string }) => void;
  }
}
