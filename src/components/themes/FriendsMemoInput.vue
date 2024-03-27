<template>
  <div class="p-2 bg-white rd fc gap-2 sticky top-0 shadow-xl z-99 dark:bg-gray-7 mb-2" ref="fcRef">
    <div class="fr items-center gap-2 text-lg text-gray-5">
      <div
        class="i-carbon:list hover:text-gray-9 cursor-pointer"
        title="有序列表"
        @click="appendValue('1. \n2. \n3. ')"
      ></div>
      <div
        class="i-carbon:menu hover:text-gray-9 cursor-pointer"
        title="无序列表"
        @click="appendValue('- \n- \n- ')"
      ></div>
      <div
        class="i-carbon:link hover:text-gray-9 cursor-pointer"
        title="链接"
        @click="appendValue('[描述](链接)')"
      ></div>
      <div
        class="i-carbon:image hover:text-gray-9 cursor-pointer"
        title="图片"
        @click="appendValue('![描述](链接)')"
      ></div>
      <div
        class="i-carbon:task hover:text-gray-9 cursor-pointer"
        title="待办"
        @click="appendValue('- [ ] \n- [ ] \n- [ ] \n')"
      ></div>
      <div
        class="i-carbon:data-table hover:text-gray-9 cursor-pointer"
        title="表格"
        @click="appendValue('|column1|column2|column3|\n|-|-|-|\n|content1|content2|content3|')"
      ></div>
      <div class="i-carbon:code hover:text-gray-9 cursor-pointer" title="代码" @click="appendValue('```\n\n```')"></div>
      <div
        class="i-carbon:not-available hover:text-gray-9 cursor-pointer"
        title="分割线"
        @click="appendValue('\n-------------------\n')"
      ></div>
      <div class="i-carbon:quotes hover:text-gray-9 cursor-pointer" title="引用" @click="appendValue('> ')"></div>
    </div>

    <n-mention
      type="textarea"
      placeholder="输入你要记录的吧,第一行以`#`开头的会被视为标签"
      show-count
      prefix="#"
      :options="tags"
      v-model:value="memoSaveParam.content"
      v-if="tags && tags.length > 0"
      @paste="paste"
      :autosize="{
        minRows: isFullscreen ? 20 : 5,
        maxRows: isFullscreen ? 30 : 20,
      }"
    />
    <n-input
      v-else
      type="textarea"
      placeholder="输入你要记录的吧,第一行以`#`开头的会被视为标签"
      show-count
      v-model:value="memoSaveParam.content"
      @paste="paste"
      :autosize="{
        minRows: isFullscreen ? 20 : 5,
        maxRows: isFullscreen ? 30 : 20,
      }"
    />
    <div class="fr gap-2 items-center">
      <n-select v-model:value="memoSaveParam.visibility" :options="visibilityOptions" class="w-32" size="small" />
      <n-upload :multiple="true" name="files" :show-file-list="false" :custom-request="customRequest" ref="uploadRef">
        <div
          class="i-carbon:cloud-upload cursor-pointer text-gray-500 hover:text-gray text-lg dark:text-yellow-3"
        ></div>
      </n-upload>
      <n-popover :show="emojiShow" @clickoutside="emojiShow = false">
        <template #trigger>
          <div
            class="i-carbon:face-wink cursor-pointer hover:text-yellow text-lg dark:text-yellow-3"
            @click="emojiShow = true"
          ></div>
        </template>
        <emoji-picker ref="pickerRef" @emoji-click="emojiClicked"></emoji-picker>
      </n-popover>
      <div
        class="i-carbon:maximize cursor-pointer text-gray-500 hover:text-gray text-sm dark:text-yellow-3"
        @click="toggle()"
        title="全屏编辑"
      ></div>
      <!-- <n-button @click="toggleDrauuBus.emit()" size="tiny" text> 随手画 </n-button> -->
      <n-switch
        v-model:value="memoSaveParam.enableComment"
        size="small"
        checked-value="1"
        unchecked-value="0"
        v-openComment
      >
        <template #checked> 允许评论 </template>
        <template #unchecked> 禁止评论 </template></n-switch
      >
      <div class="ml-auto gap-2 fr items-center">
        <n-button type="warning" class="px-8" @click="toggle()" v-if="isFullscreen"> 退出全屏 </n-button>
        <n-button type="error" class="px-8" @click="exitEdit()" v-if="edited"> 退出编辑 </n-button>
        <n-button type="primary" class="px-8" @click="saveMemo" :disabled="disbaled"> 记录 </n-button>
      </div>
    </div>

    <div class="fr" v-if="uploadFiles">
      <n-image-group>
        <n-space>
          <div class="relative" v-for="(img, index) in uploadFiles" :key="index">
            <n-image
              v-if="img.fileType.includes('image')"
              width="100"
              height="100"
              lazy
              class="rd hover:shadow-2xl"
              :src="img.url + (img.fileType.includes('webp') ? '' : img.suffix || '')"
              :fallback-src="img.url"
              :preview-src="img.url"
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
            <div v-else>
              {{ img.fileName }}
            </div>
            <div class="deleteBtn" @click="deleteResource(img.publicId)"></div>
            <div class="progress-bar" v-if="img.progress && img.progress > 0 && img.progress !== 100">
              <n-progress type="line" :percentage="img.progress" :indicator-placement="'inside'" processing />
            </div>
          </div>
        </n-space>
      </n-image-group>
    </div>

    <Drauu />

    <div
      class="markdown md-content"
      v-if="isFullscreen"
      v-html="memoSaveParam.content && marked.parse(memoSaveParam.content)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { getVisbilitys, type MemoSaveParam, type MemoDTO } from '@/types/memo'
import { type Tag } from '@/types/tag'
import { type MentionOption, type UploadCustomRequestOptions, type UploadInst } from 'naive-ui'
import 'emoji-picker-element'

const options = {
  prefix: 'mblog-',
}
marked.use(gfmHeadingId(options))
marked.use(mangle())
const tags = ref<Array<MentionOption>>()

let memoSaveParam: MemoSaveParam = reactive({
  visibility: 'PUBLIC',
  publicIds: [],
})

interface UploadItem {
  url: string
  publicId: string
  suffix: string
  storageType: string
  fileType: string
  fileName: string
  progress?: number
}

const disbaled = ref(false)
const fcRef = ref<HTMLElement | null>(null)

const { toggle, isFullscreen } = useFullscreen(fcRef as any)

const uploadRef = ref<UploadInst | null>(null)

let uploadFiles = ref<Array<UploadItem>>([])

const emojiShow = ref(false)

const visibilityOptions = getVisbilitys()

const edited = ref(false)

onKeyStroke(true, (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    saveMemo()
  }
})

onMounted(async () => {
  memoSaveParam.visibility = userinfo.value.defaultVisibility || 'PUBLIC'
  memoSaveParam.enableComment = userinfo.value.defaultEnableComment === 'true' ? '1' : '0'

  if (userinfo.value.token) {
    const { data, error } = await useMyFetch('/api/tag/list').post().json()
    if (error.value) return
    const tagList = data.value as Array<Tag>
    tags.value = tagList.map((r) => {
      return {
        label: r.name.substring(1),
        value: r.name.substring(1),
      }
    })
  }
})

const appendValue = (content: string) => {
  if (memoSaveParam.content) {
    memoSaveParam.content = memoSaveParam.content + '\n'
  } else {
    memoSaveParam.content = ''
  }
  memoSaveParam.content = memoSaveParam.content + content
  const textArea = document.querySelector('textarea') as HTMLTextAreaElement
  textArea.focus()
}

const paste = async (e: any) => {
  if (e.clipboardData.files && e.clipboardData.files.length > 0) {
    const files = e.clipboardData.files
    for (const file of files) {
      await customRequest({ file: { file } } as any)
    }
  }
}

const emojiClicked = async (event: { detail: any }) => {
  const textArea = document.querySelector('textarea') as HTMLTextAreaElement
  const emojiVal = event.detail.unicode
  if (textArea.selectionStart || textArea.selectionStart === 0) {
    var startPos = textArea.selectionStart
    var endPos = textArea.selectionEnd
    memoSaveParam.content =
      textArea.value.substring(0, startPos) + emojiVal + textArea.value.substring(endPos, textArea.value.length)
    await nextTick()
    textArea.focus()
    textArea.setSelectionRange(endPos + emojiVal.length, endPos + emojiVal.length)
  } else {
    memoSaveParam.content += ' ' + emojiVal + ' '
  }
  emojiShow.value = false
}

const saveMemo = async () => {
  const { message } = createDiscreteApi(['message'])

  const uploading = uploadFiles.value.filter((r) => r.progress && r.progress < 100)
  if (uploading.length > 0) {
    message.error('图片还没上传完.')
    return
  }
  disbaled.value = true
  window.setTimeout(() => {
    disbaled.value = false
  }, 3000)
  const url = memoSaveParam.id ? '/api/memo/update' : '/api/memo/save'
  memoSaveParam.enableComment = parseInt(memoSaveParam.enableComment as any)
  const { error } = await useMyFetch(url).post(memoSaveParam).json()
  if (!error.value) {
    if (isFullscreen.value) {
      toggle()
    }
    changedMemoBus.emit(memoSaveParam)
    exitEdit()
  }
}

editMemoBus.on((memo: MemoDTO) => {
  const content = memo.tags + memo.content
  memoSaveParam.id = memo.id
  memoSaveParam.content = content
  memoSaveParam.publicIds = memo.resources.map((r) => r.publicId)
  memoSaveParam.priority = memo.priority
  memoSaveParam.visibility = memo.visibility
  memoSaveParam.enableComment = memo.enableComment + ''
  uploadFiles.value = structuredClone(toRaw(memo.resources))
  edited.value = true
})

const exitEdit = () => {
  memoSaveParam.visibility = userinfo.value.defaultVisibility || 'PUBLIC'
  memoSaveParam.enableComment = userinfo.value.defaultEnableComment === 'true' ? '1' : '0'
  memoSaveParam.publicIds = []
  memoSaveParam.priority = 0
  memoSaveParam.deleteMemo = false
  memoSaveParam.content = ''
  memoSaveParam.id = undefined
  uploadFiles.value = []
  edited.value = false
}

const userinfo = useStorage('userinfo', { token: '', defaultVisibility: 'PUBLIC', defaultEnableComment: 'false' })

const upload = async (file: File, fileObj: UploadItem) => {
  const uploadUrl = `${import.meta.env.VITE_BASE_URL}/api/resource/upload`
  const result = (await uploadFilesWithProgress(uploadUrl, file, (loaded: number, total: number) => {
    const idx = uploadFiles.value.findIndex((r) => r.publicId === fileObj.publicId)
    if (idx >= 0) {
      const item = Object.assign({}, fileObj, {
        progress: parseInt(((loaded / total) * 100).toFixed(0)),
      })
      uploadFiles.value.splice(idx, 1, item)
    }
  })) as { status: number; body: string }
  if (result.status === 200) {
    const data = JSON.parse(result.body)
    memoSaveParam.publicIds?.push(data.data[0].publicId)
    uploadRef.value?.clear()
  }
}

const uploadFilesWithProgress = (url: string, file: File, onProgress: Function) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (e) => onProgress(e.loaded, e.total))
    xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }))
    xhr.addEventListener('error', () => reject(new Error('File upload failed')))
    xhr.addEventListener('abort', () => reject(new Error('File upload aborted')))
    xhr.open('POST', url, true)
    const formData = new FormData()
    formData.append('files', file)
    xhr.setRequestHeader('token', userinfo.value.token)
    xhr.send(formData)
  })

const getRandomNum = (Min: number, Max: number) => {
  var Range = Max - Min
  var Rand = Math.random()
  return Min + Math.round(Rand * Range)
}

const customRequest = async ({ file }: UploadCustomRequestOptions) => {
  const reader = new FileReader()
  const id = new Date().getTime() + '' + getRandomNum(10000, 200000)
  let fileObj = {
    url: '',
    fileType: 'image/png',
    progress: 0,
    publicId: id,
    suffix: '',
    storageType: '',
    fileName: '',
  }
  reader.onload = function (event) {
    fileObj.url = event.target?.result as string
    uploadFiles.value.push(fileObj as any)
  }
  reader.readAsDataURL(file.file as File)
  await upload(file.file as File, fileObj)
}

const deleteResource = (publicId: string) => {
  const idx = uploadFiles.value.findIndex((r) => r.publicId === publicId)
  if (idx >= 0) {
    uploadFiles.value.splice(idx, 1)
  }
  const idx2 = memoSaveParam.publicIds?.findIndex((r) => r === publicId)
  if (memoSaveParam.publicIds && idx2 != null && idx2 >= 0) {
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
  @apply i-carbon:close-filled text-red-700 hover:text-red-400 cursor-pointer absolute top-0 right--2 fw-500 z-99;
}

.progress-bar {
  @apply absolute bottom-2 left-1 w-9/10;
}
emoji-picker {
  width: 400px;
  height: 300px;
}
@media screen and (max-width: 640px) {
  emoji-picker {
    width: 100%;
    --num-columns: 6;
    --category-emoji-size: 1rem;
  }
}
</style>
