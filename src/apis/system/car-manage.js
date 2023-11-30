import { request as axios } from '@/plugins/axios/index.js'

// 查询车辆列表
export function getCarList(data) {
  const params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    truckType: data.truckType,
    truckCode: data.truckCode,
    truckNumber: data.truckNumber,
    loanFlag: data.loanFlag,
    status: data.status,
    organizationid: data.organizationId,
    isSelfOrg: data.isSelfOrg?.join(','),
    queryLoanFlag: data.queryLoanFlag,
  }
  return axios.get('/acws/rest/biz/firetruck/query', { params }).then((res) => {
    return {
      ...res,
      list: res?.data?.map((item) => {
        return {
          ...item,
          status: item.status === '1',
        }
      }),
    }
  })
}

// 获取车辆信息
export function getCarDetail(boFireTruckId) {
  return axios.get(`/acws/rest/biz/firetruck/getInfo/${boFireTruckId}`)
}

// 获取车辆变更信息
export function getCarRecordDetail(boFireTruckId) {
  return axios.get(`/acws/rest/biz/firetruck/queryOperationLog/${boFireTruckId}`)
}

// 获取各省简称
export function getSimpleName(organizationid) {
  return axios.get(`/acws/rest/biz/common/sysmap/${organizationid}`)
}

// 添加车辆
export function addCar(params) {
  return axios.post('/acws/rest/biz/firetruck/saveOrUpdate', params)
}

// 删除车辆
export function deleteCar(data) {
  return axios.post('/acws/rest/biz/firetruck/updateStatusOrDelFlag', data, { noErrorHandler: true })
}

// 启用车辆
export function enableCar(data) {
  return axios.post('/acws/rest/biz/firetruck/updateStatusOrDelFlag', data)
}
