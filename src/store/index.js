/*
 * @version: v 1.0.0
 * @Github: https://github.com/GitHubGanKai
 * @Author: GitHubGanKai
 * @Date: 2021-01-01 17:19:50
 * @LastEditors: gankai
 * @LastEditTime: 2021-01-02 20:35:02
 * @FilePath: /refactor-with-vue3/src/store/index.js
 */

import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

import cart from './module/cart'
import search from './module/search'
import dict from './module/dict'
import rules from './module/rules'
import userInfo from './module/userInfo'

export default createStore({
  modules: {
    cart,
    search,
    dict,
    rules,
    userInfo
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    createPersistedstate({
      key: 'saveInfo',
      paths: ['dict', 'rules','userInfo']
    })
  ]
})
