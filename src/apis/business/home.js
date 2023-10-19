


import { request as axios } from '@/plugins/axios/index.js'
// 火灾态势
export function getFireAnalysis(params) {
  return axios.get('/acws/rest/biz/analysis/dataanalysis/firelist', { params })
}