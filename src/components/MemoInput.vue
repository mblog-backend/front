<template>
  <div class="p-2 bg-white rd fc gap-2">
    <n-input
      type="textarea"
      placeholder="自动调整尺寸"
      show-count
      :autosize="{
        minRows: 3,
      }"
    />
    <div class="fr gap-2 items-center">
      <n-select v-model:value="state.visbility" :options="state.visibilityOptions" class="w-32" size="small" />
      <div class="i-carbon:cloud-upload cursor-pointer hover:text-gray text-lg"></div>
      <n-button type="info" class="ml-auto px-8"> 记录 </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const state = reactive({
  visibilityOptions: [
    {
      label: '所有人可见',
      value: 'PUBLIC',
    },
    {
      label: '登录用户可见',
      value: 'PROTECT',
    },
    {
      label: '自己可见',
      value: 'PRIVATE',
    },
  ],
  visbility: 'PUBLIC',
})
</script>

<style scoped></style>
