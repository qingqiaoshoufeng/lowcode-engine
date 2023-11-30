import { request } from '@/plugins/axios/index.js'

// 获取查询结果
export function getSearchResult(data) {
  // const formData = setSearchTypeFormData(data)
  const params = {
    ...data,
    // ...formData,
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    fireType: data.fireType,
    queryOrgId: data.queryOrgId,
  }
  return request.post('/acws/rest/biz/analysis/comprehensive/query', params).then((res) => {
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
    const list = res.data?.fireWarningList || res.data?.fireDispatchList || res.data?.fireDispatchHeadList || res.data?.fireInfoList
    const total = res.data?.fireWarning?.warningCount || res.data?.fireDispatch?.dispatchCount || res.data?.fireDispatchHead?.dispatchCount || res.data?.fireInfo?.fireCount
    return {
      ...res.data,
      total: Number(total),
      list,
    }
  })
}

// 获取我的查询
export function getMySearchList(data) {
  const params = {
    offset: (data.page - 1) * data.limit + 1,
    limit: data.limit,
    searchScene: 1,
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

// 删除我的查询
export function deleteMySearch(data) {
  return request.post('/acws/rest/biz/analysis/mysearch/delete', data, {
    noErrorHandler: true,
  })
}

// 保存我的查询条件
export function saveMySearchParams(params) {
  return request.post('/acws/rest/biz/analysis/mysearch/addcomprehensivequery', params)
}

// 保存我的查询条件
export function saveParamsAfter(params) {
  return request.post('/acws/rest/biz/analysis/mysearch/comprehensivequery', params)
}

// 保存我的查询条件，不包含查询项
export function updateMySearchParams(params) {
  return request.post('/acws/rest/biz/analysis/mysearch/updatemysearch', params)
}

// 获取我的查询条件详情
export function getMySearchDetail(id) {
  return request.get(`/acws/rest/biz/analysis/mysearch/queryinfo/${id}`)
}
