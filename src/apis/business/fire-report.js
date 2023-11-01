import { request as axios } from '@/plugins/axios/index.js'

// // 火灾填报列表
// export function getFireReportList(data) {
//   return axios.get('/acws/rest/biz/fireinfo/queryfireinfo', {
//     params: {
//       offset: (data.page - 1) * data.limit + 1,
//       limit: data.limit,
//       draftFlag: data.draftFlag,
//     },
//   }).then((res) => {
//     return {
//       ...res,
//       list: res.data,
//     }
//   })
// }
// 火灾填报列表
export function getFireReportList(data) {
  return axios.get('/acws/rest/biz/fireinfo/queryfireinfo', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      draftFlag: data.draftFlag,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.data,
    }
  })
}

// 火灾填报保存
export function saveFireDispatchReport(data) {
  if (data?.isNoDispatchFlag === '1') {
    return axios.post('/acws/rest/biz/fireinfo/nondispatch/save', data)
  }
  return axios.post('/acws/rest/biz/fireinfo/save', data)
}

// 火灾填报暂存
export function saveTemporaryFireDispatchReport(data) {
  return axios.post('/acws/rest/biz/fireinfo/temporarySave', data)
}

// 获取火灾填报详情
export function getFireReportDetail(id) {
  return axios.get(`/acws/rest/biz/fireinfo/getfireinfoviewbyinfoid?id=${id}`)
}

// 火灾填报退回
export function rejectFireBack(data) {
  return axios.post('/acws/rest/biz/fireinfo/backfire', data)
}

// 火灾填报转派
export function transferFire(data) {
  return axios.post('/acws/rest/biz/fireinfo/distributedfire', data, { noErrorHandler: true })
}

// 删除草稿
export function deleteFireReportDraft(data) {
  return axios.post('/acws/rest/biz/fireinfo/delete', data, { noErrorHandler: true })
}

// 获取当前人员是否有火灾填报草稿
export function getFireDrafts(params) {
  return axios.get('/acws/rest/biz/fireinfo/querydraft', { params })
}

// 火灾填报预加载接口
export function initFireReport(params) {
  return axios.get('/acws/rest/biz/fireinfo/initfireinfo', { params })
}
