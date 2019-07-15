// pages/shop/leaguer-center/leaguer-center.js
const _function = require('../../../utils/functionData');
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:2,
    apply_info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({type: options.type})
    that.getPassApplyInfo(options);
  },

  getPassApplyInfo:function(options){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/CommunityDoApi/getPassApplyInfo.html',
      { apply_type: options.type },
      (data) => {
        that.setData({ apply_info: data })
      }, this, { isShowLoading: false });
  },

  jumpHead:function(){
    wx.navigateTo({
      url: '/pages/shop/head/index'
    })
  },

  jumpRank:function(){
    wx.navigateTo({
      url: '/pages/shop/leaguer-ranking/leaguer-ranking'
    })
  },

  jumpOrder:function(){
    wx.navigateTo({
      url: '/pages/shop/colonelOrder/colonelOrder'
    })
  },

  communityPoster: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../community-poster/community-poster?colonel_uid=' + that.data.apply_info.uid
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