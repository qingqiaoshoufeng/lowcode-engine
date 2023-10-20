export default [{
  path: '/home',
  name: 'Home',
  meta: {
    index: 2
  },
  component: () => import('@/views/home/index.vue')
}]
  