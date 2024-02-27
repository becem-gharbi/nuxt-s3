<template>
  <div>
    <img
      :src="url"
      width="300"
    >

    <form @submit.prevent="handleChange">
      <input
        type="file"
        name="file"
      >
      <button>Change</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useS3Object, ref } from '#imports'

const { upload } = useS3Object()

const url = ref(
  'https://upload.wikimedia.org/wikipedia/commons/4/45/NuxtJS_Logo.png'
)

async function handleChange (e:any) {
  url.value = await upload(e.target?.file.files[0], {
    url: url.value,
    prefix: 'new/',
    meta: {
      user_id: 'user15956',
      user_role: 'adminqsd'
    }
  })
}
</script>
