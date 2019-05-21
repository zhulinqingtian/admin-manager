import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import actions from './actions'
import mutations from './mutations'
Vue.use(Vuex)

const state = {
  user: {
    name: '',
    role: '',
    id: ''
  },
  count: 0,
  plat: {
    name: '',
    version: '1.0.0',
    updateTime: '2017-1-4'
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
