<template>
  <div class="main">
    <div class="fr gap-2">
      <div class="left">
        <LeftNav />
      </div>
      <div class="middle">
        <RouterView />
      </div>
      <div class="right">
        <RightNav v-if="userinfo.token" />
      </div>
    </div>
    <div
      class="i-carbon:settings md:hidden sticky left-2 bottom-2 text-3xl z-99"
      @click="showDrawer = !showDrawer"
    ></div>
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
