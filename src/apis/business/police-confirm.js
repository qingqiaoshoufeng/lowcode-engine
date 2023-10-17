import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 警情确认列表
export function getPoliceConfirmList(data) {
  let params = null
  params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    confirmFlag: data.confirmFlag,
    warningDateStart: data.time?.[0] ? dayjs(data.time?.[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningDateEnd: data.time?.[1] ? dayjs(data.time?.[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningStatus: data?.warningStatus?.join(','),
    warningCode: data?.warningCode,
    warningType: cloneDeep(data?.warningType)?.pop(),
    boAreaId: cloneDeep(data.boAreaId)?.pop(),
    orgIds: data?.orgIds?.map(val => val.organizationid)?.join(','),
    otherCity: data?.otherCity?.join(','),
    otherProvince: data?.otherProvince?.join(','),
  }
  return request.get('/acws/rest/biz/firewarning/query', {
    params,
  }).then((res) => {
    return {
      ...res,
      list: res.items?.map((item) => {
        const dispatchList = item.dispatchList || []
        if (item.fireInfoReport) {
          dispatchList.push(item.fireInfoReport)
        }
        return {
          ...item,
          dispatchList,
        }
      }),
    }
  })
}

// 警情确认
export function confirmPolice(params) {
  return request.post('/acws/rest/biz/firewarning/confirm', params)
}
