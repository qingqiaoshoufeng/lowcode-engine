export default [{
  path: '/noticeList',
  name: 'NoticeList',
  meta: {
    index: 2,
    keepAlive: true,
  },
  component: () => import('@/views/noticeList/NoticeList.vue')
}]
    