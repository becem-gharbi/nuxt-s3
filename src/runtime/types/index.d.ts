declare module '#app' {
  interface RuntimeNuxtHooks {
    's3:auth': (headers: Record<string, string>) => void;
  }
}

export type S3ObjectMetadata = Record<string, string>

export type PublicConfig = {
  accept?: string;
  maxSizeMb?: number;
  server?: boolean;
}

export type PrivateConfig =
  {
    driver: 's3';
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    region: string;
    bucket: string;
  } |
  {
    driver: 'fs';
    fsBase?: string;
  }