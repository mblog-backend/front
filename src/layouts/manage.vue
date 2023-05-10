<template>
  <div class="main">
    <div class="fr gap-2">
      <div class="left">
        <LeftNav />
      </div>
      <div class="middle">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// const userinfo = useStorage('userinfo', { username: '', token: '' })
</script>

<style scoped lang="scss">
.main {
  @apply flex flex-col gap-2 lg:w-200 mx-auto;

  .left {
    @apply w-20;
  }

  .middle {
    @apply flex-1;
  }
}
</style>
