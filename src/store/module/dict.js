import { getFireWarningType } from '@/apis/index.js'

const filterDicts =( state,dictType, transformRes, callback , detail) => {
  if (detail) {
    if (Array.isArray(dictType)) {
      const filters = {}
      dictType.forEach((temp) => {
        filters[temp] = state.systemDictsAll.filter(item => item.dictType === temp)
      })
      const result = transformRes ? transformRes(filters) : filters
      callback && callback(result)
      return result
    }
    else {
      const filters = state.systemDictsAll.filter(item => item.dictType === dictType)
      const result = transformRes ? transformRes(filters) : filters
      callback && callback(result)
      return result
    }
  } else {
    if (Array.isArray(dictType)) {
      const filters = {}
      dictType.forEach((temp) => {
        filters[temp] = state.systemDicts.filter(item => item.dictType === temp)
      })
      const result = transformRes ? transformRes(filters) : filters
      callback(result)
      return result
    }
    else {
      const filters = state.systemDicts.filter(item => item.dictType === dictType)
      const result = transformRes ? transformRes(filters) : filters
      callback(result)
      return result
    }
  }
}
const state = {
  systemDicts: [],
  systemDictsAll: [], // 包含已删除字典
}
const getters = {
  filterDicts: (state) => (dictType, transformRes, detail) => {
    if (detail) {
      if (Array.isArray(dictType)) {
        const filters = {}
        dictType.forEach((temp) => {
          filters[temp] = state.systemDictsAll.filter(item => item.dictType === temp)
        })
        const result = transformRes ? transformRes(filters) : filters
        // callback(result)
        return result
      }
      else {
        const filters = state.systemDictsAll.filter(item => item.dictType === dictType)
        const result = transformRes ? transformRes(filters) : filters
        // callback(result)
        return result
      }
    } else {
      if (Array.isArray(dictType)) {
        const filters = {}
        dictType.forEach((temp) => {
          filters[temp] = state.systemDicts.filter(item => item.dictType === temp)
        })
        const result = transformRes ? transformRes(filters) : filters
        // callback && callback(result)
        return result
      }
      else {
        const filters = state.systemDicts.filter(item => item.dictType === dictType)
        const result = transformRes ? transformRes(filters) : filters
        // callback(result)
        return result
      }
    }
  },
  getSystemDictSync:(state) =>(dictType, transformRes, callback, detail = false)=> {
    if (detail) {
      if (!state.systemDictsAll || state.systemDictsAll.length <= 0) {
        getFireWarningType({ allFlag: true }).then((res) => {
          if (res && res.items) {
            state.systemDictsAll = res.items
            state.filterDictsAll(dictType, transformRes, callback)
          }
        })
        return
      }
      state.filterDictsAll(dictType, transformRes, callback)
    }
    if (!state.systemDicts || state.systemDicts.length <= 0) {
      getFireWarningType().then((res) => {
        if (res && res.items) {
          state.systemDicts = res.items
          filterDicts(dictType, transformRes, callback)
        }
      })
      return
    }

    filterDicts(state,dictType, transformRes, callback)
  },
}
const mutations = {
  setSystemDicts(state, val) {
    state.systemDicts = val.items
  },
  setSystemDictsAll(state, val) {
    state.systemDictsAll = val.items
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
      getFireWarningType({ allFlag: true }).then((res) => {
        if (res && res.items) {
          commit('setSystemDictsAll', res)
        }
      })
    ])
  },
  getSystemDictSync(dictType, transformRes, callback, detail = false) {
    if (detail) {
      if (!this.$state.systemDictsAll || this.$state.systemDictsAll.length <= 0) {
        getFireWarningType({ allFlag: true }).then((res) => {
          if (res && res.items) {
            this.$state.systemDictsAll = res.items
            this.filterDictsAll(dictType, transformRes, callback)
          }
        })
        return
      }
      this.filterDictsAll(dictType, transformRes, callback)
    }
    if (!this.$state.systemDicts || this.$state.systemDicts.length <= 0) {
      getFireWarningType().then((res) => {
        if (res && res.items) {
          this.$state.systemDicts = res.items
          this.filterDicts(dictType, transformRes, callback)
        }
      })
      return
    }
    this.filterDicts(dictType, transformRes, callback)
  },
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
