const app = getApp()
const wxpay = require('../../utils/pay.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
Page({
  data: {
    balance: 0.00,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0
  },
  onLoad() {

  },
  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      app.goLoginPageTimeOut()
      return
    }
    WXAPI.checkToken(token).then(function(res) {
      if (res.code != 0) {
        wx.removeStorageSync('token')
        app.goLoginPageTimeOut()
      }
    })
    wx.checkSession({
      fail() {
        app.goLoginPageTimeOut()
      }
    })
    this.getUserAmount()
    this.orderList()
  },  
  getUserAmount: function() {
    var that = this;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function(res) {
      if (res.code == 0) {
        that.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score
        });
      }
    })
  },
  orderList(){
    WXAPI.orderList({
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code === 0) {
        res.data.orderList.forEach(ele => {
          ele.dingdanhao = ele.orderNumber.substring(ele.orderNumber.length -4)
        })
        this.setData({
          orderList: res.data.orderList,
          logisticsMap: res.data.logisticsMap,
          goodsMap: res.data.goodsMap
        });
      }
    })
  },
  toPayTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _msg = '订单金额: ' + money + ' 元'
        if (res.data.balance > 0) {
          _msg += ',可用余额为 ' + res.data.balance + ' 元'
          if (money - res.data.balance > 0) {
            _msg += ',仍需微信支付 ' + (money - res.data.balance) + ' 元'
          }
        }
        money = money - res.data.balance
        wx.showModal({
          title: '请确认支付',
          content: _msg,
          confirmText: "确认支付",
          cancelText: "取消支付",
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              that._toPayTap(orderId, money)
            } else {
              console.log('用户点击取消支付')
            }
          }
        });
      } else {
        wx.showModal({
          title: '错误',
          content: '无法获取用户资金信息',
          showCancel: false
        })
      }
    })
  },
  _toPayTap: function (orderId, money) {
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function (res) {
        _this.onShow();
      })
    } else {
      wxpay.wxpay('order', money, orderId, "/pages/order-list/index");
    }
  }
})