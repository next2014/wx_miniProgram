// mallcart.js
const _function = require('../../../../utils/functionData');
const requestUtil = require('../../../../utils/requestUtil');
const _DuoguanData = require('../../../../utils/data');
const QR = require('../../../../utils/qrcode');
const app = getApp()
Page({
  data: {
    this_order_id: 0,
    oinfo: [],
    glo_is_load: true,
    version: '2.2.1',
    last_pay_time:[],
    order_disable: false,
    order_time:true,
  },
  //创建二维码
  createQrCode: function (code, canvasId) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.init(code, canvasId, 0, 0, 160, 160);
  },
  //查看物流
  wuliu_info_bind: function () {
    var that = this;
    if (that.data.oinfo.express_code == '' || that.data.oinfo.express_code == null) {
      wx.showModal({
        title: '提示',
        content: '对不起，该订单暂无物流信息',
        showCancel: false
      });
      return false;
    } else {
      wx.navigateTo({
        url: '../../../shop/mallwuliu/index?oid=' + that.data.oinfo.id
      })
    }
  },
  onLoad: function (options) {
    var that = this
    var order_id = options.oid;
    that.setData({
      this_order_id: order_id,
    })
    //请求订单详情
    that.loaddata();
    that.checkCommunityOrder();
  },
  loaddata: function () {
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/OrderApi/orderInfo.html',
      { oid: that.data.this_order_id, version: that.data.version },
      (data) => {
        that.initgetOrderInfoData(data)
      }, this, { isShowLoading: false });
  },
  checkCommunityOrder:function(){
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/checkCommunityOrder.html',
      { oid: that.data.this_order_id},
      (data) => {
        console.log(data)
        if(data.code == 0){
          that.loaddata();
        }
      }, this, { isShowLoading: false });
  },
  initgetOrderInfoData: function (data) {
    var that = this
    if (data.pay_status=='0'){
      var time_1 = setInterval(function () {
        if (data.last_pay_time[1] >= 1) {
          data.last_pay_time[1]--
        } else {
          if (data.last_pay_time[0] >= 1) {
            data.last_pay_time[0]--
            data.last_pay_time[1] = 59
          } else {//时间结束，改变页面显示
            clearTimeout(time_1)
            requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/DuoguanShop/DuoguanShopApi/orderDisable.html", { oid: that.data.this_order_id }, (info) => { }, that, {});
            that.setData({
              order_time: false,
              order_disable: true
            })
          }
        }
        that.setData({
          last_pay_time: data.last_pay_time
        })
      }, 1000);
    }
    setTimeout(function(){
      that.createQrCode(data.order_off_id, 'mycanvas');
      that.setData({
        oinfo: data,
        glo_is_load: false
      })
    },1000)
  },
  //支付
  order_go_pay_bind: function () {
    var order_id = this.data.this_order_id
    wx.redirectTo({
      url: '../../../shop/orderpay/index?order_id=' + order_id
    })
  },
  //评论
  order_go_comment_bind: function () {
    var order_id = this.data.this_order_id
    wx.redirectTo({
      url: '../comment/index?order_id=' + order_id
    })
  },
  //确认收货
  order_go_shouhuo_bind: function () {
    var that = this
    var order_id = this.data.this_order_id
    wx.showModal({
      title: '提示',
      content: "确认收货吗?",
      success: function (res) {
        if (res.confirm == true) {
          // _function.shouhuoOrderInfo(wx.getStorageSync("utoken"), order_id, that.initshouhuoOrderInfoData, this)
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/OrderApi/shouhuoUserOrder.html',
            { oid: order_id },
            (data) => {
              that.initshouhuoOrderInfoData(data)
            }, this, { isShowLoading: true });
        }
      }
    })
  },
  initshouhuoOrderInfoData: function (data) {
    var that = this
    // _function.getOrderInfo(wx.getStorageSync("utoken"), that.data.this_order_id, that.initgetOrderInfoData, this)
    that.loaddata()
  },
  goGoodsInfo: function (e) {
    wx.navigateTo({
      url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id,
    })
  },
  to_self_adress: function () {
    wx.openLocation({
      latitude: parseFloat(this.data.oinfo.self_address.latitude),
      longitude: parseFloat(this.data.oinfo.self_address.longitude),
      scale: 28,
      name: this.data.oinfo.self_address.address
    })
  },
  order_go_refund: function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/shop/applyRefund/applyRefund?oid=' + e.target.dataset.id,
    })
  },
  refund_go_detail:function(){
    wx.navigateTo({
      url: '/pages/shop/refundDetail/refundDetail?rid=' + this.data.oinfo.rid,
    })
  },
  //电话
  bindContantPhone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.oinfo.public_info.kefu_contant
    })
  },

  bindAddressPhone:function(){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.oinfo.self_address.mobile
    })
  },
  //取消订单
  delete_user_order: function (e) {
    var that = this
    var oid = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: "确认要取消该订单吗?",
      success: function (res) {
        if (res.confirm == true) {
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/OrderApi/deleteUserOrder.html',
            { oid: oid },
            (data) => {
                wx.showModal({
                  title: '提示',
                  content: data,
                  success: function(res){
                    wx.redirectTo({
                      url: '/pages/shop/order/list/index',
                    })
                  }
                })
              
            }, this, { isShowLoading: false });
        }
      }
    })
  },
  //删除订单
  hidden_user_order: function (e) {
    var that = this
    var oid = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: "确认要删除该订单吗?",
      success: function (res) {
        if (res.confirm == true) {
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/OrderApi/cutUserOrder.html',
            { oid: oid },
            (data) => {
                wx.showModal({
                  title: '提示',
                  content: data,
                  success: function (res) {
                    wx.redirectTo({
                      url: '/pages/shop/order/list/index',
                    })
                  }
                })
              
            }, this, { isShowLoading: false });
        }
      }
    })
  },
})