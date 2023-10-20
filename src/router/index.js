import autoRegisteredRoutes from './routeRegister.js'
import { createRouter, createWebHistory } from 'vue-router'

const indexRouter = {
  path: '/',
  component: () => import('@/views/old/index'),
  redirect: '/home',
  children: []
}
indexRouter.children = autoRegisteredRoutes(1)
const routes = [
  {
    path: '/index',
    name: 'index',
    meta: {
      index: 1
    },
    component: () =>({}),
    redirect: '/home',
  },
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


const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to,from,next)=>{
  if(localStorage.token){
    next()
  }else{
    to('/login')
  }
})


export default router
