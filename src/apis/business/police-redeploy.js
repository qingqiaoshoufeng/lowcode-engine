import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 警情确认列表
export function getPoliceRedeployList(data) {
  let params = null
  params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    // onlyMy: data.onlyMy,
    warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningStatus: data?.warningStatus?.join(','),
    warningCode: data?.warningCode,
    warningType: cloneDeep(data?.warningType)?.pop(),
    warningLevel: data?.warningLevel,
    mainGroup: data?.mainGroup?.length > 0 ? data.mainGroup[0].organizationid : '',
    warningAddr: data?.warningAddr,
    warningTag: data?.warningTag?.join(','),
    boAreaId: cloneDeep(data.boAreaId)?.pop(),
    areaLvl: cloneDeep(data.areaLvl)?.pop(),
    orgIds: data?.orgIds?.map(val => val.organizationid)?.join(','),
    naturalDisasterType: data?.naturalDisasterType?.map(val => val[val.length - 1])?.join(','),
    // isOtherCity: data?.isOtherCity,
    // isOtherProvince: data?.isOtherProvince,
    isHeadquarters: data?.isHeadquarters,
    finishQueryFlag: data?.finishQueryFlag,
    ...getExtendParams(data),
  }
  if (!data.provinceFlag && !data.cityFlag) {
    return Promise.resolve({
      list: [],
    })
  }
  return request.get('/acws/rest/biz/firewarning/query', {
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
  function getExtendParams(data) {
    const { provinceFlag, cityFlag, provinceTransfer, onlyMy } = data
    // 添加跨省的字段
    let exetendParams = (provinceFlag && provinceTransfer)
      ? {
        provinceFlag, provinceTransfer: onlyMy,
      }
      : {
        cityFlag,
        cityTransfer: onlyMy,
      }
    if (data.reinforceType) {
      exetendParams = (data.reinforceType === 1)
        ? {
          ...exetendParams,
          isOtherProvince: 1,
        }
        : {
          ...exetendParams,
          isOtherCity: 1,
        }
    }
    return exetendParams
  }
}

// 警情退回
export function reinforcereturn(params) {
  return request.post('/acws/rest/biz/firewarning/reinforcereturn', params)
}

//
export function transferWarning(params) {
  return request.post('/acws/rest/biz/firewarning/transferWarning', params)
}

