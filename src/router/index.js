/* eslint semi: ["error", "never"] */
import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import routers from './router'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: routers
}

const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

/* eslint import/prefer-default-export: 0 */
export default router
