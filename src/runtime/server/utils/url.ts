import { resolveURL } from "ufo";

export function getUrl(key: string, bucket: string): string {
  return resolveURL("/api/s3/object", bucket, key);
}
