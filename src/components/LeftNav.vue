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
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const navTo = (path: string) => {
  router.push(path)
}
const userinfo = useStorage('userinfo', { username: '', token: '' })

const logout = () => {
  userinfo.value = {} as any
  window.location.href = '/'
}
</script>

<style scoped lang="scss">
.parent {
  @apply fc p-2 gap-2 justify-end items-end sticky top-0;
  .item {
    @apply cursor-pointer list-none fr gap-1 items-center hover:text-gray-500;
    letter-spacing: 3px;
  }
}
</style>
