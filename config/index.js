'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static', // 子目录，一般存放css,js,image等文件
    assetsPublicPath: '/', // 根目录
    proxyTable: {}, // 可利用该属性解决跨域的问题,配置代理

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8666, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true, // 浏览器错误提示
    notifyOnErrors: true, // 跨平台错误提示
    poll: false, // 使用文件系统(file system)获取文件改动的通知devServer.watchOptions
    useEslint: true,
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map', // 增加调试，该属性为原始源代码（仅限行）不可在生产环境中使用
    cacheBusting: true, // 使缓存失效
    cssSourceMap: true // 代码压缩后进行调bug定位将非常困难，于是引入sourcemap记录压缩前后的位置信息记录，当产生错误时直接定位到未压缩前的位置
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'), // index编译后生成的位置和名字，根据需要改变后缀，比如index.php
    assetsRoot: path.resolve(__dirname, '../dist'), // 编译后存放生成环境代码的位置
    assetsSubDirectory: 'static', // js,css,images存放文件夹名
    assetsPublicPath: '/', // 发布的根目录，通常本地打包dist后打开文件会报错，此处修改为./。如果是上线的文件，可根据文件存放位置进行更改路径

    /**
     * Source Maps
     */

    productionSourceMap: true,
    devtool: '#source-map',

    /**
     * unit的 gzip 命令用来压缩文件，gzip模式下需要压缩的文件的扩展名有js和css
     */
    productionGzip: false,
      productionGzipExtensions: ['js', 'css'],
      bundleAnalyzerReport: process.env.npm_config_report
    }
}
