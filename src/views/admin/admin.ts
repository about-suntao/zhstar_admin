import http from '@/axios/http'

// 分页查询账户
export const getAdminUser = (params: any) => {
    return http.get('/icon/sysUser/queryByPage', params)
}

// 新增管理员
export const addAdminUser = (params: any) => {
    return http.post('/icon/sysUser/add', params)
}

// 修改管理员
export const editAdminUser = (params: any) => {
    return http.put('/icon/sysUser/edit', params)
}

// 删除管理员
export const delAdminUser = (params: any) => {
    return http.del('/icon/sysUser/deleteById', params)
}
