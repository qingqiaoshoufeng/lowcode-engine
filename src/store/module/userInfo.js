import { setStore } from "../../utils/util"
import { getUserInfo } from '@/apis/index.js'
const state = {
  userInfo: null,
}
const getters = {
  userInfo: (state) => state.userInfo,
  permission: (state)=>{
    const permissionList = state?.userInfo?.PERMISSIONLIST || []
    const result = permissionList.reduce((current,item)=>{
      current[item.perms] = true
      return current
    },{})
    return result
  }
}
const mutations = {
  setUserInfo(state, val) {
    state.userInfo = val
  }
}
const actions = {
  init:async({commit})=> {
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