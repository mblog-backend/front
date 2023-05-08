<template>
  <div class="parent">
    <div class="item i-carbon:home" @click="navTo('/')"></div>
    <div class="item i-carbon:settings" @click="navTo('/settings')"></div>
    <div class="item i-carbon:login" @click="navTo('/login')"></div>
    <div class="item i-carbon:logout" @click="logout"></div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const navTo = (path: string) => {
  router.push(path)
}
const logout = () => {}
</script>

<style scoped lang="scss">
.parent {
  @apply fr p-2 gap-2 justify-end;
  .item {
    @apply cursor-pointer list-none hover:text-gray-500 text-lg;
  }
}
</style>
