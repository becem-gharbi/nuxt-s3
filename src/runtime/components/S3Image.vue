<template>
    <img :src="src" :loading="loading" :width="width" :height="height" :style="style" :alt="alt" :srcset="srcset"
        :sizes="sizes">
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"
import useS3Image from "../composables/useS3Image"
import type { StyleValue } from "vue"

const props = withDefaults(defineProps<{
    objectKey: string,
    query?: {},
    public?: boolean,
    bucket?: string,
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

const computedPlaceholder = computed(() => props.placeholder || publicConfig.placeholder)

const style = computed<StyleValue>(() => ({
    backgroundImage: computedPlaceholder.value ? `url(${computedPlaceholder.value})` : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    objectFit: props.fit
}))

const loading = computed(() => props.lazy ? 'lazy' : 'eager')

const baseKey = computed(() => props.objectKey.split("_").pop() || props.objectKey)

const src = computed(() => getImageSrc(baseKey.value))

const srcset = computed(() => {
    const breakpoints = publicConfig.breakpoints

    return Object.keys(breakpoints)
        .filter(breakpoint => !!breakpoints[breakpoint])
        .map(breakpoint => `${getImageSrc(getKey(breakpoint))} ${breakpoints[breakpoint]}w`)
        .join(', ')
})

function getImageSrc(key: string) {
    const { getUrl, getPublicUrl } = useS3Image()

    return props.public ? getPublicUrl(key, props.query) : getUrl(key, props.bucket)
}

function getKey(breakpoint: string) {
    return `${breakpoint}_${baseKey.value}`
}


</script>