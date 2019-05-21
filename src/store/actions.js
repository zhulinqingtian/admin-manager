/**
 * actions是异步的改变state状态
 */

// 包含了多个对应事件回调函数的对象
const actions = { // 包含了多个对应事件回调函数的对象
  incrementIfOdd ({ commit, state }) { // 带条件的action
    if (state.count % 2 === 1) {
      commit('INCREMENT')
    }
  },
  getUserInfo ({ commit }) {
    var data = {
      name: 'flutter',
      id: '001fa',
      role: 'normal'
    }
    commit('GETUSER', data)
  },
  getPlatInfo ({ commit }) {
    var data = {
      name: '微信',
      version: '10.0.4',
      updateTime: +new Date()
    }
    commit('GETPLATINFO', data)
  }
}

export default actions
