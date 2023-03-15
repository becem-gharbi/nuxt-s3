import { resolveURL } from "ufo";

export function getUrl(key: string, bucket: string): string {
  const url = resolveURL("/api/s3/object", bucket, key);

  return url;
}
