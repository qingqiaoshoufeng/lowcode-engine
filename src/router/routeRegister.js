const autoRegisteredRoutes = () => {
  let routes = [
    {
      path: '/index',
      name: 'index',
      meta: {
        index: 1
      },
      component:import(/* webpackChunkName: "index" */'@/views/home/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        index: 1
      },
      component:import(/* webpackChunkName: "login" */'@/views/login/index.vue')
    },
  ]
  let files = []
  files = require.context('../views', true, /route\.js$/)
  files.keys().forEach((key) => {
    routes = [...routes, ...(files(key).default || files(key))]
  })
  return routes
}

export default autoRegisteredRoutes
