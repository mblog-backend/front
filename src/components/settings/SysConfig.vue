<template>
  <div class="rd bg-white p-2 dark:bg-gray-7 text-4">
    <div class="mx-auto">
      <n-form ref="formRef" :label-width="140" :model="formValue" label-placement="left">
        <n-collapse :default-expanded-names="['base', 'functional']" :accordion="false">
          <n-collapse-item title="基础设置" name="base">
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
            <n-form-item label="缩略图大小">
              <n-input v-model:value="formValue.THUMBNAIL_SIZE" placeholder="缩略图大小,默认100x100" />
            </n-form-item>
            <n-form-item label="单个记录长度">
              <n-input v-model:value="formValue.MEMO_MAX_LENGTH" placeholder="默认高度300,超出自动折叠" />px
            </n-form-item>
          </n-collapse-item>

          <n-collapse-item title="功能设置" name="functional">
            <n-form-item label="用户模式">
              <n-radio-group v-model:value="formValue.USER_MODEL" name="radiobuttongroup1">
                <n-radio-button value="SINGLE" label="单用户" />
                <n-radio-button value="MULTIPLE" label="多用户" />
              </n-radio-group>
            </n-form-item>
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
            <n-form-item label="开放匿名评论">
              <n-radio-group v-model:value="formValue.ANONYMOUS_COMMENT" name="radiobuttongroup1">
                <n-radio-button value="true" label="开放" />
                <n-radio-button value="false" label="关闭" />
              </n-radio-group>
            </n-form-item>
            <n-form-item label="匿名评论是否审核">
              <n-radio-group v-model:value="formValue.COMMENT_APPROVED" name="radiobuttongroup1">
                <n-radio-button value="true" label="需要" />
                <n-radio-button value="false" label="不需要" />
              </n-radio-group>
            </n-form-item>
          </n-collapse-item>
          <n-collapse-item title="云存储设置" name="oss">
            <n-form-item label="存储设置">
              <n-radio-group v-model:value="formValue.STORAGE_TYPE" @update-value="changeStorage">
                <n-radio-button value="LOCAL" label="本地" />
                <n-radio-button value="QINIU" label="七牛云" />
                <n-radio-button value="AWSS3" label="AWS S3" />
              </n-radio-group>
            </n-form-item>

            <template v-if="formValue.STORAGE_TYPE !== 'LOCAL'">
              <n-form-item label="AccessKey">
                <n-input v-model:value="oss.accessKey" placeholder="AccessKey" />
              </n-form-item>
              <n-form-item label="SecretKey">
                <n-input v-model:value="oss.secretKey" placeholder="SecretKey" />
              </n-form-item>
              <n-form-item label="Bucket">
                <n-input v-model:value="oss.bucket" placeholder="Bucket" />
              </n-form-item>
              <n-form-item label="Region" v-if="formValue.STORAGE_TYPE == 'QINIU'">
                <n-select v-model:value="oss.region" :options="qiniuRegions" class="w-32" style="width: 250px" />
              </n-form-item>
              <n-form-item label="Region" v-else>
                <n-input v-model:value="oss.region" placeholder="Region" />
              </n-form-item>
              <n-form-item label="CDN域名">
                <n-input v-model:value="oss.domain" placeholder="CDN域名,不提供默认取cdn提供方提供的二级域名" />
              </n-form-item>
              <n-form-item label="文件夹前缀">
                <n-input v-model:value="oss.prefix" placeholder="文件夹前缀" />
              </n-form-item>
              <n-form-item label="图片后缀" v-if="formValue.STORAGE_TYPE !== 'AWSS3'">
                <n-input v-model:value="oss.suffix" placeholder="图片后缀" />
              </n-form-item>
            </template>
          </n-collapse-item>
          <n-collapse-item title="外观设置" name="appearance">
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
          </n-collapse-item>
          <n-collapse-item title="Webhook设置" name="webhook">
            <!-- <n-form-item label="推送到官方广场">
              <n-radio-group v-model:value="formValue.PUSH_OFFICIAL_SQUARE" name="radiobuttongroup1">
                <n-radio-button value="true" label="是" />
                <n-radio-button value="false" label="否" />
              </n-radio-group>
              <a href="https://square.coo.st" target="_blank" class="ml-4">square.coo.st</a>
            </n-form-item> -->
            <n-form-item label="Webhook地址:">
              <n-input
                v-model:value="formValue.WEB_HOOK_URL"
                placeholder="发送所有人可见的博文时自动通知到这个地址上"
              />
            </n-form-item>
            <n-form-item label="Webhook Token:">
              <n-input
                v-model:value="formValue.WEB_HOOK_TOKEN"
                readonly="readonly"
                placeholder="可空,安全起见,建议填写,发送webhook时会在请求头里的`token`字段里带上"
              />
            </n-form-item>
            <n-form-item label="例子">
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
                >curl -L &#x27;http://WEBHOOK_URL&#x27; -H &#x27;token: Webhook Token&#x27; -H &#x27;Content-Type:
                application/json&#x27; -d &#x27;{
                <span style="color: rgb(123, 151, 38); font-weight: 400">&quot;content:&quot;</span>
                内容<span style="color: rgb(123, 151, 38); font-weight: 400">&quot;, &quot;tags</span>
                <span style="color: rgb(123, 151, 38); font-weight: 400">&quot;:&quot;</span>标签
                <span style="color: rgb(123, 151, 38); font-weight: 400">&quot;,&quot;authorName</span>
                <span style="color: rgb(123, 151, 38); font-weight: 400">&quot;:&quot;</span>发送者名称
                <span style="color: rgb(123, 151, 38); font-weight: 400">&quot;,&quot;resources</span>
                <span style="color: rgb(123, 151, 38); font-weight: 400"></span>[资源列表]
                <span style="color: rgb(123, 151, 38); font-weight: 400">&quot;, &quot;created</span
                ><span style="color: rgb(123, 151, 38); font-weight: 400">&quot;:&quot;</span>发文时间<span
                  style="color: rgb(123, 151, 38); font-weight: 400"
                  >&quot; }&#x27;</span
                ></code
              >
            </n-form-item>
          </n-collapse-item>
        </n-collapse>

        <n-form-item>
          <n-space align="center" class="mt-10">
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
  oss.value = {}
  if (val === 'QINIU') {
    oss.value = JSON.parse(formValue.QINIU_PARAM as string)
  } else if (val === 'AWSS3') {
    oss.value = JSON.parse(formValue.AWSS3_PARAM as string)
  }
  oss.value.accessKey = oss.value.accessKey || ''
  oss.value.secretKey = oss.value.secretKey || ''
  oss.value.bucket = oss.value.bucket || ''
  oss.value.domain = oss.value.domain || ''
  oss.value.prefix = oss.value.prefix || ''
  oss.value.suffix = oss.value.suffix || ''
  oss.value.region = oss.value.region || ''
}

const qiniuRegions = [
  {
    label: '华东-浙江',
    value: 'huadong',
  },
  {
    label: '华东-浙江2',
    value: 'huadongZheJiang2',
  },
  {
    label: '华北-河北',
    value: 'huabei',
  },
  {
    label: '华南-广东',
    value: 'huanan',
  },
  {
    label: '北美-洛杉矶',
    value: 'beimei',
  },
  {
    label: '亚太-新加坡（原东南亚）',
    value: 'xinjiapo',
  },
]

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
  items.push({
    key: 'THUMBNAIL_SIZE',
    value: formValue.THUMBNAIL_SIZE,
  })
  items.push({
    key: 'ANONYMOUS_COMMENT',
    value: formValue.ANONYMOUS_COMMENT,
  })
  items.push({
    key: 'COMMENT_APPROVED',
    value: formValue.COMMENT_APPROVED,
  })
  items.push({
    key: 'WEB_HOOK_URL',
    value: formValue.WEB_HOOK_URL,
  })
  items.push({
    key: 'PUSH_OFFICIAL_SQUARE',
    value: formValue.PUSH_OFFICIAL_SQUARE,
  })

  const { error } = await useMyFetch('/api/sysConfig/save').post({ items }).json()
  if (!error.value) {
    const { message } = createDiscreteApi(['message'])
    message.success('保存系统配置成功!')
    setTimeout(() => {
      window.location.reload()
    }, 1500)
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
