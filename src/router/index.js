import Vue from 'vue'
import Router from 'vue-router'

// import Menu from '@/components/Menu'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const Menu = r => require.ensure([], () => r(require('@/components/Menu')))
const HelloWorld = r => require.ensure([], () => r(require('@/components/HelloWorld')))

export default new Router({
  routes: [
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
      component: Menu,
      children: [
        {
          path: '/',
          icon: 'compose',
          name: 'Home.',
          meta: {title: '首页'},
          component: HelloWorld
        }
      ]
    }
  ]
})
