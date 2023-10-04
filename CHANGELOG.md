# Changelog


## v0.2.0

[compare changes](https://github.com/becem-gharbi/nuxt-s3-edge/compare/v0.1.7...v0.2.0)

### 🚀 Enhancements

- Add node filesystem driver ([05ef28f](https://github.com/becem-gharbi/nuxt-s3-edge/commit/05ef28f))
- Add maxSizeMb constraint on upload ([fb60270](https://github.com/becem-gharbi/nuxt-s3-edge/commit/fb60270))

### 🩹 Fixes

- Resolve mime-type from s3 content-type for keys without extension ([4c2394e](https://github.com/becem-gharbi/nuxt-s3-edge/commit/4c2394e))

### 💅 Refactors

- Transform s3 utility to an Unstorage driver ([bcb437e](https://github.com/becem-gharbi/nuxt-s3-edge/commit/bcb437e))
- ⚠️  Resolve object type from extension instead of content-type header ([09a3787](https://github.com/becem-gharbi/nuxt-s3-edge/commit/09a3787))
- Load fs and s3 storage instances conditionally ([85ddd06](https://github.com/becem-gharbi/nuxt-s3-edge/commit/85ddd06))
- **useS3Object:** Allow failed remove on object update ([d314f5d](https://github.com/becem-gharbi/nuxt-s3-edge/commit/d314f5d))
- **fs:** Set default base to uploads/ ([f2f189f](https://github.com/becem-gharbi/nuxt-s3-edge/commit/f2f189f))
- Use createError instead of new Error ([b185d29](https://github.com/becem-gharbi/nuxt-s3-edge/commit/b185d29))

### 📖 Documentation

- **readme:** Add new config options ([443991d](https://github.com/becem-gharbi/nuxt-s3-edge/commit/443991d))
- **readme:** Add new config options ([dca9f2a](https://github.com/becem-gharbi/nuxt-s3-edge/commit/dca9f2a))

### 🌊 Types

- Set module config type as dynamic based on driver ([ca68ac6](https://github.com/becem-gharbi/nuxt-s3-edge/commit/ca68ac6))
- Remove event.context.s3 type definition ([9eb09aa](https://github.com/becem-gharbi/nuxt-s3-edge/commit/9eb09aa))

### 🏡 Chore

- Fix lint issues ([ed470c1](https://github.com/becem-gharbi/nuxt-s3-edge/commit/ed470c1))
- Add driver config option ([91d3294](https://github.com/becem-gharbi/nuxt-s3-edge/commit/91d3294))
- Change lint config ([5e3c6dc](https://github.com/becem-gharbi/nuxt-s3-edge/commit/5e3c6dc))
- Remove demo ([f3c2b32](https://github.com/becem-gharbi/nuxt-s3-edge/commit/f3c2b32))
- Add server-side size validation ([bde7969](https://github.com/becem-gharbi/nuxt-s3-edge/commit/bde7969))
- Convert return type of getItemRaw on s3 to readable stream ([b736b67](https://github.com/becem-gharbi/nuxt-s3-edge/commit/b736b67))
- Set tag to latest ([bf53c61](https://github.com/becem-gharbi/nuxt-s3-edge/commit/bf53c61))
- Remove uploads folder ([52af6f7](https://github.com/becem-gharbi/nuxt-s3-edge/commit/52af6f7))

#### ⚠️ Breaking Changes

- ⚠️  Resolve object type from extension instead of content-type header ([09a3787](https://github.com/becem-gharbi/nuxt-s3-edge/commit/09a3787))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v0.1.7

[compare changes](https://github.com/becem-gharbi/nuxt-s3-edge/compare/v0.1.6...v0.1.7)

### 🚀 Enhancements

- **useS3Object:** Add prefix option on upload method ([566c66b](https://github.com/becem-gharbi/nuxt-s3-edge/commit/566c66b))

### 🩹 Fixes

- Allow naming keys with / ([b638e14](https://github.com/becem-gharbi/nuxt-s3-edge/commit/b638e14))

### 💅 Refactors

- **useS3Object:** Resolve key at upload function ([9d63e9c](https://github.com/becem-gharbi/nuxt-s3-edge/commit/9d63e9c))

### 📖 Documentation

- **readme:** Update features section ([fc4b71e](https://github.com/becem-gharbi/nuxt-s3-edge/commit/fc4b71e))
- **readme:** Add key naming section ([a673a25](https://github.com/becem-gharbi/nuxt-s3-edge/commit/a673a25))
- **readme:** Update key naming section ([cb0afff](https://github.com/becem-gharbi/nuxt-s3-edge/commit/cb0afff))
- **readme:** Update caching section ([701517d](https://github.com/becem-gharbi/nuxt-s3-edge/commit/701517d))
- **readme:** Update description ([1182d2c](https://github.com/becem-gharbi/nuxt-s3-edge/commit/1182d2c))

### 🏡 Chore

- Upgrade dependencies ([ac681d5](https://github.com/becem-gharbi/nuxt-s3-edge/commit/ac681d5))
- Upgrade dependencies ([1d4f744](https://github.com/becem-gharbi/nuxt-s3-edge/commit/1d4f744))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem Gharbi <becem.gharbi@live.com>

## v0.1.6

[compare changes](https://undefined/undefined/compare/v0.1.5...v0.1.6)

### 🩹 Fixes

- Omit credentials on fetch calls (0e54424)
- Set content-type on Get object response (61d3c29)

### 📖 Documentation

- Update pkg size (6b230ae)

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.1.5

[compare changes](https://undefined/undefined/compare/v0.1.4...v0.1.5)

### 🔥 Performance

- Call S3 with $fetch instead of etch (4be6ea7)
- On object update replace server-side remove & create calls to client-side (dc3a906)
- Stream Get object response (461ae0c)

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.1.4

[compare changes](https://undefined/undefined/compare/v0.1.3...v0.1.4)

### 🩹 Fixes

- Fix error message (2375e8a)

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.1.3

[compare changes](https://undefined/undefined/compare/v0.1.2...v0.1.3)

### 💅 Refactors

- Register server routes with explicit methods (95c0499)

### 📖 Documentation

- Update Readme (a01903d)

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.1.2

[compare changes](https://undefined/undefined/compare/v0.1.1...v0.1.2)

### 🚀 Enhancements

- Add file type validation (f4b0236)

### 📖 Documentation

- Update Readme (d485038)
- Update Readme (686dbaa)
- Update Readme (92d3683)

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.1.1


### 🚀 Enhancements

- Add object create update delete get API handlers (54b3de5)
- Create useS3Object (9ad07c0)
- Create upload as wrapper of create & update (9acc32a)
- Add s3:auth hook to pass authorization header (f1c1f89)

### 🩹 Fixes

- Create virtual import for server utils (0cb503a)
- Status to 404 on get object fail (5e09c67)
- Fix runtime dir resolution (6f1b4a4)
- Add formdata to request body (0a64682)

### 💅 Refactors

- Create isValidURL utility (ae473a6)

### 📖 Documentation

- Update Readme (3ace113)
- Update Readme (5ebd11e)

### 🏡 Chore

- Set package metadata (008c827)
- Update Readme (a1560dc)
- Add module options (1fdcc71)
- Register server APIs (1f90471)
- Add s3 client (5cbafa3)
- Rename APIs routes (dac3073)
- **demo:** Upgrade dependencies (eeb7909)
- **demo:** Add to git (2321b27)
- Set default uuid key (3599c4b)
- Add JSDOC to public APIs (9eceba9)
- Test server side middleware (d93ce76)
- **demo:** Upgrade dependencies (77d8556)
- Remove demo (09e1b42)

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

