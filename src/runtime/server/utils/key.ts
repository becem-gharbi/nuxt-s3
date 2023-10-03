import { parseURL } from "ufo";
import type { H3Event } from "h3";

function normalizeKey(key: string) {
  return key.replace(/\//g, ":");
}

function denormalizeKey(key: string) {
  return key.replace(/:/g, "/");
}

function getKey(event: H3Event) {
  const regex = new RegExp("^/api/s3/(mutation|query)/");

  const pathname = parseURL(event.path).pathname;

  return pathname.replace(regex, "");
}

export { normalizeKey, denormalizeKey, getKey };
