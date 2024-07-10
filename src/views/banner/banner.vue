<template>
    <div class="news">
        <el-tabs type="border-card" v-model="activeStatus">
            <el-tab-pane :label="item.label" :name="item.value" v-for="item in data" :key="item.id">
                <HomeComponent v-if="item.id === 1"></HomeComponent>
                <OtherComponent v-if="item.id === 2"></OtherComponent>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import HomeComponent from './home/index.vue'
    import OtherComponent from './other/other.vue'
    const vueRouter = useRouter()

    const data = [
        {
            id: 1,
            value: 1,
            label: '首页轮播图',
        },
        {
            id: 2,
            value: 2,
            label: '封面图',
        },
    ]

    const activeStatus = ref(1)
</script>

<style scoped lang="scss">
    .news {
        flex: 1;
        .el-tabs {
            height: 100%;
            display: flex;
            flex-direction: column;
            :deep(.el-tabs__item) {
                font-size: 18px;
            }
            :deep(.el-tabs__content) {
                flex: 1;
            }
            :deep(.el-tab-pane) {
                height: 100%;
            }
        }
    }
    .newsChildren {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
