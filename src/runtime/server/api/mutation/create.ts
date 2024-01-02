import { readMultipartFormData, createError } from 'h3'
import { defineEventHandler, useRuntimeConfig } from '#imports'
import { normalizeKey, getKey, getMeta } from '#s3'

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

    await event.context.s3.setItemRaw(normalizedKey, file.data, { meta })

    await event.context.s3.setMeta(normalizedKey, meta)

    return { status: 'ok' }
  }

  throw createError('invalid-file')
})

function verifyType (type: string | undefined, accept: string) {
  const regex = new RegExp(accept)

  if (!type || !regex.test(type)) {
    throw createError({
      message: 'invalid-type',
      status: 400
    })
  }
}

function verifySize (size: number, maxSizeMb: number) {
  if (maxSizeMb && size > maxSizeMb * 1000000) {
    throw createError({
      message: 'invalid-size',
      status: 400
    })
  }
}
