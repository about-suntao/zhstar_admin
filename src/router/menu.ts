import { RouteRecordRaw } from 'vue-router'

// 根据当前路由生成菜单

const MenuRouter: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/dashboard/dashboard.vue'),
        meta: {
            title: '仪表盘',
            icon: 'Odometer',
            hidden: false,
        },
    },
    {
        path: 'news',
        name: 'news',
        meta: {
            title: '新闻管理',
            icon: 'Reading',
            hidden: false,
        },
        children: [
            {
                path: 'list',
                name: 'newsList',
                component: () => import('@/views/news/list/index.vue'),
                meta: {
                    title: '新闻列表',
                    icon: 'Reading',
                    hidden: false,
                },
                children: [
                    {
                        path: 'editNews',
                        name: 'editNews',
                        component: () => import('@/views/news/add/add.vue'),
                        meta: {
                            title: '编辑文章',
                            icon: 'Reading',
                            hidden: true,
                        },
                    },
                    {
                        path: 'preViewNews',
                        name: 'preViewNews',
                        component: () => import('@/views/news/list/preView/preView.vue'),
                        meta: {
                            title: '编辑文章',
                            icon: 'Reading',
                            hidden: true,
                        },
                    },
                ],
            },
            {
                path: 'addNews',
                name: 'addNews',
                component: () => import('@/views/news/add/add.vue'),
                meta: {
                    title: '新增文章',
                    icon: 'Odometer',
                    hidden: false,
                },
            },
        ],
    },
    {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/admin/admin.vue'),
        meta: {
            title: '账户管理',
            icon: 'User',
            hidden: false,
        },
    },
]

export default MenuRouter
