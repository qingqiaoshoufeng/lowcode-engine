import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

import cart from './module/cart'
import search from './module/search'
import dict from './module/dict'
import rules from './module/rules'
import userInfo from './module/userInfo'
import menuInfo from './module/menuInfo'

export default createStore({
  modules: {
    cart,
    search,
    dict,
    rules,
    userInfo,
    menuInfo
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    createPersistedstate({
      key: 'saveInfo',
      paths: ['dict', 'rules','userInfo']
    })
  ]
})
