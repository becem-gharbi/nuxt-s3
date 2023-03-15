import { resolveURL } from "ufo";

export function composeUrl(key: string, bucket: string): string {
  return resolveURL("/api/s3/object", bucket, key);
}
