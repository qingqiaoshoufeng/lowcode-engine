import { request as axios } from '@/plugins/axios/index.js'

// 获取各省简称
export function getSimpleName(organizationid) {
  return axios.get(`/acws/rest/biz/common/sysmap/${organizationid}`)
}

// 开始授权认证
export function startAuthorization(data) {
  return axios.post('/acws/rest/biz/firetruck/saveOrUpdate', data)
}
