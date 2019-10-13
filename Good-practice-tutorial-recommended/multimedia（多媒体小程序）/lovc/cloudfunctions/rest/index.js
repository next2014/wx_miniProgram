// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  if (event.method === 'GET') {
    return get(event.url, event.data)
  } else if (event.method === 'POST') {
    return post(event.url, event.data)
  }
}

/**
 * GET请求
 * 
 * @param url REST服务地址
 * @param data 请求参数
 */
function get(url, data) {
  if (undefined !== data && '' !== data) {
    let queryString = '?'
    for (let key in data) {
      if (!queryString.endsWith('?')) {
        queryString = queryString.concat('&')
      }
      queryString = queryString.concat(key).concat('=').concat(data[key])
    }
    url = url.concat(queryString)
  }
  return rp(url)
}

/**
 * POST请求
 * 
 * @param url REST服务地址
 * @param data 请求参数
 */
function post(url, data) {
  return rp({
    uri: url,
    method: 'POST',
    body: data,
    json: true
  })
}