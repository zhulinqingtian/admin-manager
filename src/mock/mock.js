import DATA from './data'
// 引入mockjs
const Mock = require('mockjs')

// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/news/index', 'post', DATA.news)
