<template>
  <div class="rd bg-white dark:bg-gray-7 p-2">
    <n-form ref="formRef" :label-width="80" :model="state" label-placement="left" size="small" class="p-2">
      <n-form-item label="标签" path="state.tag">
        <n-select
          v-model:value="state.tag"
          :options="tags"
          class="w-50"
          clearable
          label-field="name"
          value-field="name"
          placeholder="选择标签"
        />
      </n-form-item>
      <n-form-item label="可见性" path="state.visibility">
        <n-select
          v-model:value="state.visibility"
          :options="getVisbilitys()"
          class="w-50"
          clearable
          placeholder="选择可见性"
        />
      </n-form-item>
      <n-form-item label="用户" path="state.visibility" v-if="userinfo.role === 'ADMIN'">
        <n-select
          v-model:value="state.userId"
          :options="users"
          class="w-50"
          clearable
          placeholder="请选择用户"
          label-field="displayName"
          value-field="id"
        />
      </n-form-item>
      <n-form-item label="内容" path="state.search">
        <n-input v-model:value="state.search" type="text" placeholder="支持全文搜索" clearable />
      </n-form-item>

      <n-form-item label="时间" path="state.name">
        <n-date-picker v-model:formatted-value="state.range" type="daterange" value-format="yyyy-MM-dd" />
      </n-form-item>

      <div class="fr justify-center">
        <n-button type="primary" class="px-6" size="small" @click="search">搜索</n-button>
      </div>
    </n-form>
  </div>

  <div class="rd" v-if="state.totalPage >= 1">
    <div class="fc gap-1">
      <div class="fr justify-end my-2 gap-2 items-center">
        <div class="text-gray-5 text-xs">总共{{ state.totalRecord }}条</div>
        <n-pagination
          v-model:page="state.page"
          :page-count="state.totalPage"
          v-if="state.totalPage > 1"
          size="small"
          @update-page="search"
        />
      </div>
      <memo
        :memo="item"
        v-for="item in state.memos"
        :key="item.id"
        :id="item.id"
        :max-height="sessionStorage.MEMO_MAX_LENGTH"
      />
      <div class="fr justify-end my-2 gap-2 items-center">
        <div class="text-gray-5 text-xs">总共{{ state.totalRecord }}条</div>
        <n-pagination
          v-model:page="state.page"
          :page-count="state.totalPage"
          v-if="state.totalPage > 1"
          size="small"
          @update-page="search"
        />
      </div>
    </div>
  </div>
  <div class="rd p-4 flex justify-center text-gray-5" v-else>暂无记录</div>
</template>

<script setup lang="ts">
import { type MemoDTO } from '@/types/memo'
import type { Tag } from '@/types/tag'
import type { User } from '@/types/user'
import dayjs from 'dayjs'

const userinfo = useStorage('userinfo', { token: '', role: '' })
const tags = ref<Array<Tag>>([])
const users = ref<Array<User>>([])
const sessionStorage = useSessionStorage('config', {
  MEMO_MAX_LENGTH: 300,
})
const state = reactive({
  tag: '',
  search: '',
  visibility: '',
  range: [dayjs().subtract(3, 'y').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')] as [
    string,
    string
  ],
  page: 1,
  size: 20,
  totalRecord: 0,
  totalPage: 0,
  userId: undefined,
  memos: Array<MemoDTO>(),
})

onMounted(async () => {
  const { data, error } = await useMyFetch('/api/tag/list').post().json()
  if (error.value) return
  tags.value = data.value

  if (userinfo.value.role === 'ADMIN') {
    await loadUserList()
  }
})

const loadUserList = async () => {
  const { data, error } = await useMyFetch('/api/user/list').post().json()
  if (error.value) return
  users.value = data.value
}

const search = async () => {
  const { data, error } = await useMyFetch('/api/memo/list')
    .post({
      tag: state.tag || undefined,
      visibility: state.visibility || undefined,
      begin: dayjs(state.range[0]).toDate() || dayjs().subtract(3, 'y').toDate(),
      end: dayjs(state.range[1]).toDate() || dayjs().endOf('month').toDate(),
      page: state.page,
      size: state.size,
      search: state.search || undefined,
      userId: state.userId || undefined,
    })
    .json()
  if (error.value) return
  state.totalPage = data.value.totalPage
  state.totalRecord = data.value.total
  state.memos = data.value.items
  state.memos.forEach((memo) => {
    memo.resources.forEach((item) => {
      if (item.storageType === 'LOCAL' && item.url.startsWith('/')) {
        item.url = import.meta.env.VITE_BASE_URL + item.url
      }
    })
  })
}
</script>

<style scoped></style>
