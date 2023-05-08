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
import { getVisbilitys } from '@/types/memo'
import type { SelectOption } from 'naive-ui'

interface State {
  visibilityOptions: Array<SelectOption>
  visbility: string
}

const state: State = reactive({
  visibilityOptions: getVisbilitys(),
  visbility: 'PUBLIC',
})
</script>

<style scoped></style>
