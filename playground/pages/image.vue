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
                <S3Image :src="object.url" :query="{ r: Math.random() }"></S3Image>

                <button @click="() => removeImage(object.key)">
                    Delete
                </button>

                <form @submit.prevent="(event) => updateImage(object.key, event.target?.file.files[0])">
                    <input type="file" name="file">
                    <button> Update</button>
                </form>
            </li>
        </ul>

    </div>
</template>


<script setup lang="ts">
import { useS3Object } from "#imports"

const { create, update, remove } = useS3Object()

const { listByBucket } = useS3Object()

const { data, refresh } = await listByBucket()

async function removeImage(key: string) {
    const { error } = await remove(key, true)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    await refresh()
}

async function uploadImage(files: FileList) {
    const { error } = await create(files, true)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    await refresh()
}

async function updateImage(key: string, file: File) {
    const { error } = await update(key, file, true)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    await refresh()
}
</script>
