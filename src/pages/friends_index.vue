<template>
  <div class="max-w-[567px] fc bg-white rounded ">
   <div class="relative mb-8">
    <img class="w-full h-[250px]" src="https://images.unsplash.com/photo-1711299253442-de19d4dacaae?q=80&w=3500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="">
    <div class="absolute right-2 bottom-[-40px]">
       <div class="fc">
        <div class="fr items-center gap-4">
          <div class="text-lg font-bold text-white">{{user.displayName}}</div>
          <img :src="user.avatarUrl" class="w-[70px] h-[70px] rounded-xl">
        </div>
        <div class=" text-gray truncate w-full text-end text-xs mt-2">我怎么信仰 就怎么生活</div>
       </div>
    </div>
   </div>

   <div class="fr gap-2 p-4  text-sm " v-for="memo in state.memos" :key="memo.id">
    <img :src="user.avatarUrl" class="w-9 h-9 rounded">
    <div class="fc gap-.5">
      <div class="text-[#576b95] cursor-defaultfont-bold">{{ memo.authorName }}</div>
      <div v-html="marked.parse(memo.content)" class="text-sm friend-md line-clamp-4">
      </div>
      <div class="text-gray text-xs">{{ dayjs(memo.created).format('YYYY-MM-DD HH:mm:ss') }}</div>
      <div class="text-[#576b95] cursor-pointer">全文</div>
    </div>
   </div>
  </div>
</template>

<script setup lang="ts">
import { useMyFetch } from '@/api/fetch';
import type { ListMemoResponse, MemoDTO, MemoSearchParam } from '@/types/memo';
import type { User } from '@/types/user';
import dayjs from 'dayjs';
import { onMounted, reactive } from 'vue';
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { gfmHeadingId } from 'marked-gfm-heading-id'
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
</script>

<style scoped>
.friend-md>p{
  margin:0;
}
</style>