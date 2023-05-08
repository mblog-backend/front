<template>
  <div class="memo">
    <div class="header">
      <div class="date">2023-05-08 17:56</div>
      <div class="author">@JerryWang</div>
    </div>
    <div class="content" v-text="props.memo.content"></div>
    <div class="tags">
      <div class="tag">#yoyo</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemoDTO } from '@/types/memo'
const props = defineProps<{
  memo: MemoDTO
  fold: boolean
}>()
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
    @apply fr gap-2 text-xs text-gray-500 pb-2 px-2;

    .tag {
      @apply cursor-pointer  px-2 hover:text-blue-5;
    }
  }
}
</style>
