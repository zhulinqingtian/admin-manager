/**
 * Mutations是同步改变状态
 */

const mutations = { // 包含了多个直接更新state函数的对象
  INCREMENT (state) {
    state.count = state.count + 1
  },
  DECREMENT (state) {
    state.count = state.count - 1
  },
  GETUSER (state, userInfo) {
    state.user = Object.assign({}, state.user, userInfo)
  },
  GETPLATINFO (state, platInfo) {
    var info = platInfo
    info.updateTime = new Date(info.updateTime)
    state.plat = Object.assign({}, platInfo, info)
  }
}

export default mutations
