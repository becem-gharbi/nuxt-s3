import { S3Context } from "../../../src/module";

export default defineEventHandler((event) => {
  const s3Context: S3Context = {
    permissions: {
      bucket: {
        create: false,
        delete: true,
        list: true,
      },
      object: {
        create: true,
        delete: true,
        list: true,
        read: true,
        update: true,
      },
    },
  };

  event.context.s3 = s3Context;
});
