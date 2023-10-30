import { computed, ref, unref } from 'vue'

/**
 * 封装获取列表
 * @param {function} getListFn 请求列表方法
 * @param {boolean} immediate 是否在初始化时加载，默认: `false`
 * @param {function} transformQuery 加工转换搜索数据
 * @param {function} transformRes 加工转换返回数据
 * @param {object} paginationKeys 分页数据key值映射
 * 将paginationKeys放在第一个参数里面，方便通过偏函数处理，统一处理分页数据的key
 * 如：
 * import { partial } from 'lodash'
 * const getList = partial(useList, { page: 'curPage', limit: 'countPerPage', list: 'currentData'})
 * 此时，getList 函数已经处理好了分页的key，以后所有的列表都可以通过 getList去获取就好
 */
export function useList(paginationKeys = {}, { getListFn, transformQuery, transformRes, immediate = false }) {
  const page = ref(1)
  const limit = ref(20)
  const total = ref(0)
  const query = ref({})

  const _query = computed(() => {
    const pagination = {
      [paginationKeys.page || 'page']: page.value,
      [paginationKeys.limit || 'limit']: limit.value,
    }

    return {
      ...pagination,
      ...(transformQuery ? transformQuery({ ...unref(query), ...pagination }) : query.value),
    }
  })

  const list = ref([])
  const loading = ref(false)
  function loadList() {
    loading.value = true
    return new Promise((resolve, reject) => {
      getListFn(_query.value)
        .then((res) => {
          const resData = transformRes ? transformRes(res) : res
          list.value = resData[paginationKeys.list || 'list']
          total.value = resData[paginationKeys.total || 'total']
          // page.value = resData[paginationKeys.page || 'page']
          // limit.value = resData[paginationKeys.limit || 'limit']
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {
          loading.value = false
        })
    })
  }

  immediate && loadList()

  function filter() {
    page.value = 1
    list.value = []
    return loadList()
  }

  function loadMore(index, pageSize) {
    page.value = index
    limit.value = pageSize
    loading.value = true
    return getListFn(_query.value)
      .then((res) => {
        const resData = transformRes ? transformRes(res) : res
        list.value.push(...resData[paginationKeys.list || 'list'])
        total.value = resData[paginationKeys.total || 'total']
      })
  }

  function pageChange(index, pageSize) {
    page.value = index
    limit.value = pageSize
    loadList()
  }

  return {
    query,
    page,
    limit,
    total,
    list,
    loading,
    loadList,
    loadMore,
    filter,
    pageChange,
  }
}

/**
 * 封装获取详情
 * @param {function} getDetailFn 请求详情方法
 * @param {function} transformRes 加工转换返回数据
 */
export function useDetail({ getDetailFn, transformRes }) {
  const detail = ref({})

  const loading = ref(false)
  function loadDetail() {
    loading.value = true
    return new Promise((resolve, reject) => {
      getDetailFn()
        .then((res) => {
          const resData = transformRes ? transformRes(res) : res
          detail.value = resData
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {
          loading.value = false
        })
    })
  }

  return {
    detail,
    loading,
    loadDetail,
  }
}

/**
 * 封装表单提交
 * @param {function} callBackFn 提交或修改成功后的回调方法
 * @param {function} validateFn 验证表单方法，默认为 `() => Promise.resolve()`
 * @param {function} submitFn 提交表单方法
 * @param {function} modifyFn 修改表单方法
 */
export function useSubmit(callBackFn, { validateFn = () => Promise.resolve(), submitFn, modifyFn }) {
  const loading = ref(false)
  function handleSubmit(type) {
    return () => {
      loading.value = true
      return new Promise((resolve, reject) => {
        validateFn()
          .then(async () => {
            let res
            switch (type) {
            case 'submit':
              res = await submitFn()
              break

            case 'modify':
              res = await modifyFn()
              break
            }
            return { ...res, type }
          })
          .then((res) => {
            resolve()
            callBackFn && callBackFn(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            loading.value = false
          })
      })
    }
  }

  return {
    loading,
    submit: submitFn && handleSubmit('submit'),
    modify: modifyFn && handleSubmit('modify'),
  }
}

/**
 * 封装删除某项
 * @param {function} callBackFn 删除成功后的回调方法
 * @param {function} deleteItemFn 删除方法
 */
export function useDeleteItem(callBackFn, { deleteItemFn }) {
  const loading = ref(false)
  function submitDelete() {
    loading.value = true
    return new Promise((resolve, reject) => {
      deleteItemFn()
        .then(() => {
          callBackFn && callBackFn()
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {
          loading.value = false
        })
    })
  }

  return {
    loading,
    submitDelete,
  }
}
