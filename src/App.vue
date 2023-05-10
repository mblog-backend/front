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
  const sessionStorage = useSessionStorage('config', {
    OPEN_REGISTER: false,
    WEBSITE_TITLE: 'MBlog',
  })
  const { data, error } = await useMyFetch('/api/sysConfig/').get().json()
  if (error.value) return
  const configData = data.value as Array<{ key: string; value: string }>
  sessionStorage.value.OPEN_REGISTER = configData.find((r) => r.key === 'OPEN_REGISTER')?.value === 'true' || false
  sessionStorage.value.WEBSITE_TITLE = configData.find((r) => r.key === 'WEBSITE_TITLE')?.value || 'MBlog'

  const title = useTitle()
  title.value = sessionStorage.value.WEBSITE_TITLE
})
</script>

<template>
  <n-config-provider :theme="themeModel">
    <RouterView />
  </n-config-provider>
</template>
