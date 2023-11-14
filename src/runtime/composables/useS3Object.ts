import { v4 as uuidv4 } from 'uuid'
import { useNuxtApp, useRuntimeConfig, createError } from '#imports'

export default function () {
  const { callHook } = useNuxtApp()
  const config = useRuntimeConfig()

  async function create (file: File, key: string) {
    const formData = new FormData()

    formData.append('file', file)

    const headers = { authorization: '' }
    await callHook('s3:auth', headers)

    await $fetch(`/api/s3/mutation/${key}`, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'omit'
    })

    return getURL(key)
  }

  async function update (url: string, file: File, key: string) {
    const headers = { authorization: '' }

    await callHook('s3:auth', headers)

    await remove(url).catch(() => { })

    await callHook('s3:auth', headers)

    return create(file, key)
  }

  /**
   * Remove file from its URL
   */
  async function remove (url: string) {
    if (!isValidURL(url)) {
      return
    }

    const key = getKey(url)

    const headers = { authorization: '' }
    await callHook('s3:auth', headers)

    await $fetch(`/api/s3/mutation/${key}`, {
      method: 'DELETE',
      headers,
      credentials: 'omit'
    })
  }

  /**
   * Upload single file
   * If url is provided and correspond to a previously uploaded object, this object will be replaced.
   * @returns URL of the uploaded file
   */
  function upload (
    file: File,
    opts?: { url?: string; key?: string; prefix?: string }
  ) {
    verifyType(file.type)
    verifySize(file.size)

    const ext = file.name.split('.').pop()

    const _key = (opts?.key || (opts?.prefix || '') + uuidv4()) + '.' + ext

    if (opts?.url) {
      if (isValidURL(opts.url)) {
        return update(opts.url, file, _key)
      }
    }

    return create(file, _key)
  }

  /**
   * Get URL from key
   */
  function getURL (key: string) {
    return `/api/s3/query/${key}`
  }

  /**
   * Get Key from URL
   */
  function getKey (url: string) {
    return url.split('/api/s3/query/')[1]
  }

  function isValidURL (url: string) {
    const key = getKey(url) || ''

    return key.length > 0
  }

  function verifyType (type: string) {
    const regex = new RegExp(config.public.s3.accept)

    if (!regex.test(type)) {
      throw createError('invalid-type')
    }
  }

  function verifySize (size: number) {
    const maxSizeMb = config.public.s3.maxSizeMb
    if (maxSizeMb && size > maxSizeMb * 1000000) {
      throw createError('invalid-size')
    }
  }

  return { upload, remove, getURL, getKey }
}
