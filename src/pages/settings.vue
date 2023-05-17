<template>
  <div class="p-2 bg-white rd dark:bg-gray-7" style="min-height: 600px">
    <n-tabs type="card">
      <n-tab-pane name="系统设置" v-if="userinfo.role === 'ADMIN'">
        <SysConfig />
      </n-tab-pane>
      <n-tab-pane name="用户设置">
        <UserConfig />
      </n-tab-pane>
      <n-tab-pane name="标签管理">
        <TagManage />
      </n-tab-pane>
      <n-tab-pane name="开发者" v-if="userinfo.role === 'ADMIN'"> <DevConfig /> </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
const userinfo = useStorage('userinfo', { username: '', token: '', role: '' })
</script>

<style scoped></style>
