import http from '@/axios/http'

// 查询
export const getInfo = () => {
    return http.get('/icon/url/queryAll')
}

// 修改
export const editInfo = (params: any) => {
    return http.put('/icon/url/edit', params)
}
