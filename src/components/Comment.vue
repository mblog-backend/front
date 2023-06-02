<template>
  <div class="bg-white rd dark:bg-gray-7 my-2">
    <div class="bg-slate-100 fr items-center rd-t p-2 text-gray-5 text-xs gap-2">
      <div class="">{{ dayjs(props.comment.created).format('YYYY-MM-DD HH:mm:ss') }}</div>
      <div class="cursor-pointer hover:text-gray-9">@{{ props.comment.userName }}</div>
      <div
        class="cursor-pointer hover:text-red-7 text-red-4"
        v-if="userinfo.role === 'ADMIN' && props.comment.approved === 0 && props.comment.userId < 0"
        @click="singleApproved"
      >
        未审核,点击审核通过
      </div>
      <div class="ml-auto fr gap-1 items-center">
        <div>#{{ props.index + 1 }}</div>
        <n-popconfirm
          :show-icon="false"
          v-if="userinfo.role === 'ADMIN'"
          @positive-click="removeComment(props.comment.id)"
          negative-text="取消"
          positive-text="确定"
        >
          <template #trigger>
            <div class="fr gap-1 items-center cursor-pointer hover:text-blue-600">
              <div class="i-carbon:trash-can"></div>
            </div>
          </template>
        </n-popconfirm>
      </div>
    </div>
    <div class="p-2 dark:text-white md-content" v-html="commentContent"></div>
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
const userinfo = useStorage('userinfo', { role: '' })

const commentContent = ref(marked.parse(props.comment.content))

const removeComment = async (id: number) => {
  const { error } = await useMyFetch('/api/comment/remove?id=' + id)
    .post()
    .json()
  if (!error.value) {
    const { message } = createDiscreteApi(['message'])
    message.success('删除评论成功')
    commetSavedBus.emit()
  }
}

onMounted(() => {
  if (props.comment.mentioned) {
    const users = props.comment.mentioned.split(',')
    users.forEach((user: string) => {
      // @ts-ignore
      const reg = new RegExp(`(@${user}?)\\s+`, 'g')
      commentContent.value = commentContent.value.replaceAll(reg, "<div class='mentioned'>$1</div>")
    })
  }
})

const singleApproved = async () => {
  const { error } = await useMyFetch('/api/comment/singleApprove?id=' + props.comment.id)
    .post()
    .json()
  if (!error.value) {
    window.location.reload()
  }
}
</script>

<style scoped lang="scss"></style>
