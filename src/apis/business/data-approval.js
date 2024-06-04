import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'

// 警情更正/修改申请列表
export function getFireWarningEditApproval(data) {
  return request.get('/acws/rest/biz/warning/reviewlist/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      recheckType: data.recheckType,
      startDate: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      endDate: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      state: data.state,
      applyType: data.applyType,
      applyGroup: data.applyGroup?.length > 0 ? data.applyGroup[0].organizationid : '',
      warningCode: data.warningCode,
      dispatchCode: data.dispatchCode,
      fireCode: data.fireCode,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.items?.map((temp) => {
        return {
          ...temp,
          warningDate: temp.warningDate ? dayjs(temp.warningDate).unix() * 1000 : '',
        }
      }),
    }
  })
}

// 未出动作废申请列表
export function getFireAbolishApproval(data) {
  return request.get('/acws/rest/biz/fire/cancelreviewlist/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      startDate: data.time?.[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      endDate: data.time?.[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      state: data.state,
      applyType: data.applyType,
      applyGroup: data.applyGroup?.length > 0 ? data.applyGroup[0].organizationid : '',
      fireCode: data.fireCode,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 警情作废申请列表
export function getFireWarningAbolishApproval(data) {
  return request.get('/acws/rest/biz/warning/cancelreviewlist/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      startDate: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      endDate: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      state: data.state,
      applyType: data.applyType,
      applyGroup: data.applyGroup?.length > 0 ? data.applyGroup[0].organizationid : '',
      warningCode: data.warningCode,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}
