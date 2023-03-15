<template>
    <div>
        <S3Image :src="url" />

        <form @submit.prevent="(e) => handleChange(e.target?.file.files)">
            <input type="file" name="file">
            <button> Change</button>
        </form>
    </div>
</template>

<script setup  lang="ts">
import { useS3Object, ref } from "#imports"

const { upload } = useS3Object()

const url = ref("https://upload.wikimedia.org/wikipedia/commons/4/45/NuxtJS_Logo.png")

async function handleChange(files: File[]) {
    const { data } = await upload(files, url.value, true)

    if (data.value) {
        url.value = data.value[0].url
    }
}
</script>