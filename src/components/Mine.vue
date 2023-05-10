<template>
  <div class="fc bg-white p-2 rd gap-2 text-gray dark:bg-gray-7 dark:text-gray-4">
    <div class="fr gap-2 items-center justify-center">
      <n-avatar round size="large" :src="user.avatarUrl" />
      <div class="fc text-xs">
        <div>@{{ user.displayName }}</div>
        <div>始于{{ created }}</div>
      </div>
      <div class="i-carbon:rss text-yellow-5 text-lg cursor-pointer hover:text-yellow-7" @click="nav2Rss"></div>
    </div>
    <div style="border-bottom: 1px solid #ccc"></div>
    <div class="md-content" v-html="user.bio && marked.parse(user.bio)"></div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import dayjs from 'dayjs'

const options = {
  prefix: 'mblog-',
}
marked.use(gfmHeadingId(options))
marked.use(mangle())

onMounted(async () => {
  await reload()
})

let user = ref<Partial<User>>({})

const created = computed(() => {
  return dayjs(user.value.created).format('YYYY-MM-DD')
})

const nav2Rss = () => {
  window.location.href = `${import.meta.env.VITE_BASE_URL}/rss`
}

const reload = async () => {
  const { data, error } = await useMyFetch('/api/user/current').post().json()
  if (!error.value) {
    user.value = data.value
  }
}
</script>

<style scoped></style>
