import { setStore } from "../../utils/util"
import { getMenuInfo } from '@/apis/index.js'
const state = {
  menuInfo: null,
}
const getters = {
  getMenuInfo: state => state.menuInfo,
  menuInfoList(state){
    const {
      dispatchEditBacklogNum, //出动待修改数量
      fireEditBacklogNum, // 火灾待修改数量
      warningFillBacklogNum, // 警情待填报数量
      dispatchFillBacklogNum, // 出动待填报数量
      fireFillBacklogNum, // 火灾待填报数量
      warningConfirmBacklogNum,  // 警情未确认数量
      warningTransferBacklogNum, // 警情未派发数量
      dispatchReportReviewBacklogNum, // 出动待审核数量
      fireReportReviewBacklogNum, // 火灾待审核数量
      warningReviewBacklogNum, // 警情更正待审批数量
      warningCancelBacklogNum, // 警情作废待审批
      dispatchEditReportBacklogNum, // 出动更正待审批数量
      fireEditReportBacklogNum, // 火灾更正待审批数量
      warningEditBacklogNum,  // 警情待修改数量
      fireCancelBacklogNum
    } = state.menuInfo
    const map = {
      'jingqingxiugai':warningEditBacklogNum,
      'chudongxiugai':dispatchEditBacklogNum,
      'huozaixiugai':fireEditBacklogNum,
      // 'huozaixiugai':warningFillBacklogNum,
      'huozaitianbao':fireFillBacklogNum,
      "chudongtianbao":dispatchFillBacklogNum,
      'jingqingzhuanpai':warningTransferBacklogNum,
      'chudongshenhe':dispatchReportReviewBacklogNum,
      'huozaishenhe':fireReportReviewBacklogNum,
      "jingqinggengzhengshenpi":warningReviewBacklogNum,
      "chudonggengzhengshenpi":dispatchEditReportBacklogNum,
      "huozaigengzhengshenpi":fireEditReportBacklogNum,
      "jingqingzuofeishenpi":warningCancelBacklogNum,
      "jingqingqueren":warningConfirmBacklogNum,
      "huozaizuofeishenpi":fireCancelBacklogNum,
    }
    
    return state.menuInfo.appMenuList.map((item)=>{
      return {
        ...item,
        number:!map[item.iconId] ? 0 : map[item.iconId] < 99 ? map[item.iconId] : '99+'
      }
    })
  }
}
const mutations = {
  setMenuInfo(state, val) {
    state.menuInfo = val
  }
}
const actions = {
  init:async({commit})=> {
    return getMenuInfo().then((res) => {
      if (res) {
        commit('setMenuInfo', res)
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