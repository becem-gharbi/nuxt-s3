import { resolveURL, withQuery } from "ufo";

export function getUrl(key: string, bucket: string): string {
  const timestamp = new Date().getTime();

  // Add timestamp to override caching on update
  return withQuery(resolveURL("/api/s3/object", bucket, key), { timestamp });
}
