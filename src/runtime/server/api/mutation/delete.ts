import { defineEventHandler } from 'h3'
import { getKey, normalizeKey } from '../../utils'
// @ts-ignore
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  const key = getKey(event)

  const normalizedKey = normalizeKey(key)

  await useStorage('s3').removeItem(normalizedKey, { removeMeta: true })

  return { status: 'ok' }
})
