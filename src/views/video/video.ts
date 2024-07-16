import http from '@/axios/http'

// 查询
export const getInfo = () => {
    return http.get('/icon/home/video/queryByPage')
}

// 修改管理员
export const editInfo = (params: any) => {
    return http.put('/icon/home/video/edit', params)
}
