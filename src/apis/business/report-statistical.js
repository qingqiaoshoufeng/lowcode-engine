import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 获取报表模版列表
export function getReportTemplateList(data) {
  const params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    templateType: data.templateType === 3 ? undefined : data.templateType,
    sceneType: data.sceneType ? data.sceneType : undefined,
    templateName: data.templateName,
    focusFlag: data.templateType === 3 ? true : undefined,
  }
  return request.get('/acws/rest/biz/analysis/firereporttemplate/query', {
    params,
  }).then((res) => {
    return {
      ...res,
      list: res.items.map((item) => {
        return {
          ...item,
          templateStatus: item.templateStatus === '1',
          url: `${process.env.VUE_APP_BASE_URL}/acws/rest/app/attachments/${item.attachmentId}`,
        }
      }),
    }
  })
}

// 删除自定义报表模版
export function deleteReportTemplate(data) {
  return request.post('/acws/rest/biz/analysis/firereporttemplate/update', data, {
    noErrorHandler: true,
  })
}

// 启用报表模版
export function enableReportTemplate(data) {
  return request.post('/acws/rest/biz/analysis/firereporttemplate/update', data)
}

// 根据模版查询/导出报表数据
export function searchReportByTemplate(data) {
  return request.post('/acws/rest/biz/analysis/firereport/generate', {
    queryType: data.queryType,
    boFireReportTypeId: data.boFireReportTypeId,
    excelTitle: data.excelTitle,
    isDown: data.isDown,
    templateCode: data.templateCode,
    beginTime: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    organizationId: data.organizationId,
    areaId: cloneDeep(data.areaId)?.pop(),
    perTypes: data.perTypes,
    type: data.type ? data.type : undefined,
    queryReq: data.queryReq ? data.queryReq : undefined,
    staticFlag: data.staticFlag,
    dataTimeSource: data.dataTimeSource,
  }, {
    noErrorHandler: true,
  })
}

// 根据模版查询/导出报表数据
export function searchReportByDefine(data) {
  return request.post('/acws/rest/biz/analysis/customReportExcel/getReportInfos', {
    templateCode: data.templateCode,
    excelTitle: data.excelTitle,
    beginTime: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    ancestors: data.ancestors,
    provinceId: data.areaId?.[0],
    cityId: data.areaId?.[1],
    countryId: data.areaId?.[2],
    roadId: data.areaId?.[3],
    perTypes: data.perTypes,
    id: data.id,
    querytype: data.querytype,
    queryData: data.queryData,
    staticFlag: data.staticFlag,
    dataTimeSource: data.dataTimeSource,
  }, {
    noErrorHandler: true,
  })
}

// 保存自定义报表模版
export function saveReportTemplate(data) {
  // eslint-disable-next-line no-console
  console.log(data)
  return request.post('/acws/rest/biz/analysis/templateInfo/editCustomReportTemp', data)
}

// 获取自定义报表模版维度
export function getReportDimension(params) {
  return request.get('/acws/rest/biz/analysis/mataMapping/queryRowList', { params, noErrorHandler: true })
}

// 获取自定义报表指标
export function getReportIndex(params) {
  return request.get('/acws/rest/biz/analysis/templateMetaInfo/queryTemplateColMetaInfo', { params, noErrorHandler: true })
}

// 获取自定义报表详情
export function getDefineTemplate(params) {
  return request.get('/acws/rest/biz/analysis/templateInfo/editCustomReportTempInfo', { params })
}

// 根据报表模板id查询固定报表的维度
export function getTemplateParams(params) {
  return request.get('/acws/rest/biz/analysis/firereporttemplate/getfireReporttype', { params })
}
