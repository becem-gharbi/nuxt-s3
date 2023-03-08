import { setPermissions } from "#s3";

export default defineEventHandler((event) => {
  setPermissions(event, {
    bucket: {
      create: true,
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
  });
});
