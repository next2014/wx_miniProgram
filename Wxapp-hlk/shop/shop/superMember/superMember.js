// pages/shop/superMember/superMember.js
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
    vip_info:'',
    activation:false,
    select_card:'',
    select_index: -1,
    name:'',
    disabled:true,
    telephone:'',
    wxParseData: '',
    phone_type:'',
    jump_show:false,
    top:1200,
    is_first:true,
    scroll: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getUserVipInfo();
    wx.getSystemInfo({
      success(res) {
        var str = [];
        str = res.system.split(" ");
        that.setData({ phone_type: str[0], phone_info: res});
      }
    })
  },

  getUserVipInfo:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getUserVipInfo', {}, (info) => {
      that.setData({
        vip_info: info
      })
      if (info.config_info.rich_text){
        WxParse.wxParse('article', 'html', info.config_info.rich_text, that, 0)
      }
      
    });
  },

  select_card:function(e){
    var that = this;
    that.setData({
      select_card: e.currentTarget.dataset.card,
      select_index: e.currentTarget.dataset.index
    })
  },

  vipBuyNow:function(){
    var that = this;
    if (that.data.select_card){
      if (that.data.vip_info.config_info.activation == 1 && that.data.vip_info.config_info.become_type == 2) {
        that.setData({ activation: true });
      }else{
        that.vipPostOrder();
      }
    }else{
      wx.showToast({
        title: '请选择时限卡',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  getPhoneNumber:function(e){
    var that = this;
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        that.getPhone(e);
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.removeStorageSync('utoken');
        that.getPhone(e);
      }
    })
    
  },

  getPhone: function (e){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getUserPhoneNumber', {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }, (info) => {
      if (info == 'fail') {
        wx.showToast({
          title: '请重新登陆',
          icon: 'none',
          duration: 2000
        })
      } else {
        that.setData({ telephone: info.phoneNumber });
        that.vipPostOrder();
      }
    });
  },
  

  getName:function(e){
    var that = this;
    var name = e.detail.value;
    if(name == ''){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
    }else{
      that.setData({
        name: name,
        disabled: false
        })
    }
  },

  nameStatus:function(e){
    var that = this;
    var name = e.detail.value;
    if (name == '') {
      that.setData({disabled: true})
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },

  vipPostOrder:function(){
    var that = this;
    
      var oinfo = {};
      oinfo.order_amount = that.data.select_card.price;
      oinfo.name = that.data.name;
      oinfo.telephone = that.data.telephone;
      oinfo.pay_type = 0;
      oinfo.duration = that.data.select_card.days;
      oinfo.pay_info = that.data.select_card;
      oinfo.phone_type = that.data.phone_type;
      oinfo = JSON.stringify(oinfo)
      var sign = md5.md5(oinfo + md5.md5('sign'))
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/vipPostOrder', { oinfo: oinfo, sign: sign}, (info) => {
        console.log(info);
        if (that.data.select_card.price > 0) {
          that.vipMakePay(info);
        }else{
          that.vipFreePay(info);
        }
      });
  },

  vipMakePay:function(oid){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/vipMakePay', {oid: oid}, (info) => {
      Object.assign(info, {
        'success': function (res) {
          wx.showToast({
            title: '购买成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            that.refresh()
          }, 2000)
        },
        'fail': function (res) {
          wx.showToast({
            title: '购买失败',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            that.refresh()
          }, 2000)
        },
        'complete': function () {
        }
      });
      wx.requestPayment(info);
    });
  },

  vipFreePay: function (oid){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/vipFreePay', { oid: oid }, (info) => {
      if(info == 'success'){
        wx.showToast({
          title: '购买成功',
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '购买失败',
          icon: 'none',
          duration: 2000
        })
      }
      setTimeout(() => {
        that.refresh()
      }, 2000)
    });
  },

  jumpVipBuyRecord:function(){
    wx.navigateTo({
      url: '/pages/shop/openingRecord/openingRecord',
    })
  },

  hiddenActivation:function(){
    var that = this;
    that.setData({ activation: false, disabled: true })
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
    this.getLimitVipBuyRecord();
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

  onPageScroll:function(e){
    if (this.data.vip_info.vip_type != 1){
      if (this.data.scroll) {
        this.setData({ scroll: false})
        this.getQueryInfo();
      }
      if (e.scrollTop > this.data.listHeight && this.data.jump_show) {
        this.setData({ jump_show: false })
        console.log(this.data.jump_show)
      } else if (e.scrollTop < this.data.listHeight && this.data.jump_show == false) {
        this.setData({ jump_show: true })
        console.log(this.data.jump_show)
      }
    }
  },
  
  getQueryInfo: function () {
    console.log(111)
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.vipDetailBox').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      var listHeight = res[0].height; // 获取list高度
      if (that.data.phone_info.screenHeight < listHeight + 180) {
        that.setData({ jump_show: true, listHeight: listHeight + 180 - this.data.phone_info.screenHeight})
      }
    });
    var query = wx.createSelectorQuery();
    query.select('#vipBuyBtn').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      that.setData({top: res[0].top})
    });
  },

  goBuyButton:function(){
    var that = this;
    wx.pageScrollTo({
      scrollTop: this.data.top + 100,
      duration: 300
    })
    that.setData({ jump_show: false})
  },

  getLimitVipBuyRecord: function () {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/UserApi/getLimitVipBuyRecord', { pages: 1 }, (info) => {
      console.log(info)
      if (info == null) {
        that.setData({ is_first: true });
      } else {
        that.setData({ is_first: false });
      }
    }, this, { isShowLoading: false });
  },

  refresh:function(){
    var that = this;
    that.getUserVipInfo();
    that.setData({ activation: false, disabled: true })
    that.getLimitVipBuyRecord();
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