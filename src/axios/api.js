import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

// 封装axios的post请求
export function fetch (url, params = {}, method = 'get') {
  return new Promise((resolve, reject) => {
    const config = { method, url }

    if (method === 'get') {
      config.params = params
    } else {
      config.data = params
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }

    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {
  JH_news (params) {
    return fetch('/news/index', params, 'get')
  }
}
