import { defineStore } from 'pinia'
import { getUserInfo } from '@/apis/index.js'

const useUserInfo = defineStore('userInfo', {
  state: () => ({
    userInfo: null,
  }),

  actions: {
    init() {
      getUserInfo().then((res) => {
        if (res?.data) {
          this.$state.userInfo = res.data
        }
      })
    },
    getUserInfo(callback) {
      if (!this.$state.userInfo || !this.$state.userInfo.USERMESSAGE) {
        getUserInfo().then((res) => {
          if (res?.data) {
            this.$state.userInfo = res.data
            callback(this.$state.userInfo)
          }
        })
        return
      }
      callback(this.$state.userInfo)
    },
  },

  persist: true
})

export default useUserInfo
