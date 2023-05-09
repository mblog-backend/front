<template>
  <div class="p-2 bg-white rd fc gap-2">
    <n-input
      type="textarea"
      placeholder="输入你要记录的吧"
      show-count
      v-model:value="memoSaveParam.content"
      :autosize="{
        minRows: 3,
      }"
    />
    <div class="fr gap-2 items-center">
      <n-select v-model:value="memoSaveParam.visibility" :options="visibilityOptions" class="w-32" size="small" />
      <n-upload :multiple="true" name="files" :show-file-list="false" :custom-request="customRequest" ref="uploadRef">
        <div class="i-carbon:cloud-upload cursor-pointer text-gray-500 hover:text-gray text-lg"></div>
      </n-upload>
      <n-button type="primary" class="ml-auto px-8" @click="saveMemo"> 记录 </n-button>
    </div>

    <div class="fr" v-if="uploadFiles">
      <n-image-group>
        <n-space>
          <div class="relative" v-for="(img, index) in uploadFiles" :key="index">
            <n-image
              width="100"
              height="100"
              lazy
              :src="img.url"
              :intersection-observer-options="{
                root: '#image-scroll-container',
              }"
            >
              <template #placeholder>
                <div
                  style="
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #0001;
                  "
                >
                  Loading
                </div>
              </template>
            </n-image>
            <div class="deleteBtn" @click="deleteResource(img.publicId)"></div>
          </div>
        </n-space>
      </n-image-group>

      <!--  <div v-for="img in uploadFiles" :key="img.publicId" class="relative">
        
        
        <img :src="img.url" class="w-20 h-20 rd hover:shadow-2xl cursor-pointer" />
        <div class="deleteBtn" @click="deleteResource(img.publicId)"></div> 
      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { getVisbilitys, type MemoSaveParam, type MemoDTO } from '@/types/memo'
import { type UploadCustomRequestOptions, type UploadInst } from 'naive-ui'

let memoSaveParam: Partial<MemoSaveParam> = reactive({
  visibility: 'PUBLIC',
  publicIds: [],
})

interface UploadItem {
  url: string
  publicId: string
}

const uploadRef = ref<UploadInst | null>(null)

let uploadFiles = ref<Array<UploadItem>>([])

const visibilityOptions = getVisbilitys()

const saveMemo = async () => {
  const url = memoSaveParam.id ? '/api/memo/update' : '/api/memo/save'
  await useMyFetch(url).post(memoSaveParam).json()
  memoSaveParam.id = undefined
  memoSaveParam.content = ''
  memoSaveParam.publicIds = []
  memoSaveParam.visibility = 'PUBLIC'
  memoSaveParam.top = false
  uploadFiles.value = []
  saveMemoBus.emit()
}

editMemoBus.on((memo: MemoDTO) => {
  const content = memo.tags + memo.content
  memoSaveParam.id = memo.id
  memoSaveParam.content = content
  memoSaveParam.publicIds = memo.resources.map((r) => r.publicId)
  memoSaveParam.top = false
  uploadFiles.value = structuredClone(toRaw(memo.resources))
})

const customRequest = async ({ file }: UploadCustomRequestOptions) => {
  const uploadUrl = `${import.meta.env.VITE_BASE_URL}/api/resource/upload`
  const uploadHeaders = {
    token: useStorage('userinfo', { token: '' }).value.token,
  }
  const formData = new FormData()
  formData.append('files', file.file as File)

  const { data } = await useMyFetch(uploadUrl, {
    body: formData,
    headers: uploadHeaders,
  })
    .post()
    .json()
  uploadFiles.value.push(...data.value)
  memoSaveParam.publicIds = uploadFiles.value.map((r) => r.publicId)
  uploadRef.value?.clear()
}

const deleteResource = (publicId: string) => {
  const idx = uploadFiles.value.findIndex((r) => r.publicId === publicId)
  console.log(idx)
  if (idx >= 0) {
    uploadFiles.value.splice(idx, 1)
  }
  const idx2 = memoSaveParam.publicIds?.findIndex((r) => r === publicId)
  if (memoSaveParam.publicIds && idx2 && idx2 >= 0) {
    memoSaveParam.publicIds.splice(idx2, 1)
  }
}
</script>

<style scoped lang="scss">
::v-deep(.n-upload) {
  width: auto;
  display: flex;
}

.deleteBtn {
  @apply i-carbon:close-filled text-red-400 hover:text-red-700 cursor-pointer absolute top-2 right-2 fw-500;
}
</style>
