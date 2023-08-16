# Nuxt S3

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Edge compatible S3 client for Nuxt 3.

## Features

- ✔️ Lightweight, not based on AWS SDK
- ✔️ Edge compatible (Vercel, Netlify...)
- ✔️ Object `read` `update` `delete`

## Quick Setup

1. Add `nuxt-s3` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-s3

# Using yarn
yarn add --dev nuxt-s3

# Using npm
npm install --save-dev nuxt-s3
```

2. Add `nuxt-s3` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["nuxt-s3"],
});
```

That's it! You can now use Nuxt S3 in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-s3/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-s3
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-s3.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-s3
[license-src]: https://img.shields.io/npm/l/nuxt-s3.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-s3
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
