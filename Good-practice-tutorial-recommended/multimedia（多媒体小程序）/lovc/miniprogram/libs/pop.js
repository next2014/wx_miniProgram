const {
  $Toast
} = require('../../dist/base/index')
const {
  $Message
} = require('../../dist/base/index')

module.exports = {

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
   * 弹出消息提示
   * 
   * @param content 消息内容
   * @param type 消息类型 default、success、warning、error
   */
  popMessage: function(content, type) {
    $Message({
      content: content,
      type: type,
      duration: 5
    });
  }
}