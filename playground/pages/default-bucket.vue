<template>
    <div>

        <h3>Create object</h3>
        <form @submit.prevent="(event) => createObject(event.target?.files.files)">
            <label for="input-upload">Choose a file </label>
            <input id="input-upload" name="files" type="file" accept="image/*" multiple>
            <button>Upload</button>
        </form>

        <hr>

        <h3>My objects</h3>
        <ul>
            <li v-for="object of data">
                <p>{{ object }}</p>

                <button @click="() => removeObject(object.key)">
                    Delete
                </button>

                <form @submit.prevent="(event) => updateObject(object.key, event.target?.file.files[0])">
                    <input type="file" name="file">
                    <button> Update</button>
                </form>

                <img :src="object.url" width="200">
            </li>
        </ul>

    </div>
</template>


<script setup lang="ts">
import { useS3Object } from "#imports"

const { listByBucket, create, remove, update } = useS3Object()

const { data, refresh } = await listByBucket()

async function removeObject(key: string) {
    const { error } = await remove(key)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}

async function createObject(files: FileList) {
    const { error } = await create(files)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}

async function updateObject(key: string, file: File) {
    const { error } = await update(key, file)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}
</script>
