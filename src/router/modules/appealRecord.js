/*
 * @version: v 1.0.0
 * @Github: https://github.com/GitHubGanKai
 * @Author: GitHubGanKai
 * @Date: 2021-01-01 17:05:34
 * @LastEditors: gankai
 * @LastEditTime: 2021-01-02 14:29:50
 * @FilePath: /refactor-with-vue3/src/router/module/appealRecord.js
 */
export default [
  {
    path: '/order/appealRecord',
    name: 'appealRecord',
    meta: {
      index: 12
    },
    component: () => import('@/views/old/order/appealRecord.vue')
  }
]
