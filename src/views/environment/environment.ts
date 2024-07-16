import http from '@/axios/http'

// 分页查询
export const getInfo = (params: any) => {
    return http.get('/icon/surroundings/queryByPage', params)
}

// 新增
export const addInfo = (params: any) => {
    return http.post('/icon/surroundings/add', params)
}

// 修改
export const editInfo = (params: any) => {
    return http.put('/icon/surroundings/edit', params)
}

// 删除
export const delInfo = (params: any) => {
    return http.del('/icon/surroundings/deleteById', params)
}
