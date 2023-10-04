import mime from 'mime'
import { setResponseHeader } from 'h3'
import type { H3Event } from 'h3'
import { getKey, normalizeKey } from '#s3'
import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  const key = getKey(event)

  const normalizedKey = normalizeKey(key)

  const opts = { mimeType: undefined }
  const data = await event.context.s3.getItemRaw(normalizedKey, opts)

  const mimeType = opts.mimeType || mime.getType(key)

  if (mimeType) {
    setResponseHeader(event, 'Content-Type', mimeType)
  }

  return data
})
