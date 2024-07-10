<template>
    <div class="container">
        <h2>hi,{{ usrInfo.name }}</h2>
        <p>欢迎使用后台管理系统</p>
    </div>
</template>

<script setup lang="ts">
    const usrInfo = JSON.parse(localStorage.getItem('Authorization') as string)
</script>

<style scoped lang="scss">
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        h2 {
            width: 100%;
            text-align: center;
        }
    }
</style>
