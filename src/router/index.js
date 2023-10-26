import autoRegisteredRoutes from './routeRegister.js'
import { createRouter, createWebHistory ,createWebHashHistory } from 'vue-router'

const indexRouter = {
  path: '/',
  component: () => import('@/views/old/index'),
  redirect: '/home',
  children: []
}
indexRouter.children = autoRegisteredRoutes()

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


const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to,from,next)=>{
  if(localStorage.token){
    next()
  }else{
    if(to.path === '/login'){
      next();
    }else {
      next({
        path:'/login',
      });
    }
  }
})


export default router
