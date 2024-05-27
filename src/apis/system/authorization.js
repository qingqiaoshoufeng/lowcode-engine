import { request as axios } from '@/plugins/axios/index.js'

// 开始授权认证
export function startAuthorization(data) {
  return axios.post('/acws/rest/authentication', data, {
    noErrorHandler: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }).then((res) => {
    return res.data
  })
}
