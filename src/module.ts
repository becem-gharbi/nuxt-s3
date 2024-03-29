import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addServerHandler,
  addTemplate,
  logger,
  addComponent,
} from "@nuxt/kit";

import { name, version } from "../package.json";
import { fileURLToPath } from "url";
import { defu } from "defu";
import type { PublicConfig, PrivateConfig } from "./runtime/types";

export interface ModuleOptions extends PrivateConfig, PublicConfig {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "s3",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },

  defaults: {
    client: {},
    image: {
      compression: {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
      },
    },
    cacheControl: "",
  },

  setup(options, nuxt) {
    if (!options.client) {
      logger.warn(`Please make sure to set your S3 credentials in ${name}`);
    }

    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    //Transpile the runtime directory
    nuxt.options.build.transpile.push(runtimeDir);

    //Add composables directory
    const composables = resolve(runtimeDir, "composables");
    addImportsDir(composables);

    //Add server routes
    addServerHandler({
      route: "/api/s3/object/create",
      method: "post",
      handler: resolve(runtimeDir, "server/api/s3/object/create"),
    });

    addServerHandler({
      route: "/api/s3/object/update",
      method: "put",
      handler: resolve(runtimeDir, "server/api/s3/object/update"),
    });

    addServerHandler({
      route: "/api/s3/object/delete",
      method: "delete",
      handler: resolve(runtimeDir, "server/api/s3/object/delete"),
    });

    addServerHandler({
      route: "/api/s3/object/:bucket/:key",
      method: "get",
      handler: resolve(runtimeDir, "server/api/s3/object/[bucket]/[key]"),
    });

    addServerHandler({
      route: "/api/s3/object/:bucket",
      method: "get",
      handler: resolve(runtimeDir, "server/api/s3/object/[bucket]/index"),
    });

    addServerHandler({
      route: "/api/s3/bucket/create",
      method: "post",
      handler: resolve(runtimeDir, "server/api/s3/bucket/create"),
    });

    addServerHandler({
      route: "/api/s3/bucket/delete",
      method: "delete",
      handler: resolve(runtimeDir, "server/api/s3/bucket/delete"),
    });

    addServerHandler({
      route: "/api/s3/bucket",
      method: "get",
      handler: resolve(runtimeDir, "server/api/s3/bucket/index"),
    });

    //Add components
    addComponent({
      name: "S3Image",
      filePath: resolve(runtimeDir, "components", "S3Image.vue"),
    });

    //Create virtual imports for server-side
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolve(runtimeDir)],
        }
      );
      nitroConfig.alias["#s3"] = resolve(runtimeDir, "server/utils");
    });

    addTemplate({
      filename: "types/s3.d.ts",
      getContents: () =>
        [
          "declare module '#s3' {",
          `const setPermissions: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').setPermissions`,
          `const checkPermission: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').checkPermission`,
          `const publicConfig: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').publicConfig`,
          `const privateConfig: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').privateConfig`,
          `const handleError: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').handleError`,
          `const s3Client: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').s3Client`,
          `const composeUrl: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').composeUrl`,
          `const createKey: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').createKey`,
          "}",
        ].join("\n"),
    });

    // Register #s3 types
    nuxt.hook("prepare:types", (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, "types/s3.d.ts"),
      });
    });

    // Add module options to runtime config
    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      public: {
        s3: {
          bucket: options.bucket,
          publicBucketUrl: options.publicBucketUrl,
          image: options.image,
        },
      },
      s3: {
        client: options.client,
        cacheControl: options.cacheControl,
      },
    });
  },
});
