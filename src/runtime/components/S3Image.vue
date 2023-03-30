<template>
    <img :src="src" :loading="loading" :width="width" :height="height" :alt="alt">
</template>

<script setup lang="ts">
import { computed } from "#imports"
import useS3Object from "../composables/useS3Object"

const props = withDefaults(defineProps<{
    src: string,
    public?: boolean,
    lazy?: boolean,
    width?: number | string,
    height?: number | string,
    alt?: string,
}>(), {
    public: true,
    lazy: false,
    fit: "cover"
})

const { getPublicUrl } = useS3Object()

const loading = computed(() => props.lazy ? 'lazy' : 'eager')

const src = computed(() => props.public ? getPublicUrl(props.src) : props.src)

</script>