import fsLiteDriver from 'unstorage/drivers/fs-lite'
import { createStorage } from 'unstorage'
import { createError } from 'h3'
import type { Storage } from 'unstorage'
import s3Driver from '../utils/s3Driver'
import { defineNitroPlugin, useRuntimeConfig } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  let storage: Storage

  if (config.s3.driver === 'fs') {
    storage = createStorage({
      driver: fsLiteDriver({
        base: config.s3.fsBase
      })
    })
  } else if (config.s3.driver === 's3') {
    storage = createStorage({
      driver: s3Driver({
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
        endpoint: config.s3.endpoint,
        region: config.s3.region,
        bucket: config.s3.bucket
      })
    })
  } else {
    throw createError('[nuxt-s3] Invalid driver')
  }

  nitroApp.hooks.hook('request', (event) => {
    event.context.s3 = storage
  })
})
