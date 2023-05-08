<template>
  <div class="fc gap-2">
    <memo-input />
    <div class="search">
      <n-space>
        <n-tag type="success" closable v-if="state.search.tag" @close="state.search.tag = undefined">
          {{ state.search.tag }}
        </n-tag>
        <n-tag type="warning" closable v-if="state.search.userId" @close="state.search.userId = undefined"
          >{{ state.search.userId }}
        </n-tag>
        <n-tag type="info" closable v-if="state.search.visibility" @close="state.search.visibility = undefined">
          {{ state.search.visibility }}
        </n-tag>
      </n-space>
    </div>
    <memo :memo="item" v-for="item in state.memos" :key="item.id" />
  </div>
</template>

<script setup lang="ts">
import { useMyFetch } from '@/api/fetch'
import type { ListMemoResponse, MemoDTO, MemoSearchParam } from '@/types/memo'
import { searchMemosBus } from '@/event/event'

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
</script>

<style scoped></style>
