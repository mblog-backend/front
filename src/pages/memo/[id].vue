<template>
  <Memo :memo="memoData" :id="memoData.id" v-if="memoData" />
  <template v-else>
    <div class="flex justify-center text-lg">需要登录才能访问</div>
    <div class="flex items-center justify-center mt-4">
      <n-button type="primary" class="px-6" @click="router.push('/')">去首页</n-button>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { MemoDTO } from '@/types/memo'

const route = useRoute()

const memoData = ref<MemoDTO>({} as MemoDTO)
const router = useRouter()

onMounted(async () => {
  const { data, error } = await useMyFetch('/api/memo/' + route.params.id)
    .post()
    .json()
  if (error.value) return

  memoData.value = data.value
})
</script>

<style scoped></style>
