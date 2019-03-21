'use strict'
require('./check-versions')(); // check-versions：调用检查版本的文件。加（）代表直接调用该函数

process.env.NODE_ENV = 'production'; // 设置当前是生产环境

// 下面定义常量引入插件
const ora = require('ora'); // 加载动画
const rm = require('rimraf'); // 删除文件
const path = require('path');
const chalk = require('chalk'); // 对文案输出一个彩色的设置
const webpack = require('webpack');
const config = require('../config'); // 默认读取下面的index.js文件
const webpackConfig = require('./webpack.prod.conf');

const spinner = ora('building for production...');
spinner.start(); // 调用start的方法实现加载动画，优化用户体验

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
