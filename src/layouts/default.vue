<template>
    <div class="main">
        <div class="left">
            <LeftNav />
        </div>
        <div class="middle">
            <RouterView />
        </div>
        <div class="right">

        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.main {
    @apply flex flex-row gap-2 lg: w-300 mx-auto;

    .left {
        @apply ;
    }

    .middle {}

    .right {}
}
</style>