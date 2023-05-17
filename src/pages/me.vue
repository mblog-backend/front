<template>
  <div class="fc">
    <n-tabs type="bar" @update-value="changeTab">
      <n-tab-pane name="all">
        <template #tab>全部({{ state.total }})</template>
        <MeAll />
      </n-tab-pane>
      <n-tab-pane name="liked">
        <template #tab>已点赞({{ state.liked }})</template>
        <MeAll :liked="true" />
      </n-tab-pane>
      <n-tab-pane name="commented">
        <template #tab>已评论({{ state.commented }})</template>
        <MeAll :commented="true" />
      </n-tab-pane>
      <n-tab-pane name="mentioned">
        <template #tab>
          <n-badge :value="state.unreadMentioned" size="small">
            <div class="men" style="color: rgb(31, 34, 37)">被提到({{ state.mentioned }})</div></n-badge
          >
        </template>
        <MeAll :commented="true" :mentioned="true"
      /></n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
const state = ref<MemoStatisticsDto>({
  total: 0,
  liked: 0,
  mentioned: 0,
  commented: 0,
  unreadMentioned: 0,
})

interface MemoStatisticsDto {
  total: number
  liked: number
  mentioned: number
  commented: number
  unreadMentioned: number
}
onMounted(async () => {
  await reload()
})

const reload = async () => {
  const { data, error } = await useMyFetch('/api/user/statistics').post().json()
  if (error.value) return
  state.value = data.value as any as MemoStatisticsDto
}

const changeTab = async (value: string | number) => {
  if (value === 'mentioned' && state.value.unreadMentioned > 0) {
    state.value.unreadMentioned = 0
  }
}
</script>

<style scoped>
::v-deep(.n-tabs-nav--bar-type) {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  background-color: #fff;
  padding: 0 10px;
}
</style>
