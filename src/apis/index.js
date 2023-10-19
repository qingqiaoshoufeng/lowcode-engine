import axios from 'axios'

export * from './system/login.js'
export * from './system/menu.js'
export * from './system/login.js'
export * from './business/home.js'
import { request } from '@/plugins/axios/index.js'



// 获取行政区域
export function getSystemArea({ parentAreaId, reportName, showAllArea, staticFlag }) {
  let url = ''
  if (parentAreaId) {
    url = `/acws/rest/biz/common/sysarea/unfold/arealist?parentAreaId=${parentAreaId}&reportName=${reportName}&showAllArea=${showAllArea}&staticFlag=${staticFlag}`
  }
  else {
    url = `/acws/rest/biz/common/sysarea/unfold/arealist?reportName=${reportName}&showAllArea=${showAllArea}&staticFlag=${staticFlag}`
  }
  return request.get(url)
}

// 地址位置编码查询
export function searchLocation(params) {
  const instance = axios.create({
    baseURL: 'https://api.tianditu.gov.cn',
    withCredentials: false,
  })
  return instance.get(`/geocoder?ds=${params.ds}&tk=${params.tk}`)
}