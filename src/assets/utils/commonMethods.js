// 判断是否是空对象
function isEmptyObject (obj) {
  var flag = true
  if (flag) {
    for (let key in obj) {
      if (key) {
        flag = false
        return
      }
    }
  }
  return flag
}

function locationQuery () {
  const query = {}
  window.location.search && window.location.search.slice(1).split('&').forEach(v => {
    const val = v.split('=')
    query[val[0]] = val[1]
  })
  return query
}
export default {
  locationQuery, isEmptyObject
}
