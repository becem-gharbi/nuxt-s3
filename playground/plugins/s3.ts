import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  hooks: {
    's3:auth': (headers) => {
      headers.authorization = 'bearer 123'
    },
  },
})
