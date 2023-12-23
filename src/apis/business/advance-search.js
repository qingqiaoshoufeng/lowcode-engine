import { request } from '@/plugins/axios/index.js'

function getAdvanceSearchParams(data) {
  return {
    ...data,
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
  }
}

export function getAdvanceSearchInfo(data) {
  const params = getAdvanceSearchParams(data)
  return request.post('/acws/rest/biz/analysis/senior/queryresult', params)
}

// 获取查询结果
export function getAdvanceSearchResult(data) {
  const params = getAdvanceSearchParams(data)
  return request.post('/acws/rest/biz/analysis/senior/query', params).then(async (res) => {
    if (res.data?.fireWarningList) {
      res.data.fireWarningList = res.data.fireWarningList.map((item) => {
        const dispatchList = []
        if (item.fireInfoReport) {
          dispatchList.push(item.fireInfoReport)
        }
        if (item.dispatchList?.length > 0) {
          dispatchList.push(...item.dispatchList)
        }
        return {
          ...item,
          dispatchList,
        }
      })
    }
    const infoRef = await getAdvanceSearchInfo(data)
    const list = res.data?.fireWarningList || res.data?.fireDispatchList || res.data?.fireDispatchHeadList || res.data?.fireInfoList
    const total = infoRef.data?.fireWarning?.warningCount || infoRef.data?.fireDispatch?.dispatchCount || infoRef.data?.fireDispatchHead?.dispatchCount || infoRef.data?.fireInfo?.fireCount
    return {
      ...res.data,
      fireWarning: infoRef.data?.fireWarning,
      fireDispatch: infoRef.data?.fireDispatch,
      fireDispatchHead: infoRef.data?.fireDispatchHead,
      fireInfo: infoRef.data?.fireInfo,
      total: Number(total),
      list,
    }
  })
}

// 获取我的查询
export function getAdvanceSearchList(data) {
  const params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    searchScene: 2,
    shareFlag: data.shareFlag,
  }
  return request.get('/acws/rest/biz/analysis/mysearch/query', {
    params,
  }).then((res) => {
    return {
      ...res,
      list: res.items.map((item) => {
        return {
          ...item,
          templateStatus: item.templateStatus === '1',
        }
      }),
    }
  })
}

// 获取查询条件
export function getConfigList(params) {
  return request.get('/acws/rest/biz/analysis/mysearch/getConfigList', { params }).then((res) => {
    return res
  })
}
// 删除我的查询
export function deleteAdvanceSearch(data) {
  return request.post('/acws/rest/biz/analysis/mysearch/delete', data, {
    noErrorHandler: true,
  })
}

// 保存我的查询条件
export function saveAdvanceSearchParams(params) {
  return request.post('/acws/rest/biz/analysis/mysearch/addadvancedquery', params)
}

// 保存我的查询条件，不包含查询项
export function updateAdvanceSearchParams(params) {
  return request.post('/acws/rest/biz/analysis/mysearch/updatemysearch', params)
}

// 获取我的查询条件详情
export function getAdvanceSearchDetail(id) {
  return request.get(`/acws/rest/biz/analysis/mysearch/queryinfo/${id}`)
}

// 高级查询 用户收藏查询项
export function addCollect(params) {
  return request.post('/acws/rest/biz/analysis/mysearch/addcollect', params)
}

// 高级查询 用户取消收藏查询项
export function cancelCollect(params) {
  return request.post('/acws/rest/biz/analysis/mysearch/cancelcollect', params)
}
