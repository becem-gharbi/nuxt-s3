<template>
    <img ref="image" :src="url" :loading="lazy ? 'lazy' : 'eager'" :width="width" :height="height" :style="imageStyle">
</template>

<script setup lang="ts">
import { computed, ref, onMounted, useRuntimeConfig } from "#imports"
import useS3Image from "../composables/useS3Image"
import type { Breakpoint } from "../types"
import type { StyleValue } from "vue"

const publicConfig = useRuntimeConfig().public.s3.image

const { getUrl, getPublicUrl } = useS3Image()

const props = withDefaults(defineProps<{
    objectKey: string,
    query?: {},
    public?: boolean,
    bucket?: string,
    placeholder?: string,
    lazy?: boolean,
    width?: number,
    height?: number,
}>(), {
    public: true,
    lazy: false,
})

const computedPlaceholder = computed(() => props.placeholder || publicConfig.placeholder)

const imageStyle = computed<StyleValue>(() => ({
    backgroundImage: computedPlaceholder.value ? `url(${computedPlaceholder.value})` : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
}))

const image = ref<HTMLImageElement>()

const breakpoint = ref<Breakpoint>()

onMounted(() => {
    const resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0].target.clientWidth

        breakpoint.value = getBreakpoint(width)
    })

    resizeObserver.observe(image.value)
})

const url = computed<string>(() => {
    const baseKey = props.objectKey?.split("_").pop();

    const key = baseKey && breakpoint.value ? `${breakpoint.value}_${baseKey}` : props.objectKey

    if (props.public) {
        return getPublicUrl(key, props.query)
    }

    return getUrl(key, props.bucket)
})

function getBreakpoint(width: number) {
    const breakpoints = publicConfig.breakpoints

    let breakpointKeys = Object.keys(breakpoints);
    breakpointKeys.sort((a, b) => breakpoints[a] - breakpoints[b]); // Sort keys by breakpoint value

    let i = 0;

    while (i < breakpointKeys.length && breakpoints[breakpointKeys[i]] <= width) {
        i++;
    }

    return i === 0 ? undefined : breakpointKeys[i];
}

</script>