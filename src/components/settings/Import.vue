<template>
  <div>
    <n-upload :multiple="false" name="file" :show-file-list="false" :custom-request="customRequest" ref="uploadRef">
      <n-button>导入flomo</n-button>
    </n-upload>
  </div>
</template>

<script setup lang="ts">
import type { UploadCustomRequestOptions } from 'naive-ui'
const userinfo = useStorage('userinfo', { token: '' })

const customRequest = async ({ file }: UploadCustomRequestOptions) => {
  const uploadUrl = `${import.meta.env.VITE_BASE_URL}/api/import/flomo`
  const uploadHeaders = {
    token: userinfo.value.token,
  }
  const formData = new FormData()
  formData.append('file', file.file as File)

  const { data, error } = await useMyFetch(uploadUrl, {
    body: formData,
    headers: uploadHeaders,
  })
    .post()
    .json()
  if (!error.value) {
    console.log('upload result ', data)
  }
}
</script>

<style scoped></style>
