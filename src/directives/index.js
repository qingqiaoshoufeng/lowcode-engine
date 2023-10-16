const getDirectives = () => {
  let files = []
  let directives = {}
  files = require.context('../directives', true, /\.js$/)
  files.keys().forEach((key) => {
    const { alias, config } = files(key).default
    if (alias !== 'index') {
      directives[alias] = config
    }
  })
  return directives
}
export default {
  install(app) {
    const directives = getDirectives()
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    });
  },
  alias: 'index'
}