import axios from 'axios'
import config from './config'
import router from '@/router'

// 1、创建实例
const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 20 * 1000,
})
// 2.请求拦截器
service.interceptors.request.use(
    (config) => {
        if (config.method === 'get' && !config.data) {
            config.data = true
        }
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'
        }
        const token = JSON.parse(localStorage.getItem('Authorization') as string)

        if (token) {
            config.headers['Token'] = token.token
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

// 3.响应拦截器
service.interceptors.response.use(
    (res) => {
        if (res.data?.code) {
            if (res.data.code !== 200) {
                ElMessage.error(res.data.message)
            }
            if (res.data.code === '10001') {
                ElMessage.error('身份验证失效，请重新登录')
                router.push({ path: 'login' }) //返回登录页
            } else if (res.data.code === '10003') {
                ElMessage.error('身份过期,请重新登录')
                router.push({ path: 'login' }) //返回登录页
            }
            return res.data
        } else {
            return res
        }
    },
    (error) => {
        if (error.request?.status === 500) {
            ElMessage.error('服务器错误')
        }
        if (error.code === 'ERR_NETWORK') {
            ElMessage.error('请求超时，请重试')
        }
        return Promise.resolve(error.response)
    }
)
//4.导出实例
export default service
