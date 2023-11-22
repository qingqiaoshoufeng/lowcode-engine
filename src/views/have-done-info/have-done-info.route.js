export default [{
  path: '/have-done-info/:type',
  name: 'haveDoneInfo',
  props:true,
  meta: {
    index: 2
  },
  component: () => import('@/views/have-done-info/index')
}]
