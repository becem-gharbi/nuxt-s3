<template>
    <div>
        <h3>Create bucket</h3>
        <form @submit.prevent="(event) => createBucket(event.target?.bucketName.value)">
            <label for="bucket-name">Name</label>
            <input id="bucket-name" name="bucketName">
            <button>Create</button>
        </form>

        <hr>

        <h3>My buckets</h3>
        <ul>
            <li v-for="bucket of data?.Buckets">
                <p>{{ bucket }}</p>

                <button v-if="bucket.Name" @click="() => removeBucket(bucket.Name!)">
                    Delete
                </button>
            </li>
        </ul>

    </div>
</template>

<script setup lang="ts">
import { useS3Bucket } from "#imports"

const { list, create, remove } = useS3Bucket()

const { data, refresh } = await list()

async function createBucket(name: string) {
    const { error } = await create(name)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}

async function removeBucket(name: string) {
    const { error } = await remove(name)

    if (error.value) {
        alert(error.value.data?.message)
        return
    }

    refresh()
}
</script>