<script setup lang="ts">
import type { GlobalTheme } from 'naive-ui'

const theme = ref<GlobalTheme | null>(null)

</script>

<template>
  <n-config-provider :theme="theme">
    <RouterView />
  </n-config-provider>
</template>

