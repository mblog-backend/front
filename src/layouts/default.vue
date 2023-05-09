<template>
  <div class="main">
    <div class="header">
      <HeaderNav />
    </div>
    <div class="fr gap-2">
      <div class="middle">
        <RouterView />
      </div>
      <div class="right">
        <RightNav />
      </div>
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
    @apply flex-1;
  }

  .right {
    @apply w-50;
  }
}
</style>
