import crypto from 'crypto'
import { $fetch } from 'ofetch'
import { AwsClient } from 'aws4fetch'
import { defineDriver } from 'unstorage'

if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto
}

interface DriverOptions {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    region: string;
    bucket: string;
}

interface GetItemOptions {
    headers?: HeadersInit;
}

interface SetItemOptions {
    headers?: HeadersInit;
    meta?: Record<string, string>;
}

const DRIVER_NAME = 's3'

// @ts-ignore
export default defineDriver((options: DriverOptions) => {
  const awsClient = new AwsClient({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    region: options.region,
    service: DRIVER_NAME
  })

  const normalizedKey = (key: string) => key.replace(/:/g, '/')

  const awsUrlWithoutKey = () => `${options.endpoint}/${options.bucket}`

  const awsUrlWithKey = (key: string) => `${awsUrlWithoutKey()}/${normalizedKey(key)}`

  // https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html
  async function _getMeta (key: string) {
    const request = await awsClient.sign(awsUrlWithKey(key), {
      method: 'HEAD'
    })

    return $fetch.raw(request)
      .then((res) => {
        const metaHeaders: HeadersInit = {}
        for (const [key, value] of res.headers.entries()) {
          const match = /x-amz-meta-(.*)/.exec(key)
          if (match) {
            metaHeaders[match[1]] = value
          }
        }
        return metaHeaders
      })
  }

  return {
    name: DRIVER_NAME,
    options,

    getItem () {},
    setItem () {},
    getItems () {},
    setItems () {},
    clear () {},
    getKeys () {},
    dispose () {},
    watch () {},

    // https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html
    async getItemRaw (key, opts: GetItemOptions) {
      const request = await awsClient.sign(awsUrlWithKey(key), {
        method: 'GET'
      })

      return $fetch.raw(request)
        .then((res) => {
          opts.headers = res.headers
          return res._data
        })
        .catch(() => null)
    },

    // https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
    async setItemRaw (key, value, opts: SetItemOptions) {
      const metaHeaders: HeadersInit = {}

      if (typeof opts.meta === 'object') {
        for (const [key, value] of Object.entries(opts.meta)) {
          metaHeaders[`x-amz-meta-${key}`] = value
        }
      }

      const request = await awsClient.sign(awsUrlWithKey(key), {
        method: 'PUT',
        body: value,
        headers: {
          ...opts.headers,
          ...metaHeaders
        }
      })

      return $fetch(request)
    },

    // https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html
    async removeItem (key) {
      const request = await awsClient.sign(awsUrlWithKey(key), {
        method: 'DELETE'
      })

      return $fetch(request)
    },

    async hasItem (key) {
      return await _getMeta(key)
        .then(() => true)
        .catch(() => false)
    },

    getMeta: key => _getMeta(key).catch(() => ({}))
  }
})
