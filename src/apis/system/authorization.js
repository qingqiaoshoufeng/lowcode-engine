import { request as axios } from '@/plugins/axios/index.js'

// 开始授权认证
export function startAuthorization(data) {
  return axios.post('/acws/rest/biz/firetruck/saveOrUpdate', data)
}
