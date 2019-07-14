// pages/shop/whiteLogistic/whiteLogistic.js
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
    withdraw_type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync('all_info');
    var that = this
    var refund_id = options.rid;
    that.setData({
      this_refund_id: refund_id,
    })
  
  },

  selectWithdrawType: function(e){
    this.setData({ withdraw_type: e.detail.value})
  },

  selectSelfAddress: function () {
    wx.navigateTo({
      url: '../business-address/index'
    })
  },

  to_self_adress: function () {
    wx.openLocation({
      latitude: parseFloat(this.data.all_address.latitude),
      longitude: parseFloat(this.data.all_address.longitude),
      scale: 28,
      name: this.data.all_address.address
    })
  },

  formSubmit:function(e){
    console.log(e)
    var that = this
    var withdraw_info = {};
    withdraw_info.withdraw_type = that.data.withdraw_type;
    if (that.data.withdraw_type == 0){
      withdraw_info.address_name = that.data.all_address.address_name
      withdraw_info.address = that.data.all_address.address
      withdraw_info.longitude = that.data.all_address.longitude
      withdraw_info.latitude = that.data.all_address.latitude
      withdraw_info.mobile = that.data.all_address.mobile
    }else{
      withdraw_info.logistics_name = e.detail.value.logistics_name
      withdraw_info.logistics_num = e.detail.value.logistics_num
    }
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/postWithdrawInfo.html',
      { rid: that.data.this_refund_id, withdraw_info: withdraw_info },
      (data) => {
        if (data.code == 1) {
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
        } else {
          wx.showModal({
            title: '提示',
            content: data.info,
            showCancel: false,
            success: function (res) {

            }
          })
        }
      }, this, { isShowLoading: false });
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
    //获取订单信息
    var that = this;
    wx.getSetting({
      success: (res) => {
        console.log('getSetting.success')
      },
      fail: (res) => {
        console.log('getSetting.fail')
        wx.openSetting({
          success: (res) => {
            console.log('openSetting.success')
          },
          fail: (res) => {
            console.log('openSetting.fail')
          }
        })
      }
    });
    if (wx.getStorageSync('all_info')) {
      that.setData({ all_address: wx.getStorageSync('all_info') })
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddress.html', { lat: that.data.latitude, lng: that.data.longitude }, (info) => {
            that.setData({ all_address: info[0] })
          }, that, { isShowLoading: false });
        }
      })
    }
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