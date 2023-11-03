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

// 创建axios实例
export const request = window.__axios = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL,
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : '/',
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
  responseInterceptors,
  // 请求失败
  responseError
)

export default {
  install(app) {
    app.config.globalProperties.$http = request
  }
};


