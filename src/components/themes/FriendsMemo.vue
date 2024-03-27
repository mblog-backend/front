<template>

  <div class="fr gap-4 p-4  text-sm border-x-0">
    <img src="https://images.kingwrcy.cn/memo/20240386211829TtcOUOMaXyITlTkxhSjp" class="w-9 h-9 rounded">
    <div class="fc gap-.5 flex-1">
      <div class="text-[#576b95] cursor-default font-bold">{{ props.memo.authorName }}</div>
      <div v-html="props.memo && props.memo.content && marked.parse(props.memo.content)" class="text-sm friend-md "
        ref="el">
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
              <div class="text-[#576b95] text-nowrap">{{ comment.userName }}</div>
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


// interface State {
//   memos: Array<MemoDTO>
//   search: MemoSearchParam
//   total: number
//   totalPage: number
// }

// const state: State = reactive({
//   memos: [],
//   search: {
//     page: 1,
//     size: 20,
//     begin: dayjs().subtract(20, 'year').startOf('d').toDate(),
//     end: dayjs().endOf('d').toDate(),
//   },
//   total: 0,
//   totalPage: 0,
// })
// let user = ref<Partial<User>>({})

// onMounted(async () => {
//   await reload()

//   const { data, error } = await useMyFetch('/api/user/current').post().json()
//   if (!error.value) {
//     user.value = data.value
//   }
// })



// const reload = async () => {
//   const { data, error } = await useMyFetch('/api/memo/list').post(state.search).json()
//   if (!error.value) {
//     const response = data.value as ListMemoResponse
//     if (state.search.page > 1) {
//       state.memos.push(...response.items)
//     } else {
//       state.memos = response.items
//     }
//     state.memos.forEach((memo) => {
//       memo.resources.forEach((item) => {
//         if (item.storageType === 'LOCAL' && item.url.startsWith('/')) {
//           item.url = import.meta.env.VITE_BASE_URL + item.url
//         }
//       })
//     })
//     state.total = response.total
//     state.totalPage = response.totalPage
//   }
// }

function countLines(target: HTMLElement) {
  var style = window.getComputedStyle(target, null);
  var height = parseInt(style.getPropertyValue("height"));
  var font_size = parseInt(style.getPropertyValue("font-size"));
  var line_height = parseInt(style.getPropertyValue("line-height"));
  var box_sizing = style.getPropertyValue("box-sizing");

  if (isNaN(line_height)) line_height = font_size * 1.2;

  if (box_sizing == 'border-box') {
    var padding_top = parseInt(style.getPropertyValue("padding-top"));
    var padding_bottom = parseInt(style.getPropertyValue("padding-bottom"));
    var border_top = parseInt(style.getPropertyValue("border-top-width"));
    var border_bottom = parseInt(style.getPropertyValue("border-bottom-width"));
    height = height - padding_top - padding_bottom - border_top - border_bottom
  }
  var lines = Math.ceil(height / line_height);
  return lines;
}
</script>

<style scoped>
.friend-md>p {
  margin: 0;
}
</style>