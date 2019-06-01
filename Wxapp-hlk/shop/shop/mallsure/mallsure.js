const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
const util = require('../../../utils/util');
const listener = require('../../../utils/listener');
const md5 = require('../../shop/common/utils/md5');
import _ from '../../../utils/underscore';
import Form from '../../../utils/form';
Page({
  data: {
    post_data:{},
    version:'4.0.0',
    glo_is_load:true,
    all_address:'',
    address_remind:false,
  },

  onLoad: function (options) {
    wx.removeStorageSync('all_info');
    var that = this;
    this.form = new Form(this, "form");
    util.trySyncUserInfo();
    if (options.goods_id != undefined) {
      that.data.post_data = options
    }
    wx.getStorage({
      key: 'shop_name',
      success: function (res) {
        that.setData({name:res.data})
      }
    })
    wx.getStorage({
      key: 'shop_phone',
      success: function (res) {
        that.setData({ phone: res.data })
      }
    })
    //请求订单信息
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getOrderInfo.html', { goods_id: that.data.post_data.goods_id, goods_number: that.data.post_data.goods_number, attr_str: that.data.post_data.attr_str, goods_attr: that.data.post_data.goods_attr}, (info) => {
      // 新版本地址选择
      if(!info.way){
        info.way = new Array(1);
      }
      if (info.goods_kind) {
        info.way = [];
      }
      if (info.community_config && info.community_config.is_open == 1 && info.community_config.open_express == 0){
        info.way = [2];
      }
      if (info.way.length == 1) {
        that.choose_by_type(info.way[0])
      }

      if (info.form) {
        for (let i = 0; i < info.form.length; i++) {
          let field = info.form[i], value = field.value;
          this.form.add(field.title, field.name, field.type, value, field.options);
        }
        this.form.render();
      }
      //地址结束
      that.data.post_data.manjian_id = info.mianjian_id
      that.setData({
        order_info: info, 
        post_data: that.data.post_data, 
        glo_is_load: false, 
        })
      if (info.time_type == 1){
        that.setData({
          time_type: info.time_type,
          fDate: info.res_date_week,
          tpart: info.time_num,
          ck_tpart: info.time_num[0]
        })
      }
      if (that.data.order_info.goods_kind != true && that.data.order_info.way[0] == 1) {
        var e = {};
        e.currentTarget = {};
        e.currentTarget.dataset = {};
        e.currentTarget.dataset.type = 1;
        that.choose_shipping_type(e);
      }
      that.setPrice();
      that.getUserQuanInfo();
    }, {});
  },
  onShow: function(){
   //获取订单信息
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunityConfig.html', {}, (info) => {
      console.log(info);
      if (info && info.is_open == 1){
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
                console.log(res)
                requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressByRelation.html', { colonel_uid: info.colonel_uid, lat: res.result.location.lat, lng: res.result.location.lng }, (info) => {
                  if (info == '该自提点已更换团长'){
                    wx.showModal({
                      title: '提示',
                      content: '该自提点已更换团长,请重新选择本自提点',
                      showCancel: false
                    })
                    return;
                  }else{
                    that.setData({ all_address: info })
                  }
                }, that, { isShowLoading: false });
              }
            });
          },
          fail:function(res){
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressByRelationNoLocation.html', { colonel_uid: info.colonel_uid }, (info) => {
              if (info == '该自提点已更换团长') {
                wx.showModal({
                  title: '提示',
                  content: '该自提点已更换团长,请重新选择本自提点',
                  showCancel: false
                })
                return;
              } else {
                that.setData({ all_address: info })
              }
            }, that, { isShowLoading: false });
          }
        })
      }else{
        wx.getSetting({
          success: (res) => {
            console.log('getSetting.success')
            console.log(res)
          },
          fail: (res) => {
            console.log('getSetting.fail')
            wx.openSetting({
              success: (res) => {
                console.log('openSetting.success')
                console.log(res)
              },
              fail: (res) => {
                console.log('openSetting.fail')
                console.log(res)
              }
            })
          }
        });
        if (wx.getStorageSync('all_info')) {
          that.setData({ all_address: wx.getStorageSync('all_info') })
        } else {
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getLastAddress.html', {}, (info) => {
            console.log(info)
            if (info.code == 1) {
              that.setData({ all_address: info.info })
            } else {
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  console.log(res)
                  that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                  requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddress.html', { lat: that.data.latitude, lng: that.data.longitude }, (info) => {
                    that.setData({ all_address: info[0] })
                  }, that, { isShowLoading: false });
                }
              })
            }
          }, that, { isShowLoading: false });

        }
      }
    }, that, { isShowLoading: false });
    
  },
  setPrice:function(){
    var that=this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getOrderPrice.html', { data: that.data.post_data, version: that.data.version }, (info) => {
      that.setData({ glo_is_load: false, price_info:info })
    }, that, { isShowLoading:false});
  },
  go_select_dai_bind:function(){
    //跳转优惠券选择页面。
    var that = this
    if (that.data.post_data.goods_id > 0){
      wx.navigateTo({
        url: '../mallquanselect/index?goods_id=' + that.data.post_data.goods_id + '&goods_number=' + that.data.post_data.goods_number + '&goods_attr=' + that.data.post_data.goods_attr + '&all_price=' + that.data.order_info.all_g_price
      });
    } else {
      wx.navigateTo({
        url: '../mallquanselect/index?all_price=' + that.data.order_info.all_g_price
      });
    }
    let quan_callback = (res) => {
      listener.removeEventListener('shop.order.choose.discount', quan_callback)
      that.data.post_data.quan_id = res
      //重新请求获取订单信息
      that.setPrice();
    }
    listener.addEventListener('shop.order.choose.discount', quan_callback);

  },
  /**
   * 切换配送方式
   */
  choose_shipping_type:function(e){
    var that = this
    that.data.post_data.shipping_type = e.currentTarget.dataset.type
    if(that.data.post_data.shipping_type == 1){
      var value = false
      if (this.data.post_data.wxAddress) {
        value = this.data.post_data.wxAddress
      } else if (this.data.order_info.default_address != ''){
        value = this.data.order_info.default_address
      }else{
        value = wx.getStorageSync('shop_wx_address_info')
      }
      if (value) {
        // Do something with return value
        this.data.post_data.wxAddress = value
      } else {
        this.select_address_bind()
      }
    }
    that.setData({ post_data: that.data.post_data})
    that.setPrice();
  },
  select_address_bind:function(){
    var that=this
    //显示地址列表，地址列表为空时跳转地址管理页面
    util.chooseAddress(function (res){
      if(res.wxAddress != undefined){
        that.data.post_data.wxAddress = {}
        that.data.post_data.wxAddress = res.wxAddress
      } else if (res.qqmap_address != undefined){
        that.data.post_data.wxAddress = {}
        that.data.post_data.wxAddress.provinceName = res.qqmap_address.province
        that.data.post_data.wxAddress.cityName = res.qqmap_address.city
        that.data.post_data.wxAddress.countyName = res.qqmap_address.district
        that.data.post_data.wxAddress.detailInfo = res.detail_info
        that.data.post_data.wxAddress.userName = res.name
        that.data.post_data.wxAddress.telNumber = res.mobile
        that.data.post_data.wxAddress.nationalCode = res.province_id
        that.data.post_data.wxAddress.postalCode = res.province_id
        that.data.post_data.wxAddress.address = res.address
      }
      that.setData({post_data:that.data.post_data})
      that.setPrice();
    });
  },

  addressRemind:function(){
    var that = this;
    if (that.data.post_data.shipping_type == 2) {
      that.setData({ address_remind: !that.data.address_remind })
    }
  },

  //提交订单
  order_formSubmit: function (e) {
    var that = this;
    if (e.detail.value.shipping_type == '到店取货') {
      if (e.detail.value.phone.search(/^([0-9]{11})?$/) == -1) {
        wx.showModal({ content: '请输入正确的手机号！', showCancel: false });
        return;
      }
    }
    
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    });
    that.setData({
      btn_submit_disabled: true
    });
    var order_info = e.detail.value;
    order_info.extra = this.form.getSerializeValues();
    order_info.form = that.data.order_info.form;
    order_info.wx_address = that.data.post_data.wxAddress;
    order_info.quan_id = that.data.post_data.quan_id;
    order_info.manjian_id = that.data.order_info.mianjian_id;
    order_info.form_id = e.detail.formId;
    order_info.version = that.data.version
    order_info.order_key = wx.getStorageSync("utoken") + '_' + that.data.order_info.glist[0].goods_info.goods_id
    order_info.goods_id = that.data.post_data.goods_id
    order_info.goods_number = that.data.post_data.goods_number
    order_info.goods_attr = that.data.post_data.goods_attr
    order_info.attr_str = that.data.post_data.attr_str
    order_info.usecard = 1
    order_info.shipping_type = that.data.post_data.shipping_type
    order_info.time_type = that.data.order_info.time_type
    order_info.self_address_name = that.data.all_address.address_name
    order_info.self_address = that.data.all_address
    order_info = JSON.stringify(order_info)
    var sign = md5.md5(order_info+md5.md5('sign'))
    requestUtil.post(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/postOrder.html',
      { oinfo: order_info, sign: sign},
      (data) => {
        wx.setStorage({ key: "shop_name", data: e.detail.value.name == undefined ? '' : e.detail.value.name })
        wx.setStorage({ key: "shop_phone", data: e.detail.value.phone == undefined ? '' : e.detail.value.phone })
        wx.setStorage({ key: "shop_wx_address_info", data: that.data.post_data.wxAddress })
        wx.hideToast();
        that.setData({
          btn_submit_disabled: false
        });
        //跳转支付
        var order_id = data;
        that.setData({order_id : order_id})
        that.getPayOrderInfo();
        // wx.redirectTo({
        //   url: '../orderpay/index?order_id=' + order_id
        // })
      }, this, {
        isShowLoading: false, complete: function () {
          that.setData({
            btn_submit_disabled: false
          });
        }
      });
  },
  //根据类别选择取货方式
  choose_by_type: function (type) {
    var that = this
    this.data.post_data.shipping_type = type
    if (type == 1) {
      var value = false
      if (this.data.post_data.wxAddress) {
        value = this.data.post_data.wxAddress
      } else if (this.data.order_info.default_address != '') {
        value = this.data.order_info.default_address
      }else {
        value = wx.getStorageSync('shop_wx_address_info')
      }
      if (value) {
        // Do something with return value
        this.data.post_data.wxAddress = value
      } else {
        this.select_address_bind()
      }
    }
    that.setData({ post_data: that.data.post_data })
    that.setPrice();
  },

  //控制时间弹出框
  bindTime: function () {
    this.setData({//打开
      is_time: 1,
    })

    var that = this;
    var date_week = that.data.fDate;
    var all_time = that.data.ck_tpart;
    // that.setData({
      // date: date_week[0].date,//默认最近日期
      // week: date_week[0].week,//默认最近日期周几
      // week_status: date_week[0].date,//默认最近日期选中状态
    // })

  },
  //关闭时间选择
  bindTimeClose: function () {
    this.setData({
      is_time: 0,
      date: '',
      time: '',
      week: '',
      week_status: '',
      time_status: '',
    })
  },
  //选择日期
  bindChangeDate: function (e) {
    // 日期选中状态
    var that = this;
    var fDate = that.data.fDate;//日期
    var time_type = that.data.time_type;//时段类型
    var date_check = e.currentTarget.dataset.index;//选中的日期

    var j = 0;//选中日期对象下标
    for (var i = 0; i < fDate.length; i++) {
      if (fDate[i].date == date_check) {
        j = i;
      }
    }
    for (let i = 0; i < fDate.length; i++) {
      var date = fDate[i].date;
      if (date == date_check) {
        var date_ck = fDate[i].date;
        var week_ck = fDate[i].week;
      }
    }
    that.setData({
      week_status: date_check,
      week: week_ck,
      date: date_ck,
      time: '',//清空之前时间段选择
      time_status: '',
      ck_tpart: that.data.tpart[j],//切换显示可选时段
    })

  },
  //选择时段
  bindChangeTime: function (e) {
    var time = e.currentTarget.dataset.index;
    this.setData({
      time_status: time,
      time: time,
    })
  },
  //选中时间关闭
  changTimeOver: function () {
    this.setData({
      is_time: 0,
      // week_status: '',
      // time_status: '',
    })
  },
  selectSelfAddress: function (){
    wx.navigateTo({
      url: '../business-address/index'
    })
  },
  //电话
  bind_contant_phone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.all_address.mobile
    })
  },
  to_self_adress: function () {
    wx.openLocation({
      latitude: parseFloat(this.data.all_address.latitude),
      longitude: parseFloat(this.data.all_address.longitude),
      scale: 28,
      name: this.data.all_address.address
    })
  },
  getUserQuanInfo:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/listUserQuan.html', { qtype: 0, all_price: that.data.order_info.all_g_price, version: 109, gid: that.data.post_data.goods_id}, (info) => {
      if (info == null) {
        that.setData({
          able_quan_list: null,
          disable_quan_list: null,
          glo_is_load: false
        });
      } else {
        that.setData({
          able_quan_list: info.able_list,
          disable_quan_list: info.disable_list,
          glo_is_load: false
        });
      }
    }, {});
  },
  getPayOrderInfo: function (order_id){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/DuoguanShop/OrderApi/orderInfo.html", { oid:
      that.data.order_id }, (info) => {
        that.setData({ oinfo: info})
    }, this, {});
    requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/Card/CardApi/getMyCardInfo.html", {}, (info) => {
      that.setData({ 
        cardinfo: info ,
        pay_show:true
        })
    }, that, {});
  },
  //开始支付
  pay_confirmOrder: function (e) {
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/makePay.html', { oid: that.data.order_id, pay_name: e.detail.value.pay_name, formId: e.detail.formId, version: that.data.version }, (info, data) => {
      if (info === '零元商品支付成功'){
        wx.redirectTo({
          url: '../pay-success/pay-success?order_id=' + that.data.order_id,
        });
      }else if (e.detail.value.pay_name == '0') {
        Object.assign(info, {
          'success': function (res) {
            //支付完成 跳转订单列表
            wx.redirectTo({
              url: '../pay-success/pay-success?order_id=' + that.data.order_id
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '../order/list/index'
            })
          },
          'complete': function () {
            that.setData({
              disabled: false
            })
            
          }
        });
        wx.requestPayment(info);
      } else if (e.detail.value.pay_name == '1') {
        if (info == '余额支付成功') {
          wx.redirectTo({
            url: '../pay-success/pay-success?order_id=' + that.data.order_id,
          });
        } else if (data.info == '余额不足') {
          that.setData({ buttonIsDisabled: false, submitIsLoading: false })
          wx.navigateTo({
            url: '/pages/user/mcard/recharge',
          });
        }
      } else if (e.detail.value.pay_name == '2') {
        if (info == '货到付款设置成功') {
          wx.redirectTo({
            url: '../pay-success/pay-success?order_id=' + that.data.order_id,
          });
        }
      }

    }, this, {isShowLoading: true});

  },
  payClose:function(){
    var that = this;
    that.setData({ pay_show:false})
    wx.redirectTo({
      url: '../order/list/index'
    })
  }
})