export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        module: 'ESNext',
      },
    },
  },

  modules: ['../src/module'],

  s3: {
    accessKeyId: process.env.NUXT_S3_ACCESS_KEY_ID,
    bucket: process.env.NUXT_S3_BUCKET,
    endpoint: process.env.NUXT_S3_ENDPOINT,
    region: process.env.NUXT_S3_REGION,
    secretAccessKey: process.env.NUXT_S3_SECRET_ACCESS_KEY,
    driver: 's3',
    maxSizeMb: 30,
    accept: '^image/(png|jpeg|png|gif)',
    // driver: 'fs'
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-07-28',
})
