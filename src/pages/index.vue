<template>
  <div class="fc gap-2">
    <!-- <memo-input /> -->
    <!-- <memo :memo="{ content: '哈哈' }" /> -->
  </div>
</template>

<script setup lang="ts">
import { createFetch } from '@vueuse/core'
const useMyFetch = createFetch({
  baseUrl: 'http://127.0.0.1:38321',
  options: {
    async beforeFetch({ options }) {
      // const myToken = await getMyToken()
      // options.headers.Authorization = `Bearer ${myToken}`

      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

onMounted(async () => {
  const { isFetching, error, data } = await useMyFetch('/api/memo/list').post().json()
  console.log(isFetching, error, data)
})
</script>

<style scoped></style>
