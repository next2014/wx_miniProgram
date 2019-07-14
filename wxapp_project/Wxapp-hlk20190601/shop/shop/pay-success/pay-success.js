const _DuoguanData = require('../../../utils/data');
const requestUtil = require('../../../utils/requestUtil');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ order_id: options.order_id});
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getConfig.html', {}, (info) => {
      that.setData({ config: info })
    }, that, { isShowLoading: false });
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunityConfig.html', {}, (info) => {
      that.setData({ community_config: info })
    }, that, { isShowLoading: false });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    if (that.data.community_config.is_open == 1) {
      var path = '/pages/shop/reminder/reminder?order_id=' + that.data.order_id + '&self_address_id=' + that.data.community_config.self_address_id + '&colonel_uid=' + that.data.community_config.colonel_uid
      return {
        title: '接单提醒',
        path: path,
        imageUrl: 'http://www.ixiaochengxu.cc/resource/images/shop/ordersTop.png'
      };
    } else {
      return {
        title: '接单提醒',
        path: 'pages/shop/reminder/reminder?order_id=' + that.data.order_id,
        imageUrl: 'http://www.ixiaochengxu.cc/resource/images/shop/ordersTop.png'
      };
    }
  },
  gohome: function (e) {
    if (_DuoguanData.duoguan_app_is_superhome) {
      wx.switchTab({
        url: _DuoguanData.duoguan_app_index_path
      })
    } else {
      wx.switchTab({
        url: '/pages/shop/mall/mall'
      })
    }
  },
  goOrder:function(){
    wx.navigateTo({
      url: '/pages/shop/order/list/index'
    })
  }
  
})