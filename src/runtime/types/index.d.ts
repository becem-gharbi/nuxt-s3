declare module '#app' {
  interface RuntimeNuxtHooks {
    's3:auth': (headers: { authorization: string }) => void;
  }
}

export type S3ObjectMetadata = Record<string, string>

export interface ModuleOptionsFS {
  driver: 'fs';
  fsBase?: string;
  accept?: string;
  maxSizeMb?: number;
}

export interface ModuleOptionsS3 {
  driver: 's3';
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
  accept?: string;
  maxSizeMb?: number;
}