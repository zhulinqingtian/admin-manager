// webpack.base.conf.js是开发和生产共同使用提出来的基础配置文件，主要实现配制入口，配置输出环境，配置模块resolve和插件等

// path.join将路径片段进行拼接
// path.resolve将以/开始的路径片段作为根目录，在此之前的路径将会被丢弃
// path.join('/a', '/b')    // 'a/b'
// path.resolve('/a', '/b') // '/b'

'use strict'
const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) { // 拼接出绝对路径
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: { // 配置入口，默认为单页面所以只有app一个入口
    app: './src/main.js'
  },
  output: { // 配置出口，默认是/dist作为目标文件夹的路径
    path: config.build.assetsRoot, // 路径
    filename: '[name].js', // 文件名
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath // 公共存放路径
  },
  resolve: {
    // 自动的扩展后缀，比如一个js文件，引用的时候可以不写.js扩展名
    extensions: ['.js', '.vue', '.json'],

    // 创建路径的别名，比如增加'components': resolve('src/components')等
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  // 使用插件配置相应文件的处理方法
  module: {
    rules: [
      { test: /iview.src.*?js$/, loader: 'babel' },
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      // {
      //   test: /.css$/,    // 是一个正则,处理后缀名为css的文件,匹配到的文件名后缀
      //   loaders: ["style-loader", "css-loader"],  // 放加载器,一个加载器写成字符串,两个就写成数组
      //   exclude: "/node_modules" // 要排除的文件夹
      //   // webpack在打包过程中，遇到后缀为css的文件，就会使用style-loader和css-loader去加载这个文件。
      //   // 最后计算完的css，将会使用style-loader生成一个style标签（内容为最终解析完的css代码），放到head标签里。
      //   // 注意：loader是有顺序的，webpack是先将所有css模块依赖解析完得到结果再创建style标签。
      //   // 因此应该把style-loader放在css-loader的前面（webpack loader的执行顺序是从右到左）
      // },
      { // 使用vue-loader将vue文件转化成js的模块
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        // js文件需要通过babel-loader进行编译成es5文件以及压缩等操作
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      { // 图片、音像、字体都使用url-loader进行处理，超过10000会编译成base64
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    // 以下选项是Node.js全局变量或模块，这里主要是防止webpack注入一些Node.js的东西到vue中
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
