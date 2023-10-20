
import { request as axios } from '@/plugins/axios/index.js'
export function getFireAnalysis(params) {
  return axios.get('acws/rest/biz/dataAnalysis/homePage/list', { params })
}