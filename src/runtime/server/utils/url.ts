import { resolveURL, withQuery } from "ufo";

export function getUrl(
  key: string,
  bucket: string,
  timestamp: boolean = false
): string {
  const url = resolveURL("/api/s3/object", bucket, key);

  if (timestamp) {
    return withQuery(url, { timestamp: new Date().getTime() });
  }

  return url;
}
