import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

import cart from './module/cart'
import search from './module/search'
import dict from './module/dict'
import rules from './module/rules'
import userInfo from './module/userInfo'
import menuInfo from './module/menuInfo'
import setting from './module/setting'

export default createStore({
  modules: {
    cart,
    search,
    dict,
    rules,
    userInfo,
    menuInfo,
    setting
  },
  strict: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'production-h5',
  plugins: [
    createPersistedstate({
      key: 'saveInfo',
      paths: ['dict', 'rules','userInfo','menuInfo']
    })
  ]
})
