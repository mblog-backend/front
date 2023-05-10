<template>
  <div class="fc bg-white p-2 rd gap-2">
    <div class="fr gap-2 items-center justify-center">
      <n-avatar round size="large" :src="user.avatarUrl" />
      <div class="fc text-xs text-gray">
        <div>@{{ user.displayName }}</div>
        <div>始于{{ created }}</div>
      </div>
    </div>
    <div style="border-bottom: 1px solid #ccc"></div>
    <div class="text-gray">{{ user.bio }}</div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import dayjs from 'dayjs'
onMounted(async () => {
  await reload()
})

let user = ref<Partial<User>>({})

const created = computed(() => {
  return dayjs(user.value.created).format('YYYY-MM-DD')
})

const reload = async () => {
  const { data, error } = await useMyFetch('/api/user/current').post().json()
  if (!error.value) {
    user.value = data.value
  }
}
</script>

<style scoped></style>
