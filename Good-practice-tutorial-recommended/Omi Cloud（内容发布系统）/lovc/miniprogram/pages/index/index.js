const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onShow: function() {
    setTimeout(function() {
      wx.redirectTo({
        url: '../content/content',
      })
    }, 3600)
  }
  
})