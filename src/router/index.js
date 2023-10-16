import autoRegisteredRoutes from './routeRegister.js'
import { createRouter, createWebHistory } from 'vue-router'

const indexRouter = {
  path: '/',
  component: () => import('@/views/old/index'),
  redirect: '/index',
  children: []
}
indexRouter.children = autoRegisteredRoutes(1)
const routes = [
  indexRouter,
  {
    path: '/nopermission',
    name: 'nopermission',
    meta: {
      index: 1
    },
    component: () => import('@/views/old/error/NoPermission')
  },
  {
    path: '/*',
    name: '404',
    meta: {
      index: 1
    },
    component: () => import('@/views/old/error/404')
  },
]



export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
