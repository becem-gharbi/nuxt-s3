<template>
    <img :src="src" :loading="loading" :width="width" :height="height" :alt="alt" :srcset="srcset" :sizes="sizes">
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"
import useS3Object from "../composables/useS3Object"

const props = withDefaults(defineProps<{
    src: string,
    public?: boolean,
    lazy?: boolean,
    width?: number | string,
    height?: number | string,
    alt?: string,
    sizes?: string
}>(), {
    public: true,
    lazy: false,
    fit: "cover"
})

const publicConfig = useRuntimeConfig().public.s3.image
const { decomposeUrl, getPublicUrl, composeUrl } = useS3Object()

const loading = computed(() => props.lazy ? 'lazy' : 'eager')

const src = computed(() => composeImageSrc(props.src))

const srcset = computed(() => {
    const decomposedUrl = decomposeUrl(props.src)

    if (!decomposedUrl) {
        return
    }

    const breakpoints = publicConfig.breakpoints

    return Object.keys(breakpoints)
        .filter(breakpoint => !!breakpoints[breakpoint as keyof typeof breakpoints])
        .map(breakpoint => `${composeImageSrc(props.src, breakpoint)} ${breakpoints[breakpoint as keyof typeof breakpoints]}w`)
        .join(', ')
})

function composeImageSrc(url: string, breakpoint?: string) {
    const decomposedUrl = decomposeUrl(url)

    if (!decomposedUrl) {
        return url
    }

    if (!breakpoint) {
        return props.public ? getPublicUrl(url) : url
    }

    decomposedUrl.breakpoint = breakpoint

    const responsiveUrl = composeUrl(decomposedUrl)

    return props.public ? getPublicUrl(responsiveUrl) : responsiveUrl
}

</script>