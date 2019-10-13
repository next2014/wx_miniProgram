// 数据库对象
const db = wx.cloud.database()

module.exports = {

  /**
   * 构造媒体存储标记
   * 
   * @param index 文件类型 0:视频，1:声音，2:照片
   * @param fileID 云文件ID
   * @param author 上传者
   * @return Object
   */
  mark: function(index, fileID, author) {
    return {
      index: index,
      fileID: fileID,
      author: author,
      time: db.serverDate()
    }
  },

  /**
   * 选择照片
   * 
   * @return {"errMsg": String, "tempFilePaths": Array(String), "tempFiles": Array(Obejct)}
   */
  chooseImage: function() {
    return new Promise(function(resolve) {
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: res => {
          resolve(res)
        }
      })
    })
  },

  /**
   * 全屏预览照片
   * 
   * @param current 当前显示图片的链接
   * @param urls 需要预览的图片链接列表（云文件ID @since 2.2.3）
   */
  previewImage: function(current, urls) {
    return new Promise(function(resolve, reject) {
      wx.previewImage({
        current: current,
        urls: urls,
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },

  /**
   * 选择视频
   * 
   * @return {"errMsg": String, "tempFilePath": String, "thumbTempFilePath": String, "duration": Number, "width": Number, "height": Number, "size": Number}
   */
  chooseVideo: function() {
    return new Promise(function(resolve, reject) {
      wx.chooseVideo({
        sourceType: ['album'],
        compressed: true,
        maxDuration: 60,
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },

  /**
   * 保存video到本地
   * 
   * @param filePath 文件路径
   * @return {"errMsg": String}
   */
  saveVideo: function(filePath) {
    return new Promise(function(resolve, reject) {
      wx.saveVideoToPhotosAlbum({
        filePath: filePath,
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
}