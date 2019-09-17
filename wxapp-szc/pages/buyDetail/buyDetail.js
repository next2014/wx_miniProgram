// pages/buyDetail/buyDetail.js
let datas = require('../../datas/list-data');
let appData = getApp();
let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},
    isCollected: false,
    index: 0,

    tabs: ["购票须知", "入园须知", "内容详情"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    date: "2019-09-12",

    goodsList: {
      saveHidden: true,
      totalScoreToPay: 0,
      allSelect: true,
      noSelect: false,
      list: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.onShow();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bbDetail: function (e) {
    wx.switchTab({
      url: '/pages/shopcar/shopcar'
    });
  },
  ddOrder: function (e){
    wx.switchTab({
      url: '/pages/order/order'
    })
  },
  nowBuy: function (e){
    wx.navigateTo({
      url: '/pages/nowbuy/nowbuy'
    })
  }


})