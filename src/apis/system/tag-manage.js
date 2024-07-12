import { request as axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'

// 查询标签列表
export function getTagList(data) {
  const params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    tagType: data?.tagType,
    tagRange: data?.tagRange,
    tagStatus: data?.tagStatus,
    tagName: data?.tagName,
    createDateStart: data.time?.[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    createDateEnd: data.time?.[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
  }
  return axios.get('/acws/rest/biz/firetag/firetag/query', { params }).then((res) => {
    return {
      ...res,
      list: res.data,
    }
  })
}

// 获取标签信息
export function getTagDetail(organizationid) {
  return axios.get(`/acws/rest/biz/firetag/firetag/${organizationid}`)
}

// 添加标签
export function addTag(params) {
  return axios.post('/acws/rest/biz/firetag/firetag/save', params)
}

// 删除标签
export function deleteTag(data) {
  return axios.post('/acws/rest/biz/firetag/firetag/delete', data)
}

// 启用标签
export function enableTag(params) {
  return axios.post('/acws/rest/biz/firetag/firetag/save', params)
}
