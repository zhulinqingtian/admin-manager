import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  name: '123',
  count: 1
}

/* eslint no-unused-vars: 0 */
const mutations = {
  add (state) {
    state.count += 1
  },
  reduce (state) {
    state.count -= 1
  }
}

export default new Vuex.Store({
  state
})
