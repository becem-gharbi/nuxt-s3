# Nuxt S3

An S3 SDK for Nuxt 3 applications

## Features

- ✔️ Bucket create/delete/list via `useS3Bucket` composable
- ✔️ Object create/update/delete/read/list via `useS3Object` composable

## Installation

```bash
npm i @bg-dev/nuxt-s3
```

## Setup

```ts
defineNuxtConfig({
  modules: ["@bg-dev/nuxt-s3"],

  s3: {
    client: {}, // S3ClientConfig interface from @aws-sdk/client-s3
  },
});
```

## Authorization

By default all the module's features are inaccessible. Add a server side middleware in order to check the user's role and set the permissions accordingly.

```javascript
// ~/server/middleware/index.ts

import { S3Context } from "@bg-dev/nuxt-s3";

export default defineEventHandler((event) => {
  const s3Context: S3Context = {
    permissions: {
      bucket: {
        create: true,
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
    },
  };

  event.context.s3 = s3Context;
});
```

