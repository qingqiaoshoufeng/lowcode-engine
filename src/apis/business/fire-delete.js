import { request as axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 作废火灾列表
export function getFireDeleteList(data) {
  let params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    fireCode: data.fireCode,
    fireDateStart: data.time?.[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    fireDateEnd: data.time?.[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    applyGroup: data?.applyGroup?.map(val => val.organizationid)?.join(','),
    warningArea: cloneDeep(data.warningArea)?.pop(),
    fireDirection: data?.fireDirection,
  }

  return axios.get('/acws/rest/biz/fireinfo/cancelfire', {
    params,
  }).then((res) => {
    return {
      ...res,
      list: res?.data || res?.items || [],
    }
  })
}
