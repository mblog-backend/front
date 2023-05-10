<template>
  <div class="fc gap-2 bg-white rd pb-2">
    <div class="bg-gray-300 text-white p-2 rd-t">Top10 Tags</div>
    <div
      class="text-sm text-gray cursor-pointer hover:text-blue px-2"
      v-for="tag in tagList"
      :key="tag.id"
      @click="searchMemosBus.emit({ tag: tag.name })"
    >
      {{ tag.name }}({{ tag.count }})
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '@/types/tag'

const tagList = ref<Array<Tag>>([])

onMounted(async () => {
  await reload()
})

const reload = async () => {
  const { data, error } = await useMyFetch('/api/tag/top10').post().json()
  if (error.value) return
  tagList.value = data.value
}
</script>

<style scoped></style>
