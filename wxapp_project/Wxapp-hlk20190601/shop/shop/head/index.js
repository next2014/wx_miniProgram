// pages/shop/head/index.js
const requestUtil = require('../../../utils/requestUtil');
const $ = require('../../../utils/underscore');
const _DuoguanData = require('../../../utils/data');
const util = require('../../../utils/util');
const md5 = require('../../shop/common/utils/md5');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    community_info:[],
    order_info:[],
    pages:1,
    is_loadmore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.checkIsColonel();
  },

  checkIsColonel: function(){
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/checkIsColonel', {}, (info) => {
      that.getColonelAchievement();
      that.getColonelOrder();
    }, this, { isShowLoading: false });
  },

  getColonelAchievement: function () {
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getColonelAchievement', {}, (info) => {
      that.setData({ community_info: info })
    }, this, { isShowLoading: false });
  },

  getColonelOrder:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getColonelOrder', {pages: that.data.pages}, (info) => {
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

  

  onNavigateTap: function (e) {
    const dataset = e.currentTarget.dataset, url = dataset.url;
      wx.navigateTo({
        url: url,
        fail: function (res) {
          wx.switchTab({
            url: url,
          });
        }
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
    var that = this;
    wx.showNavigationBarLoading();
    if (that.data.is_loadmore == false) {
      wx.hideNavigationBarLoading();
      return false;
    }
    that.setData({ pages: that.data.pages + 1 })
    that.getColonelOrder();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})