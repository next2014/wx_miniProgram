// pages/shop/league/league.js
const _function = require('../../../utils/functionData');
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
const QR = require('../../../utils/qrcode');
const WxParse = require('../../../wxParse/wxParse.js');
import util from '../../../utils/util';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_type:1,
    apply_describe:'',
    wxParseData: '',
    submission:false,
    address:'',
    detail:'',
    rule_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({apply_type: options.type})
    that.getApplyDescribe(options.type);
  },

  getApplyDescribe: function (type){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/CommunityDoApi/getApplyDescribe.html',
      { apply_type: type },
      (data) => {
        that.setData({ apply_describe: data })
        if (data.rich_text) {
          WxParse.wxParse('article', 'html', data.rich_text, that, 0)
        }
      }, this, { isShowLoading: false });
  },

  checkboxChange:function(e){
    var that = this;
    if(e.detail.value[0] == '1'){
      that.setData({ submission: true})
    }else{
      that.setData({ submission: false })
    }
  },

  getUserLocation:function(){
    var that = this;
    wx.getSetting({
      success(res) {
        wx.chooseLocation({
          success: function (res) {
            var qqmapsdk = util.getMapSdk()
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: (res) => {
                that.setData({
                  address: res.result.address,
                  detail: res.result.formatted_addresses.recommend
                });
              }
            });
          }
        })
      }
    })
    
  },

  applyFormSubmit:function(e){
    var that = this;
    var apply_info = e.detail.value;
    apply_info = JSON.stringify(apply_info);
    requestUtil.post(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/CommunityDoApi/applyFormSubmit.html',
      { apply_type: that.data.apply_type, apply_info: apply_info},
      (data) => {
        if (data > 0) {
          wx.navigateTo({
            url: '/pages/shop/audit/audit?type=' + that.data.apply_type
          })
        }
      }, this, { isShowLoading: false });
  },

  jumpRule:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/shop/rule/rule?type=' + that.data.apply_type + '&rule=' + that.data.apply_describe.rule
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