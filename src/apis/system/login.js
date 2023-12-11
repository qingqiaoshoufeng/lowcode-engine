import { request } from '@/plugins/axios/index.js'
import axios from 'axios'

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



// export const getVerificationCode=() =>{
//   return new Promise((resolve) => {
//     const img = new Image()
//     img.crossOrigin = ''
//     img.src = '/acws/rest/captcha'
//     img.onload = function () {
//       const canvas = document.createElement('canvas')
//       canvas.width = img.width
//       canvas.height = img.height
//       const ctx = canvas.getContext('2d')
//       ctx?.drawImage(img, 0, 0, img.width, img.height)
//       const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
//       const dataURL = canvas.toDataURL(`image/${ext}`)
//       resolve(dataURL)
//     }
//   })
// }

export const getVerificationCode = async() =>{
  const imgRes = await fetch(`${ ['production','test'].includes(process.env.NODE_ENV) ? process.env.VUE_APP_BASE_URL : ''}/acws/rest/captcha`).then(r => r.blob()).then((blob) => {
    return new Promise((resolve) => { 
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        resolve(reader.result)
      }
    })
  })
  return Promise.resolve(imgRes)
}

// export const getVerificationCode = async() =>{
//   return new Promise(async(resolve) => { 
//     const imgRes = await axios(
//       {
//         url:'/acws/rest/captcha',
//         method:'get',
//         responseType:'blob'
//       }
//     ).then(response =>{
//       debugger;
//       // debugger
//       // let blob = new Blob([response.data], { type: "image/jpeg" });
//       // debugger;
//       const reader = new FileReader()
//       reader.readAsDataURL(new Blob([response.data])) 
      
//       reader.onloadend = () => {
//         console.log(reader.result);
//         resolve(reader.result)
//       }
//       // const url = "data:image/png;base64," + (Buffer.from(response.data, "binary").toString("base64"));
//       // resolve(url)
//     })
//   })
// }