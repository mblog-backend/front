<script setup lang="ts">
import type { GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'
const themeModelVal = useLocalStorage('themeModel', { theme: 'day' })
const themeModel = ref<GlobalTheme | null>(null)
themeChangeBus.on(({ theme }) => {
  if (theme === 'dark') {
    themeModel.value = darkTheme
    window.document.documentElement.classList.add('dark')
    themeModelVal.value.theme = theme
  } else {
    themeModel.value = null
    window.document.documentElement.classList.remove('dark')
    themeModelVal.value.theme = theme
  }
})

onMounted(async () => {
  themeChangeBus.emit({ theme: themeModelVal.value.theme })
})
</script>

<template>
  <n-config-provider :theme="themeModel">
    <RouterView />
  </n-config-provider>
</template>
