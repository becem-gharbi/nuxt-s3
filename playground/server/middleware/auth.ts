import { defineEventHandler, getRequestURL } from '#imports'
import { getKey } from "#s3"

export default defineEventHandler((event) => {
  const isS3Mutation = getRequestURL(event).pathname.startsWith('/api/s3/mutation')

  if (isS3Mutation) {
    // check authorization
    const key = getKey(event)
    console.log("mutation", key)
  }
})
