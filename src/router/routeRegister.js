const autoRegisteredRoutes = (val) => {
  let routes = []
  let files = []
  if (val) {
    files = require.context('../views', true, /route\.js$/)
    files.keys().forEach((key) => {
      routes.push(files(key).default)
    })
  } else {
    files = require.context('./modules', true, /\.js$/)
    files.keys().forEach((key) => {
      routes = [...routes, ...(files(key).default || files(key))]
    })
  }
  return routes
}
export default autoRegisteredRoutes
