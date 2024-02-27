import fsLiteDriver from 'unstorage/drivers/fs-lite'
import { createError } from 'h3'
import s3Driver from '../utils/s3Driver'
// @ts-ignore
import { defineNitroPlugin, useRuntimeConfig, useStorage } from '#imports'

export default defineNitroPlugin(() => {
  const privateConfig = useRuntimeConfig().s3

  if (privateConfig.driver === 'fs') {
    useStorage().mount('s3', fsLiteDriver({
      base: privateConfig.fsBase
    }))
  } else if (privateConfig.driver === 's3') {
    useStorage().mount('s3', s3Driver({
      accessKeyId: privateConfig.accessKeyId,
      secretAccessKey: privateConfig.secretAccessKey,
      endpoint: privateConfig.endpoint,
      region: privateConfig.region,
      bucket: privateConfig.bucket
    }))
  } else {
    throw createError('[nuxt-s3] Invalid driver')
  }
})
