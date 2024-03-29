# Nuxt S3

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt 3 module for using Amazon S3 compatible file storage services such as Cloudflare R2. This module is based on the AWS JS SDK `v3`.

> **Warning**
> This package `@bg-dev/nuxt-s3` is no longer maintained. An alternative package `nuxt-s3` can be used instead. You can find it [here](https://github.com/becem-gharbi/nuxt-s3-edge). It offers the following features over this one
> - Lightweight around 12KB with no dependency on AWS SDK.
> - Runs on edge workers with compatible APIs.
> - Key customization for bucket organization.
> - Built-in filesystem driver for local storage.
> - Caching configuration via Route rules.


## Features

- ✔️ Bucket create/remove/list via `useS3Bucket` composable
- ✔️ Object upload/remove/list via `useS3Object` composable

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
      compression: {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
      },
    },
    cacheControl: "", // Cache-Control response header on Object Read endpoint
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
  });
});
```

### Example application

```vue
<template>
  <div>
    <S3Image :src="url" />

    <form @submit.prevent="(e) => handleChange(e.target?.file.files)">
      <input type="file" name="file" />
      <button>Change</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { upload } = useS3Object();

const url = ref(
  "https://upload.wikimedia.org/wikipedia/commons/4/45/NuxtJS_Logo.png"
);

async function handleChange(files: File[]) {
  const { data } = await upload({
    files,
    url: url.value,
  });

  if (data.value) {
    url.value = data.value[0].url;
  }
}
</script>
```

## Notes

- The term `url` refers to the api endpoint that calls S3 client's `GetObjectCommand`. This url is subject to authorization via `object.read` permission.
- The term `publicUrl` refers to the direct call to the CDN. If the object is uploaded to a public bucket then the `publicUrl` can be obtained via `getPublicUrl` of `useS3Object`.
- When using [nuxt-security](https://nuxt-security.vercel.app/), HTTP requests might get rejected. You will need to add the following configuration

```js
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          {S3_PUBLIC_BUCKET_URL},
        ],
      },
    },
  },

  routeRules: {
    "api/s3/object/create": {
      security: {
        xssValidator: false,
      },
    },
  },
```

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
[npm-downloads-src]: https://img.shields.io/npm/dt/@bg-dev/nuxt-s3.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@bg-dev/nuxt-s3
[license-src]: https://img.shields.io/npm/l/@bg-dev/nuxt-s3.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@bg-dev/nuxt-s3
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
