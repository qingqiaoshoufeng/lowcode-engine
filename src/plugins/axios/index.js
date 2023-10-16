import axios from 'axios'
import router from '@/router/index'
import { Toast } from 'vant'
import { requestInterceptors, responseInterceptors, responseError } from './interceptors.js'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
    Toast({
        message: msg,
        duration: 1000,
        forbidClick: true
    })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            toLogin()
            break
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            tip('登录过期，请重新登录')
            localStorage.removeItem('token')
            //   store.commit('loginSuccess', null);
            setTimeout(() => {
                toLogin()
            }, 1000)
            break
        // 404请求不存在
        case 404:
            tip('请求的资源不存在')
            break
        default:
            console.log(other)
    }
}

// 创建axios实例
export const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    // baseURL: '',
    timeout: 1000 * 12
})
// 设置post请求头
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
request.interceptors.request.use(
    requestInterceptors,
    error => Promise.error(error)
);

// 响应拦截器
request.interceptors.response.use(
    // 请求成功
    function (res) {
        debugger;
        console.log(1111)
    },
    responseInterceptors,
    // 请求失败
    responseError
)

export default {
    install(app) {
        app.config.globalProperties.$http = request
    }
};


