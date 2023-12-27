import axios from 'axios'
import { request } from '@/plugins/axios/index.js'

export * from './system/login.js'
export * from './system/user-manage.js'
export * from './system/car-manage.js'
export * from './system/person-manage.js'
export * from './business/police-confirm.js'
export * from './business/police-entry.js'
export * from './business/police-manage.js'
export * from './business/dispatch-manage.js'
export * from './business/dispatch-report.js'
export * from './business/report-review.js'
export * from './system/login.js'
export * from './system/menu.js'
export * from './system/login.js'
export * from './business/home.js'
export * from './business/fire-report.js'
export * from './business/fire-manage.js'
export * from './business/fire-review.js'
export * from './business/data-approval.js'
export * from './business/statistical-supervision.js'
export * from './business/apply-record.js'
export * from './business/report-statistical.js'
export * from './business/global-search.js'
export * from './business/mine-collect.js'
export * from './business/message.js'
export * from './business/police-redeploy.js'
export * from './business/composite-search.js'
export * from './business/police-delete.js'
export * from './business/advance-search.js'
export * from './business/police-delete.js'



// 119警情挂接（新建警情）
export function saveFireWarning(data) {
  return request.post('/acws/rest/biz/firewarning/save', data)
}

// 获取行政区域
export function getSystemArea({ parentAreaId, reportName, showAllArea, staticFlag }) {
  let url = ''
  if (parentAreaId) {
    url = `/acws/rest/biz/common/sysarea/unfold/arealist?parentAreaId=${parentAreaId}&reportName=${reportName}&showAllArea=${showAllArea}&staticFlag=${staticFlag}`
  }
  else {
    url = `/acws/rest/biz/common/sysarea/unfold/arealist?reportName=${reportName}&showAllArea=${showAllArea}&staticFlag=${staticFlag}`
  }
  return request.get(url)
}

// 获取警情类型
export function getFireWarningType(params) {
  return request.get('/acws/rest/biz/common/firedict/query', { params })
}

// 获取自然灾害类型
export function getNatureType() {
  return request.get('/acws/rest/biz/common/firedict/query')
}

// 获取队站
export function getDispatchGroup(params) {
  const { disabledValue, disabledKey, ...rest } = params
  if (params.permission) {
    return request.get('/acws/rest/biz/common/childDept/query', { params: { ...rest, permission: undefined } }).then((res) => {
      res.items = widthDisable(res.items)
      return res
      // 需要禁止选择的参数处理
    })
  }
  if (params.deptRoots) {
    if (params.parentOrganizationId) {
      delete params.deptRoots
      params.parentorganizationid = params.parentOrganizationId
      delete params.parentOrganizationId
    }
    return request.get('/acws/rest/biz/common/sysdept/treeselect', { params }).then((res) => {
      res.items = widthDisable(res.items)
      return res
      // 需要禁止选择的参数处理
    })
      .then((res) => {
        return {
          ...res,
          items: res,
        }
      })
  }
  return request.get('/acws/rest/biz/common/sysdept/query', { params })

  function widthDisable(res) {
    if (disabledValue && disabledKey) {
      return res.map(item => ({
        disabled: disabledValue.includes(item.orgLevel),
        ...item,
      }))
    }
    else {
      return res
    }
  }
}

// 搜索队站
export function searchDispatchGroup(params) {
  if (params.deptRoots) {
    delete params.deptRoots
    return request.get('/acws/rest/biz/common/sysdept/treeselect', { params }).then((res) => {
      return {
        ...res,
        items: res,
      }
    })
  }
  delete params.parentOrganizationId
  return request.get('/acws/rest/biz/common/sysdept/querysearch', { params })
}

// 获取责任区大队
export function getAreaDutyGroup(params) {
  return request.get('/acws/rest/biz/common/sysdept/query', { params })
}

// 获取增援总队
export function getOtherProvince(params) {
  return request.get('/acws/rest/biz/common/sysdept/pulldown/orglist', { params })
}

// 获取全勤指挥部
export function getHeadquarters(params) {
  return request.get('/acws/rest/biz/common/sysdept/query', { params })
}

// 获取警情标签
export function getFireWarningTag(params) {
  return request.get('/acws/rest/biz/firetag/query', { params })
}

// 获取流程下一节点
export function getProcessOuttransitions(params) {
  return request.get(`/acws/rest/task/${params.taskId}/outtransitions`, { params })
}

// 获取流程第一个节点
export function getFirstOuttransitions(params) {
  return request.get(`/acws/rest/process/${params.processDefKey}/firstnode/outtransitions`, { params, noErrorHandler: true })
}

// 获取流程下一节点处理人
export function getProcessAuditUsers(params) {
  return request.get('/acws/rest/process/auditusers/query', { params, noErrorHandler: true })
}

// 启动流程接口
export function startProcessActions(data) {
  return request.post('/acws/rest/process/actions/start', data, { noErrorHandler: true })
}

// 审批流程接口
export function approveProcessActions(taskId, data) {
  return request.post(`/acws/rest/flowtask/${taskId}/actions/audit`, data)
}

// 审批火灾接口
export function approveFireActions(data) {
  if (data?.isNoDispatchFlag === '1') {
    return request.post(`/acws/rest/biz/fireinfo/nondispatch/saveAndAudit`, data)
  }
  return request.post(`/acws/rest/biz/fireinfo/saveAndAudit`, data)
}

// 审批出动接口
export function approveDispatchActions(data, type) {
  if (type) {
    return request.post(`/acws/rest/biz/firedispatch/saveheadquarterAndAudit`, data)
  }
  return request.post(`/acws/rest/biz/firedispatch/saveAndAudit`, data)
}

// 我的待办已办接口
export function getTodoTasks(params) {
  return request.get('/acws/rest/tasks/query', { params, noErrorHandler: true })
}

// 获取流程监控
export function getProcessMonitor(params) {
  return request.get('/acws/rest/process/monitor/query', { params })
}

// 地址位置编码查询
export function searchLocation(params) {
  const instance = axios.create({
    baseURL: 'https://api.tianditu.gov.cn',
    withCredentials: false,
  })
  return instance.get(`/geocoder?ds=${params.ds}&tk=${params.tk}`)
}

// 查询历史数据可取下拉列表
export function getSourceOption(params) {
  return request.get('/acws/rest/biz/analysis/snapshot/getSourceOption', { params })
}
