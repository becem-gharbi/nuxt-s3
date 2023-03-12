<template>
    <img ref="image" :src="url" :loading="lazy ? 'lazy' : 'eager'" :width="width" :height="height" :style="{
        backgroundImage: `url(${placeholder})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    }">
</template>

<script setup lang="ts">
import { computed, ref, onMounted, useRuntimeConfig } from "#imports"
import useS3Image from "../composables/useS3Image"
import type { Breakpoint } from "../types"

const breakpoints = useRuntimeConfig().public.s3.image.breakpoints

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
    placeholder: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJiT-UHSm6w0Jperb8SitpfoAKeMUE3uynPg5YO-2Drw&s",
    lazy: false
})

const image = ref<HTMLImageElement>()

const breakpoint = ref<Breakpoint>()

onMounted(() => {
    const resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0].target.clientWidth

        // The breakpoint should be
        // - Largest than the image width
        // - Smallest one
        breakpoint.value = getBreakpoint(width)
    })

    resizeObserver.observe(image.value)
})

const url = computed<string>(() => {
    // if (!props.objectKey) {
    //     return props.placeholder
    // }

    const baseKey = props.objectKey?.split("_").pop();

    const key = baseKey && breakpoint.value ? `${breakpoint.value}_${baseKey}` : props.objectKey

    if (props.public) {
        return getPublicUrl(key, props.query)
    }

    return getUrl(key, props.bucket)
})

function getBreakpoint(width: number) {
    let breakpointKeys = Object.keys(breakpoints);
    breakpointKeys.sort((a, b) => breakpoints[a] - breakpoints[b]); // Sort keys by breakpoint value

    let i = 0;

    while (i < breakpointKeys.length && breakpoints[breakpointKeys[i]] <= width) {
        i++;
    }

    return i === 0 ? undefined : breakpointKeys[i];
}

</script>