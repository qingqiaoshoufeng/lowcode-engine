import { request } from '@/plugins/axios/index.js'

// 出动填报列表
export function getReportList(data) {
  return request.get('/acws/rest/biz/firedispatch/querydispatch', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      isDraft: data.isDraft,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.data,
    }
  })
}

// 出动填报暂存
export function saveTemporaryDispatchReport(data) {
  return request.post('/acws/rest/biz/firedispatch/temporarySave', data)
}

// 出动填报预加载接口
export function initDispatchReport(params) {
  return request.get('/acws/rest/biz/firedispatch/initdispatch', { params })
}

// 出动填报保存（普通队站）
export function saveDispatchReport(data) {
  return request.post('/acws/rest/biz/firedispatch/save', data)
}

// 出动填报保存（全勤指挥部）
export function saveDispatchHeadquarter(data) {
  return request.post('/acws/rest/biz/firedispatch/saveheadquarter', data)
}

// 出动填报删除
export function deleteReport(params) {
  return request.get('/acws/rest/biz/firedispatch/delete', { params })
}

// 出动填报获取气象信息
export function getWeatherMsg(params) {
  return request.get('/acws/rest/biz/common/weatherinfo/getInfo', { params })
}

// 出动填报人员列表
export function getInputPerson(params) {
  return request.get('/acws/rest/biz/fireuser/query/list', { params })
}

// 出动填报获取车辆信息
export function getTruckMsg(params) {
  return request.get('/acws/rest/biz/firedispatch/querytruck', { params })
}

// 获取当前人员出动填报草稿
export function getDraftList(params) {
  return request.get('/acws/rest/biz/firedispatch/querydraft', { params })
}

// 获取出动填报详情（普通队站）
export function getDispatchDetail(id) {
  return request.get(`/acws/rest/biz/firedispatchlist/querydispatchbywarning?id=${id}`)
}

//  获取出动填报详情（全勤指挥部）
export function getDispatchDetailHeadquarter(id) {
  return request.get(`/acws/rest/biz/firedispatchlist/querydispatchbywarninghead?id=${id}`)
}

// 获取部门人员
export function getDeptMembers(params) {
  return request.get('/acws/rest/biz/common/queryusers', { params })
}

// 删除草稿
export function deleteReportDraft(data) {
  return request.post('/acws/rest/biz/firedispatch/delete', data, { noErrorHandler: true })
}

// 上传附件
export function uploadFile(params) {
  return request.post('/acws/rest/attachments', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    noErrorHandler: true,
  }).then((res) => {
    return {
      ...res?.data,
      url: `/acws/rest/attachments/${res?.data?.attachmentId}`,
      thumbUrl: `/acws/rest/attachments/${res?.data?.attachmentId}`,
    }
  })
}

// 删除附件
export function deleteAttachmentFile({ attachmentId }) {
  return request.delete(`/acws/rest/attachments/${attachmentId}`, { noErrorHandler: true })
}

// 获取附件
export function getAttachmentFile(params) {
  return request.get('/acws/rest/attachmentswithtype', { params, noErrorHandler: true })
}

// 下载附件
export function downloadAttachmentFile({ attachmentId }) {
  return request.get(`/acws/rest/attachments/${attachmentId}`)
}

// 出动填报退回
export function rejectDispatchBack(data) {
  return request.post('/acws/rest/biz/dispatch/dispatchback', data)
}
