<template>
  <img
    :srcset="srcset"
    :src="src"
    :sizes="sizes"
  >
</template>

<script setup lang="ts">
import { useRuntimeConfig, computed } from "#imports"
import {withQuery} from "ufo"

const props = defineProps<{ src: string, sizes?: string}>()

const config = useRuntimeConfig()

const screens = config.public.s3.image.screens

const srcset = computed(() => 
     Object.entries(screens).map(([name, width]) => {
       const url = withQuery(props.src, { screen:name }) 
        return `${url} ${width}w`
    }).join(', ')
)
</script>