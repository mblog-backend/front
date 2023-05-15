<template>
  <div class="main">
    <div class="fr gap-2">
      <div class="left">
        <LeftNav v-if="userinfo.token || !route.path.startsWith('/memo')" />
      </div>
      <div class="middle">
        <RouterView />
      </div>
      <div class="right">
        <RightNav v-if="route.path === '/'" />
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
</script>

<style scoped lang="scss">
.main {
  @apply flex flex-col gap-2 lg:w-200 mx-auto md:mt-2;

  .left {
    @apply w-20  lt-md:hidden;
  }

  .middle {
    @apply flex-1;
  }

  .right {
    @apply w-50  lt-md:hidden;
  }
}
</style>
