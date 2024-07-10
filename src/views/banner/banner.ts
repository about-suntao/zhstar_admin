import http from '@/axios/http'

// 首页轮播图

// 查询
export const getHomeSwiper = (params: any) => {
    return http.get('/icon/slideshow/queryByPage', params)
}

// 新增首
export const addHomeSwiper = (params: any) => {
    return http.post('/icon/slideshow/add', params)
}

// 修改
export const editHomeSwiper = (params: any) => {
    return http.put('/icon/slideshow/edit', params)
}

// 删除
export const delHomeSwiper = (params: any) => {
    return http.del('/icon/slideshow/deleteById', params)
}

// 其他

// 新增
export const getOtherBanner = (params: any) => {
    return http.get('/icon/slideshow/queryByPage', params)
}

// 修改
export const editOtherBanner = (params: any) => {
    return http.put('/icon/slideshow/edit', params)
}
