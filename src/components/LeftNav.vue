<template>
    <n-menu v-model:value="activeKey" mode="vertical" :options="menus" />
</template>

<script setup lang="ts">

const menus = reactive([
    {
        label: '首页',
        key: 'index'
    },
    {
        label: '登录',
        key: 'login'
    },
    {
        label: '登出',
        key: 'logout'
    },
    {
        label: '设置',
        key: 'setup'
    }
])

const activeKey = ref<string>('')

</script>

<style scoped></style>