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

        <S3Image v-if="data?.Contents" :objectKey="data.Contents[0].Key!" :query="{ download: 1 }"></S3Image>
        <ul>
            <li v-for="object of data?.Contents">
                <!-- <p>{{ object.Key }}</p> -->
                <!-- <S3Image :objectKey="object.Key!" :query="{ download: 1 }"></S3Image> -->

                <!-- <button @click="() => removeObject(object.Key!)">
                    Delete
                </button>

                <form @submit.prevent="(event) => updateObject(object.Key!, event.target?.file.files[0])">
                    <input type="file" name="file">
                    <button> Update</button>
                </form> -->

                <!-- Add random query params to override asset's caching-->
                <!-- <img :src="getPublicUrl(object.Key!, { download: 1 })"> -->
            </li>
        </ul>

    </div>
</template>


<script setup lang="ts">
import { useS3Object, useS3Image } from "#imports"

const { create, update, remove, getPublicUrl } = useS3Image()

const { listByBucket } = useS3Object()

const { data, refresh } = await listByBucket()

async function removeObject(key: string) {
    const { error } = await remove(key)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}

async function uploadImage(files: File[]) {
    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i])
    }

    const { error } = await create(formData)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    await refresh()
}

async function updateObject(key: string, file: File) {
    const formData = new FormData()
    formData.append("key", key)
    formData.append(file.name, file)

    const { error } = await update(formData)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    await refresh()
}
</script>


<style scoped>
img {
    width: 50%;
    height: auto;
    aspect-ratio: 1280 / 720;
}
</style>