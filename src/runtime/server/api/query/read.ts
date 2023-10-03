import { defineEventHandler, useRuntimeConfig } from "#imports";
import { getObject } from "#s3";
import { getQuery, parseURL } from "ufo";
import sharp from "sharp";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const key = parseURL(event.path).pathname.split("/s3/query/")[1];

  const original = (await getObject(event, key)) as Blob;

  const screen = getQuery(event.path).screen;

  if (!screen) return original;

  const config = useRuntimeConfig();

  const screens = config.public.s3.image.screens;

  const width = screens[screen as keyof typeof screens];

  const originalBuffer = await original
    .arrayBuffer()
    .then((array) => Buffer.from(array));

  return sharp(originalBuffer).resize({ width }).toBuffer();
});
