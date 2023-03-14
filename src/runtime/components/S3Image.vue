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

const baseKey = computed(() => useS3Object().getKey(props.src))

const src = computed(() => baseKey.value ? getImageSrc(baseKey.value) : props.src)

const srcset = computed(() => {
    const breakpoints = publicConfig.breakpoints

    return Object.keys(breakpoints)
        .filter(breakpoint => !!breakpoints[breakpoint as keyof typeof breakpoints])
        .map(breakpoint => `${getImageSrc(`${breakpoint}_${baseKey.value}`)} ${breakpoints[breakpoint as keyof typeof breakpoints]}w`)
        .join(', ')
})

function getImageSrc(key: string) {
    return props.public ? useS3Object().getPublicUrl(key, props.query) : props.src
}

</script>