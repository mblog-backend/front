<template>
  <div class="memo">
    <div class="header">
      <div class="date">2023-05-08 17:56</div>
      <div class="author">{{ props.memo.authorName }}</div>
      <div class="author" @click="searchMemosBus.emit({ visibility: props.memo.visibility })">
        {{ getVisbilityDesc(props.memo.visibility) }}
      </div>
    </div>
    <div class="content" v-text="props.memo.content"></div>
    <div class="tags">
      <div class="tag" v-for="tag in tags" :key="tag" @click="searchMemosBus.emit({ tag: tag })">{{ tag }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type MemoDTO, getVisbilityDesc } from '@/types/memo'
import { searchMemosBus } from '@/event/event'
const props = defineProps<{
  memo: MemoDTO
}>()

const tags = computed(() => {
  return props.memo.tags?.split(',')
})
</script>

<style scoped lang="scss">
.memo {
  @apply fc bg-white rd;

  .header {
    @apply bg-gray-50 fr gap-2 text-xs py-2 px-4 text-gray-500;
  }

  .content {
    @apply py-2 px-4;
  }

  .tags {
    @apply fr gap-2 text-xs text-gray-500 pb-2 px-2 items-center;

    .tag {
      @apply cursor-pointer   hover:text-blue-5;
    }
  }
}
</style>
