const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

function getPublicPath() {
  switch (process.env.NODE_ENV) {
    case 'test-h5':
      return './fire_alarm_statistics_app_h5_test/'
    case 'production-h5':
      return './fire_alarm_statistics_app_h5_production/'
    default:
      return './'
  }
}

module.exports = {
  lintOnSave: false,
  publicPath: getPublicPath(),
  outputDir: process.env.NODE_ENV?.indexOf('-h5') > -1 ? 'dist' : resolve('cordova/www'),
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  },
  configureWebpack: {
    devServer: {
      disableHostCheck: true, // 禁用webpack热重载检查 解决热更新失效问题
      proxy: {
        '/acws': {
          // target: 'http://10.13.5.47:8080',
          // target: 'http://172.18.203.18:8080', 
          target: 'http://10.13.5.47:8080',
          // target: 'http://172.18.108.47:8081', // 潘恒
          changeOrigin: true,
          // secure: false,
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
      ]
    }
  }
}
