const config: any = {
    baseUrl: '',
    socketUrl: '',
}

if (process.env.NODE_ENV === 'development') {
    config.baseUrl = 'http://192.168.111.87:8080'
    // config.baseUrl = 'http://120.26.109.36:8081'
} else if (process.env.NODE_ENV === 'production') {
    config.baseUrl = 'http://120.26.109.36:8081'
}

export default config
