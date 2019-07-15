// mallcart.js
var _function = require('../../../utils/functionData');
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
var app = getApp()
Page({
  data: {
    this_order_id: 0,
    oinfo: [],
    submitIsLoading: false,
    buttonIsDisabled: false,
    glo_is_load: true,
    cardinfo:[],
    order_disable:false,
    order_time:true
  },
  onLoad: function (options) {
    var that = this
    var order_id = options.order_id;
    that.setData({
      this_order_id: order_id,
    })
    //请求订单详情
    requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/DuoguanShop/OrderApi/orderInfo.html", { oid: that.data.this_order_id}, (info) => {
      that.initgetOrderInfoData(info)
    }, this, {});
    requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/Card/CardApi/getMyCardInfo.html", {}, (info) => {
      that.setData({ cardinfo: info })
    }, that, {});
  },
  initgetOrderInfoData: function (data) {
    var that = this
    var time_1 = setInterval(function () {
      if (data.last_pay_time[1]>=1){
        data.last_pay_time[1]--
      }else{
        if (data.last_pay_time[0]>=1){
          data.last_pay_time[0]--
          data.last_pay_time[1] = 59
        }else{//时间结束，改变页面显示
          clearTimeout(time_1)
          requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/DuoguanShop/DuoguanShopApi/orderDisable.html", { oid: that.data.this_order_id }, (info) => {}, that, {});
          that.setData({
            order_time:false,
            order_disable:true
          })
        }
      }
      that.setData({
        last_pay_time: data.last_pay_time
      })
    }, 1000);
    setTimeout(function(){
      that.setData({
        oinfo: data,
        glo_is_load: false
      })
    },1000)
      
  },
  //开始支付
  pay_confirmOrder: function (e) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/checkCommunityOrder.html',
      { oid: that.data.this_order_id },
      (data) => {
        if (data.code == 0) {
          wx.showModal({
            title: '提示',
            content: data.error,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/shop/order/list/index'
                });
              } else if (res.cancel) {
                wx.redirectTo({
                  url: '/pages/shop/order/list/index'
                });
              }
            }
          })
        } else {
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/makePay.html', { oid: that.data.this_order_id, pay_name: e.detail.value.pay_name, formId: e.detail.formId }, (info, data) => {

            if (e.detail.value.pay_name == '0') {
              Object.assign(info, {
                'success': function (res) {

                },
                'fail': function (res) {

                },
                'complete': function () {
                  that.setData({
                    disabled: false
                  })
                  //支付完成 跳转订单列表
                  wx.redirectTo({
                    url: '../pay-success/pay-success?order_id=' + that.data.this_order_id
                  })
                }
              });
              wx.requestPayment(info);
            } else if (e.detail.value.pay_name == '1') {
              if (info == '余额支付成功') {
                wx.redirectTo({
                  url: '../pay-success/pay-success?order_id=' + that.data.this_order_id
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
                  url: '../pay-success/pay-success?order_id=' + that.data.this_order_id
                });
              }
            }

          }, this, {
            isShowLoading: true, completeAfter: function () {
              that.setData({
                buttonIsDisabled: false,
                submitIsLoading: false
              })
            }
            });
        }
      }, this, { isShowLoading: false });
    that.setData({
      buttonIsDisabled: true,
      submitIsLoading: true
    })
    

  }
})