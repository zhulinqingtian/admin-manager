// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import iView from 'iview' // 导入组件库
import 'iview/dist/styles/iview.css' // 导入样式

import App from './App'
import router from './router'

Vue.prototype.$http = axios

Vue.use(iView)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
