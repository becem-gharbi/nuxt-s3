export default defineNuxtConfig({
  modules: ["../src/module"],
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    accountId: process.env.S3_ACCOUNT_ID,
    bucket: process.env.S3_BUCKET,
    publicUrl: process.env.S3_PUBLIC_URL,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
