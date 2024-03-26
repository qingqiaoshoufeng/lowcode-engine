import {request as axios} from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { getTagsKeyValue } from '@/utils/tools.js'

// 警情质量监督列表参数
export function getFireWarningSupervisionParams(data) {
  const tags = getTagsKeyValue(data.tags)
  return {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    createUserOrg: data?.createUserOrg?.length > 0 ? data.createUserOrg[0].organizationid : '',
    warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    ...tags,
  }
}

// 警情质量监督列表
export function getFireWarningSupervision(data) {
  return axios.get('/acws/rest/biz/firewarningstatistics/query', {
    params: getFireWarningSupervisionParams(data),
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

// 出动质量监督列表参数
export function getDispatchSupervisionParams(data) {
  const tags = getTagsKeyValue(data.tags)
  return {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    queryOrd: data?.queryOrd?.length > 0 ? data.queryOrd[0].organizationid : '',
    ...tags,
  }
}

// 出动质量监督列表
export function getDispatchSupervisionList(data) {
  return axios.get('/acws/rest/biz/firedispatchstatistic/query', {
    params: getDispatchSupervisionParams(data),
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 火灾质量监督列表参数
export function getFireSupervisionParams(data) {
  const tags = getTagsKeyValue(data.tags)
  return {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    warningCode: data.warningCode,
    fireCode: data.fireCode,
    reportCreateTimeStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    reportCreateTimeEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    unit: data.unit?.length > 0 ? data.unit[0].organizationid : '',
    fireDirection: data.fireDirection,
    boAreaId: cloneDeep(data.boAreaId)?.pop(),
    ...tags,
  }
}

// 火灾质量监督列表
export function getFireSupervisionList(data) {
  return axios.get('/acws/rest/biz/fireinfostatisticlist/query', {
    params: getFireSupervisionParams(data),
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 超时警情统计参数
export function getPoliceTimeoutParams(data) {
  return {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    createUserOrg: data?.createUserOrg?.length > 0 ? data.createUserOrg[0].organizationid : '',
    timeoutStart: data.timeoutStart,
    timeoutEnd: data.timeoutEnd,
    warningType: cloneDeep(data.warningType)?.pop(),
    timeOutType: data.timeOutType,
  }
}

// 超时警情统计
export function getPoliceTimeout(data) {
  return axios.get('/acws/rest/biz/firewarningtimeout/query', {
    params: getPoliceTimeoutParams(data),
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 超时出动统计参数
export function getDispatchTimeoutParams(data) {
  return {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    queryOrd: data?.queryOrd?.length > 0 ? data.queryOrd[0].organizationid : '',
    timeoutDateStart: data.timeoutDateStart,
    timeoutDateEnd: data.timeoutDateEnd,
    warningType: cloneDeep(data.warningType)?.pop(),
    timeOutType: data.timeOutType,
    warningCode: data.warningCode,
    dispatchCode: data.dispatchCode,
    warningAddr: data.warningAddr,
    warningArea: cloneDeep(data?.warningArea)?.pop(),
  }
}

// 超时出动统计
export function getDispatchTimeout(data) {
  return axios.get('/acws/rest/biz/firedispatchtimeout/query', {
    params: getDispatchTimeoutParams(data),
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 超时火灾统计参数
export function getFireTimeoutParams(data) {
  return {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    unit: data?.unit?.length > 0 ? data.unit[0].organizationid : '',
    timeOutHoursStart: data.timeOutHoursStart,
    timeOutHoursEnd: data.timeOutHoursEnd,
    fireType: cloneDeep(data.fireType)?.pop(),
    timeOutType: data.timeOutType,
  }
}

// 超时火灾统计
export function getFireTimeout(data) {
  return axios.get('/acws/rest/biz/fireinfotimeout/query/list', {
    params: getFireTimeoutParams(data),
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 未填报队站统计参数
export function getUnworkTimeoutParams(data) {
  return {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    // statisticsDateType: data.statisticsDateType,
    xqOrgId: data?.xqOrgId?.length > 0 ? data.xqOrgId[0].organizationid : '',
    beginTime: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
  }
}

// 未填报队站统计
export function getUnworkTimeout(data) {
  return axios.get('/acws/rest/biz/firejobcontent/nofillin/query', {
    params: getUnworkTimeoutParams(data),
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 导出
export function saveExportData(data, type) {
  let url = '/acws/rest/biz/analysis/export/excel/customtemplate'
  return axios.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    responseType: 'blob',
    noErrorHandler: true,
  })
}

// 获取导出项
export function getExportField(params) {
  return axios.get('/acws/rest/biz/firestatistics/queryexportitem', { params })
}

// 批量驳回
export function rejectBatch(data) {
  return axios.post('/acws/rest/biz/rejectpublic/reject', data)
}

// 备注‘超时原因’
export function remarkReason(data) {
  return axios.post('/acws/rest/biz/firewarningtimeout/remark/addremark', data)
}

// 获取‘超时原因’
export function getRemarkReason(params) {
  return axios.get('/acws/rest/biz/firewarningtimeout/remark/getremark', { params })
}

// 生成报表
export function reportSupervision(data) {
  return axios.post('/acws/rest/biz/firewarningtimeout/remark/addremark', data)
}
