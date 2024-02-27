import { defineEventHandler } from 'h3'
import { getKey, normalizeKey } from '../../utils'

export default defineEventHandler(async (event) => {
  const key = getKey(event)

  const normalizedKey = normalizeKey(key)

  await event.context.s3.removeItem(normalizedKey, { removeMeta: true })

  return { status: 'ok' }
})
