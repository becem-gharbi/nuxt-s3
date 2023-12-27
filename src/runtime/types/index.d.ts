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

interface ModuleOptionsFS {
  driver: 'fs';
  fsBase?: string;
  accept?: string;
  maxSizeMb?: number;
}

interface ModuleOptionsS3 {
  driver: 's3';
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
  accept?: string;
  maxSizeMb?: number;
}