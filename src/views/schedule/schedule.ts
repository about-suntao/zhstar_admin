import http from '@/axios/http'

// 查询
export const getInfo = () => {
    return http.get('/icon/web/surroundings/queryAll', { type: 2 })
}

// 修改
export const editInfo = (params: any) => {
    return http.put('/icon/surroundings/edit', params)
}
