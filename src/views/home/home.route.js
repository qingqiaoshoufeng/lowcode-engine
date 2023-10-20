export default [{
  path: '/index',
  name: 'Home',
  meta: {
    index: 2
  },
  component: () => import('@/views/home/index.vue')
}]
  