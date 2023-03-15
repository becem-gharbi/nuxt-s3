<template>
    <img :src="src" :loading="loading" :width="width" :height="height" :style="style" :alt="alt" :srcset="srcset"
        :sizes="sizes">
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"
import useS3Object from "../composables/useS3Object"
import type { StyleValue } from "vue"

const props = withDefaults(defineProps<{
    src: string,
    query?: {},
    public?: boolean,
    placeholder?: string,
    lazy?: boolean,
    width?: number | string,
    height?: number | string,
    alt?: string,
    fit?: "contain" | "cover" | "fill" | "none" | "scale-down",
    sizes?: string
}>(), {
    public: true,
    lazy: false,
    fit: "cover"
})

const publicConfig = useRuntimeConfig().public.s3.image
const { decomposeUrl, getPublicUrl, composeUrl } = useS3Object()

const computedPlaceholder = computed(() => props.placeholder || publicConfig.placeholder)

const style = computed<StyleValue>(() => ({
    backgroundImage: computedPlaceholder.value ? `url(${computedPlaceholder.value})` : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    objectFit: props.fit
}))

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