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
      :disabled="!enabelComment"
      size="small"
    />
    <div class="fr justify-end mt-2 gap-2">
      <template v-if="!userinfo.token">
        <div class="fr items-center">
          <div class="w-10 text-xs text-gray-5">昵称</div>
          <n-input placeholder="不填取`匿名`" size="small" v-model:value="username"></n-input>
        </div>
        <div class="fr items-center">
          <div class="w-10 text-xs text-gray-5">邮箱</div>
          <n-input placeholder="选填" size="small" v-model:value="email"></n-input>
        </div>
        <div class="fr items-center">
          <div class="w-10 text-xs text-gray-5">链接</div>
          <n-input placeholder="选填" size="small" v-model:value="link"> </n-input></div
      ></template>

      <n-button text attr-type="button" type="info" class="dark:text-white" v-if="!userinfo.token" @click="nav2Login"
        >去登陆</n-button
      >
      <n-button type="primary" @click="saveComment" :disabled="!enabelComment">{{ btnName }}</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MentionOption } from 'naive-ui'

const usernames: Ref<Array<MentionOption>> = ref([])
const content = ref('')
const username = ref('')
const email = ref('')
const link = ref('')
const placeholder = ref('请先登录,再发表评论')
const btnName = ref('发表评论')

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

const sessionStorage = useSessionStorage('config', {
  OPEN_COMMENT: false,
  ANONYMOUS_COMMENT: false,
})

const enabelComment = computed(() => {
  console.log(sessionStorage.value.OPEN_COMMENT, userinfo.value.token, sessionStorage.value.ANONYMOUS_COMMENT)
  if (sessionStorage.value.OPEN_COMMENT === false) {
    return false
  }
  if (userinfo.value.token) {
    return true
  }
  if (sessionStorage.value.ANONYMOUS_COMMENT === true) {
    return true
  }
  return false
})

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
      username: username.value || '匿名',
      link: link.value,
      email: email.value,
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
  } else {
    placeholder.value = '支持匿名评论,输入您的评论吧,文明发言,支持markdown'
    btnName.value = '匿名评论'
  }
})
</script>

<style scoped></style>
