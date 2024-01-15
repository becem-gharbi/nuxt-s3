import { readMultipartFormData, createError } from 'h3'
import { normalizeKey, getKey, getMeta, verifySize, verifyType } from '../../utils'
import { defineEventHandler, useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const key = getKey(event)

  const multipartFormData = await readMultipartFormData(event)

  const file = multipartFormData?.find(el => el.name === 'file')

  if (file) {
    const normalizedKey = normalizeKey(key)

    verifyType(file.type, config.public.s3.accept)
    verifySize(file.data.length, config.public.s3.maxSizeMb)

    const meta = await getMeta(event)

    await event.context.s3.setItemRaw(normalizedKey, file.data, {
      meta,
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.data.length
      }
    })

    if (config.s3.driver === 'fs') {
      await event.context.s3.setMeta(normalizedKey, meta)
    }

    return { status: 'ok' }
  }

  throw createError('invalid-file')
})
