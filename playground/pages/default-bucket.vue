<template>
    <div>

        <h3>Create object</h3>
        <form @submit.prevent="(event) => uploadObject(event.target?.files.files)">
            <label for="input-upload">Choose a file </label>
            <input id="input-upload" name="files" type="file" accept="image/*" multiple>
            <button>Upload</button>
        </form>

        <hr>

        <h3>My objects</h3>
        <ul>
            <li v-for="object of data">
                <p>{{ object }}</p>

                <button @click="() => removeObject(object.url)">
                    Delete
                </button>

                <form @submit.prevent="(event) => uploadObject(event.target?.file.files, object.url)">
                    <input type="file" name="file">
                    <button> Update</button>
                </form>

                <img :src="object.url" width="200" />
            </li>
        </ul>

    </div>
</template>


<script setup lang="ts">
import { useS3Object } from "#imports"

const { listByBucket, upload, remove, getPublicUrl } = useS3Object()

const { data, refresh } = await listByBucket()

async function removeObject(url: string) {
    const publicUrl = getPublicUrl(url)

    const { error } = await remove({ url: publicUrl })

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}

async function uploadObject(files: File[], url?: string) {
    const { error } = await upload({ files, url })

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}
</script>
