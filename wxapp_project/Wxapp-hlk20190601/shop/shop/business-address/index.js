// pages/shop/business-address/index.js
const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
const util = require('../../../utils/util');
const listener = require('../../../utils/listener');
import _ from '../../../utils/underscore';
import Form from '../../../utils/form';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    all_address: '',
    now_community:'',
    now_address:'',
    address_type: 1,
    select_type: 1,
    no_suggest: 0,
    suggest_info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ bind_type: options.bind_type})
    wx.getSetting({
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        wx.openSetting({
          success: (res) => {

          },
          fail: (res) => {

          }
        })
      }
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddress.html', { lat: that.data.latitude, lng: that.data.longitude }, (info) => {
          that.setData({ all_address: info})
        }, that, { isShowLoading: false });
      },
      fail:function(res){
        console.log('fail')
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressNL.html', {}, (info) => {
          that.setData({ all_address: info })
        }, that, { isShowLoading: false });
      }
    });
    if (options.address_type == 2){
      that.getCommunityNow();
      that.getLastOrderAddress();
      that.setData({ address_type: 2})
    }
    if(options.bind_type == 1){
      that.setData({ select_type: 0 })
      that.getNewAddress(options.colonel_uid);
    }
    if(options.bind_type == 2){
      that.setData({ select_type: 1 })
    }
    that.getLocation();
  },

  selectAddress:function(e){
    var all_info = e.currentTarget.dataset;
    wx.setStorage({ key: 'all_info', data: all_info });
    wx.navigateBack({
      delta: 1
    })
  },

  selectSuggestAddress:function(e){
    var that = this;
    if (e.currentTarget.dataset.id == that.data.now_community.id){
      that.setData({ suggest_info: e.currentTarget.dataset})
      that.inAddress();
    }else{
      that.setData({
        suggest_info: e.currentTarget.dataset,
        in_address: 1
      })
    }
    
  },

  inAddress:function(){
    var that = this;
    var all_info = that.data.suggest_info;
    wx.setStorage({ key: 'all_info', data: all_info });
    wx.navigateBack({
      delta: 1
    })
    that.setData({in_address: 0})
  },

  closeAddress:function(){
    this.setData({ in_address: 0 })
  },

  returnIndex:function(){
    wx.navigateBack({
      delta: 1
    })
  },

  selectType:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    if(that.data.bind_type == 2 && type == 0){
      that.setData({ no_suggest: 1})
    }else{
      that.setData({ select_type: type });
    }
  },

  clossSuggest:function(){
    var that = this;
    that.setData({ no_suggest: 0 })
  },

  getCommunityNow: function () {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunityNow.html', {
    }, (info) => {
      that.setData({ now_community: info })
      wx.setStorage({ key: 'all_info', data: info });
    }, that, { isShowLoading: false });
  },

  getLastOrderAddress:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/CommunityDoApi/getLastOrderAddress.html', {
    }, (info) => {
      that.setData({ lastOrderAddress: info })
    }, that, { isShowLoading: false });
  },

  getNewAddress: function (colonel_uid){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/CommunityDoApi/getNewAddress.html', {
      colonel_uid: colonel_uid
    }, (info) => {
      that.setData({ newAddress: info })
    }, that, { isShowLoading: false });
  },

  getLocation:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var qqmapsdk = util.getMapSdk()
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (res) => {
            that.setData({
              now_address: res.result.address
            });
          }
        });
      }
    })
  },

  location: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          now_address: res.address,
          latitude: res.latitude,
          longitude: res.longitude})
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddress.html', { lat: res.latitude, lng: res.longitude }, (info) => {
          that.setData({ all_address: info })
        }, that, { isShowLoading: false });
      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg == 'chooseLocation:fail auth deny'){
          wx.navigateTo({
            url: '/pages/user/setting/index',
          })
        }
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