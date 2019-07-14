// pages/shop/reminder/index.js
const _DuoguanData = require('../../../utils/data');
const requestUtil = require('../../../utils/requestUtil');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_info: '',
    cart_num: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunityConfig.html', {}, (info) => {
      that.setData({ community_config: info })
    }, that, { isShowLoading: false });
    that.setData({
      order_id: options.order_id,
      self_address_id: options.self_address_id,
      colonel_uid: options.colonel_uid
    })
    that.getOrderInfo(options.order_id);
    that.getCarListNum();
  },

  getOrderInfo: function (order_id) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/DuoguanShop/OrderApi/orderInfo.html", {
      oid: that.data.order_id,
      type: 2
    }, (info) => {
      that.setData({ order_info: info })
    }, this, {});
  },

  //进入购物车
  bind_go_cart: function () {
    wx.navigateTo({
      url: '../mallcart/mallcart'
    })
  },

  bind_go_index: function () {
    wx.switchTab({
      url: _DuoguanData.duoguan_app_index_path
    })
  },

  goGoodsInfo: function (e) {
    var that = this;
    if (that.data.community_config.is_open == 1) {
      wx.navigateTo({
        url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id + '&self_address_id=' + that.data.self_address_id + '&colonel_uid=' + that.data.colonel_uid,
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id,
      })
    }
  },

  getCarListNum: function () {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getCartList.html', {},
      (data) => {
        var cart_num = 0;
        if (data) {
          for (var i = 0; i < data.length; i++) {
            cart_num += data[i].goods_number * 1
          }
        }
        that.setData({
          cart_num: cart_num
        })
      }, that, {
        isShowLoading: false
      });
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

  }
})