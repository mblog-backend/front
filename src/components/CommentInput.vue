<template>
  <div class="p-2 bg-white dark:bg-gray-7 rd">
    <div class="text-xs my-2 dark:text-white text-gray">发表评论</div>
    <n-mention
      :autosize="{
        minRows: 4,
      }"
      :options="usernames"
      :placeholder="placeholder"
      type="textarea"
      v-model:value="content"
      :disabled="!userinfo.token"
      size="small"
    />
    <div class="fr justify-end mt-2 gap-2">
      <n-button text attr-type="button" type="info" class="dark:text-white" v-if="!userinfo.token" @click="nav2Login"
        >去登陆</n-button
      >
      <n-button type="primary" @click="saveComment" :disabled="!userinfo.token">发表评论</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MentionOption } from 'naive-ui'

const usernames: Ref<Array<MentionOption>> = ref([])
const content = ref('')
const placeholder = ref('请先登录,再发表评论')

const props = defineProps<{ memoId: number }>()
const userinfo = useStorage('userinfo', { token: '' })
const router = useRouter()

const nav2Login = () => {
  router.push('/login?redirect=/memo/' + props.memoId)
}

const getUsernames = async () => {
  const { data, error } = await useMyFetch('/api/user/listNames').post().json()
  if (error.value) return
  usernames.value = (data.value as any as Array<string>).map((r) => {
    return {
      label: r,
      value: r,
    }
  })
}

const saveComment = async () => {
  if (!content.value) {
    const { message } = createDiscreteApi(['message'])
    message.warning('先填写评论')
    return
  }
  const { error } = await useMyFetch('/api/comment/add')
    .post({
      content: content.value,
      memoId: props.memoId,
    })
    .json()
  if (error.value) return
  content.value = ''
  commetSavedBus.emit()
}

onMounted(async () => {
  if (userinfo.value.token) {
    placeholder.value = '输入您的评论吧,文明发言,支持markdown'
    await getUsernames()
  }
})
</script>

<style scoped></style>
