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
        'Content-Type': 'application/jsoncharset=UTF-8'
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

export function fetchJson (url, param = {}, method = 'get') {
  return new Promise((resolve, reject) => {
    const config = {method, url}
    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    if (method === 'get') {
      config.params = param
    } else {
      // `data` is the data to be sent as the request body
      // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
      // When no `transformRequest` is set, must be of one of the following types:
      // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
      // - Browser only: FormData, File, Blob
      // - Node only: Stream, Buffer
      config.data = param
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }

    axios(config)
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error.data)
      })
  })
};

export default {
  JH_news (params) {
    return fetch('/news/index', params, 'get')
  },
  getCommodityList (params) {
    return fetch('/get/commodity/list', params, 'get')
  },
  getBannerList (params) {
    return fetch('/get/banner/list', params, 'get')
  },
  moveBanner (params) {
    return fetch('/get/banner/moveBanner', params, 'get')
  },
  addBannerInfo (params) {
    return fetch('/get/banner/add', params, 'get')
  },
  uploadImg (param) {
    return fetchJson('/api/test/gxq/upload_imgs', param, 'post')
  }
}
