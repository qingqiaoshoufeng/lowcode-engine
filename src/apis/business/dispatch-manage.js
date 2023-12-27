import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 出动管理列表
export function getDispatchManageList(data) {
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
      dispatchCode: data.dispatchCode,
      warningCode: data.warningCode,
      dispatchStatus: data.dispatchStatus?.join(','),
      warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      warningType: cloneDeep(data.warningType)?.pop(),
      warningAddr: data.warningAddr,
      dispatchType: data.dispatchType,
      dispatchGroup: data.dispatchGroup,
      warningArea: cloneDeep(data.warningArea)?.pop(),
      mainGroup: data?.mainGroup?.length > 0 ? data.mainGroup[0].organizationid : '',
      orgList: data?.orgList?.map(val => val.organizationid)?.join(','),
      isOtherProvince: data?.isOtherProvince,
      isOtherCity: data?.isOtherCity,
      dealSituation: data?.dealSituation?.join(','),
      headNameList: data?.headNameList?.join(','),
      finishQueryFlag: data?.finishQueryFlag,
    }
  }
  return request.get('/acws/rest/biz/firedispatch/query', {
    params,
  }).then((res) => {
    return {
      ...res,
      list: res.data,
    }
  })
}

// 驳回出动
export function rejectDispatch(params) {
  return request.post('/acws/rest/biz/firedispatch/rejectd', params)
}
