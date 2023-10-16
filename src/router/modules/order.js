export default [
    {
      path: '/order',
      name: 'order',
      meta: {
        index: 2
      },
      component: () => import('@/views/old/order/index.vue')
    }
  ]