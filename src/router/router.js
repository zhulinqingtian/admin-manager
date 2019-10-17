const MenuLayout = r => require.ensure([], () => r(require('@/components/layout/menuLayout')))
const HelloWorld = r => require.ensure([], () => r(require('@/components/HelloWorld')))
const OptimizeVuex = r => require.ensure([], () => r(require('@/components/optimizeVuex'))) // vuex的引入方式
const NewLists = r => require.ensure([], () => r(require('@/components/news/newsList')))
const CommodityList = r => require.ensure([], () => r(require('@/components/commodity/commoditysList')))

/**
 * banner管理
 */
const BannerManagement = r => require.ensure([], () => r(require('@/components/manager/BannerManagement')))

/**
 * 测试部分
 */
const TestUpload = r => require.ensure([], () => r(require('@/components/test/testUpload')))

export const appRouter = [
  {
    path: '/',
    redirect: '/view/home'
  },
  {
    path: '/view',
    redirect: '/view/home'
  },
  {
    path: '/view/home',
    meta: {title: '首页'},
    component: MenuLayout,
    children: [
      {
        path: '/',
        icon: 'compose',
        name: 'Home.',
        meta: {title: '首页'},
        component: HelloWorld
      }
    ]
  },
  {
    path: '/view/news',
    meta: {title: '新闻'},
    component: MenuLayout,
    children: [
      {
        path: '/',
        icon: 'compose',
        name: 'news',
        meta: {title: '新闻列表'},
        component: NewLists
      }
    ]
  },
  {
    path: '/view/commodity',
    meta: {title: '商品'},
    component: MenuLayout,
    children: [
      {
        path: '/',
        icon: 'compose',
        name: 'commodity',
        meta: {title: '商品列表'},
        component: CommodityList
      }
    ]
  },
  {
    path: '/view/optimizeVuex',
    name: 'OptimizeVuex',
    component: OptimizeVuex
  },
  {
    path: '/view/bannerManager',
    name: 'bannerManager',
    component: BannerManagement
  },
  {
    path: '/view/testUpload',
    title: '测试上传',
    name: 'TestUpload',
    component: TestUpload
  }
]

const routers = [
  ...appRouter
]

/* eslint import/prefer-default-export: 0 */
export default routers
