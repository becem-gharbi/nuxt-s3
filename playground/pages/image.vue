<template>
    <div>
        <h3>Upload image</h3>
        <form @submit.prevent="(event) => uploadImage(event.target?.files.files)">
            <label for="input-upload">Choose a file </label>
            <input id="input-upload" name="files" type="file" accept="image/*" multiple>
            <button>Upload</button>
        </form>

        <hr>

        <h3>My images</h3>

        <ul>
            <li v-for="object of data">
                <p>{{ object.key }}</p>
                <S3Image :src="object.url"></S3Image>

                <button @click="() => removeImage(object.url)">
                    Delete
                </button>

                <form @submit.prevent="(event) => uploadImage(event.target?.file.files, object.url)">
                    <input type="file" name="file">
                    <button> Update</button>
                </form>
            </li>
        </ul>

    </div>
</template>


<script setup lang="ts">
import { useS3Object } from "#imports"

const { upload, remove, listByBucket } = useS3Object()

const { data, refresh } = await listByBucket()

async function removeImage(url: string) {
    const { error } = await remove({ url, image: true })

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    await refresh()
}

async function uploadImage(files: File[], url?: string) {
    const { error } = await upload({ files, image: true, url })

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    await refresh()
}
</script>
