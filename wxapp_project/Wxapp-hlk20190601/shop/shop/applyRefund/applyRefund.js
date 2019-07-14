// pages/shop/applyRefund/applyRefund.js
const _function = require('../../../utils/functionData');
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
const QR = require('../../../utils/qrcode');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score_arr: [
      {
        'val': 1,
        'ischeck': true
      },
      {
        'val': 2,
        'ischeck': true
      },
      {
        'val': 3,
        'ischeck': true
      },
      {
        'val': 4,
        'ischeck': true
      },
      {
        'val': 5,
        'ischeck': true
      }
    ],
    this_order_id: 0,
    submitIsLoading: false,
    buttonIsDisabled: false,
    this_score_val: 5,
    img_count_limit: 5,
    this_img_i: 0,
    this_img_max: 0,
    this_post_id: 0,
    postimg: [],
    pick_arr:['退货退款' , '仅退款'],
    index: 0,
    version: '2.2.1',
    order_info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var order_id = options.oid;
    that.setData({
      this_order_id: order_id,
    })
    that.loaddata()
  },

  loaddata: function () {
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/OrderApi/orderInfo.html',
      { oid: that.data.this_order_id, version: that.data.version },
      (data) => {
        that.setData({ order_info: data})
      }, this, { isShowLoading: false });
  },

  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },

  //上传图片
  chooseimg_bind: function () {
    var that = this
    var img_lenth = that.data.postimg.length
    var sheng_count = that.data.img_count_limit - img_lenth
    if (sheng_count <= 0) {
      wx.showModal({
        title: '提示',
        content: '对不起，最多可上传五张图片',
        showCancel: false
      })
      return false
    }
    wx.chooseImage({
      count: sheng_count,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          postimg: that.data.postimg.concat(res.tempFilePaths)
        })
      }
    })
  },

  //删除
  del_pic_bind: function (e) {
    var that = this
    var index = e.currentTarget.id;
    var datas = that.data.postimg;
    datas.splice(index, 1)
    that.setData({
      postimg: datas
    })
  },

  formSubmit: function (e) {
    var that = this
    var t_con = e.detail.value.content
    that.setData({
      submitIsLoading: true,
      buttonIsDisabled: true
    })
    if (t_con == '') {
      wx.showModal({
        title: '提示',
        content: '对不起，请输入留言内容',
        showCancel: false
      })
      that.setData({
        submitIsLoading: false,
        buttonIsDisabled: false
      })
      return false;
    }

    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/postRefundReason.html',
      { oid: that.data.this_order_id, uid: that.data.order_info.user_id, content: t_con, refund_type: that.data.index, formId: e.detail.formId, max_refund: that.data.order_info.refund_amount, mobile:e.detail.value.mobile },
      (data) => {
        console.log(data)
        if (data.code == 1) {
          
        } else {
          wx.showModal({
            title: '提示',
            content: data.info,
            showCancel: false,
            success: function (res) {
              
            }
          })
          return;
        }
        // 上传图片
        let filePathList = this.data.postimg;
        if (filePathList.length == 0) {
          that.initpostCommentOrderData(data);
        } else {
          this.uploadImage(that.data.postimg, 0, function (res) {
            this.initpostCommentOrderData(data);
          }, that.data.this_order_id);
        }
      }, this, { isShowLoading: false });
  },
  initpostCommentOrderData: function (data) {
    var that = this
    that.setData({
      submitIsLoading: false,
      buttonIsDisabled: false
    })
    wx.showModal({
      title: '提示',
      content: "申请退款成功",
      showCancel: false,
      success: function (res) {
        wx.redirectTo({
          url: '/pages/shop/refundDetail/refundDetail?rid=' + data.info,
        })
      }
    })
  },
  uploadImage: function (filePathList, index, callback, id) { //上传图片
    if (filePathList.length == index) { // 递归出口
      callback.apply(this, []);
    } else {
      let url = _DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanShop/Api/uploadImage/oid/' + id;
      let path = filePathList[index];
      requestUtil.upload(url, path, 'file', {}, (res) => {
        // 此处不处理
      }, this, {
        completeAfter: function (res) {
          // 防止上传失败之后影响程序的正常执行
          this.uploadImage(filePathList, ++index, callback, id); // 递归入口
        }
        });
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