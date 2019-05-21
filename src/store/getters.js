/**
 * getters从表面是获得的意思，可以把他看作在获取数据之前进行的一种再编辑,相当于对数据的一个过滤和加工。
 * getters就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
 */

// 当读取属性值时自动调用并返回属性值
export const user = store => {
  return store.user
}

export const plat = store => {
  return store.plat
}
