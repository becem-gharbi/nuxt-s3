import crypto from 'node:crypto'
import { $fetch } from 'ofetch'
import { defineDriver } from 'unstorage'
import { parseString as xml2js } from 'xml2js'
import { toXML as js2xml } from 'jstoxml'
import { joinURL, withQuery } from 'ufo'
import { AwsClient } from 'aws4fetch'

if (!globalThis.crypto) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.crypto = crypto
}

export interface S3DriverOptions {
  accessKeyId: string
  secretAccessKey: string
  endpoint: string
  region: string
  bucket: string
  accountId?: string
}

type GetItemOptions = undefined | {
  headers?: Record<string, string>
}

type SetItemOptions = undefined | {
  headers?: Record<string, string>
  meta?: Record<string, string>
}

const DRIVER_NAME = 's3'

export default defineDriver((options: S3DriverOptions) => {
  let awsClient: AwsClient

  function getAwsClient() {
    if (!awsClient) {
      awsClient = new AwsClient({
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        region: options.region,
        service: DRIVER_NAME,
      })
    }
    return awsClient
  }

  const normalizedKey = (key: string) => key.replace(/:/g, '/').replace(/\/+$/, '')

  const awsUrlWithoutKey = joinURL(options.endpoint, options.bucket)

  const awsUrlWithKey = (key: string) => joinURL(options.endpoint, options.bucket, normalizedKey(key))

  // https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html
  async function _getMeta(key: string) {
    const request = await getAwsClient().sign(awsUrlWithKey(key), {
      method: 'HEAD',
    })

    return $fetch.raw(request)
      .then((res) => {
        const metaHeaders: HeadersInit = {}
        for (const [key, value] of res.headers.entries()) {
          const match = /x-amz-meta-(.*)/.exec(key)
          if (match && match[1]) {
            metaHeaders[match[1]] = value
          }
        }
        return metaHeaders
      })
  }

  // https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
  async function _getKeys(base?: string) {
    const url = withQuery(awsUrlWithoutKey, { prefix: base && normalizedKey(base) })

    const request = await getAwsClient().sign(url, {
      method: 'GET',
    })

    return $fetch(request)
      .then((res) => {
        let keys: Array<string> = []
        xml2js(res, (error, result) => {
          if (error === null) {
            const contents = result.ListBucketResult.Contents as Array<{ Key: string }>
            keys = contents.map(item => item.Key[0]!)
          }
        })
        return keys
      }).catch(() => [])
  };

  // https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html
  async function _getItemRaw(key: string, opts: GetItemOptions = {}) {
    const request = await getAwsClient().sign(awsUrlWithKey(key), {
      method: 'GET',
    })

    return $fetch.raw(request)
      .then((res) => {
        opts.headers ||= {}

        for (const [key, value] of res.headers.entries()) {
          opts.headers[key] = value
        }

        return res._data
      })
      .catch(() => null)
  }

  // https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
  async function _setItemRaw(key: string, value: string | ArrayBuffer | Blob, opts: SetItemOptions = {}) {
    const metaHeaders: HeadersInit = {}

    if (typeof opts.meta === 'object') {
      for (const [key, value] of Object.entries(opts.meta)) {
        metaHeaders[`x-amz-meta-${key}`] = value
      }
    }

    const request = await getAwsClient().sign(awsUrlWithKey(key), {
      method: 'PUT',
      body: value,
      headers: {
        ...opts.headers,
        ...metaHeaders,
      },
    })

    return $fetch(request)
  }

  // https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html
  async function _removeItem(key: string) {
    const request = await getAwsClient().sign(awsUrlWithKey(key), {
      method: 'DELETE',
    })

    return $fetch(request)
  }

  return {
    name: DRIVER_NAME,
    options,

    getItemRaw: _getItemRaw,
    setItemRaw: _setItemRaw,
    getKeys: _getKeys,
    removeItem: _removeItem,

    getMeta: key => _getMeta(key).catch(() => ({})),

    hasItem: key => _getMeta(key).then(() => true).catch(() => false),

    getItem(key, opts: GetItemOptions) {
      return _getItemRaw(key, opts)
    },

    setItem(key, value, opts: SetItemOptions = {}) {
      let contentType = 'text/plain'

      try {
        JSON.parse(value)
        contentType = 'application/json'
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (_) { /* empty */ }

      opts.headers = {
        'Content-Type': contentType,
        'Content-Length': value.length.toString(),
        ...opts.headers,
      }

      return _setItemRaw(key, value, opts)
    },

    // https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html
    async clear(base) {
      const keys = await _getKeys(base)

      if (options.accountId) {
        const body = js2xml({
          Delete: keys.map(key => ({ Object: { Key: key } })),
        })

        const request = await getAwsClient().sign(awsUrlWithoutKey, {
          method: 'DELETE',
          body,
          headers: {
            'x-amz-expected-bucket-owner': options.accountId,
          },
        })

        await $fetch(request)
      }

      await Promise.all(keys.map(key => _removeItem(key)))
    },
  }
})
