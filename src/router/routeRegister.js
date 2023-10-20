// const autoRegisteredRoutes = (val) => {
//   let routes = []
//   let files = []
//   if (val) {
//     files = require.context('../views', true, /route\.js$/)
//     files.keys().forEach((key) => {
//       routes.push(files(key).default)
//     })
//   } else {
//     files = require.context('./modules', true, /\.js$/)
//     files.keys().forEach((key) => {
//       routes = [...routes, ...(files(key).default || files(key))]
//     })
//   }
//   return routes
// }


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
  // files = require.context('../views', true, /\.js$/)
  files.keys().forEach((key) => {
    routes = [...routes, ...(files(key).default || files(key))]
  })
  return routes
}

export default autoRegisteredRoutes
