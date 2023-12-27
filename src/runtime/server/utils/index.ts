import { parseURL } from 'ufo'
import { readMultipartFormData, createError } from 'h3'
import type { H3Event } from 'h3'
import type { S3ObjectMetadata } from '../../types'

function normalizeKey (key: string) {
  return key.replace(/\//g, ':')
}

function denormalizeKey (key: string) {
  return key.replace(/:/g, '/')
}

function getKey (event: H3Event) {
  const regex = /^\/api\/s3\/(mutation|query)\//
  const pathname = parseURL(event.path).pathname

  if (!regex.test(pathname)) {
    throw createError({
      message: 'invalid-pathname',
      status: 400
    })
  }

  return pathname.replace(regex, '')
}

async function getMeta (event: H3Event) {
  const key = getKey(event)

  const normalizedKey = normalizeKey(key)

  try {
    if (event.method === 'POST') {
      const multipartFormData = await readMultipartFormData(event)
      const meta = multipartFormData?.find(el => el.name === 'meta')
      if (typeof meta === 'object') {
        return JSON.parse(meta.data.toString()) as S3ObjectMetadata
      }
      return {}
    }

    const meta = await event.context.s3.getMeta(normalizedKey)
    return { ...meta } as S3ObjectMetadata
  } catch (_) {
    return {}
  }
}

export { normalizeKey, denormalizeKey, getKey, getMeta }
