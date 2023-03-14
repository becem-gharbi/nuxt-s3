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
            <li v-for="object of data?.Contents">
                <p>{{ object.Key }}</p>
                <S3Image :objectKey="object.Key!"></S3Image>

                <button @click="() => removeImage(object.Key!)">
                    Delete
                </button>

                <form @submit.prevent="(event) => updateImage(object.Key!, event.target?.file.files[0])">
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

    refresh()
}

async function uploadImage(files: File[]) {
    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i])
    }

    const { error, data } = await create(formData, true)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    console.log(data.value)

    refresh()
}

async function updateImage(key: string, file: File) {
    const formData = new FormData()
    formData.append("key", key)
    formData.append(file.name, file)

    const { error } = await update(formData, true)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}
</script>
