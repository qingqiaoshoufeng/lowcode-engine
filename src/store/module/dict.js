import { getFireWarningType } from '@/apis/index.js'

const filterDicts = (state, dictType, transformRes, callback , detail) => {
  if (Array.isArray(dictType)) {
    const filters = {}
    dictType.forEach((temp) => {
      if (detail === 3) {
        filters[temp] = state.systemDictsUnKnow.filter(item => item.dictType === temp)
      }
      else if (detail) {
        filters[temp] = state.systemDictsAll.filter(item => item.dictType === temp)
      }
      else {
        filters[temp] = state.systemDicts.filter(item => item.dictType === temp)
      }
    })
    const result = transformRes ? transformRes(filters) : filters
    callback && callback(result)
    return result
  }
  else {
    let filters = null
    if (detail === 3) {
      filters = state.systemDictsUnKnow.filter(item => item.dictType === dictType)
    }
    else if (detail) {
      filters = state.systemDictsAll.filter(item => item.dictType === dictType)
    }
    else {
      filters = state.systemDicts.filter(item => item.dictType === dictType)
    }
    const result = transformRes ? transformRes(filters) : filters
    callback && callback(result)
    return result
  }
}
const state = {
  systemDicts: [], // 不包含已删除、未知字典
  systemDictsAll: [], // 包含已删除、包含未知字典
  systemDictsUnKnow: [], // 不包含已删除、包含未知字典
}

const getters = {
  filterDicts: (state) => (dictType, transformRes, detail) => {
    if (Array.isArray(dictType)) {
      const filters = {}
      dictType.forEach((temp) => {
        if (detail === 3) {
          filters[temp] = state.systemDictsUnKnow.filter(item => item.dictType === temp)
        }
        else if (detail) {
          filters[temp] = state.systemDictsAll.filter(item => item.dictType === temp)
        }
        else {
          filters[temp] = state.systemDicts.filter(item => item.dictType === temp)
        }
      })
      const result = transformRes ? transformRes(filters) : filters
      return result
    }
    else {
      let filters = null
      if (detail === 3) {
        filters = state.systemDictsUnKnow.filter(item => item.dictType === dictType)
      }
      else if (detail) {
        filters = state.systemDictsAll.filter(item => item.dictType === dictType)
      }
      else {
        filters = state.systemDicts.filter(item => item.dictType === dictType)
      }
      const result = transformRes ? transformRes(filters) : filters
      return result
    }
  },
  getSystemDictSync:(state) => (dictType, transformRes, callback, detail = false)=> {
    if (detail === 3) {
      if (!state.systemDictsUnKnow || state.systemDictsUnKnow.length <= 0) {
        getFireWarningType({ displayClean: true }).then((res) => {
          if (res && res.items) {
            state.systemDictsUnKnow = res.items
            filterDicts(state, dictType, transformRes, callback, detail)
          }
        })
        return
      }
      filterDicts(state, dictType, transformRes, callback, detail)
    }
    if (detail) {
      if (!state.systemDictsAll || state.systemDictsAll.length <= 0) {
        getFireWarningType({ allFlag: true, displayClean: true }).then((res) => {
          if (res && res.items) {
            state.systemDictsAll = res.items
            filterDicts(state, dictType, transformRes, callback, detail)
          }
        })
        return
      }
      filterDicts(state, dictType, transformRes, callback, detail)
    }
    if (!state.systemDicts || state.systemDicts.length <= 0) {
      getFireWarningType().then((res) => {
        if (res && res.items) {
          state.systemDicts = res.items
          filterDicts(state, dictType, transformRes, callback, detail)
        }
      })
      return
    }

    filterDicts(state, dictType, transformRes, callback, detail)
  },
}
const mutations = {
  setSystemDicts(state, val) {
    state.systemDicts = val.items
  },
  setSystemDictsAll(state, val) {
    state.systemDictsAll = val.items
  },
  setSystemDictsUnKnow(state, val) {
    state.systemDictsUnKnow = val.items
  }
}

const actions = {
  init:async({commit})=>{
    return Promise.all([
      getFireWarningType().then((res) => {
        if (res && res.items) {
          commit('setSystemDicts', res)
        }
      }),
      getFireWarningType({ allFlag: true, displayClean: true }).then((res) => {
        if (res && res.items) {
          commit('setSystemDictsAll', res)
        }
      }),
      getFireWarningType({ displayClean: true }).then((res) => {
        if (res && res.items) {
          commit('setSystemDictsUnKnow', res)
        }
      })
    ])
  },
  getSystemDictSync(dictType, transformRes, callback, detail = false) {
    if (detail === 3) {
      if (!this.$state.systemDictsUnKnow || this.$state.systemDictsUnKnow.length <= 0) {
        getFireWarningType({ displayClean: true }).then((res) => {
          if (res && res.items) {
            this.$state.systemDictsUnKnow = res.items
            this.filterDicts(dictType, transformRes, detail)
          }
        })
        return
      }
    }
    else if (detail) {
      if (!this.$state.systemDictsAll || this.$state.systemDictsAll.length <= 0) {
        getFireWarningType({ allFlag: true, displayClean: true }).then((res) => {
          if (res && res.items) {
            this.$state.systemDictsAll = res.items
            this.filterDicts(dictType, transformRes, detail)
          }
        })
        return
      }
    }
    else if (!this.$state.systemDicts || this.$state.systemDicts.length <= 0) {
      getFireWarningType().then((res) => {
        if (res && res.items) {
          this.$state.systemDicts = res.items
          this.filterDicts(dictType, transformRes, detail)
        }
      })
      return
    }
    this.filterDicts(dictType, transformRes, detail)
  },
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
