import type { Storage } from 'unstorage'

declare module 'h3' {
  interface H3EventContext {
    s3: Storage;
   }
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    's3:auth': (headers: { authorization: string }) => void;
  }
}

type S3ObjectMetadata = Record<string, string>