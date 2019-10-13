// cloud
const cloud = require('../../libs/cloud.js')

// iview
const {
  $Toast
} = require('../../dist/base/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 缩略图
    thumb: '',
    // 记录_id
    id: '',
    // 想法
    desc: '',
    // 遮罩层开关
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      thumb: options.thumb,
      id: options.id
    })
    this.popToast('使用默认缩略图', 'warning', true, 3, true)
  },

  /**
   * 发布想法
   */
  publish: function() {
    let desc = this.data.desc
    if (undefined === desc || '' === desc) {
      this.popToast('想法不能为空~', 'warning', true, 3, true)
    } else {
      this.popToast('发布中...', 'loading')
      let that = this
      cloud.update(this.data.id, {
        desc: desc
      }).then(res => {
        that.hideToast()
        wx.navigateBack({
          delta: 1
        })
      }).catch(err => {
        console.log(err)
      })
    }
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
   * 获取输入的想法
   */
  getDesc: function(e) {
    this.setData({
      desc: e.detail.value
    })
  }
})