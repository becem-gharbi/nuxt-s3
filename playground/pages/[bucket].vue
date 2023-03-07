<template>
    <div>
        <h2>{{ bucket }}</h2>

        <h3>Create object</h3>
        <form @submit.prevent="(event) => createObject(event.target?.files.files)">
            <label for="input-upload">Choose a file </label>
            <input id="input-upload" name="files" type="file" accept="image/*" multiple>
            <button>Upload</button>
        </form>

        <hr>

        <h3>My objects</h3>
        <ul>
            <li v-for="object of data?.Contents">
                <p>{{ object }}</p>

                <button @click="() => removeObject(object.Key!)">
                    Delete
                </button>

                <form @submit.prevent="(event) => updateObject(object.Key!, event.target?.file.files[0])">
                    <input type="file" name="file">
                    <button> Update</button>
                </form>

                <!-- Add random query params to override asset's caching-->
                <img :src="getUrl({ bucket, key: object.Key! }) + `?random=${Math.random()}`" width="200">
            </li>
        </ul>

    </div>
</template>


<script setup lang="ts">
import { useRoute, computed, useS3Object } from "#imports"

const route = useRoute()

const bucket = computed(() => route.params.bucket as string)

const { listByBucket, create, remove, getUrl, update } = useS3Object()

const { data, refresh } = await listByBucket(bucket.value)

async function removeObject(key: string) {
    const { error } = await remove({
        bucket: bucket.value,
        key: key
    })

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}

async function createObject(files: File[]) {
    const formData = new FormData()
    formData.append("bucket", bucket.value)

    for (let i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i])
    }

    const { error } = await create(formData)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}

async function updateObject(key: string, file: File) {
    const formData = new FormData()
    formData.append("bucket", bucket.value)
    formData.append("key", key)
    formData.append(file.name, file)

    const { error } = await update(formData)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}
</script>
