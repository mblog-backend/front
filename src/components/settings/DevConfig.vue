<template>
  <div class="fc gap-2 px-4">
    <div class="fr gap-2">
      <n-button type="info" v-if="!token.id" @click="enableToken">启用开发者Token</n-button>
      <n-button type="primary" v-if="token.id" @click="resetToken">重置Token</n-button>
      <n-button type="error" v-if="token.id" @click="disableToken">禁用开发者Token</n-button>
      <n-button type="info" v-if="token.id" @click="copyToken">一键复制Token</n-button>
    </div>

    <n-input
      v-if="token.id"
      type="textarea"
      :rows="3"
      :readonly="true"
      :resizable="false"
      v-model:value="token.token"
    ></n-input>

    <div>
      <h3>发表内容</h3>
      <div>可见性(visibility)如下,可空,不填写默认为`PUBLIC`,图片(publicIds)可以传多个,可空</div>
      <ul>
        <li>PRIVATE 只有自己可见</li>
        <li>PUBLIC 所有人可见</li>
        <li>PROTECT 登录用户可见</li>
      </ul>
      <div>
        <code
          id="htmlViewer"
          class="rd"
          style="
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            color: rgb(168, 161, 159);
            font-weight: 400;
            background-color: rgb(27, 25, 24);
            background: rgb(27, 25, 24);
            display: block;
            padding: 0.5em;
          "
          >curl -L &#x27;http://127.0.0.1:38321/api/memo/save&#x27; -H &#x27;token: 你的token&#x27; -H
          &#x27;Content-Type: application/json&#x27; -d &#x27;{
          <span style="color: rgb(123, 151, 38); font-weight: 400">&quot;content:&quot;</span>内容<span
            style="color: rgb(123, 151, 38); font-weight: 400"
            >&quot;, &quot;</span
          >visibility<span style="color: rgb(123, 151, 38); font-weight: 400">&quot;:&quot;</span>可见性<span
            style="color: rgb(123, 151, 38); font-weight: 400"
            >&quot;, &quot;</span
          >publicIds<span style="color: rgb(123, 151, 38); font-weight: 400">&quot;:[&quot;</span>图片id<span
            style="color: rgb(123, 151, 38); font-weight: 400"
            >&quot;] }&#x27;</span
          ></code
        >
      </div>
      <h3>上传图片</h3>
      <span>可以一次上传多个图片,返回图片ID,再调用`发表内容`接口传入</span>
      <div>
        <code
          id="htmlViewer"
          class="rd"
          style="
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            color: rgb(168, 161, 159);
            font-weight: 400;
            background-color: rgb(27, 25, 24);
            background: rgb(27, 25, 24);
            display: block;
            padding: 0.5em;
          "
          >curl -L
          <span style="color: rgb(123, 151, 38); font-weight: 400"
            >&#x27;http://127.0.0.1:38321/api/resource/upload&#x27;</span
          >
          -H <span style="color: rgb(123, 151, 38); font-weight: 400">&#x27;token: 你的token&#x27;</span> -F
          <span style="color: rgb(123, 151, 38); font-weight: 400"
            >&#x27;files=@&quot;图片文件路径&quot;&#x27;</span
          ></code
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types/token'

onMounted(async () => {
  await reload()
})

const token = ref<Partial<Token>>({})

const tokenStr = ref('')
const { copy } = useClipboard({ source: tokenStr })

const copyToken = () => {
  tokenStr.value = token.value.token!
  copy()
  const { message } = createDiscreteApi(['message'])
  message.success('复制token成功!')
}

const reload = async () => {
  const { data, error } = await useMyFetch('/api/token/').get().json()
  if (error.value) return
  if (data.value === null) {
    token.value = {}
  } else {
    token.value = data.value
  }
}

const enableToken = async () => {
  const { error } = await useMyFetch('/api/token/enable').post().json()
  if (error.value) return
  await reload()
}
const resetToken = async () => {
  const { error } = await useMyFetch('/api/token/reset?id=' + token.value.id)
    .post()
    .json()
  if (error.value) return
  await reload()
}
const disableToken = async () => {
  const { error } = await useMyFetch('/api/token/disable').post().json()
  if (error.value) return
  await reload()
}
</script>

<style scoped></style>
