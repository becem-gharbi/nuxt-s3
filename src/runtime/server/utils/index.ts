import { parseURL, withoutTrailingSlash } from 'ufo'
import { readMultipartFormData, createError } from 'h3'
import type { H3Event } from 'h3'
import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
import type { S3ObjectMetadata, PublicConfig } from '../../types'

function normalizeKey(key: string) {
  return key.replace(/\//g, ':')
}

function denormalizeKey(key: string) {
  return key.replace(/:/g, '/')
}

function getKey(event: H3Event) {
  const regex = /^\/api\/s3\/(mutation|query)\//
  const pathname = withoutTrailingSlash(parseURL(event.path).pathname)

  if (!regex.test(pathname)) {
    throw createError({
      message: 'invalid-pathname',
      status: 400,
    })
  }

  return pathname.replace(regex, '')
}

async function getMeta(event: H3Event) {
  const key = getKey(event)

  const normalizedKey = normalizeKey(key)

  if (event.method === 'POST') {
    const multipartFormData = await readMultipartFormData(event)
    const meta = multipartFormData?.find(el => el.name === 'meta')
    if (typeof meta === 'object') {
      return JSON.parse(meta.data.toString()) as S3ObjectMetadata
    }
    return {}
  }

  const meta = await useStorage('s3').getMeta(normalizedKey)
  return { ...meta } as S3ObjectMetadata
}

function verifyType(type?: string) {
  const { accept } = useRuntimeConfig().public.s3 as PublicConfig

  if (!accept) {
    return
  }

  const regex = new RegExp(accept)

  if (!type || !regex.test(type)) {
    throw createError({
      message: 'invalid-type',
      status: 400,
    })
  }
}

function verifySize(size: number) {
  const { maxSizeMb } = useRuntimeConfig().public.s3 as PublicConfig

  if (!maxSizeMb) {
    return
  }

  if (size > maxSizeMb * 1000000) {
    throw createError({
      message: 'invalid-size',
      status: 400,
    })
  }
}

export { normalizeKey, denormalizeKey, getKey, getMeta, verifySize, verifyType }
