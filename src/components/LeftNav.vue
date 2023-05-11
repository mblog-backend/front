<template>
  <div class="parent">
    <div class="item" @click="navTo('/')">
      <div class="i-carbon:home"></div>
      <div>首页</div>
    </div>
    <div class="item" @click="navTo('/settings')" v-if="userinfo.token">
      <div class="i-carbon:settings"></div>
      <div>设置</div>
    </div>

    <div class="item" @click="logout" v-if="userinfo.token">
      <div class="i-carbon:logout"></div>
      <div>登出</div>
    </div>
    <div class="item" @click="navTo('/login')" v-if="!userinfo.token">
      <div class="i-carbon:login"></div>
      <div>登录</div>
    </div>
    <div class="fr gap-2 items-center justify-center">
      <div
        class="i-carbon:moon hover:text-gray-7 cursor-pointer"
        @click="toggleTheme('dark')"
        v-if="themeModelVal.theme === 'day'"
      ></div>
      <div
        class="i-carbon:sun text-yellow-5 text-lg hover:text-yellow-4 cursor-pointer"
        @click="toggleTheme('day')"
        v-if="themeModelVal.theme === 'dark'"
      ></div>
      <a
        class="i-carbon:logo-github text-lg hover:text-gray-7 dark:text-yellow-5 dark:hover:text-yellow-4"
        target="_blank"
        href="https://github.com/kingwrcy/mblog-backend"
      ></a>
    </div>
  </div>
</template>

<script setup lang="ts">
const themeModelVal = useLocalStorage('themeModel', { theme: 'day' })

const router = useRouter()
const navTo = (path: string) => {
  router.push(path)
  closeDrawerBus.emit()
}
const userinfo = useStorage('userinfo', { username: '', token: '' })
const toggleTheme = (theme: string) => {
  themeChangeBus.emit({ theme })
}
const logout = () => {
  userinfo.value = {} as any
  window.location.href = '/'
}
</script>

<style scoped lang="scss">
.parent {
  @apply fc p-2 gap-2 justify-end  sticky top-0;
  .item {
    @apply cursor-pointer list-none fr gap-1 items-center hover:text-gray-500 dark:text-gray-4 justify-center;
    letter-spacing: 3px;
  }
}
</style>
