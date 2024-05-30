import mime from 'mime'
import { setResponseHeader, createError, defineEventHandler } from 'h3'
import { getKey, normalizeKey } from '../../utils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  const key = getKey(event)

  const normalizedKey = normalizeKey(key)

  const data = await useStorage('s3').getItemRaw(normalizedKey)

  if (data === null) {
    throw createError({ statusCode: 404 })
  }

  const mimeType = mime.getType(key)

  if (mimeType) {
    setResponseHeader(event, 'Content-Type', mimeType)
  }

  return data
})
