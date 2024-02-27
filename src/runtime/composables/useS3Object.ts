import { v4 as uuidv4 } from 'uuid'
import { withoutTrailingSlash, parseURL, joinURL } from 'ufo'
import type { S3ObjectMetadata } from '../types'
import { useNuxtApp, useRuntimeConfig, createError } from '#imports'

export function useS3Object () {
  const config = useRuntimeConfig().public.s3

  async function create (file: File, key: string, meta?: S3ObjectMetadata) {
    const formData = new FormData()

    formData.append('file', file)

    if (typeof meta === 'object') {
      formData.append('meta', JSON.stringify(meta))
    }

    const headers = { authorization: '' }
    await useNuxtApp().callHook('s3:auth', headers)

    await $fetch(`/api/s3/mutation/${key}`, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'omit'
    })

    return getURL(key)
  }

  async function update (url: string, file: File, key: string, meta?: S3ObjectMetadata) {
    const headers = { authorization: '' }

    await useNuxtApp().callHook('s3:auth', headers)

    await remove(url).catch(() => { })

    await useNuxtApp().callHook('s3:auth', headers)

    return create(file, key, meta)
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
    await useNuxtApp().callHook('s3:auth', headers)

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
    opts?: { url?: string; key?: string; prefix?: string, meta?: S3ObjectMetadata }
  ) {
    verifyType(file.type)
    verifySize(file.size)

    const ext = file.name.split('.').pop()

    const prefix = opts?.prefix ? opts.prefix.replace(/^\//, '') : ''

    const _key = `${opts?.key ?? prefix + uuidv4()}.${ext}`

    if (opts?.url) {
      if (isValidURL(opts.url)) {
        return update(opts.url, file, _key, opts.meta)
      }
    }

    return create(file, _key, opts?.meta)
  }

  /**
   * Get URL from key
   */
  function getURL (key: string) {
    return joinURL('/api/s3/query/', key)
  }

  /**
   * Get Key from URL
   */
  function getKey (url: string) {
    const pathname = withoutTrailingSlash(parseURL(url).pathname)
    const regex = /^\/api\/s3\/query\//
    if (regex.test(pathname)) {
      return pathname.replace(regex, '')
    }
  }

  function isValidURL (url: string) {
    return typeof getKey(url) !== 'undefined'
  }

  function verifyType (type: string) {
    if (config.accept && !new RegExp(config.accept).test(type)) {
      throw createError('invalid-type')
    }
  }

  function verifySize (size: number) {
    if (config.maxSizeMb && size > config.maxSizeMb * 1000000) {
      throw createError('invalid-size')
    }
  }

  return { upload, remove, getURL, getKey }
}
