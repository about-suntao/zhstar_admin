<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-header-titleZn">
                <p>后台管理系统</p>
            </div>
            <div class="sidebar-header-titleEn">Backend management system</div>
        </div>
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse">
            <div v-for="route in MenuRouter" :key="route.path">
                <el-sub-menu :index="route.name" v-if="route.children && !route.meta?.hidden">
                    <template #title>
                        <el-icon v-if="route.meta!.icon!==''">
                            <component :is="route.meta!.icon"></component>
                        </el-icon>
                        <span>{{ route.meta!.title }}</span>
                    </template>
                    <el-menu-item
                        v-for="item in route.children"
                        :key="item.path"
                        :index="item.path"
                        @click="handleSelect(route.path, item.path)"
                        v-show="!item.meta?.hidden"
                    >
                        <span>{{ item.meta!.title }}</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item
                    v-else
                    @click="handleSelect(route.path, '')"
                    :key="route.path"
                    :index="route.path"
                    v-show="!route.meta?.hidden"
                >
                    <el-icon v-if="route.meta!.icon!==''">
                        <component :is="route.meta!.icon"></component>
                    </el-icon>
                    {{ route.meta!.title }}
                </el-menu-item>
            </div>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import MenuRouter from '@/router/menu'

    const activeIndex = ref('/dashboard')
    const isCollapse = ref(false)

    // const route = useRoute()
    const vueRouter = useRouter()

    onMounted(() => {
        // 刷新页面定义当前页
        const path = vueRouter.currentRoute.value.fullPath.split('/').slice(0, 3)
        const active = path[path.length - 1]
        if (active === '') {
            activeIndex.value = '/'
        } else {
            activeIndex.value = active
        }
    })

    // 获取当前激活的菜单项
    const handleSelect = (root: string, index: string) => {
        if (index === '') {
            root === '/' ? vueRouter.push(`${root}`) : vueRouter.push(`/${root}`)
            activeIndex.value = `${root}`
        } else {
            vueRouter.push(`/${root}/${index}`)
            activeIndex.value = index
        }
    }
</script>

<style scoped lang="scss">
    .sidebar {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        &-header {
            width: 100%;
            padding: 51px 0 51px 20px;
            &-titleZn {
                img {
                    width: 36px;
                    height: 33px;
                }
                p {
                    font-family: Microsoft YaHei, sans-serif;
                    font-weight: bold;
                    font-size: 24px;
                    color: #ffffff;
                    line-height: 28px;
                }
            }
            &-titleEn {
                margin-top: 5px;
                font-family: Arial, monospace;
                font-weight: 400;
                font-size: 14px;
                color: #ffffff;
                line-height: 16px;
            }
        }
        .el-menu-vertical-demo {
            flex: 1;
            color: white;
            background: #fa6f69;
        }
        :deep(.el-sub-menu__title) {
            color: white;
            font-size: 16px;
        }
        :deep(.el-menu) {
            border: none;
        }
        .el-menu-item {
            font-size: 16px;
            padding-left: 48px;
            color: white;
        }
        .el-menu-item:hover {
            background-color: transparent;
            color: white;
        }
        .el-sub-menu {
            :hover {
                background-color: transparent;
            }
            background-color: #fa6f69;
            .el-menu-item {
                background-color: #fa6f69;
                padding-left: 60px;
                span {
                    display: inline-block;
                    padding-left: 8px;
                }
            }
        }
        .is-active {
            background: linear-gradient(269deg, #ffdfe2 0%, #fa6f69 100%);
        }
    }
</style>
