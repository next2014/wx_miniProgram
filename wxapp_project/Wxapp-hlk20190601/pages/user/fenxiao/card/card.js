const app = getApp();
const requestUtil = require('../../../../utils/requestUtil');
const _DuoguanData = require('../../../../utils/data');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidecode:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getFenxiaoCard();

    //加载用户信息
    requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
      this.setData({ userInfo: data });
    });
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
  onShareAppMessage: function (options) {
    var that = this;
    if (options.target != undefined){
      var goods_name = options.target.dataset.name;
      var cid = options.target.dataset.cid;
      var shareTitle = that.data.userInfo.nickname + '向你分享了' + goods_name;
      var sharePath = 'pages/giftCard/index/index?cid=' + cid + '&shareuid=' + that.data.userInfo.uid +'&sharetype=fx';
    }else{
      var shareTitle = that.data.userInfo.nickname + '向你分享了一个卡片';
      var sharePath = 'pages/giftCard/index/index';
    }

    return {
      title: shareTitle,
      path: sharePath
    }
  },
  /**
   * 获取分销卡片
   */
  getFenxiaoCard:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanGiftCard/GoodsApi/fenxiao_goods', {}, (info) => {
      that.setData({clist:info});
    }, this, { isShowLoading: true });
  },
  
  /**
   *获取礼品卡首页二维码 
   */
  getCardCode:function(){
    var that = this;
    const url = _DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/DuoguanGiftCard/CodeApi/getCardCode.html&&token=" + _DuoguanData.duoguan_user_token + "&shareopenid=" + that.data.userInfo.uid;
    wx.showToast({
      title: '正在努力加载中...',
      icon: 'loading',
      duration: 10000
    });
    wx.getImageInfo({
      src: url,
      success: (res) => {
        wx.hideToast();
        that.setData({
          code_img: res.path,
          hidecode: false,
        })
      },
      fail: function (res) {
        console.error(res);
        wx.showModal({
          content: '加载失败！',
          showCancel: false,
        });
        wx.hideToast();
      },
      complete: function (res) {
        console.log(res)
      }
    });
  },

  /**
   * 获取礼品卡详情二维码
   */
  getCardInfoCode:function(e){
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    const url = _DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/DuoguanGiftCard/CodeApi/getCardInfoCode.html&&token=" + _DuoguanData.duoguan_user_token + "&shareopenid=" + that.data.userInfo.uid+"&cid="+cid;
    wx.showToast({
      title: '正在努力加载中...',
      icon: 'loading',
      duration: 10000
    });
    wx.getImageInfo({
      src: url,
      success: (res) => {
        wx.hideToast();
        that.setData({
          code_img: res.path,
          hidecode: false,
        })
      },
      fail: function (res) {
        console.error(res);
        wx.showModal({
          content: '加载失败！',
          showCancel: false,
        });
        wx.hideToast();
      },
      complete: function (res) {
        console.log(res)
      }
    });
  },

  /**
   * 关闭二维码弹窗
   */
  closeShow:function(){
    this.setData({ hidecode: true});
  },

  /**
   *保存图片到本地 
   */
  downLoad: function () {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.code_img,
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
})