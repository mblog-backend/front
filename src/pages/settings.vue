<template>
  <div class="p-2 bg-white rd" style="min-height: 600px">
    <n-tabs type="card">
      <n-tab-pane name="系统设置">
        <SysConfig />
      </n-tab-pane>
      <n-tab-pane name="用户设置">
        <UserConfig />
      </n-tab-pane>
      <n-tab-pane name="标签管理">
        <TagManage />
      </n-tab-pane>
      <n-tab-pane name="开发者"> <DevConfig /> </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>

<route lang="yaml">
meta:
  layout: manage
</route>
