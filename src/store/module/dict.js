import { getFireWarningType } from '@/apis/index.js'


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
        return transformRes ? transformRes(filters) : filters
      }
      else {
        const filters = state.systemDictsAll.filter(item => item.dictType === dictType)
        return transformRes ? transformRes(filters) : filters
      }
    } else {
      if (Array.isArray(dictType)) {
        const filters = {}
        dictType.forEach((temp) => {
          filters[temp] = state.systemDicts.filter(item => item.dictType === temp)
        })
        return transformRes ? transformRes(filters) : filters
      }
      else {
        const filters = state.systemDicts.filter(item => item.dictType === dictType)
        return transformRes ? transformRes(filters) : filters
      }
    }
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
  init({ state, commit }) {
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
