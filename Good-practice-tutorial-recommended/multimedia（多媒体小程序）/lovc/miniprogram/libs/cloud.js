// 云交互API

// 云db对象
const db = wx.cloud.database()
// 默认集合
const lovc = 'lovc'

module.exports = {

  /**
   * 通过云函数访问服务
   * 
   * @param name 云函数名
   * @param params 参数
   * @return {"errMsg": String, "result": Object, "requestID": String}
   */
  call: function(name, params) {
    return wx.cloud.callFunction({
      name: name,
      data: params
    })
  },

  /**
   * 通过tcb-router访问服务
   *
   * @param url router路径
   * @param params 参数
   * @return {"errMsg": String, "result": String, "requestID": String}
   */
  tcbRouter: function(url, params) {
    params.$url = url
    return this.call('router', params)
  },

  /**
   * 云函数-REST访问服务
   *
   * @param url REST服务地址
   * @param 请求方法
   * @param params 请求参数
   * @return {"errMsg": String, "result": String, "requestID": String}
   */
  rest: function(url, method, params) {
    return this.call('rest', {
      url: url,
      method: method,
      data: params
    })
  },

  /**
   * 新增记录
   *
   * @param data 数据
   * @param collection 集合
   * @return {"_id": String, "errMsg": String}
   */
  add: function(data, collection) {
    collection = collection || lovc
    return db.collection(collection).add({
      data: data
    })
  },

  /**
   * 查询记录
   * 
   * @param where 查询条件
   * @param collection 集合
   * @param skip 查询起始位置
   * @param limit 查询数量
   * @return {"data": Array, "errMsg": String}
   */
  query: function(where, collection, skip, limit) {
    where = where || {}
    collection = collection || lovc
    skip = skip || 0
    limit = limit || 10
    return db.collection(collection)
      .where(where).orderBy('time', 'desc')
      .skip(skip).limit(limit).get()
  },

  /**
   * 查询记录数量
   *
   * @param where 查询条件
   * @param collection 集合
   * @return {"total": Number, "errMsg": String}
   */
  count: function(where, collection) {
    collection = collection || lovc
    where = where || {}
    return db.collection(collection).where(where).count()
  },

  /**
   * 新增/全部更新文档
   *
   * @param doc 文档_id
   * @param data 数据
   * @param collection 集合
   * @return {"_id": String, "errMsg": String}
   */
  addDoc: function(doc, data, collection) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).set({
      data: data
    })
  },

  /**
   * 查询文档
   *
   * @param doc 文档_id
   * @param collection 集合
   * @return {"data": Object, "errMsg": String}
   */
  getDoc: function(doc, collection) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).get()
  },

  /**
   * 部分更新文档
   * 
   * @param doc 文档_id   
   * @param data 数据
   * @param collection 集合
   * @return {"stats": Object, "errMsg": String}
   */
  update: function(doc, data, collection) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).update({
      data: data
    })
  },

  /**
   * 删除文档
   *
   * @param doc 文档_id
   * @param collection 集合
   * @return {"stats": Object, "errMsg": String}
   */
  remove: function(doc, collection) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).remove()
  },

  /**
   * 上传文件
   * 
   * @param fileName 文件名
   * @param filePath 文件路径
   * @return {"errMsg": String, "fileID": String, "statusCode": Number}
   */
  upload: function(fileName, filePath) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: filePath
    })
  },

  /**
   * 下载文件
   * 
   * @param fileID 文件名
   * @return {"tempFilePath": String, "statusCode": Number}
   */
  download: function(fileID) {
    return wx.cloud.downloadFile({
      fileID: fileID
    })
  }
}