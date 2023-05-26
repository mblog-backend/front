<template>
  <div class="wrapper" ref="wrapper">
    <div class="main fr gap-2">
      <div class="left">
        <LeftNav v-if="userinfo.token || !route.path.startsWith('/memo')" />
      </div>
      <div class="middle">
        <RouterView />
      </div>
      <div class="right" v-if="route.path !== '/settings'">
        <RightNav v-if="route.path === '/' || route.path === '/me' || route.path === '/search'" />
      </div>
    </div>
    <div
      title="设置"
      class="bg-blue rd md:hidden sticky hover:bg-blue-5 left-2 bottom-2 z-99 w-10 items-center justify-center cursor-pointer flex"
    >
      <div class="i-carbon:settings text-3xl text-white" @click="showDrawer = !showDrawer"></div>
    </div>
  </div>

  <n-drawer v-model:show="showDrawer" :width="'60%'" placement="right">
    <n-drawer-content>
      <div class="fc gap-2">
        <LeftNav />
        <RightNav />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useElementStyle } from '@vueuse/motion'
const userinfo = useStorage('userinfo', { username: '', token: '' })
const showDrawer = ref(false)
const route = useRoute()
closeDrawerBus.on(() => {
  showDrawer.value = false
})
const wrapper = ref<HTMLElement>()
const isSmallerScreen = useMediaQuery('(max-width: 768px)')
const sessionStorage = useSessionStorage('config', {
  OPEN_REGISTER: false,
  OPEN_COMMENT: false,
  OPEN_LIKE: false,
  MEMO_MAX_LENGTH: 300,
  INDEX_WIDTH: '50rem',
  WEBSITE_TITLE: 'MBlog',
  USER_MODEL: 'SINGLE',
  CUSTOM_CSS: '',
  CUSTOM_JAVASCRIPT: '',
})
onMounted(async () => {
  const { data, error } = await useMyFetch('/api/sysConfig/').get().json()
  if (error.value) {
    return
  }
  const configData = data.value as Array<{ key: string; value: string }>
  sessionStorage.value.USER_MODEL = configData.find((r) => r.key === 'USER_MODEL')?.value || 'SINGLE'
  if (sessionStorage.value.USER_MODEL === 'MULTIPLE') {
    sessionStorage.value.OPEN_REGISTER = configData.find((r) => r.key === 'OPEN_REGISTER')?.value === 'true' || false
    sessionStorage.value.OPEN_COMMENT = configData.find((r) => r.key === 'OPEN_COMMENT')?.value === 'true' || false
    sessionStorage.value.OPEN_LIKE = configData.find((r) => r.key === 'OPEN_LIKE')?.value === 'true' || false
  }
  sessionStorage.value.WEBSITE_TITLE = configData.find((r) => r.key === 'WEBSITE_TITLE')?.value || 'MBlog'
  sessionStorage.value.MEMO_MAX_LENGTH = parseInt(configData.find((r) => r.key === 'MEMO_MAX_LENGTH')?.value as any)
  sessionStorage.value.INDEX_WIDTH = configData.find((r) => r.key === 'INDEX_WIDTH')?.value || '50rem'
  const { style } = useElementStyle(wrapper)
  style.width = sessionStorage.value.INDEX_WIDTH
  if (!isSmallerScreen) {
    const { style } = useElementStyle(wrapper)
    style.width = sessionStorage.value.INDEX_WIDTH
  }

  const title = useTitle()
  title.value = sessionStorage.value.WEBSITE_TITLE

  sessionStorage.value.USER_MODEL = configData.find((r) => r.key === 'USER_MODEL')?.value || 'SINGLE'
  sessionStorage.value.CUSTOM_JAVASCRIPT = configData.find((r) => r.key === 'CUSTOM_JAVASCRIPT')?.value || ''
  sessionStorage.value.CUSTOM_CSS = configData.find((r) => r.key === 'CUSTOM_CSS')?.value || ''

  var head = document.getElementsByTagName('head')[0]

  if (sessionStorage.value.CUSTOM_JAVASCRIPT) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = sessionStorage.value.CUSTOM_JAVASCRIPT
    head.appendChild(script)
  }
  if (sessionStorage.value.CUSTOM_CSS) {
    var externalStyle = document.createElement('style')
    externalStyle.type = 'text/css'
    externalStyle.innerHTML = sessionStorage.value.CUSTOM_CSS
    head.appendChild(externalStyle)
  }
})
</script>

<style scoped lang="scss">
.wrapper {
  @apply flex flex-col gap-2 lg:w-200 mx-auto;

  .left {
    @apply w-24  lt-md:hidden;
  }

  .middle {
    @apply flex-1;
  }

  .right {
    @apply w-50  lt-md:hidden;
  }
}
</style>
