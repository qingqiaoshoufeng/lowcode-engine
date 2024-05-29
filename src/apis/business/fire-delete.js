import { request as axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 作废火灾列表
export function getFireDeleteList(data) {
  let params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    onlyMy: data.onlyMy,
    fireCode: data.fireCode,
    fireDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    fireDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    orgId: data?.orgId?.map(val => val.organizationid)?.join(','),
    severity: data.severity,
    isDispatch: data.isDispatch,
    warningArea: cloneDeep(data.warningArea)?.pop(),
    fireInfoTag: data?.fireInfoTag?.join(','),
    fireLevel: data?.fireLevel?.join(','),
    area:data?.area ? data?.area[data?.area?.length - 1] : null,
    fireDirection: data?.fireDirection,
  }

  return axios.get('/acws/rest/biz/fireinfo/query', {
    params,
  }).then((res) => {
    return {
      ...res,
      list: res.data,
    }
  })
}
