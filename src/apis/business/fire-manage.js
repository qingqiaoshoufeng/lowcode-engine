import { request as axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'


// 火灾管理列表
export function getFireManageList(data) {
  let params = null
  if (data.unEditFlag) {
    params = {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      unEditFlag: true,
    }
  }
  else if (data.myCollect) {
    params = {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      focusFlag: true,
    }
  }
  else {
    params = {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      onlyMy: data.onlyMy,
      fireCode: data.fireCode,
      fireStatus: data.fireStatus?.join(','),
      fireDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      fireDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      orgId: data?.orgId?.map(val => val.organizationid)?.join(','),
      severity: data.severity,
      isDispatch: data.isDispatch,
      warningArea: cloneDeep(data.warningArea)?.pop(),
      fireInfoTag: data?.fireInfoTag?.join(','),
      fireLevel: data?.fireLevel?.join(','),
      fireCause: data?.fireCause?.map(val => val[val.length - 1])?.join(','),
      area: data?.area?.map(val => val[val.length - 1])?.join(','),
      isSafetyAccident: data?.isSafetyAccident,
      isResearch: data?.isResearch,
      finishQueryFlag: data?.finishQueryFlag,
    }
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

// 火灾填报驳回
export function turnFireBack(data) {
  return axios.post('/acws/rest/biz/fireinfo/rejectfire', data)
}
