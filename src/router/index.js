import Vue from 'vue'
import Router from 'vue-router'

// import MenuLayout from '@/components/MenuLayout'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const MenuLayout = r => require.ensure([], () => r(require('@/components/layout/menuLayout')))
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
    }
  ]
})
