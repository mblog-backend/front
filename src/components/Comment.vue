<template>
  <div class="bg-white rd dark:bg-gray-7 my-2">
    <div class="bg-slate-100 fr items-center rd-t p-2 text-gray-5 text-xs gap-2">
      <div class="">{{ dayjs(props.comment.created).format('YYYY-MM-DD HH:mm:ss') }}</div>
      <div class="cursor-pointer hover:text-gray-9">@{{ props.comment.userName }}</div>
      <div class="ml-auto">
        <div>#{{ props.index + 1 }}</div>
      </div>
    </div>
    <div class="p-2 dark:text-white" v-html="marked.parse(props.comment.content)"></div>
  </div>
</template>

<script setup lang="ts">
import type { CommentDTO } from '@/types/comment'
import dayjs from 'dayjs'
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { gfmHeadingId } from 'marked-gfm-heading-id'
const options = {
  prefix: 'mblog-comment-',
}
marked.use(gfmHeadingId(options))
marked.use(mangle())

const props = defineProps<{
  comment: CommentDTO
  index: number
}>()
</script>

<style scoped></style>
