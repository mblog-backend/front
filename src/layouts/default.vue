<template>
  <div class="main">
    <div class="header">
      <HeaderNav />
    </div>
    <div class="fc">
      <div class="middle">
        <RouterView />
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main {
  @apply flex flex-col gap-2 lg:w-200 mx-auto;

  .left {
    @apply;
  }

  .middle {
  }

  .right {
  }
}
</style>
