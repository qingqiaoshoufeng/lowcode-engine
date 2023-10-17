import { axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

// 获取119警情列表
export function getFireWarningList(data) {
  return axios.get('/acws/rest/biz/firewarningyyj/warningyyj/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      status: data.status,
      warningDateStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      warningDateEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      warningArea: cloneDeep(data.warningArea)?.pop(),
      warningCodeYyj: data.warningCodeYyj,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}

// 获取119警情详情
export function getFireWarningDetail119(id) {
  return axios.get(`/acws/rest/biz/firewarningyyj/warningyyj/${id}`)
}

// 119警情挂起
export function hangupFireWarning(data) {
  return axios.post('/acws/rest/biz/firewarningyyj/updatewarningyyj', data)
}
