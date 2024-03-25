import autoRegisteredRoutes from './routeRegister.js'
import { createRouter, createWebHistory ,createWebHashHistory } from 'vue-router'

const indexRouter = {
  path: '/',
  component: () => import('@/views/index.vue'),
  redirect: '/home',
  children: []
}
indexRouter.children = autoRegisteredRoutes()

const routes = [
  indexRouter,
]


const router = createRouter({
  history: createWebHashHistory(),
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
        replace: true,
      });
    }
  }
})


export default router
