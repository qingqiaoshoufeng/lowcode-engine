/*
 * @version: v 1.0.0
 * @Github: https://github.com/GitHubGanKai
 * @Author: GitHubGanKai
 * @Date: 2021-01-01 17:05:34
 * @LastEditors: gankai
 * @LastEditTime: 2021-01-02 14:29:11
 * @FilePath: /refactor-with-vue3/src/router/module/advertisementPool.js
 */
export default [{
  path: '/pool/advertisementPool',
  name: 'advertisementPool',
  meta: {
    index: 15
  },
  component: () => import('@/views/old/pool/advertisementPool.vue')
}]
