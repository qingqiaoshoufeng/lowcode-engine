import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'

// 出动审核列表
export function getDispatchReviewList(data) {
  return request.get('/acws/rest/biz/report/reviewlist/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      state: data.state,
      reviewType: '1',
      sendTimeStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      sendTimeEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      dispatchCode: data.dispatchCode,
      dispatchGroup: data?.dispatchGroup?.length > 0 ? data.dispatchGroup[0].organizationid : '',
      dispatchStatus: data.dispatchStatus?.join(','),
    },
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 火灾审核列表
// export function getFireReviewList(data) {
//   return request.get('/acws/rest/biz/report/reviewlist/query', {
//     params: {
//       offset: (data.page - 1) * data.limit + 1,
//       limit: data.limit,
//       state: data.state,
//       reviewType: '2',
//       sendTimeStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
//       sendTimeEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
//       fireCode: data.fireCode,
//       fireGroup: data.fireGroup?.length > 0 ? data.fireGroup[0].organizationid : '',
//       fireStatus: data.fireStatus?.join(','),
//     },
//   }).then((res) => {
//     return {
//       ...res,
//       list: res.items,
//     }
//   })
// }

// 审核初始化信息
export function getInitProcess(data) {
  return request.post('/acws/rest/flowtask/actions/audit/preload', data)
}

// 待办列表总数
export function getWaitList(params, type) {
  let url = ''
  if (type === 'review') {
    url = '/acws/rest/biz/report/reviewlist/query/total'
  }
  else if (type === 'recheck') {
    url = '/acws/rest/biz/warning/reviewlist/query/total'
  }
  else if (type === 'abolist') {
    url = '/acws/rest/biz/warning/cancelreviewlist/query/total'
  }
  return request.get(url, { params })
}

// 待修改列表总数
export function getWaitEditList(params, type) {
  let url = ''
  if (type === 'police') {
    url = '/acws/rest/biz/firewarning/queryEdit'
  }
  else if (type === 'dispatch') {
    url = '/acws/rest/biz/firedispatch/queryEdit'
  }
  else if (type === 'fire') {
    url = '/acws/rest/biz/fireinfo/queryEdit'
  }
  else if (type === 'dispatch-input') {
    url = '/acws/rest/biz/firedispatch/queryFill'
  }
  else if (type === 'fire-input') {
    url = '/acws/rest/biz/fireinfo/queryFill'
  }
  return request.get(url, { params })
}

// 警情待确认数量
export function getConfirmList(params, type) {
  let url = ''
  if (['police-confirm', 'police-redeploy'].includes(type)) {
    url = '/acws/rest/biz/firewarning/gettotal'
  }
  return request.get(url, { params })
}

