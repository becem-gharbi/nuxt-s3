export default defineNuxtConfig({
  modules: ["../src/module", "nuxt-security"],
  s3: {
    client: {
      endpoint: process.env.S3_CLIENT_ENDPOINT,
      region: "auto",
      credentials: {
        accessKeyId: process.env.S3_CLIENT_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_CLIENT_SECRET_ACCESS_KEY || "",
      },
    },
    bucket: process.env.S3_BUCKET,
    //   publicBucketUrl: process.env.S3_PUBLIC_BUCKET_URL,
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          process.env.S3_PUBLIC_BUCKET_URL || "",
        ],
      },
    },
  },

  routeRules: {
    "api/s3/object/create": {
      security: {
        xssValidator: false,
      },
    },
  },
});
