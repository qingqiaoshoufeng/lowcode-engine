
import { request as axios } from '@/plugins/axios/index.js'

// 火灾填报列表
export function getFireReportList(data) {
  return axios.get('/acws/rest/biz/fireinfo/queryfireinfo', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      draftFlag: data.draftFlag,
    },
  }).then((res) => {
    return {
      ...res,
      list: res.data,
    }
  })
}