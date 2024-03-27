<route lang="yaml">
  meta:
    layout: friends
</route>
<template>
  <div class="max-w-[567px] fc bg-white rounded ">
    <div class="relative mb-8">
      <img class="w-full h-[250px]"
        src="https://images.unsplash.com/photo-1711299253442-de19d4dacaae?q=80&w=3500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="">
      <div class="absolute right-2 bottom-[-40px]">
        <div class="fc">
          <div class="fr items-center gap-4">
            <div class="text-lg font-bold text-white">{{ user.displayName }}</div>
            <img :src="user.avatarUrl" class="w-[70px] h-[70px] rounded-xl">
          </div>
          <div class=" text-gray truncate w-full text-end text-xs mt-2">我怎么信仰 就怎么生活</div>
        </div>
      </div>
    </div>

    <div class="fc divide-y-1 divide-coolGray/20 divide-solid ">
      <FriendsMemo :memo="memo" v-for="memo in state.memos" :key="memo.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyFetch } from '@/api/fetch';
import type { ListMemoResponse, MemoDTO, MemoSearchParam } from '@/types/memo';
import type { User } from '@/types/user';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { onMounted, reactive } from 'vue';
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { gfmHeadingId } from 'marked-gfm-heading-id'

dayjs.extend(relativeTime)

const userinfo = useStorage('userinfo', { token: '', userId: 0 })

const options = {
  prefix: 'mblog-',
}

marked.use(gfmHeadingId(options))
marked.use(mangle())

interface State {
  memos: Array<MemoDTO>
  search: MemoSearchParam
  total: number
  totalPage: number
}

const state: State = reactive({
  memos: [],
  search: {
    page: 1,
    size: 20,
    begin: dayjs().subtract(20, 'year').startOf('d').toDate(),
    end: dayjs().endOf('d').toDate(),
  },
  total: 0,
  totalPage: 0,
})
let user = ref<Partial<User>>({})

onMounted(async () => {
  await reload()

  const { data, error } = await useMyFetch('/api/user/current').post().json()
  if (!error.value) {
    user.value = data.value
  }
})



const reload = async () => {
  const { data, error } = await useMyFetch('/api/memo/list').post(state.search).json()
  if (!error.value) {
    const response = data.value as ListMemoResponse
    if (state.search.page > 1) {
      state.memos.push(...response.items)
    } else {
      state.memos = response.items
    }
    state.memos.forEach((memo) => {
      memo.resources.forEach((item) => {
        if (item.storageType === 'LOCAL' && item.url.startsWith('/')) {
          item.url = import.meta.env.VITE_BASE_URL + item.url
        }
      })
    })
    state.total = response.total
    state.totalPage = response.totalPage
  }
}

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