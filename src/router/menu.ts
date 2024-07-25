import { RouteRecordRaw } from 'vue-router'

// 根据当前路由生成菜单

const MenuRouter: Array<RouteRecordRaw> = [
    // {
    //     path: '/',
    //     name: 'dashboard',
    //     component: () => import('@/views/dashboard/dashboard.vue'),
    //     meta: {
    //         title: '仪表盘',
    //         icon: 'Odometer',
    //         hidden: false,
    //     },
    // },
    {
        path: '/',
        name: 'banner',
        component: () => import('@/views/banner/banner.vue'),
        meta: {
            title: 'banner',
            icon: 'ScaleToOriginal',
            hidden: false,
        },
    },
    {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video/video.vue'),
        meta: {
            title: '视频管理',
            icon: 'VideoCameraFilled',
            hidden: false,
        },
    },
    {
        path: 'education',
        name: 'education',
        meta: {
            title: '教育教学',
            icon: 'Trophy',
            hidden: false,
        },
        children: [
            {
                path: 'team',
                name: 'team',
                component: () => import('@/views/team/team.vue'),
                meta: {
                    title: '师资团队',
                    icon: 'Trophy',
                    hidden: false,
                },
            },
            {
                path: 'schedule',
                name: 'schedule',
                component: () => import('@/views/schedule/schedule.vue'),
                meta: {
                    title: '学校作息表',
                    icon: 'Trophy',
                    hidden: false,
                },
            },
        ],
    },
    {
        path: 'environment',
        name: 'environment',
        component: () => import('@/views/environment/environment.vue'),
        meta: {
            title: '校园环境',
            icon: 'School',
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
            {
                path: 'speak',
                name: 'speak',
                component: () => import('@/views/news/speak/speak.vue'),
                meta: {
                    title: '国旗下讲话',
                    icon: 'Odometer',
                    hidden: false,
                },
            },
        ],
    },
    {
        path: 'apply',
        name: 'apply',
        component: () => import('@/views/apply/apply.vue'),
        meta: {
            title: '招生报名',
            icon: 'School',
            hidden: false,
        },
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
