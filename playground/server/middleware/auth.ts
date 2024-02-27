import { defineEventHandler, getRequestURL } from 'h3'
import { getMeta } from '#s3'

export default defineEventHandler(async (event) => {
  const isS3Mutation = getRequestURL(event).pathname.startsWith('/api/s3/mutation')

  if (isS3Mutation) {
    // check authorization
    const meta = await getMeta(event)
    /* eslint-disable no-console */
    console.log({ meta })
  }
})
