// cloud
const cloud = require('../../libs/cloud.js')

// media
const media = require('../../libs/media.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID: '',
    thumb: '',
    author: '',
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      fileID: options.fileID,
      thumb: options.thumb,
      author: options.author
    })

    let desc = options.desc
    console.log(desc)
    if (desc === '' || desc == undefined) {
      desc = '这个人很懒，什么也没说~'
    }

    this.setData({
      desc: desc
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let videoContext = wx.createVideoContext('video')
    this.videoContext = videoContext
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 视频播放结束事件
   */
  onVideoEnd: function() {
    this.videoContext.exitFullScreen()
  },

  /**
   * 保存视频
   */
  saveVideo: function() {
    let that = this
    cloud.download(this.data.fileID).then(res => {
      // 临时文件路径
      let tempFilePath = res.tempFilePath
      media.saveVideo(tempFilePath).then(res => {}).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  }
})