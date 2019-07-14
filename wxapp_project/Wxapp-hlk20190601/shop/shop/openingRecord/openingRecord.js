// pages/shop/openingRecord/openingRecord.js
const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
const md5 = require('../../shop/common/utils/md5');
const WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 1,
    is_loadmore: true,
    order_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getLimitVipBuyRecord();
  },

  getLimitVipBuyRecord:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getLimitVipBuyRecord', { pages: that.data.pages }, (info) => {
      console.log(info)
      if (info == null) {
        that.setData({ is_loadmore: false });
      } else {
        if (info.length < 10) {
          that.setData({ is_loadmore: false });
        }
      }
      if (that.data.pages == 1) {
        that.setData({ order_list: info })
      } else {
        that.setData({ order_list: that.data.order_list.concat(info) })
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
    console.log(11111)
    var that = this;
    wx.showNavigationBarLoading();
    if (that.data.is_loadmore == false) {
      wx.hideNavigationBarLoading();
      return false;
    }
    that.setData({ pages: that.data.pages + 1 })
    that.getLimitVipBuyRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})