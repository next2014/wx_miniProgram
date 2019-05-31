// pages/shop/refundDetail/refundDetail.js
const _function = require('../../../utils/functionData');
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
const QR = require('../../../utils/qrcode');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_goods:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var refund_id = options.rid;
    that.setData({
      this_refund_id: refund_id,
    })
    that.getRefundInfo();
  },

  getRefundInfo:function(){
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getRefundInfo.html',
      { rid: that.data.this_refund_id },
      (data) => {
        that.setData({ order_info: data })
      }, this, { isShowLoading: false });
  },

  //电话
  bindContantPhone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.order_info.public_info.kefu_contant
    })
  },

  //申请撤回
  withdrawRequest:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/withdrawRequest.html',
      { rid: that.data.this_refund_id },
      (data) => {
        console.log(data)
        if(data.code == 1){
          wx.showModal({
            title: '提示',
            content: data.info,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '/pages/shop/order/list/index',
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: data.info,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '/pages/shop/refundDetail/refundDetail?rid=' + that.data.this_refund_id,
              })
            }
          })
        }
      }, this, { isShowLoading: false });
  },

  goHomePage:function(){
    wx.switchTab({
      url: "/pages/shop/mall/mall"
    })
  },
  //填写物流退货信息

  postRefundInfo: function(){
    wx.navigateTo({
      url: '/pages/shop/whiteLogistic/whiteLogistic?rid=' + this.data.this_refund_id,
    })
  },

  goodsShow: function(){
    var that = this;
    if (that.data.show_goods){
      this.setData({ show_goods: false })
    }else{
      this.setData({ show_goods: true })
    }
    
  },

  copyRefundSn:function(){
    wx.setClipboardData({
      data: this.data.order_info.refund_sn,
      success: function (res) {
        // wx.getClipboardData({
        //   success: function (res) {
        //     console.log(res.data) // data
        //   }
        // })
      }
    })
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
    var that = this;
    that.getRefundInfo();
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
    var that = this;
    that.getRefundInfo();
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