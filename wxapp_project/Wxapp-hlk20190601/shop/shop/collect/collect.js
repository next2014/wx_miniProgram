// pages/shop/collect/collect.js
const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectlist:[],
    this_page_size: 10,//页大小
    this_page_num: 1,//页数
    glo_is_load: true,
    is_loadmore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getcollect', { size: that.data.this_page_size, page: that.data.this_page_num}, (info) => {
      that.initCollect(info)
    }, this, { isShowLoading: false });
  },
  initCollect:function(data){
    wx.hideNavigationBarLoading()
    var that = this;
    that.setData({
      glo_is_load: false,      
    });
    if (data == null || data.length < that.data.this_page_size){
      that.setData({
        is_loadmore: false,
      });
      if (data == null) return;
    }
      if (that.data.collectlist.length>0){
        that.setData({
          collectlist:that.data.collectlist.concat(data)
        })
      }else{
        that.setData({
          glo_is_load: false,
          collectlist: data
        })
      }
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
    wx.showNavigationBarLoading()
    var that = this;
    that.setData({
      collectlist:[],
        this_page_size: 10,//页大小
        this_page_num: 1,//页数
        glo_is_load: true,
        is_loadmore: true,
      });
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getcollect', { size: that.data.this_page_size, page: that.data.this_page_num }, (info) => {
      that.initCollect(info)
    }, this, { isShowLoading: true });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading()
    var that = this;
    var page = that.data.this_page_num+1;
    if (that.data.is_loadmore){
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getcollect', { size: that.data.this_page_size, page: page }, (info) => {
        wx.hideNavigationBarLoading()
        that.setData({
          this_page_num:page
        })
        that.initCollect(info)
      }, this, { isShowLoading: true });
    }else{
      wx.hideNavigationBarLoading()
    }
  },
   goHome: function (e) {
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
})