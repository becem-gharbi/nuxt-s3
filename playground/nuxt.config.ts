export default defineNuxtConfig({
  modules: ["../src/module"],
  s3: {
    client: {
      endpoint: process.env.S3_CLIENT_ENDPOINT,
      region: "auto",
      credentials: {
        accessKeyId: process.env.S3_CLIENT_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_CLIENT_SECRET_ACCESS_KEY || "",
      },
    },
    bucket: "public-bucket",
    publicUrl: "https://link.storjshare.io/jwbpb2nz3x6l7gjiaxht3cjqdqla/{bucket}/{key}?download=1"
  },
});
