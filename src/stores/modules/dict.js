import { defineStore } from 'pinia'
import { getFireWarningType } from '@/apis/index.js'

const useSystemDict = defineStore('systemDict', {
  state: () => ({
    systemDicts: [],
    systemDictsAll: [], // 包含已删除字典
  }),

  actions: {
    init:async function() {
      await getFireWarningType().then((res) => {
        if (res && res.items) {
          this.$state.systemDicts = res.items
        }
      })
      await getFireWarningType({ allFlag: true }).then((res) => {
        if (res && res.items) {
          this.$state.systemDictsAll = res.items
        }
      })
      return true
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
    filterDicts(dictType, transformRes, callback) {
      if (Array.isArray(dictType)) {
        const filters = {}
        dictType.forEach((temp) => {
          filters[temp] = this.$state.systemDicts.filter(item => item.dictType === temp)
        })
        callback(transformRes ? transformRes(filters) : filters)
      }
      else {
        const filters = this.$state.systemDicts.filter(item => item.dictType === dictType)
        callback(transformRes ? transformRes(filters) : filters)
      }
    },
    filterDictsAll(dictType, transformRes, callback) {
      if (Array.isArray(dictType)) {
        const filters = {}
        dictType.forEach((temp) => {
          filters[temp] = this.$state.systemDictsAll.filter(item => item.dictType === temp)
        })
        callback(transformRes ? transformRes(filters) : filters)
      }
      else {
        const filters = this.$state.systemDictsAll.filter(item => item.dictType === dictType)
        callback(transformRes ? transformRes(filters) : filters)
      }
    },
  },
})

export default useSystemDict
