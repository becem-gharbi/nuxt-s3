# Changelog

## v1.1.0

[compare changes](https://github.com/becem-gharbi/nuxt-s3-edge/compare/v1.0.2...v1.1.0)

### 🚀 Enhancements

- **useS3Object:** Add object metadata on upload ([4b1adbe](https://github.com/becem-gharbi/nuxt-s3-edge/commit/4b1adbe))
- **s3 driver:** Add `getMeta` method ([f785eeb](https://github.com/becem-gharbi/nuxt-s3-edge/commit/f785eeb))
- Add `getMeta` server utility ([7b0c71b](https://github.com/becem-gharbi/nuxt-s3-edge/commit/7b0c71b))

### 🩹 Fixes

- **api:** Make sure to remove metadata on object delete ([f47035e](https://github.com/becem-gharbi/nuxt-s3-edge/commit/f47035e))

### 💅 Refactors

- **api:** Set metadata on object create ([2ecf30c](https://github.com/becem-gharbi/nuxt-s3-edge/commit/2ecf30c))
- **s3 driver:** Send object metadata on `setItemRaw` ([0c29645](https://github.com/becem-gharbi/nuxt-s3-edge/commit/0c29645))
- **api:** Always set meta on object create ([8b3bcd2](https://github.com/becem-gharbi/nuxt-s3-edge/commit/8b3bcd2))
- **getKey:** Throw an error on invalid pathname ([dca2948](https://github.com/becem-gharbi/nuxt-s3-edge/commit/dca2948))
- **getKey:** Make sure key is without trailing slash ([7a4941b](https://github.com/becem-gharbi/nuxt-s3-edge/commit/7a4941b))
- No significant change ([c01fbf9](https://github.com/becem-gharbi/nuxt-s3-edge/commit/c01fbf9))

### 📖 Documentation

- Update 2.setup.md ([550726e](https://github.com/becem-gharbi/nuxt-s3-edge/commit/550726e))
- Document metadata feature ([5e9b673](https://github.com/becem-gharbi/nuxt-s3-edge/commit/5e9b673))

### 🌊 Types

- Group types in a declaration file ([d6c9326](https://github.com/becem-gharbi/nuxt-s3-edge/commit/d6c9326))
- Remove `event.context.s3` type definition ([24527cb](https://github.com/becem-gharbi/nuxt-s3-edge/commit/24527cb))

### 🏡 Chore

- **deps-dev:** Bump vite from 4.4.9 to 4.5.1 ([22f5c5d](https://github.com/becem-gharbi/nuxt-s3-edge/commit/22f5c5d))
- **deps-dev:** Bump vite from 4.5.0 to 4.5.1 in /docs ([56529bc](https://github.com/becem-gharbi/nuxt-s3-edge/commit/56529bc))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v1.0.2

[compare changes](https://github.com/becem-gharbi/nuxt-s3-edge/compare/v0.2.2...v0.3.0)

### 🩹 Fixes

- **useS3Object:** Check if url is valid on remove ([a4d53f1](https://github.com/becem-gharbi/nuxt-s3-edge/commit/a4d53f1))
- Allow env variables to overwrite config options ([71f4003](https://github.com/becem-gharbi/nuxt-s3-edge/commit/71f4003))

### 💅 Refactors

- Minor refactoring ([74f2cbb](https://github.com/becem-gharbi/nuxt-s3-edge/commit/74f2cbb))
- Return json on success mutation response ([b4219eb](https://github.com/becem-gharbi/nuxt-s3-edge/commit/b4219eb))
- No significant change ([8702345](https://github.com/becem-gharbi/nuxt-s3-edge/commit/8702345))

### 📖 Documentation

- Create docus app ([11569d2](https://github.com/becem-gharbi/nuxt-s3-edge/commit/11569d2))
- Setup landing page ([7d96620](https://github.com/becem-gharbi/nuxt-s3-edge/commit/7d96620))
- Define structure ([b9c37f3](https://github.com/becem-gharbi/nuxt-s3-edge/commit/b9c37f3))
- Add content ([281aa6a](https://github.com/becem-gharbi/nuxt-s3-edge/commit/281aa6a))
- **readme:** Add documentation website ([627b6ed](https://github.com/becem-gharbi/nuxt-s3-edge/commit/627b6ed))

### 🌊 Types

- Add #s3 types ([761f13e](https://github.com/becem-gharbi/nuxt-s3-edge/commit/761f13e))
- Ignore ([4dfc0d4](https://github.com/becem-gharbi/nuxt-s3-edge/commit/4dfc0d4))

### 🏡 Chore

- **deps-dev:** Bump postcss from 8.4.30 to 8.4.31 ([18dd07d](https://github.com/becem-gharbi/nuxt-s3-edge/commit/18dd07d))
- **deps-dev:** Bump undici from 5.25.2 to 5.27.0 ([9825a69](https://github.com/becem-gharbi/nuxt-s3-edge/commit/9825a69))
- **defaults:** ⚠️  Set fs as default storage driver ([a2af160](https://github.com/becem-gharbi/nuxt-s3-edge/commit/a2af160))
- **defaults:** ⚠️  Set 10 as default maxSizeMb ([b0a7b97](https://github.com/becem-gharbi/nuxt-s3-edge/commit/b0a7b97))
- Add compatible S3 providers ([c44eb03](https://github.com/becem-gharbi/nuxt-s3-edge/commit/c44eb03))
- No significant change ([d1f0367](https://github.com/becem-gharbi/nuxt-s3-edge/commit/d1f0367))
- Bump version to 1.0.0 ([0d2d467](https://github.com/becem-gharbi/nuxt-s3-edge/commit/0d2d467))
- **release:** V1.0.1 ([dd839c0](https://github.com/becem-gharbi/nuxt-s3-edge/commit/dd839c0))

#### ⚠️ Breaking Changes

- **defaults:** ⚠️  Set fs as default storage driver ([a2af160](https://github.com/becem-gharbi/nuxt-s3-edge/commit/a2af160))
- **defaults:** ⚠️  Set 10 as default maxSizeMb ([b0a7b97](https://github.com/becem-gharbi/nuxt-s3-edge/commit/b0a7b97))

### ❤️ Contributors

- Becem-gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v0.2.2

[compare changes](https://github.com/becem-gharbi/nuxt-s3-edge/compare/v0.2.1...v0.2.2)

### 💅 Refactors

- Move driver selection to server plugin ([668e242](https://github.com/becem-gharbi/nuxt-s3-edge/commit/668e242))

### 📖 Documentation

- **readme:** Add object via CDN note on Caching section ([c27f24b](https://github.com/becem-gharbi/nuxt-s3-edge/commit/c27f24b))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v0.2.1

[compare changes](https://github.com/becem-gharbi/nuxt-s3-edge/compare/v0.2.0...v0.2.1)

### 💅 Refactors

- Rename config options ase to sBase ([c3d0012](https://github.com/becem-gharbi/nuxt-s3-edge/commit/c3d0012))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

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

