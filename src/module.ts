import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addServerHandler,
} from "@nuxt/kit";
import { fileURLToPath } from "url";
import { defu } from "defu";
import type { PublicConfig, PrivateConfig } from "./runtime/types";

export interface ModuleOptions extends PrivateConfig, PublicConfig {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@bg-dev/nuxt-s3",
    configKey: "s3",
  },

  // Default configuration options of the Nuxt module
  defaults: {
    client: {
      region: "auto",
    },
    bucket: "",
  },

  setup(options, nuxt) {
    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    //Transpile the runtime directory
    nuxt.options.build.transpile.push(runtimeDir);

    //Add plugins
    const plugin = resolve(runtimeDir, "plugin");
    addPlugin(plugin);

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
      route: "/api/s3/object/read",
      method: "post",
      handler: resolve(runtimeDir, "server/api/s3/object/read"),
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

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},

      s3: {
        client: options.client,
      },

      public: {
        s3: {
          bucket: options.bucket,
        },
      },
    });
  },
});
