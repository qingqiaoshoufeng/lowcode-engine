import { request } from '@/plugins/axios/index.js'

// 登录接口
export function loginIn(data) {
    return request.post('/acws/rest/authentication', data, {
        noErrorHandler: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
}

// 登出接口
export function loginOut(data) {
    return request.post('/acws/rest/logout', data, { noErrorHandler: true })
}

// 获取验证码图片
export function getCaptcha() {
    return request.get('/acws/rest/captcha', { noErrorHandler: true })
}

// 获取用户信息
export function getUserInfo() {
    return request.get('/acws/rest/biz/sys/currentusers', { noErrorHandler: true })
}

// 登录报错
export function loginError(msg) {
    return request.get(`/acws/rest/fileLog?msg=${msg}`, { noErrorHandler: true })
}
