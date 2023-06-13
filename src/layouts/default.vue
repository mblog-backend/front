<template>
  <div class="wrapper" ref="wrapper" :style="{ width: isSmallerScreen ? '100%' : sessionStorage.INDEX_WIDTH }">
    <div class="main fr gap-2">
      <div class="left">
        <LeftNav v-if="userinfo.token || !route.path.startsWith('/memo')" />
      </div>
      <div class="middle">
        <RouterView />
      </div>
      <div class="right" :style="{ visibility: userinfo.token ? 'visible' : 'hidden' }">
        <RightNav />
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
  THUMBNAIL_SIZE: '100,100',
  ANONYMOUS_COMMENT: false,
  COMMENT_APPROVED: true,
})
onBeforeMount(async () => {
  const { data, error } = await useMyFetch('/api/sysConfig/').get().json()
  if (error.value) {
    return
  }
  const configData = data.value as Array<{ key: string; value: string }>
  sessionStorage.value.USER_MODEL = configData.find((r) => r.key === 'USER_MODEL')?.value || 'SINGLE'
  sessionStorage.value.OPEN_REGISTER = configData.find((r) => r.key === 'OPEN_REGISTER')?.value === 'true' || false
  sessionStorage.value.OPEN_COMMENT = configData.find((r) => r.key === 'OPEN_COMMENT')?.value === 'true' || false
  sessionStorage.value.OPEN_LIKE = configData.find((r) => r.key === 'OPEN_LIKE')?.value === 'true' || false

  sessionStorage.value.WEBSITE_TITLE = configData.find((r) => r.key === 'WEBSITE_TITLE')?.value || 'MBlog'
  sessionStorage.value.MEMO_MAX_LENGTH = parseInt(configData.find((r) => r.key === 'MEMO_MAX_LENGTH')?.value as any)
  sessionStorage.value.INDEX_WIDTH = configData.find((r) => r.key === 'INDEX_WIDTH')?.value || '50rem'

  const title = useTitle()
  title.value = sessionStorage.value.WEBSITE_TITLE

  sessionStorage.value.USER_MODEL = configData.find((r) => r.key === 'USER_MODEL')?.value || 'SINGLE'
  sessionStorage.value.CUSTOM_JAVASCRIPT = configData.find((r) => r.key === 'CUSTOM_JAVASCRIPT')?.value || ''
  sessionStorage.value.CUSTOM_CSS = configData.find((r) => r.key === 'CUSTOM_CSS')?.value || ''
  sessionStorage.value.THUMBNAIL_SIZE = configData.find((r) => r.key === 'THUMBNAIL_SIZE')?.value || '100,100'
  sessionStorage.value.ANONYMOUS_COMMENT =
    configData.find((r) => r.key === 'ANONYMOUS_COMMENT')?.value === 'true' || false
  sessionStorage.value.COMMENT_APPROVED =
    configData.find((r) => r.key === 'COMMENT_APPROVED')?.value === 'true' || false

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
    @apply w-28  lt-md:hidden;
  }

  .middle {
    @apply flex-1;
  }

  .right {
    @apply w-50  lt-md:hidden;
  }
}
</style>
