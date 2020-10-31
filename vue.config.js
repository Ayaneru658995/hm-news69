module.exports = {
  devServer: {
    open: true,
    proxy: {
      '/mgapi': {
        // 代理的目标服务器地址
        // 目标 : https://news-at.zhihu.com/api/4/news/latest
        //        https://news-at.zhihu.com/api/4/news/latest
        target: 'https://www.zhihu.com',
        pathRewrite: { '^/mgapi': '' },
        // 设置https
        secure: false,
        // 必须设置该项
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => {
    config.externals = {
      // 键 : 表示导入包语法 form 后面跟着的名称  import from 'vue-router'
      // 值 : 表示 script 引入的js文件时, 在全局环境中的变量名称
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }
  },
  // 配置 px 转 rem的
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            // rem 的单位  填设计稿的 1/10
            remUnit: 37.5,
          }),
        ],
      },
    },
  },
}
