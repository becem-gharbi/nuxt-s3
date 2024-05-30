import { readMultipartFormData, createError, defineEventHandler } from 'h3'
import { normalizeKey, getKey, getMeta, verifySize, verifyType } from '../../utils'
import type { PrivateConfig } from '../../../types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useRuntimeConfig, useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  const privateConfig = useRuntimeConfig().s3 as PrivateConfig

  const key = getKey(event)

  const multipartFormData = await readMultipartFormData(event)

  const file = multipartFormData?.find(el => el.name === 'file')

  if (file) {
    const normalizedKey = normalizeKey(key)

    verifyType(file.type)
    verifySize(file.data.length)

    const meta = await getMeta(event)

    await useStorage('s3').setItemRaw(normalizedKey, file.data, {
      meta,
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.data.length,
      },
    })

    if (privateConfig.driver === 'fs') {
      await useStorage('s3').setMeta(normalizedKey, meta)
    }

    return { status: 'ok' }
  }

  throw createError('invalid-file')
})
