// pages/hexiao/index.js
const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DgData = require('../../../utils/data');
Page({

  data: {
    is_orderInfo_show: 0,
    order_number: '',
    oinfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //手动输入核销码
  formSubmit: function (e) {
    var that = this;
    var order_number = e.detail.value.order_number;
    if (order_number) {
      that.data.order_number = order_number;
      that.getOrderInfo();
    }
  },
  //扫码结果
  scanCode: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        that.data.order_number = res.result;
        that.getOrderInfo();
      }
    })
  },
  getOrderInfo: function () {
    var that = this;
    requestUtil.post(_DgData.duoguan_host_api_url + '/index.php?s=/addon/Examuser/ExamApi/exam.html', { order_number: that.data.order_number }, (data) => {
      var that = this;
      if (data){
        that.setData({
          oinfo: data,
          is_orderInfo_show: 1
        });
      }else{
        wx.showModal({
          title: '提示',
          content: '无效的订单状态',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    });
  },
  sureChargeOff: function (e) {
    var that = this;
    that.change_order_status_or_show();
  },
  cancel: function () {
    var that = this;
    that.setData({
      is_orderInfo_show: 0
    });
  },
  //核销改变券的状态
  change_order_status_or_show: function () {
    var that = this
    requestUtil.post(_DgData.duoguan_host_api_url + '/index.php?s=/addon/Examuser/ExamApi/examChange.html', { order_number: that.data.order_number,is_part: that.data.oinfo.is_part, goods_info: JSON.stringify(that.data.oinfo.goods_info)}, (info) => {
      that.setData({ show_success: true, is_orderInfo_show: 0})

    }, { complete: that.changeComplete() });
  },
  changeComplete: function (res) {
    console.log(res);
  },
  add_use:function(e){
    let key = e.currentTarget.dataset.key,data = this.data
    if (data.oinfo.goods_info[key].use_number == undefined){
      data.oinfo.goods_info[key].use_number = 0
    }
    data.oinfo.goods_info[key].use_number++
    if (data.oinfo.goods_info[key].use_number >= data.oinfo.goods_info[key].goods_number){
      data.oinfo.goods_info[key].use_number = data.oinfo.goods_info[key].goods_number
    }
    this.setData(data)
  },
  cut_use:function(e){
    let key = e.currentTarget.dataset.key, data = this.data
    if (data.oinfo.goods_info[key].use_number == undefined) {
      data.oinfo.goods_info[key].use_number = 0
    }
    data.oinfo.goods_info[key].use_number--
    if (data.oinfo.goods_info[key].use_number < 0) {
      data.oinfo.goods_info[key].use_number = 0
    }
    this.setData(data)
  },

  successBack:function(){
    this.setData({ show_success: false, is_orderInfo_show: 0, oinfo:{}})
  }
})