<template>

  <div class="fr gap-4 p-4 border-x-0">
    <img src="https://images.kingwrcy.cn/memo/20240386211829TtcOUOMaXyITlTkxhSjp" class="w-9 h-9 rounded">
    <div class="fc gap-.5 flex-1">
      <div class="text-[#576b95] cursor-default font-bold">{{ props.memo.authorName }}</div>
      <div v-html="props.memo && props.memo.content && marked.parse(props.memo.content)" class="text-sm friend-md"
        ref="el">
      </div>
      <div class="">

        <n-image-group>
          <n-space>
            <n-image v-for="(img, index) in imgs" class="rd hover:shadow-2xl" :key="index" :width="thumbnailWidth"
              :height="thumbnailHeight" lazy object-fit="cover"
              :src="img.url + (img.fileType.includes('webp') ? '' : img.suffix || '')" :fallback-src="img.url"
              :preview-src="img.url" :intersection-observer-options="{
        root: '#image-scroll-container',
      }">
              <template #placeholder>
                <div style="
                  width: 100px;
                  height: 100px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #0001;
                ">
                  加载中...
                </div>
              </template>
            </n-image>
          </n-space>
        </n-image-group>


      </div>
      <div class="text-[#576b95] cursor-pointer" v-if="hh > 96 && !showAll" @click="showMore">全文</div>
      <div class="text-[#576b95] cursor-pointer " v-if="showAll" @click="showLess">收起</div>
      <div class="relative fr justify-between">
        <div class="flex-1 text-gray text-xs">{{ dayjs(props.memo.created).locale('zh-cn').fromNow().replaceAll(/\s+/g,
        '') }}</div>
        <div @click="showToolbar = !showToolbar"
          class=" px-2 py-1 bg-[#f7f7f7] hover:bg-[#dedede] cursor-pointer rounded flex items-center justify-center">
          <img src="/img/dian.svg" class="w-3 h-3" />
        </div>
        <div class="text-xs absolute top-[-8px] right-[30px] bg-[#4c4c4c] rounded text-white p-2" v-if="showToolbar"
          ref="toolbarRef">
          <div class="fr gap-2">
            <div class="fr gap-2 cursor-pointer">
              <img src="/img/zan.svg" />
              <div>赞</div>
            </div>
            <div class="fr gap-2 cursor-pointer"
              @click="showCommentInput = !showCommentInput; showUserCommentArray = []; showToolbar = false">
              <img src="/img/comment.svg" />
              <div>评论</div>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded bottom-shadow bg-[#f7f7f7] dark:bg-[#262626] fc gap-1  ">
        <template v-if="commentResp.list && commentResp.list.length > 0">
          <div class="p-4">
            <div class="fc gap-2 text-sm" v-for="(comment, index) in commentResp.list" :key="comment.id">
              <div class="fr">
                <div class="text-[#576b95] ws-nowrap">{{ comment.userName }}</div>
                <div class="mx-1">:</div>
                <div class="break-all cursor-pointer" @click="toggleUserComment(index)">{{
        comment.content }}</div>
              </div>
              <FriendsCommentInput :memoId="props.memo.id" :commentId="comment.id" :reply="comment.userName"
                v-if="showUserCommentArray[index]" />
            </div>
          </div>
        </template>

        <FriendsCommentInput :memoId="props.memo.id" v-if="showCommentInput" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemoDTO } from '@/types/memo';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import type { QueryCommentResponse } from '@/types/comment';

dayjs.extend(relativeTime)


const options = {
  prefix: 'mblog-',
}

marked.use(gfmHeadingId(options))
marked.use(mangle())

const props = withDefaults(
  defineProps<{
    memo: MemoDTO
  }>(),
  {
  }
)
const commentResp: Ref<QueryCommentResponse> = ref({} as QueryCommentResponse)

const showAll = ref(false)
const showToolbar = ref(false)
const showCommentInput = ref(false)
const toolbarRef = ref(null)
const showUserCommentArray = ref<Array<boolean>>([])
const el = ref<any>(null)
let hh = ref(0)
const { height } = useElementSize(el)

const toggleUserComment = (index: number) => {
  const current = showUserCommentArray.value[index]
  showUserCommentArray.value = []
  showUserCommentArray.value[index] = !current
}

onClickOutside(toolbarRef, () => showToolbar.value = false)

const showMore = () => {
  showAll.value = true
  el.value.classList.remove('line-clamp-4')
}
const showLess = () => {
  showAll.value = false
  el.value.classList.add('line-clamp-4')
}
const sessionStorage = useSessionStorage('config', {
  THUMBNAIL_SIZE: '100,100',
})
const thumbnailWidth = computed(() => {
  return sessionStorage.value.THUMBNAIL_SIZE.split(',')[0]
})
const thumbnailHeight = computed(() => {
  return sessionStorage.value.THUMBNAIL_SIZE.split(',')[1]
})

const imgs = computed(() => {
  return props.memo.resources?.filter((r) => r.fileType.includes('image'))
})


watchOnce(height, () => {
  hh.value = height.value
  if (height.value > 96) {
    el.value.classList.add('line-clamp-4')
  }
})

const loadComments = async () => {
  const { data, error } = await useMyFetch('/api/comment/query')
    .post({
      page: 1,
      size: 100,
      memoId: props.memo.id,
    })
    .json()
  if (error.value) return
  commentResp.value = data.value
  showUserCommentArray.value = commentResp.value.list.map(() => { return false })
}

onMounted(async () => {
  await loadComments()
})
</script>

<style scoped>
.friend-md>p {
  margin: 0;
}
</style>