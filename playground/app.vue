<template>
  <div>
    {{ getURL() }}
  </div>
</template>

<script setup>
import { useS3Object } from '#imports';

const { getURL } = useS3Object()
</script>
