// app
const app = getApp()

// iview
const {
  $Toast
} = require('../../dist/base/index');

// cloud
const cloud = require('../../libs/cloud.js')

// media
const media = require('../../libs/media.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认进入视频页
    bar: 'video',
    // 视频
    videoFiles: undefined,
    // 声音
    audioFiles: undefined,
    // 默认进入tiktok
    item: 'tiktok',
    // 头像url
    avatarUrl: 'https://7465-test-d518bb-1253713003.tcb.qcloud.la/system/user-unlogin.png?sign=2b40f3c59e9ded062fe03751407960b6&t=1541001803',
    // openid
    openid: '',
    // 用户昵称
    nickName: '',
    // 抖音
    tiktokFiles: undefined,
    // 唱吧
    singFiles: undefined,
    // 相册
    albumFiles: undefined,
    // add
    showAdd: false,
    addActions: [{
        name: '视频',
      },
      {
        name: '照片'
      }
    ],
    /**
     * 歌名输入弹窗
     */
    audioInput: false,
    // 遮罩层开关
    hidden: true,
    // 开启歌名输入框
    ifAudioInput: false,
    // 歌名输入
    audioInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // 从缓存中获取用户头像/openid
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          avatarUrl: res.data.avatarUrl,
          openid: res.data.openid,
          nickName: res.data.nickName
        })
      }
    })

    this.loadVideo()
    this.loadTiktok()
    this.loadAlbum()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadTiktok()
    this.loadAlbum()
    this.loadVideo()
  },

  /**
   * 用户登录获取用户信息
   */
  onGetUserInfo: function(e) {
    let userInfo = e.detail.userInfo
    cloud.call('login', {}).then(res => {
      let openid = res.result.openid
      // 获取openid
      userInfo.openid = openid
      // 将用户信息写入本地缓存
      wx.setStorage({
        key: 'userInfo',
        data: userInfo,
      })
      // 设置openid
      this.setData({
        openid: openid
      })
    }).catch(err => {
      console.log(err)
    })
    // 设置登录头像
    this.setData({
      avatarUrl: userInfo.avatarUrl
    })
  },

  // --------- tabbar ----------
  /**
   * tabbar点击
   */
  clickTabBar({
    detail
  }) {
    let key = detail.key
    if ('add' === key) {
      // 点击添加按钮弹出上传选项
      this.setData({
        showAdd: true
      })
    } else {
      this.setData({
        bar: key
      })
    }

    if ('video' === key && undefined === this.data.videoFiles) {
      this.loadVideo()
    } else if ('audio' === key) {
      // this.loadAudio()
    } else if ('mine' === key && undefined === this.data.tiktokFiles) {
      this.loadTiktok()
    }
  },

  /**
   * 加载视频
   */
  loadVideo: function() {
    let that = this
    cloud.query({
      index: 0
    }).then(res => {
      let files = []
      res.data.forEach(function(e, i) {
        files.push({
          id: e._id,
          fileID: e.fileID,
          thumb: e.thumb,
          author: e.author,
          desc: e.desc
        })
      })
      that.setData({
        videoFiles: files
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 加载声音
   */
  loadAudio: function() {

  },

  // --------- add ----------
  /**
   * 点击视频/声音/照片上传
   */
  handleChooseMedia({
    detail
  }) {
    this.cancelAdd()
    if (this.data.openid === '') {
      this.popToast('请先登录~', 'warning', true, 3, true)
      return
    }
    const index = detail.index;
    let that = this;
    if (0 === index) {
      // 视频
      media.chooseVideo().then(res => {
        that.popToast('上传中...', 'loading')
        // 文件
        let tempFilePath = res.tempFilePath
        let tempFilename = that.splitFileName(tempFilePath)
        // 缩略图文件
        let thumbTempFilePath = res.thumbTempFilePath
        // 上传视频文件
        cloud.upload(tempFilename, tempFilePath).then(res => {
          let mark = media.mark(index, res.fileID, that.data.nickName)
          if (thumbTempFilePath) {
            // 缩略图文件
            let thumbTempFilename = that.splitFileName(thumbTempFilePath)
            // 上传缩略图文件
            cloud.upload(thumbTempFilename, thumbTempFilePath).then(res => {
              let thumb = res.fileID
              mark.thumb = thumb
              // 写入数据库
              cloud.add(mark).then(res => {
                let id = res._id
                wx.navigateTo({
                  url: '../editVideo/editVideo'.concat('?thumb=').concat(thumb)
                    .concat('&id=').concat(id)
                })
                that.hideToast()
              }).catch(err => {
                console.log(err)
              })
            })
          } else {
            // 未生成缩略图，使用默认图片
            let thumb = 'cloud://test-d518bb.7465-test-d518bb/system/default-poster.jpg'
            mark.thumb = thumb
            // 写入数据库
            cloud.add(mark).then(res => {
              that.hideToast()
              let id = res._id
              wx.navigateTo({
                url: '../editVideo/editVideo'.concat('?thumb=').concat(thumb)
                  .concat('&id=').concat(id)
              })
            }).catch(err => {
              console.log(err)
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    } else if (1 === index) {
      // 照片
      media.chooseImage().then(res => {
        res.tempFilePaths.forEach(function(filePath, i) {
          that.popToast('上传中...', 'loading')
          let filename = that.splitFileName(filePath)
          cloud.upload(filename, filePath).then(res => {
            let mark = media.mark(index, res.fileID, that.data.nickName)
            // 写入数据库
            cloud.add(mark).then(res => {
              that.loadAlbum()
              that.hideToast()
            }).catch(err => {
              console.log(err)
            })
          }).catch(err => {
            console.log(err)
          })
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },

  /**
   * 退出add选项
   */
  cancelAdd: function() {
    this.setData({
      showAdd: false
    })
  },

  /**
   * 弹出toast提示
   * 
   * @param content loading显示内容
   * @param type toast类型 default、success、warning、error、loading
   * @param modal 遮罩层是否打开
   * @param duration 持续时间，单位s，0为不自动关闭，需调用 $Toast.hide() 方法手动关闭
   * @param mask toast是否可关闭
   */
  popToast: function(content, type, modal, duration, mask) {
    duration = duration || 0
    mask = mask || false
    modal = modal || false
    $Toast({
      content: content,
      type: type,
      duration: duration,
      mask: mask
    })
    // 打开遮罩层
    this.setData({
      hidden: modal
    })
  },

  /**
   * 关闭toast提示
   */
  hideToast: function() {
    $Toast.hide()
    // 关闭遮罩层
    this.setData({
      hidden: true
    })
  },

  /**
   * 截取文件名
   */
  splitFileName: function(path) {
    let filename = path.split('/').pop()
    filename = filename || path
    return filename
  },

  // ---------- tab ----------
  /**
   * tabs切换
   */
  handleTabsChange({
    detail
  }) {
    this.setData({
      item: detail.key
    })

    if ('tiktok' === detail.key && undefined === this.data.tiktokFiles) {
      this.loadTiktok()
    }
    if ('album' === detail.key && undefined === this.data.albumFiles) {
      this.loadAlbum()
    }
  },

  /**
   * 初始化tiktok
   */
  loadTiktok: function() {
    let that = this
    cloud.query({
      index: 0
    }).then(res => {
      let files = []
      res.data.forEach(function(e, i) {
        files.push({
          id: e._id,
          fileID: e.fileID,
          thumb: e.thumb,
          author: e.author,
          desc: e.desc
        })
      })
      that.setData({
        tiktokFiles: files
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 播放视频
   */
  playVideo: function(e) {
    let origin = e.currentTarget.dataset['origin']
    let files
    if ('video' === origin) {
      files = this.data.videoFiles
    } else if ('tiktok' === origin) {
      files = this.data.tiktokFiles
    } else {
      return
    }
    let video
    files.forEach(function(element, i) {
      if (e.currentTarget.dataset['index'] === element.id) {
        video = element
        return
      }
    })
    if (undefined !== video) {
      wx.navigateTo({
        url: '../video/video?fileID='.concat(video.fileID)
          .concat('&thumb=').concat(video.thumb)
          .concat('&author=').concat(video.author)
          .concat('&desc=').concat(video.desc == undefined ? '' : video.desc)
      })
    }
  },

  /**
   * 初始化album
   * 
   * TODO 分页加载
   */
  loadAlbum: function() {
    let that = this
    cloud.query({
      index: 1
    }).then(res => {
      let files = []
      res.data.forEach(function(e, i) {
        files.push({
          id: e._id,
          fileID: e.fileID
        })
      })
      that.setData({
        albumFiles: files
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 相册图片点击全屏预览
   */
  imageToPreview: function(e) {
    // 被点击图片云文件ID
    let current = e.currentTarget.dataset['current']
    // 所有图片云文件ID
    let fileIDs = []
    this.data.albumFiles.forEach(function(e, i) {
      fileIDs.push(e.fileID)
    })
    media.previewImage(current, fileIDs)
  }
})