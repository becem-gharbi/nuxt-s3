import { fileURLToPath } from 'node:url'
import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addServerHandler,
  addTemplate,
  addServerPlugin,
} from '@nuxt/kit'
import { defu } from 'defu'
import { name, version } from '../package.json'
import type { PrivateConfig, PublicConfig } from './runtime/types'

export type ModuleOptions = PrivateConfig & PublicConfig

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 's3',
  },

  defaults: {
    driver: 'fs',
    fsBase: './uploads',
    accept: '',
    maxSizeMb: 10,
    server: true,
  },

  setup(options, nuxt) {
    // Get the runtime directory
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      s3: options.driver === 'fs'
        ? {
            driver: options.driver,
            fsBase: options.fsBase,
          }
        : {
            driver: options.driver,
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
            endpoint: options.endpoint,
            region: options.region,
            bucket: options.bucket,
          },
      public: {
        s3: {
          server: options.server,
          accept: options.accept,
          maxSizeMb: options.maxSizeMb,
        },
      },
    })

    // Add server utils
    nuxt.options.nitro = defu(
      {
        alias: {
          '#s3': resolve(runtimeDir, 'server/utils'),
        },
      },
      nuxt.options.nitro,
    )

    addTemplate({
      filename: 'types/s3.d.ts',
      getContents: () =>
        [
          'declare module \'#s3\' {',
          `  const normalizeKey: typeof import('${resolve(
            runtimeDir,
            'server/utils',
          )}').normalizeKey`,
          `  const denormalizeKey: typeof import('${resolve(
            runtimeDir,
            'server/utils',
          )}').denormalizeKey`,
          `  const getKey: typeof import('${resolve(
            runtimeDir,
            'server/utils',
          )}').getKey`,
          `  const getMeta: typeof import('${resolve(
            runtimeDir,
            'server/utils',
          )}').getMeta`,
          `  const verifyType: typeof import('${resolve(
            runtimeDir,
            'server/utils',
          )}').verifyType`,
          `  const verifySize: typeof import('${resolve(
            runtimeDir,
            'server/utils',
          )}').verifySize`,
          '}',
        ].join('\n'),
    })

    // Register #s3 types
    nuxt.hook('prepare:types', (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, 'types/s3.d.ts'),
      })
    })

    // Register server plugins
    addServerPlugin(resolve(runtimeDir, 'server/plugins/storage'))

    nuxt.options.build.transpile.push('jstoxml')

    if (options.server) {
      addImportsDir(resolve(runtimeDir, 'composables'))

      // Get object
      addServerHandler({
        route: '/api/s3/query/**',
        method: 'get',
        handler: resolve(runtimeDir, 'server/api/query/read'),
      })

      // Create object
      addServerHandler({
        route: '/api/s3/mutation/**',
        method: 'post',
        handler: resolve(runtimeDir, 'server/api/mutation/create'),
      })

      // Delete object
      addServerHandler({
        route: '/api/s3/mutation/**',
        method: 'delete',
        handler: resolve(runtimeDir, 'server/api/mutation/delete'),
      })
    }
  },
})
