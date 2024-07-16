import http from '@/axios/http'

// 分页查询
export const getTeam = (params: any) => {
    return http.get('/icon/teacher/queryByPage', params)
}

// 新增
export const addTeam = (params: any) => {
    return http.post('/icon/teacher/add', params)
}

// 修改
export const editTeam = (params: any) => {
    return http.put('/icon/teacher/edit', params)
}

// 删除
export const delTeam = (params: any) => {
    return http.del('/icon/teacher/deleteById', params)
}
