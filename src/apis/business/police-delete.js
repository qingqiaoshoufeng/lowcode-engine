import { request as axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 警情作废列表
export function getDeleteFireWarningLists(data) {
  let params = null
  const url = '/acws/rest/biz/firewarning/cancelwarning'
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
      // onlyMy: data.onlyMy,
      warningDateStart: data.time?.[0] ? dayjs(data.time?.[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      warningDateEnd: data.time?.[1] ? dayjs(data.time?.[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      warningCode: data?.warningCode,
      warningType: cloneDeep(data?.warningType)?.pop(),
      cancelReason: data.cancelReason,
      applyGroup: data.applyGroup?.length > 0 ? data.applyGroup[0].organizationid : '',
      // warningLevel: data?.warningLevel,
      // mainGroup: data?.mainGroup?.length > 0 ? data.mainGroup[0].organizationid : '',
      // warningAddr: data?.warningAddr,
      // warningTag: data?.warningTag?.join(','),
      // boAreaId: cloneDeep(data.boAreaId)?.pop(),
      // areaLvl: cloneDeep(data.areaLvl)?.pop(),
      // orgIds: data?.orgIds?.map(val => val.organizationid)?.join(','),
      // naturalDisasterType: data?.naturalDisasterType?.map(val => val[val.length - 1])?.join(','),
      // isOtherCity: data?.isOtherCity,
      // isOtherProvince: data?.isOtherProvince,
      // isHeadquarters: data?.isHeadquarters,
      // finishQueryFlag: data?.finishQueryFlag,
    }
  }
  return axios.get(url, {
    params,
  }).then((res) => {
    return {
      ...res,
      list: res.items?.map((item) => {
        const dispatchList = []
        if (item.fireInfoReport) {
          dispatchList.push(item.fireInfoReport)
        }
        if (item.dispatchList?.length > 0) {
          dispatchList.push(...item.dispatchList)
        }
        return {
          ...item,
          dispatchList,
        }
      }),
    }
  })
}