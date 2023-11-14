import { defineEventHandler, getRequestURL } from '#imports'

export default defineEventHandler((event) => {
  const isS3Mutation = getRequestURL(event).pathname.startsWith('/api/s3/mutation')

  if (isS3Mutation) {
    // check authorization
  }
})
