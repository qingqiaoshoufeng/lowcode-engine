import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'

// 申请记录列表
export function getApplyRecordList(data) {
  return request.get('/acws/rest/biz/common/applyrecordlist/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      applyStartDate: data.time?.[0] ? dayjs(data.time?.[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      applyEndDate: data.time?.[1] ? dayjs(data.time?.[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      applyType: data.applyType,
      applyUnit: data.applyUnit?.length > 0 ? data.applyUnit[0].organizationid : '',
      applyStatus: data.applyStatus,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.items?.map((item) => {
        return {
          ...item,
          applyTypeValue: data.applyType === '2' ? '' : item.applyTypeValue,
        }
      }),
    }
  })
}

// 获取申请单详情
export function getApplyDetail(params) {
  return request.get('/acws/rest/biz/common/applyrecorddetail/query', { params })
}
