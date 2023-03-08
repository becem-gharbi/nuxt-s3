# Nuxt S3

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt 3 module for using Amazon S3 compatible file storage services such as Cloudflare R2, Storj, etc. This module is based on the latest version of the AWS SDK for JavaScript (v3)

## Features

- ✔️ Bucket create/delete/list via `useS3Bucket` composable
- ✔️ Object create/update/delete/read/list via `useS3Object` composable

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
  },
});
```

That's it! You can now use My Module in your Nuxt app ✨

## Authorization

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
  });
});
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the default Branch
5. Open a Pull Request

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
