import { request as axios } from '@/plugins/axios/index.js'

// 查询人员列表
export function getPersonList(data) {
  const params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    userName: data.userName,
    userType: data.userType,
    status: data.status,
    organizationId: data.organizationId,
    isSelfOrg: data.isSelfOrg?.join(','),
    overQueryFlag: data.overQueryFlag,
  }
  return axios.get('/acws/rest/biz/fireuser/query', { params }).then((res) => {
    return {
      ...res,
      list: res?.items?.map((item) => {
        return {
          ...item,
          status: item.status === '1',
        }
      }),
    }
  })
}

// 获取人员信息
export function getPersonDetail(id) {
  return axios.get(`/acws/rest/biz/fireuser/${id}`)
}

// 获取人员变更信息
export function getPersonRecordDetail(boFireUserId) {
  return axios.get(`/acws/rest/biz/fireuser/operationlog/${boFireUserId}`)
}

// 添加人员
export function addPerson(data) {
  return axios.post('/acws/rest/biz/fireuser/saveOrUpdate', data)
}

// 删除人员
export function deletePerson(data) {
  return axios.post('/acws/rest/biz/fireuser/updateStatusOrDelFlag', data, { noErrorHandler: true })
}

// 启用人员
export function enablePerson(data) {
  return axios.post('/acws/rest/biz/fireuser/updateStatusOrDelFlag', data)
}
