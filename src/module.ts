import {
  defineNuxtModule,
  createResolver,
  logger,
  addImportsDir,
  addServerHandler,
  addComponent
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
  image?: {
    screens:{
      xs: number,
      sm: number,
      md: number,
      lg: number,
      xl: number,
     }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-s3",
    configKey: "s3",
  },

  defaults: {
    accessKeyId: '',
    secretAccessKey:'',
    endpoint: '',
    region: '',
    bucket: '',
    image: {
      screens: {
        xs: 320,
        sm: 640,
        md: 768,
        lg: 1024,
        xl:1280
      }
    }
  },

  setup(options, nuxt) {
    Object.entries(options).forEach(([key, value]) => {
      if (!value && key !== "accept")
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
      },
      public: {
        s3: {
          accept: options.accept,
          image: options.image
        },
      },
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
      nitroConfig.alias["#s3"] = resolve(runtimeDir, "server/utils/s3");
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

    //Add components
    addComponent({
      name: "S3Image",
      filePath: resolve(runtimeDir, "components/S3Image.vue"),
    });
  },
});

declare module "#app" {
  interface RuntimeNuxtHooks {
    "s3:auth": (headers: { authorization: string }) => void;
  }
}
