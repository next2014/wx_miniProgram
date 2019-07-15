// pages/shop/memberGoods/memberGoods.js
const app = getApp();
const $ = require('../../../utils/underscore');
import requestUtil from '../../../utils/requestUtil';
import _DuoguanData from '../../../utils/data';
import util from '../../../utils/util';
import dg from '../../../utils/dg';
import plugUtil from '../../../utils/plugUtil';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip_status:false,
    config:[],
    vip_goods:[],
    load_more:true,
    page:1,
    tips_show:false,
    seckill_page:1,
    vip_load_more:false,
    seckill_goods:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.onPullDownRefresh();
  },

  checkVipStatus:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/userCheckVipStatus', {}, (info) => {
      that.setData({ vip_status: info == 1 ? true : false })
    }, this, { isShowLoading: false });
  },

  getVipPageConfig:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getVipPageConfig', {}, (info) => {
      that.setData({config: info})
    }, this, { isShowLoading: false });
  },

  toCate:function(){
    wx.switchTab({
      url: '/pages/shop/mallcate/mallcate',
      fail(res){
        wx.navigateTo({
          url: '/pages/shop/mallcate/mallcate',
        })
      }
    })
  },

  quan_lingqu_bind: function (e) {
    var that = this;
    wx.showToast({
      title: '领取中',
      icon: 'loading',
      duration: 800,
      mask: true
    });
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/ShopQuanLingqu.html',
      { qid: e.currentTarget.id, vip:'vip' },
      (data) => {
        that.initgetShopQuanLingquData(data)
        that.getVipPageConfig();
      }, this, { isShowLoading: false });
  },

  initgetShopQuanLingquData: function (data) {
    var that = this;
    wx.hideToast();
    if (data == '只有VIP+用户才可以领取'){
      that.setData({ tips_show: true })
    }else{
      wx.showModal({
        title: '恭喜您',
        content: '优惠券领取成功',
      })
    }
  },

  tipsClose:function(){
    this.setData({ tips_show: false })
  },

  jumpToVip: function () {
    this.setData({ tips_show: false })
    wx.navigateTo({
      url: '/pages/shop/superMember/superMember'
    })
  },

  getVipGoods:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getVipGoods', {page:that.data.page}, (data) => {
      if (data == null) {
        that.setData({
          load_more: false
        })
      } else {
        var vip_goods = that.data.vip_goods.concat(data);
        that.setData({
          vip_goods: vip_goods,
          page: that.data.page + 1
        })
      }
    }, this, { isShowLoading: false });
  },

  getVipSckillInfo:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getVipSckillInfo', {}, (data) => {
      that.setData({
        seckill_info: data
      })
      var k = 0;
      if (k == 0 && data) {
        k++;
        that.setseckilltime()
        setInterval(function () {
          var Data = new Date();
          that.data.sec = 59 - Data.getSeconds();
          if (that.data.sec == 59) {
            that.setseckilltime()
          }
          if (that.data.sec < 10) {
            that.data.sec = '0' + that.data.sec;
          }
          that.setData({
            sec: that.data.sec
          })
        }, 1000);
      }
    }, this, { isShowLoading: false });
  },

  setseckilltime: function () {
    var that = this;
    var time = {};
    var _Data = new Date();
    var seckilltime = [];
    var seckilltime2 = [];
    var minute = 0;
    var hour = 0;
    seckilltime = that.data.seckill_info.start_time.split(":")
    seckilltime = seckilltime[0] * 60 * 60 + seckilltime[1] * 60
    seckilltime2 = that.data.seckill_info.end_time.split(":")
    seckilltime2 = seckilltime2[0] * 60 * 60 + seckilltime2[1] * 60
    if (seckilltime > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
      seckilltime = seckilltime - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
      hour = parseInt(seckilltime / 3600)
      minute = parseInt((seckilltime % 3600) / 60)
      time.status = 0
    } else if (seckilltime2 > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
      seckilltime2 = seckilltime2 - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
      hour = parseInt(seckilltime2 / 3600)
      minute = parseInt((seckilltime2 % 3600) / 60)
      time.status = 1
    } else {
      hour = -1
      minute = -1
      time.status = 2
    }
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    time.hour = hour
    time.minute = minute
    this.setData({
      time: time
    })
  },

  getVipSckillGoods:function(){
    var that = this;
    if(that.data.seckill_page > 1){
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    }
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getVipSckillGoods', { page: that.data.seckill_page }, (data) => {
      if (data == null) {
        that.setData({
          seckill_load_more: false
        })
      } else if (data.length < 5) {
        var seckill_goods = that.data.seckill_goods.concat(data);
        that.setData({
          seckill_goods: seckill_goods,
          seckill_load_more: false
        })
      }else{
        var seckill_goods = that.data.seckill_goods.concat(data);
        that.setData({
          seckill_goods: seckill_goods,
          seckill_page: that.data.seckill_page + 1,
          seckill_load_more: true
        })
      }
    }, this, { isShowLoading: false });
  },

  goods_detail: function (e) {
    util.trySyncUserInfo(function () {
      wx.navigateTo({
        url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id,
      })
    })
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
    var that = this;
    that.setData({
      vip_goods: [],
      load_more: true,
      page: 1,
      seckill_page: 1,
      seckill_goods: [],
      seckill_load_more: false
    })
    that.checkVipStatus();
    that.getVipPageConfig();
    that.getVipGoods();
    that.getVipSckillInfo();
    that.getVipSckillGoods();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.getVipGoods();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'VIP+专页',
      path: 'pages/shop/memberGoods/memberGoods'
    }
  }
})