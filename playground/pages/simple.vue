<template>
    <div>
        <S3Image :src="url" :query="{ r: Math.random() }"></S3Image>

        <form @submit.prevent="(e) => handleChange(e.target?.file.files)">
            <input type="file" name="file">
            <button> Change</button>
        </form>
    </div>
</template>

<script setup  lang="ts">
import { useS3Object, ref } from "#imports"

const { createOrUpdate } = useS3Object()

const url = ref("https://www.google.tn/images/branding/googlelogo/1x/googlelogo_dark_color_272x92dp.png")

async function handleChange(files: FileList) {
    const { data } = await createOrUpdate(files, url.value, true)

    if (data.value) {
        url.value = data.value.url || data.value[0].url
    }
}
</script>