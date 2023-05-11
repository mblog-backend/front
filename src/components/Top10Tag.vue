<template>
  <div class="fc gap-2 bg-white rd pb-2 dark:bg-gray-7">
    <div class="bg-gray-300 text-white p-2 rd-t dark:bg-gray-9">Top10 Tags</div>
    <div
      class="text-sm text-gray cursor-pointer hover:text-blue px-2"
      v-for="tag in tagList"
      :key="tag.id"
      @click="searchByTag({ tag: tag.name })"
    >
      {{ tag.name }}({{ tag.count }})
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemoSearchParam } from '@/types/memo'
import type { Tag } from '@/types/tag'

const tagList = ref<Array<Tag>>([])

onMounted(async () => {
  await reload()
})

const searchByTag = (param: Partial<MemoSearchParam> | undefined) => {
  searchMemosBus.emit(param)
  closeDrawerBus.emit()
}

const reload = async () => {
  const { data, error } = await useMyFetch('/api/tag/top10').post().json()
  if (error.value) return
  tagList.value = data.value
}

changedMemoBus.on(reload)
</script>

<style scoped></style>
