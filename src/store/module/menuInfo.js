import { setStore } from "../../utils/util"
import { getMenuInfo } from '@/apis/index.js'
const state = {
  menuInfo: null,
}
const getters = {}
const mutations = {
  setMenuInfo(state, val) {
    state.menuInfo = val
  }
}
const actions = {
  init({commit}) {
    return getMenuInfo().then((res) => {
      if (res?.data) {
        commit('setUserInfo', res.data)
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