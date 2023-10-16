import { getAllRules } from '@/apis/index.js'

const relations = {
  到场时速合理性校验: 'speedConfig',
  行驶距离合理性校验: 'distanceConfig',
  人车比合理性校验: 'carRateConfig',
  现场被困人数合理性校验: 'trappedConfig',
  轻微火灾标准校验: 'severityConfig',
}

const getters = {}

const state = {
  ruleConfig: {
    speedConfig: null,
    distanceConfig: null,
    carRateConfig: null,
    trappedConfig: null,
    severityConfig: null,
  },
}
const mutations = {
  setRuleConfig(state, val) {
    val.forEach((item) => {
      if (item.ruleContent) {
        const result = JSON.parse(item.ruleContent)?.map((item) => {
          const value = typeof item.value === 'string' && item.value?.indexOf(',') > -1 ? item.value?.split(',').map(temp => Number(temp)) : Number(item.value)
          return {
            ...item,
            value,
          }
        })
        state.ruleConfig[relations[item.ruleName]] = result?.length === 1 ? result[0] : result
      }
    })
  }
}
const actions = {
  init( {state,commit}) {
    return getAllRules().then((res) => {
      if (res?.length > 0) {
        commit('setRuleConfig',res)
      }
    })
  },
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
