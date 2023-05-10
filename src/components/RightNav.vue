<template>
  <div class="fc gap-2 sticky top-0">
    <Mine v-if="userinfo.token" />
    <Statistics v-if="userinfo.token" />
    <Top10Tag v-if="userinfo.token" />
  </div>
</template>

<script setup lang="ts">
const userinfo = useStorage('userinfo', { token: '' })
</script>

<style scoped></style>
