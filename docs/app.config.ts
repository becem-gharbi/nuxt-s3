import { defineAppConfig } from '#imports'

export default defineAppConfig({
  docus: {
    title: 'Nuxt S3',
    description: 'Edge compatible S3 client for Nuxt 3',
    image: '/cover.png',
    socials: {
      github: 'becem-gharbi/nuxt-s3-edge',
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
  }
})
