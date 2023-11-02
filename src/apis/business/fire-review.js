
import { request as axios } from '@/plugins/axios/index.js'
import dayjs from 'dayjs'

// 火灾审核列表
export function getFireReviewList(data) {
  return axios.get('/acws/rest/biz/report/reviewlist/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      state: data.state,
      reviewType: '2',
      sendTimeStart: data.time && data.time[0] ? dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      sendTimeEnd: data.time && data.time[1] ? dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      fireCode: data.fireCode,
      fireGroup: data.fireGroup?.length > 0 ? data.fireGroup[0].organizationid : '',
      fireStatus: data.fireStatus?.join(','),
    },
  }).then((res) => {
    return {
      ...res,
      list: res.items,
    }
  })
}