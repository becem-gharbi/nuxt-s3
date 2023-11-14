import crypto from 'crypto'
import fsLiteDriver from 'unstorage/drivers/fs-lite'
import { createStorage } from 'unstorage'
import { AwsClient } from 'aws4fetch'
import { createError } from 'h3'
import { $fetch } from 'ofetch'
import mime from 'mime'
import type { Storage } from 'unstorage'
import { denormalizeKey } from '#s3'
import { defineNitroPlugin, useRuntimeConfig } from '#imports'

if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto
}

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  let storage: Storage

  if (config.s3.driver === 'fs') {
    storage = createStorage({
      driver: fsLiteDriver({ base: config.s3.fsBase })
    })
  } else if (config.s3.driver === 's3') {
    const client = new AwsClient({
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
      region: config.s3.region,
      service: 's3'
    })

    storage = createStorage({
      // @ts-ignore
      driver: {
        name: 's3',

        async getItemRaw (key, opts) {
          key = denormalizeKey(key)

          const request = await client.sign(
            `${config.s3.endpoint}/${config.s3.bucket}/${key}`,
            {
              method: 'GET'
            }
          )

          const res = await $fetch.raw(request).catch(() => {
            throw createError({
              message: 'get-failed',
              statusCode: 404
            })
          })

          const contentType = res.headers.get('Content-Type')

          opts.mimeType = contentType

          return res._data.stream()
        },

        async setItemRaw (key, value) {
          key = denormalizeKey(key)

          const type = mime.getType(key)

          const request = await client.sign(
            `${config.s3.endpoint}/${config.s3.bucket}/${key}`,
            {
              method: 'PUT',
              body: value,
              headers: {
                'Content-Type': type as string
              }
            }
          )

          return $fetch(request).catch(() => {
            throw createError({
              message: 'put-failed',
              statusCode: 500
            })
          })
        },

        async removeItem (key) {
          key = denormalizeKey(key)

          const request = await client.sign(
            `${config.s3.endpoint}/${config.s3.bucket}/${key}`,
            {
              method: 'DELETE'
            }
          )

          return $fetch(request).catch(() => {
            throw createError({
              message: 'delete-failed',
              statusCode: 400
            })
          })
        }
      }
    })
  } else {
    throw createError('[nuxt-s3] Invalid driver')
  }

  nitroApp.hooks.hook('request', (event) => {
    event.context.s3 = storage
  })
})
