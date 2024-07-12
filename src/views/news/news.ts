import http from '@/axios/http'

// 类型

// 查询新闻类型
export const getNewsType = () => {
    return http.get('/icon/newsType/queryByPage')
}

// 新增新闻类型
export const addNewsType = (params: any) => {
    return http.post('/icon/newsType/add', params)
}

// 编辑新闻类型
export const editNewsType = (params: any) => {
    return http.put('/icon/newsType/edit', params)
}

// 删除新闻类型
export const delNewsType = (params: any) => {
    return http.del(`/icon/newsType/deleteById?id=${params}`)
}

// 文章

// 新增资讯文章
export const addNews = (params: any) => {
    return http.post('/icon/news/add', params)
}

// 查询新闻资讯列表
export const getNewsList = (params: any) => {
    return http.get('/icon/news/queryByPage', params)
}

// 删除新闻类型
export const delNews = (params: any) => {
    return http.del(`/icon/news/deleteById?id=${params}`)
}

// 发布撤回新闻资讯
export const changeNewsStatus = (params: any) => {
    return http.put('/icon/news/push/article', params)
}

// 编辑文章

// 查询新闻资讯详情
export const getNewsDetail = (id: any) => {
    return http.get(`/icon/news/${id}`)
}

// 修改新闻资讯
export const editNews = (params: any) => {
    return http.put('/icon/news/edit', params)
}

//国旗下讲话

// 查询
export const getArticle = (params: any) => {
    return http.get('/icon/lecture/queryByPage', params)
}

export const getArticleDetail = (params: any) => {
    return http.get(`/icon/lecture/${params}`)
}

// 新增
export const addArticle = (params: any) => {
    return http.post('/icon/lecture/add', params)
}

// 修改
export const editArticle = (params: any) => {
    return http.put('/icon/lecture/edit', params)
}

// 删除
export const delArticle = (params: any) => {
    return http.del(`/icon/lecture/deleteById?id=${params}`)
}
