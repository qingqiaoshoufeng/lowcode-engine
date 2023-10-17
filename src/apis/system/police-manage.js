import { axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 警情管理列表
export function getFireWarningManage(data) {
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
      warningDateStart: data.time?.[0] ? dayjs(data.time?.[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      warningDateEnd: data.time?.[1] ? dayjs(data.time?.[1]).format('YYYY-MM-DD HH:mm:ss') : '',
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
      isOtherCity: data?.isOtherCity,
      isOtherProvince: data?.isOtherProvince,
      isHeadquarters: data?.isHeadquarters,
      finishQueryFlag: data?.finishQueryFlag,
    }
  }
  return axios.get('/acws/rest/biz/firewarning/query', {
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

// 获取警情信息
export function getFireWarningDetail(id) {
  return axios.get(`/acws/rest/biz/firewarning/${id}`)
}

// 获取警情详情页签
export function getFireWarningTabs(warningId) {
  return axios.get(`/acws/rest/biz/firewarning/query/view?warningId=${warningId}`)
}

// 添加标签
export function addTagsFireWarning(params) {
  return axios.post('/acws/rest/biz/firewarning/savewarningtag', params)
}

// 收藏警情
export function collectFireWarning(params) {
  return axios.post('/acws/rest/biz/firefocus/focus/save', params)
}

// 警情收藏列表
export function getCollectList(params) {
  return axios.get('/acws/rest/biz/common/focus/query', { params })
}

// 驳回警情
export function rejectFireWarning(params) {
  return axios.post('/acws/rest/biz/firewarning/reject', params)
}

// 申请更正/修改
export function recheckFireWarning(params) {
  return axios.post('/acws/rest/biz/firerecheck/firerecheck/save', params)
}

// 申请作废
export function abolishFireWarning(params) {
  return axios.post('/acws/rest/biz/firecancel/save', params)
}

// 获取字段备注信息
export function getFieldAnnotationList(params) {
  return axios.get('/acws/rest/biz/fieldremark/selectsinglefieldremarks', { params })
}

// 新增字段备注
export function addFieldAnnotation(params) {
  return axios.post('/acws/rest/biz/fieldremark/addsinglefieldremark', params)
}

// 更新备注信息
export function getFormFieldAnnotation(params) {
  return axios.post('/acws/rest/biz/fieldremark/updatefieldremark', params)
}

// 删除字段备注信息
export function deleteFormFieldAnnotation(data) {
  return axios.post('/acws/rest/biz/fieldremark/deletefieldremark', data, { noErrorHandler: true })
}

// 获取字段备注提醒
export function getFieldAnnotationDetail(params) {
  return axios.get('/acws/rest/biz/fieldremark/getremarkwarn', { params })
}

// 页面新增时保存备注
export function updateFormFieldAnnotationIds(params) {
  return axios.post('/acws/rest/biz/fieldremark/updatedataid', params)
}
