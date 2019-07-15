// pages/shop/audit/audit.js
const _function = require('../../../utils/functionData');
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:4,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getApplyInfo(options);
  },

  getApplyInfo: function (options){
    var type = options.type;
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/CommunityDoApi/getApplyInfo.html',
      { apply_type: type},
      (data) => {
        that.setData({ status: data })
        if(data == 3){
          wx.redirectTo({
            url: '/pages/shop/league/league?type=' + type
          })
        }
        if(data == 1){
          wx.redirectTo({
            url: '/pages/shop/leaguer-center/leaguer-center?type=' + type
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