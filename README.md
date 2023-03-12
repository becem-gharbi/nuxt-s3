# Nuxt S3

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt 3 module for using Amazon S3 compatible file storage services such as Cloudflare R2, Storj, etc. This module is based on the latest version of the AWS SDK for JavaScript (v3)

## Features

- ✔️ Bucket create/delete/list via `useS3Bucket` composable
- ✔️ Object create/update/delete/read/list via `useS3Object` composable
- ✔️ Image create/update/delete via `useS3Image` composable
- ✔️ Responsive friendly image upload with multiple breakpoints `xsmall`, `small`, `medium`, `large`, `xlarge`
- ✔️ Size based image source via `S3Image` component

## Installation

Add `@bg-dev/nuxt-s3` dependency to your project

```bash
# Using npm
npm install --save-dev @bg-dev/nuxt-s3

# Using yarn
yarn add --dev @bg-dev/nuxt-s3
```

## Setup

Add `@bg-dev/nuxt-s3` to the `modules` section of `nuxt.config.ts` and set your S3 client credentials

```js
export default defineNuxtConfig({
  modules: ["@bg-dev/nuxt-s3"],

  s3: {
    client: {}, // S3 client config from @aws-sdk/client-s3
    bucket: "", // Default bucket
    publicBucketUrl: "", // Url for shared bucket
    image: {
    placeholder: "", // Url for default S3Image background
    breakpoints: {
        xlarge: false, // Disabled by default
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: false,
    };
  };
  },
});
```

That's it! You can now use `@bg-dev/nuxt-s3` in your Nuxt app ✨

## Usage

### Authorization

By default all the module's features are inaccessible. Add a server side middleware in order to check the user's role and set the permissions accordingly.

```javascript
import { setPermissions } from "#s3";

export default defineEventHandler((event) => {
  setPermissions(event, {
    bucket: {
      create: false,
      delete: true,
      list: true,
    },
    object: {
      create: true,
      delete: true,
      list: true,
      read: true,
      update: true,
    },
    image: {
      create: true,
      update: true,
      delete: true,
    },
  });
});
```

### Image optimization

The goal is to automatically adapt the Intrinsic size and Rendered size of an image. This will reduce the bandwidth consumed and enhance the UX. The solution is:

- On upload, resize the image to multiple versions according to a set of breakpoints.

- On download, check the html image size and find the largest and closest breakpoint in order to resolve the image source.

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

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@bg-dev/nuxt-s3/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@bg-dev/nuxt-s3
[npm-downloads-src]: https://img.shields.io/npm/dm/@bg-dev/nuxt-s3.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@bg-dev/nuxt-s3
[license-src]: https://img.shields.io/npm/l/@bg-dev/nuxt-s3.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@bg-dev/nuxt-s3
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
