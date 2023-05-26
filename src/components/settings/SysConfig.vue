<template>
  <div class="rd bg-white p-2 dark:bg-gray-7">
    <div class="mx-auto">
      <n-form ref="formRef" :label-width="120" :model="formValue" label-placement="left">
        <n-form-item label="网站标题">
          <n-input v-model:value="formValue.WEBSITE_TITLE" placeholder="输入网站标题" />
        </n-form-item>
        <n-form-item label="安全域名">
          <n-input v-model:value="formValue.CORS_DOMAIN_LIST" placeholder="输入安全域名" />
        </n-form-item>
        <n-form-item label="服务端域名">
          <n-input v-model:value="formValue.DOMAIN" placeholder="输入服务端域名" />
        </n-form-item>
        <n-form-item label="首页宽度">
          <n-input v-model:value="formValue.INDEX_WIDTH" placeholder="首页宽度,默认50REM" />
        </n-form-item>
        <n-form-item label="单个记录长度">
          <n-input v-model:value="formValue.MEMO_MAX_LENGTH" placeholder="默认高度300,超出自动折叠" />px
        </n-form-item>
        <n-form-item label="用户模式">
          <n-radio-group v-model:value="formValue.USER_MODEL" name="radiobuttongroup1">
            <n-radio-button value="SINGLE" label="单用户" />
            <n-radio-button value="MULTIPLE" label="多用户" />
          </n-radio-group>
        </n-form-item>
        <template v-if="formValue.USER_MODEL === 'MULTIPLE'">
          <n-form-item label="开放注册">
            <n-radio-group v-model:value="formValue.OPEN_REGISTER" name="radiobuttongroup1">
              <n-radio-button value="true" label="开放" />
              <n-radio-button value="false" label="关闭" />
            </n-radio-group>
          </n-form-item>
          <n-form-item label="开放评论">
            <n-radio-group v-model:value="formValue.OPEN_COMMENT" name="radiobuttongroup1">
              <n-radio-button value="true" label="开放" />
              <n-radio-button value="false" label="关闭" />
            </n-radio-group>
          </n-form-item>
          <n-form-item label="开放点赞">
            <n-radio-group v-model:value="formValue.OPEN_LIKE" name="radiobuttongroup1">
              <n-radio-button value="true" label="开放" />
              <n-radio-button value="false" label="关闭" />
            </n-radio-group>
          </n-form-item>
        </template>
        <n-form-item label="存储设置">
          <n-radio-group v-model:value="formValue.STORAGE_TYPE" name="radiobuttongroup1" @update-value="changeStorage">
            <n-radio-button value="LOCAL" label="本地" />
            <n-radio-button value="QINIU" label="七牛云" />
          </n-radio-group>
        </n-form-item>

        <template v-if="formValue.STORAGE_TYPE === 'QINIU'">
          <n-form-item label="AccessKey">
            <n-input v-model:value="oss.accessKey" placeholder="AccessKey" />
          </n-form-item>
          <n-form-item label="SecretKey">
            <n-input v-model:value="oss.secretKey" placeholder="SecretKey" />
          </n-form-item>
          <n-form-item label="Bucket">
            <n-input v-model:value="oss.bucket" placeholder="Bucket" />
          </n-form-item>
          <n-form-item label="CDN域名">
            <n-input v-model:value="oss.domain" placeholder="CDN域名" />
          </n-form-item>
          <n-form-item label="文件夹前缀">
            <n-input v-model:value="oss.prefix" placeholder="文件夹前缀" />
          </n-form-item>
          <n-form-item label="图片后缀">
            <n-input v-model:value="oss.suffix" placeholder="图片后缀" />
          </n-form-item>
        </template>
        <n-form-item label="自定义CSS">
          <n-input v-model:value="formValue.CUSTOM_CSS" placeholder="输入自定义CSS" type="textarea" :rows="5" />
        </n-form-item>
        <n-form-item label="自定义Script">
          <n-input
            v-model:value="formValue.CUSTOM_JAVASCRIPT"
            placeholder="输入自定义Script"
            type="textarea"
            :rows="5"
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
import type { SysConfig, OssStorage } from '@/types/config'

const formValue: Partial<SysConfig> = reactive({})

let oss = ref<Partial<OssStorage>>({})

const changeStorage = (val: string) => {
  if (val === 'QINIU') {
    oss.value = JSON.parse(formValue.QINIU_PARAM as string)
  }
}

// const sessionStorage = useSessionStorage('config', {
//   OPEN_REGISTER: false,
//   WEBSITE_TITLE: 'MBlog',
//   OPEN_COMMENT: false,
//   OPEN_LIKE: false,
//   MEMO_MAX_LENGTH: 300,
//   INDEX_WIDTH: '50rem',
//   USER_MODEL: 'SINGLE',
// })

const reload = async () => {
  const { data, error } = await useMyFetch('/api/sysConfig/get').get().json()
  if (error.value) return
  const config = data.value as Array<{ key: string; value: string }>
  config.forEach(({ key, value }) => {
    formValue[key] = value
  })
  changeStorage(formValue.STORAGE_TYPE!!)
}

const saveConfig = async () => {
  const items = []

  items.push({
    key: 'STORAGE_TYPE',
    value: formValue.STORAGE_TYPE,
  })
  items.push({
    key: 'CORS_DOMAIN_LIST',
    value: formValue.CORS_DOMAIN_LIST,
  })
  items.push({
    key: 'DOMAIN',
    value: formValue.DOMAIN,
  })
  items.push({
    key: 'WEBSITE_TITLE',
    value: formValue.WEBSITE_TITLE,
  })

  if (formValue.USER_MODEL === 'MULTIPLE') {
    items.push({
      key: 'OPEN_REGISTER',
      value: formValue.OPEN_REGISTER,
    })
    items.push({
      key: 'OPEN_COMMENT',
      value: formValue.OPEN_COMMENT,
    })
    items.push({
      key: 'OPEN_LIKE',
      value: formValue.OPEN_LIKE,
    })
  }
  items.push({
    key: 'USER_MODEL',
    value: formValue.USER_MODEL,
  })
  items.push({
    key: 'MEMO_MAX_LENGTH',
    value: formValue.MEMO_MAX_LENGTH,
  })
  items.push({
    key: 'INDEX_WIDTH',
    value: formValue.INDEX_WIDTH,
  })
  if (formValue.STORAGE_TYPE !== 'LOCAL') {
    items.push({
      key: `${formValue.STORAGE_TYPE}_PARAM`,
      value: JSON.stringify(oss.value),
    })
  }
  items.push({
    key: 'CUSTOM_CSS',
    value: formValue.CUSTOM_CSS,
  })
  items.push({
    key: 'CUSTOM_JAVASCRIPT',
    value: formValue.CUSTOM_JAVASCRIPT,
  })

  const { error } = await useMyFetch('/api/sysConfig/save').post({ items }).json()
  if (!error.value) {
    const { message } = createDiscreteApi(['message'])
    message.success('保存系统配置成功!')
    window.location.reload()
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
