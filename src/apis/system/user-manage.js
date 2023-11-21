import { request } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'

// 查询用户列表
export function getUserList(data) {
  const params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    beginTime: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    loginUserName: data.loginUserName,
    userName: data.userName,
    isSelfOrg: data.isSelfOrg?.join(','),
    mobile: data.mobile,
    roleIds: data.roleIds?.join(','),
    active: data.active,
    menuIds: data.menuIds?.map(item => item.id)?.join(','),
    orgId: data.orgId,
  }
  return request.get('/acws/rest/biz/common/user/query', { params }).then((res) => {
    return {
      ...res,
      list: res?.items,
    }
  })
}

// 获取用户信息
export function getUserDetail(id) {
  if (id) {
    return request.get(`/acws/rest/biz/common/user?id=${id}`)
  }
  return request.get('/acws/rest/biz/common/user')
}

// 添加用户
export function addUser(data) {
  if (data.userId) {
    return request.post('/acws/rest/biz/common/user/updateuser', data)
  }
  return request.post('/acws/rest/biz/common/user/add', data)
}

// 删除用户
export function deleteUser(data) {
  return request.post('/acws/rest/biz/common/user/deleteuser', data, { noErrorHandler: true })
}

// 重置密码
export function resetPassword(data) {
  return request.post('/acws/rest/biz/common/user/reset', data, { noErrorHandler: true })
}

// 启用用户
export function enableUser(data) {
  return request.post('/acws/rest/biz/common/user/setstatus', data)
}

// 修改密码
export function updatePwd(data) {
  return request.post('/acws/rest/biz/common/user/updatePwd', data)
}

// 用户头像
export function uploadAvatar(params) {
  return request.post('/acws/rest/biz/common/user/attachments', params, { noErrorHandler: true })
}
