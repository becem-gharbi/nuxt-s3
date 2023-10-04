export default defineEventHandler((event) => {
  const isS3Mutation = getRequestURL(event).pathname.includes('s3/mutation')

  if (isS3Mutation) {
    // check authorization
  }
})
