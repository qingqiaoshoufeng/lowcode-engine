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


const getRouterBase = () => {
  switch (process.env.NODE_ENV) {
    case 'test-h5':
      return '/fire_alarm_statistics_app_h5_test'
    case 'staging-h5':
      return '/fire_alarm_statistics_app_h5_staging'
    case 'production-h5':
      return '/fire_alarm_statistics_app_h5_production'
    default:
      return ''
  }
}

const router = createRouter({
  base: getRouterBase(),
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to,from,next)=>{
  if(localStorage.token){
    next()
  }else{
    if(to.path === '/login' || to.path === '/authorization'){
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
