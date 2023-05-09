<template>
  <div class="fc gap-2">
    <memo-input />
    <div class="search">
      <n-space>
        <n-tag type="success" closable v-if="state.search.tag" @close="state.search.tag = undefined">
          {{ state.search.tag }}
        </n-tag>
        <n-tag type="warning" closable v-if="state.search.userId" @close="state.search.userId = undefined"
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
    <memo :memo="item" v-for="item in state.memos" :key="item.id" />
  </div>
</template>

<script setup lang="ts">
import { useMyFetch } from '@/api/fetch'
import type { ListMemoResponse, MemoDTO, MemoSearchParam } from '@/types/memo'
import { reloadMemosBus, searchMemosBus } from '@/event/event'
import dayjs from 'dayjs'

interface State {
  memos: Array<MemoDTO>
  search: MemoSearchParam
  total: number
}

const state: State = reactive({
  memos: [],
  search: {
    page: 1,
    size: 20,
    begin: dayjs().subtract(1, 'year').startOf('d').toDate(),
    end: dayjs().endOf('d').toDate(),
  },
  total: 0,
  page: 1,
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
  const { data } = await useMyFetch('/api/memo/list').post(state.search).json()
  const response = data.value as ListMemoResponse
  state.memos = response.items
}

searchMemosBus.on(async (params) => {
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
