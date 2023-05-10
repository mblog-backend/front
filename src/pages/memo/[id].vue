<template>
  <Memo :memo="memoData" />
</template>

<script setup lang="ts">
import type { MemoDTO } from '@/types/memo'

const route = useRoute()

const memoData = ref<MemoDTO>({} as MemoDTO)

console.log(route.params)
onMounted(async () => {
  const { data, error } = await useMyFetch('/api/memo/' + route.params.id)
    .post()
    .json()
  if (error.value) return
  memoData.value = data.value
})
</script>

<style scoped></style>
