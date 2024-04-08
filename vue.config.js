const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  lintOnSave: false,
  publicPath: './',
  outputDir: resolve('cordova/www'),
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
