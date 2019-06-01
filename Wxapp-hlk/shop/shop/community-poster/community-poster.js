const app = getApp();
const util = require('../../../utils/util');
const requestUtil = require('../../../utils/requestUtil');
const $ = require('../../../utils/underscore');
const _DuoguanData = require('../../../utils/data');
const WxParse = require('../../../wxParse/wxParse.js');
function GetLength(str) {
  return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: '/images/default.png',
    loadhide: true,
    canvasHiden: false,
    goods_pic: '/images/default.png',
    qr_pic: '/images/default.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取分享网页面的数据
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/CommunityDoApi/share.html', { colonel_uid: options.colonel_uid}, (data) => {
      that.setData({poster_text: data.text})
      that.initData(data);
    }, this, { isShowLoading: false })
  },

  initData:function(data){
    var that = this;
    wx.downloadFile({
      url: data.pic.head_pic,
      success:function(res){
        that.setData({
          head_pic: res.tempFilePath
        })
        wx.downloadFile({
          url: _DuoguanData.duoguan_host_api_url + data.pic.qr_pic,
          complete:function(res){
            that.setData({
              qr_pic: res.tempFilePath
            })
            that.drawPoster();
          }
        })
        // that.drawPoster();
      }
    })
  },

  drawPoster:function(){
    var that = this;
    //获取手机信息
    var phoneMsg = wx.getSystemInfoSync();
    //当前手机的宽度
    let pWidth = phoneMsg.windowWidth;
    //制定统一的长度单位
    let mpx = pWidth / 375;
    //海报的高度
    var nowH = 540 * mpx;
    //开始
    var context = wx.createCanvasContext('myCanvas');
    //绘制背景色
    context.setFillStyle('#ffffff');
    //填充一个矩形
    context.fillRect(0, 0, pWidth, 2 * pWidth);
    //放置头像
    context.drawImage(that.data.head_pic, 38 * mpx, 38 * mpx, 68 * mpx, 68 * mpx);
    //昵称
    context.setFillStyle('black');
    context.setFontSize(14 * mpx);
    context.fillText(that.data.poster_text.nickname, 126 * mpx, 62 * mpx);
    //团长等级
    context.setFillStyle('#98A1B2');
    context.setFontSize(14 * mpx);
    context.fillText('邀您进入团长小区', 126 * mpx, 92 * mpx);
    //横线
    context.rect(15 * mpx, 124 * mpx, pWidth - 30 * mpx, 0.3 * mpx);
    context.setFillStyle('#98A1B2');
    context.fill();
    //自提点名称
    var address_name_length = GetLength(that.data.poster_text.address_name) / 2;
    var address_name_x = pWidth / 2 - address_name_length * 16 * mpx / 2;
    context.setFillStyle('black');
    context.setFontSize(16 * mpx);
    context.fillText(that.data.poster_text.address_name, address_name_x, 162 * mpx);
    //二维码
    context.drawImage(that.data.qr_pic, 98 * mpx, 190 * mpx, 180 * mpx, 180 * mpx);
    //模块名称
    var public_name_length = GetLength(that.data.poster_text.public_name) / 2;
    var public_name_x = pWidth / 2 - public_name_length * 14 * mpx / 2;
    context.setFillStyle('black');
    context.setFontSize(14 * mpx);
    context.fillText(that.data.poster_text.public_name, public_name_x, 402 * mpx);
    //扫码进入团长小区
    context.setFillStyle('black');
    context.setFontSize(14 * mpx);
    context.fillText('扫码进入团长小区', 134 * mpx, 420 * mpx);
    //自提地点
    context.setFillStyle('#98A1B2');
    context.setFontSize(14 * mpx);
    //最大书写宽度
    var max_w = pWidth - 60 * mpx;
    //单行最多字数
    var max_n = Math.floor(max_w / (14 * mpx));
    //初始位置
    var address_x = 30 * mpx;
    var address_y = 470 * mpx;
    //最多行数
    var address = '自提地址：' + that.data.poster_text.address;
    var max_h = Math.ceil(GetLength(address) / 2 / max_n);
    var a, b;
    for(var i = 1; i <= max_h; i++){
      a = (i - 1) * max_n;
      b = i * max_n;
      var sub_name = address.substring(a, b);
      context.fillText(sub_name, address_x, 450 * mpx + i * 18 * mpx);
    }
    context.save();
    context.draw()
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        height: nowH,
        fileType: 'jpg',
        success: function (res) {
          that.setData({
            imgurl: res.tempFilePath,
            canvasHiden: true,
            loadhide: false
          })
        }
      })
    }, 1500);
  },

  savePic: function () {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imgurl,
      success: function (res) {
        if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (res) {

        wx.showModal({
          title: '提示',
          content: '请前往开启保存到相册权限!',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({ success: function (res) { console.log(res) } })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  goHome: function () {
    var url = '';
    if (_DuoguanData.duoguan_app_is_superhome == 0) {
      url += "/pages/shop/mall/mall";
    } else {
      url += _DuoguanData.duoguan_app_index_path;
    }
    wx.switchTab({
      url: url,
      fail: () => {
        wx.navigateTo({
          url: url,
        })
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