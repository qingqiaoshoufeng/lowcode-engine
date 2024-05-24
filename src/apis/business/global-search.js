import { request } from '@/plugins/axios/index.js'

// 全局搜索查询
export function getGlobalSearchList(data) {
  if (!data.keyword) {
    return Promise.resolve({
      total: 0,
      list: [],
    })
  }
  return request.get('/acws/rest/biz/analysis/globalsearch/query', {
    params: {
      offset: (data.page - 1) * data.limit + 1,
      limit: data.limit,
      type: data.type,
      keyword: data.keyword,
    },
  }).then((res) => {
    let list = res.data?.fireWarningList || res.data?.fireDispatchList || res.data?.fireDispatchHeadList || res.data?.fireInfoList
    const total = res.data?.total >= 0 ? res.data?.total : res.data?.fireWarning?.warningCount || res.data?.fireDispatch?.dispatchCount || res.data?.fireDispatchHead?.dispatchCount || res.data?.fireInfo?.fireCount
    if (list) {
      list = list.map((item) => {
        return {
          ...item,
          highlightMul: item.highlightStr?.replaceAll(';', '<br/>'),
        }
      })
    }
    return {
      ...res.data,
      total: Number(total),
      list,
    }
  })
}

// 全局搜索历史记录
export function getGlobalHistory(params) {
  return request.get('/acws/rest/biz/analysis/globalsearch/history', { params })
}
