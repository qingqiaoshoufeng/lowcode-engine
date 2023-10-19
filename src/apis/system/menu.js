import { request as axios } from '@/plugins/axios/index.js'

export function getMenuInfo() {
  return axios.get('/acws/rest/biz/mystatistics/app/query/menu')
}