<template>
  <div class="fc">
    <div class="search">
      <n-space>
        <n-tag type="success" closable v-if="state.search.tag" @close="state.search.tag = undefined">
          {{ state.search.tag }}
        </n-tag>
        <n-tag type="info" closable v-if="state.search.visibility" @close="state.search.visibility = undefined">
          {{ getVisbilityDesc(state.search.visibility) }}
        </n-tag>
        <n-tag type="error" closable v-if="searchDayDesc" @close="clearSearchDate">
          {{ searchDayDesc }}
        </n-tag>
      </n-space>
    </div>
    <memo :memo="item" v-for="item in state.memos" :key="item.id" :id="item.id" />

    <div v-cloak v-if="state.memos.length === 0 && state.search.page === 1" class="flex justify-center text-gray-700">
      暂无记录
    </div>
    <div
      class="flex items-center justify-center text-gray-500 text-sm cursor-pointer my-4 hover:text-blue-300"
      v-if="state.search.page < state.totalPage"
      @click="++state.search.page"
    >
      点击继续加载更多...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyFetch } from '@/api/fetch'
import type { ListMemoResponse, MemoDTO, MemoSearchParam } from '@/types/memo'
import { reloadMemosBus, searchMemosBus } from '@/event/event'
import dayjs from 'dayjs'

const props = defineProps<{
  liked?: boolean
  commented?: boolean
  mentioned?: boolean
}>()

const userinfo = useStorage('userinfo', { token: '', userId: 0 })

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
    userId: props.liked || props.commented ? 0 : userinfo.value.userId,
    liked: props.liked,
    commented: props.commented,
    mentioned: props.mentioned,
  },
  total: 0,
  totalPage: 0,
})

watch(
  () => state.search,
  async () => {
    await reload()
  },
  {
    deep: true,
  }
)

onMounted(async () => {
  await reload()
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

searchMemosBus.on(async (params) => {
  params.page = 1
  state.search = Object.assign(state.search, params)
})

reloadMemosBus.on(reload)
changedMemoBus.on(reload)

const clearSearchDate = () => {
  state.search.begin = undefined
  state.search.end = undefined
}

const searchDayDesc = computed(() => {
  if (state.search.begin && state.search.end) {
    if (dayjs(state.search.begin).isSame(state.search.end, 'D')) {
      return dayjs(state.search.begin).format('YYYY-MM-DD')
    }
  }
  return ''
})
</script>

<style scoped></style>
