// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nuxt-s3"],
  s3: {
    accessKeyId: process.env.NUXT_S3_ACCESS_KEY_ID,
    bucket: process.env.NUXT_S3_BUCKET,
    endpoint: process.env.NUXT_S3_ENDPOINT,
    region: process.env.NUXT_S3_REGION,
    secretAccessKey: process.env.NUXT_S3_SECRET_ACCESS_KEY,
  },
  devtools: { enabled: false },
  routeRules: {
    "/api/s3/query/**": { isr: true },
  },
});
