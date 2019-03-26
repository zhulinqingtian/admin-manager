// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
/* eslint no-duplicates: 0 */
import iView from 'iview' // 导入组件库
import 'iview/dist/styles/iview.css' // 导入样式

import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
