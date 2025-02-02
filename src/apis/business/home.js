
import { request as axios } from '@/plugins/axios/index.js'


// 查询页面信息
export function getDataAnalysis(params) {
  return axios.get('/acws/rest/biz/analysis/dataAnalysis/homePage/list', { params })
}

// 火灾相关信息
export function getFirelist(params) {
  return axios.get('/acws/rest/biz/analysis/dataAnalysis/homePage/firelist', { params })
}

// 获取通知列表
export function getFireNotice(params) {
  return axios.get('/acws/rest/biz/mystatistics/notice/query', { params }).then((res)=>{
    return res.items
  })
}

// 榜单列表
export function getAnnualList(params) {
  return axios.get('/acws/rest/biz/analysis/dataAnalysis/homePage/annualList', { params })
}

// 查询出动信息接口
export function getDispatchInfo(params) {
  return axios.get('/acws/rest/biz/analysis/dataAnalysis/homePage/dispatch', { params })
}

// 火灾平时常
export function getAverageTime(params) {
  return axios.get('/acws/rest/biz/analysis/dataAnalysis/homePage/averageTime', { params })
}

//参展形式接口
export function getStylePercent(params) {
  return axios.get('/acws/rest/biz/analysis/dataAnalysis/homePage/parameter', { params })
}

// 获取通知详情
export function getNoticeDetail(params) {
  const {id} = params
  return axios.get(`/acws/rest/biz/notice/${id}`)
}

// 下载附件
// export function downloadAttachmentFile({ attachmentId }) {
//   return axios.get(`/acws/rest/attachments/${attachmentId}`)
// }
// 参展形式

// export function downloadAttachmentFile({ attachmentId }) {
//   return axios.get(`/acws/rest/attachments/${attachmentId}`)
// }


//  我的统计--我的消息--已读
export function updateMessage(params) {
  const {id}= params
  return axios.get(`/acws/rest/biz/firestatistics/usermessage/update`,{params})
}

// 通知状态更新
export function updateNotice(params) {
  const {id}= params
  return axios.post(`/acws/rest/biz/mystatistics/notice/update/${id}`)
}

// 获取用户信息
export function gethomePageInfo(params) {
  const url = params.isStanding ? '/acws/rest/biz/analysis/dataAnalysis/homePage/orgquery' : '/acws/rest/biz/analysis/dataAnalysis/homePage/query'
  return axios.get(url, { params })
}

