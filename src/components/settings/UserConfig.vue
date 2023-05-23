<template>
  <div class="rd bg-white p-2 dark:bg-gray-7">
    <div class="mx-auto">
      <n-form ref="formRef" :label-width="100" :model="formValue" label-placement="left">
        <n-form-item label="头像">
          <n-upload :custom-request="customRequest" ref="uploadRef" :show-file-list="false">
            <n-avatar :size="48" :src="formValue.avatarUrl" class="cursor-pointer" />
          </n-upload>
        </n-form-item>
        <n-form-item label="昵称">
          <n-input v-model:value="formValue.displayName" placeholder="输入昵称" />
        </n-form-item>
        <n-form-item label="密码">
          <n-input
            type="password"
            v-model:value="formValue.password"
            placeholder="留空就是不修改密码"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </n-form-item>
        <n-form-item label="邮箱">
          <n-input v-model:value="formValue.email" placeholder="输入邮箱" />
        </n-form-item>
        <n-form-item label="个人介绍">
          <n-input v-model:value="formValue.bio" placeholder="输入个人介绍" type="textarea" :rows="5" />
        </n-form-item>
        <n-form-item label="默认可见性" path="state.visibility">
          <n-select
            v-model:value="formValue.defaultVisibility"
            :options="getVisbilitys()"
            class="w-50"
            clearable
            placeholder="选择可见性"
          />
        </n-form-item>
        <n-form-item>
          <n-space align="center">
            <n-button attr-type="button" type="primary" @click="saveConfig"> 保存配置 </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import type { UploadCustomRequestOptions, UploadInst } from 'naive-ui'

const userinfo = useStorage('userinfo', { token: '', defaultVisibility: 'PUBLIC' })
const formValue = ref<Partial<User> & { password?: string }>({})

const reload = async () => {
  const { data, error } = await useMyFetch('/api/user/current').post().json()
  if (error.value) return
  formValue.value = data.value
}

const saveConfig = async () => {
  const { error } = await useMyFetch('/api/user/update').post(formValue).json()
  if (!error.value) {
    const { message } = createDiscreteApi(['message'])
    message.success('保存用户配置成功!')
    userinfo.value.defaultVisibility = formValue.value.defaultVisibility || 'PUBLIC'
    await reload()
  }
}
const uploadRef = ref<UploadInst | null>(null)

const customRequest = async ({ file }: UploadCustomRequestOptions) => {
  const uploadUrl = `${import.meta.env.VITE_BASE_URL}/api/resource/upload`
  const uploadHeaders = {
    token: userinfo.value.token,
  }
  const formData = new FormData()
  formData.append('files', file.file as File)

  const { data, error } = await useMyFetch(uploadUrl, {
    body: formData,
    headers: uploadHeaders,
  })
    .post()
    .json()
  if (!error.value) {
    let url = data.value[0].url
    if (data.value[0].storageType === 'LOCAL') {
      url = import.meta.env.VITE_BASE_URL + url
    }
    formValue.value.avatarUrl = url + (data.value[0].suffix || '')
    uploadRef.value?.clear()
  }
}

onMounted(async () => {
  await reload()
})
</script>

<style scoped></style>
<route lang="yaml">
meta:
  layout: manage
</route>
