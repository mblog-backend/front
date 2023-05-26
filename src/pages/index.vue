<template>
  <div class="fc" ref="middleRef">
    <memo-input v-if="userinfo.token" />
    <div class="search">
      <n-space>
        <n-tag type="success" closable v-if="state.search.tag" @close="state.search.tag = undefined">
          {{ state.search.tag }}
        </n-tag>
        <n-tag type="warning" closable v-if="state.search.username" @close="state.search.userId = undefined"
          >{{ state.search.username }}
        </n-tag>
        <n-tag type="info" closable v-if="state.search.visibility" @close="state.search.visibility = undefined">
          {{ getVisbilityDesc(state.search.visibility) }}
        </n-tag>
        <n-tag type="error" closable v-if="searchDayDesc" @close="clearSearchDate">
          {{ searchDayDesc }}
        </n-tag>
      </n-space>
    </div>
    <memo
      :memo="item"
      v-for="item in state.memos"
      :key="item.id"
      :id="item.id"
      :max-height="sessionStorage.MEMO_MAX_LENGTH"
    />

    <div v-cloak v-if="state.memos.length === 0 && state.search.page === 1" class="flex justify-center text-gray-700">
      暂无记录
    </div>
    <div
      class="flex items-center justify-center text-gray-500 text-sm cursor-pointer my-4 hover:text-blue-300 select-none"
      v-if="state.search.page < state.totalPage"
      @click="++state.search.page"
    >
      点击继续加载更多...
    </div>
  </div>

  <div class="fixed bottom-10% lt-md:hidden" :style="'left:' + (left + width + 20) + 'px'" v-if="y > 150">
    <div class="fc items-center cursor-pointer hover:text-gray-7 text-gray-400" @click="scroll2Top">
      <div class="i-carbon:upgrade text-xl" title="回到顶部"></div>
      <div class="text-xs">回到顶部</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyFetch } from '@/api/fetch'
import type { ListMemoResponse, MemoDTO, MemoSaveParam, MemoSearchParam } from '@/types/memo'
import { reloadMemosBus, searchMemosBus } from '@/event/event'
import dayjs from 'dayjs'

const middleRef = ref(null)
const { left, width } = useElementBounding(middleRef)
const { y } = useWindowScroll()
let timer = 0

const scroll2Top = () => {
  cancelAnimationFrame(timer)
  timer = requestAnimationFrame(function fn() {
    var oTop = document.body.scrollTop || document.documentElement.scrollTop
    if (oTop > 0) {
      document.body.scrollTop = document.documentElement.scrollTop = oTop - 100
      timer = requestAnimationFrame(fn)
    } else {
      cancelAnimationFrame(timer)
    }
  })
}

const userinfo = useStorage('userinfo', { token: '', userId: 0 })
const sessionStorage = useSessionStorage('config', {
  MEMO_MAX_LENGTH: 300,
  USER_MODEL: 'SINGLE',
})
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
  if (sessionStorage.value.USER_MODEL === 'SINGLE') {
    state.search.userId = userinfo.value.userId
  } else {
    await reload()
  }

  // style.width = '100px'
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
changedMemoBus.on(async (param: MemoSaveParam) => {
  if (param.id && param.id > 0) {
    const memo = state.memos.find((r) => r.id === param.id)
    if (memo) {
      if (param.deleteMemo) {
        const idx = state.memos.findIndex((r) => r.id === param.id)
        state.memos.splice(idx, 1)
      } else {
        Object.assign(memo, param)
      }
    }
  } else {
    await reload()
  }
})

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
