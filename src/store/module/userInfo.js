import { setStore } from "../../utils/util"
import { getUserInfo } from '@/apis/index.js'
const state = {
  userInfo: null,
}
const getters = {
  userInfo: (state) => state.userInfo,
}
const mutations = {
  setUserInfo(state, val) {
    state.userInfo = val
  }
}
const actions = {
  init({commit}) {
    return getUserInfo().then((res) => {
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