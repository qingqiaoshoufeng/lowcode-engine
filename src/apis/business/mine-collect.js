import { request as axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'

// 获取收藏列表
export const getMineCollect = (params)=>{
  const {url,page,...rest} = params
  const isPolice = url === '/acws/rest/biz/firewarning/query'
  return axios.get(url, { params:rest }).then((res) => {
    return {
      ...res,
      list: isPolice ? res.items : res.data,
    }
  })
}


//  我的统计--我的收藏--统计数量
export function getFocus() {
  return axios.get('/acws/rest/biz/mystatistics/query/focus')
}


//  我的统计--待办、消息--统计数量
export function getRemind() {
  return axios.get('/acws/rest/biz/mystatistics/query/remind')
}
