import { readMultipartFormData, createError } from 'h3'
import { defineEventHandler } from '#imports'
import { normalizeKey, getKey } from '#s3'

export default defineEventHandler(async (event) => {
  const key = getKey(event)

  const multipartFormData = await readMultipartFormData(event)

  const file = multipartFormData?.find(el => el.name === 'file')

  if (file) {
    const normalizedKey = normalizeKey(key)

    await event.context.s3.setItemRaw(normalizedKey, file.data)

    return 'ok'
  }

  throw createError('invalid-file')
})
