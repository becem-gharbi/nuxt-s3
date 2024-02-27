import fsLiteDriver from 'unstorage/drivers/fs-lite'
import { createStorage } from 'unstorage'
import { createError } from 'h3'
import type { Storage } from 'unstorage'
import type { NitroApp } from 'nitropack'
import s3Driver from '../utils/s3Driver'
// @ts-ignore
import { defineNitroPlugin, useRuntimeConfig } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const privateConfig = useRuntimeConfig().s3

  let storage: Storage

  if (privateConfig.driver === 'fs') {
    storage = createStorage({
      driver: fsLiteDriver({
        base: privateConfig.fsBase
      })
    })
  } else if (privateConfig.driver === 's3') {
    storage = createStorage({
      driver: s3Driver({
        accessKeyId: privateConfig.accessKeyId,
        secretAccessKey: privateConfig.secretAccessKey,
        endpoint: privateConfig.endpoint,
        region: privateConfig.region,
        bucket: privateConfig.bucket
      })
    })
  } else {
    throw createError('[nuxt-s3] Invalid driver')
  }

  nitroApp.hooks.hook('request', (event) => {
    event.context.s3 = storage
  })
})
