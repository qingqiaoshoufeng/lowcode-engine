import { request } from '@/plugins/axios/index.js'

// 登录接口
export function loginIn(data) {
  return request.post('/acws/rest/authentication', data, {
    noErrorHandler: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }).then((res) => {
    return res.data
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


// 获取警情类型
export function getFireWarningType(params) {
  return request.get('/acws/rest/biz/common/firedict/query', { params })
}

// 获取所有规则配置
export function getAllRules() {
  return request.get('/acws/rest/biz/ruleconfig/get')
}