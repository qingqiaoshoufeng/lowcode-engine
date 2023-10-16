export default [
    {
      path: '/order/pendingReceipt',
      name: 'pendingReceipt',
      meta: {
        index: 11
      },
      component: () => import('@/views/old/order/pendingReceipt.vue')
    }
  ]