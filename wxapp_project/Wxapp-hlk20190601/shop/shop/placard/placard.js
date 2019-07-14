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
    shareurl: null,
    poster: {},
    avatar: null,
    ticket: null,
    imgurl: null,
    cavhide: false,
    imghide: true,
    loadhide: true,
    goodsimg: null,//商品图
    options: {}
  },
  poster: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
  },
  initplacard: function (options) {
    let that = this;
    // options.goodsid = options.goods_id;
    // options.myopenid = options.myo;
    // options.shareuid = options.sho;
    
    requestUtil.post(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/tickttest.html', options, (info) => {
      that.setData({
        poster: info,
      })
      that.getresTemp(info, options);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getresTemp: function (poster, options) {
    let that = this;
    wx.downloadFile({
      url: poster.avatar,
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            avatar: res.tempFilePath
          }, function () {
            wx.downloadFile({
              url: poster.goodsimg,
              success: function (res) {
                if (res.statusCode === 200) {
                  that.setData({
                    goodsimg: res.tempFilePath
                  }, function () {
                    
                    wx.downloadFile({
                      url: _DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/mygetticket/goods_id/' + options.goods_id + '/token/' + _DuoguanData.duoguan_user_token+'.html',
                      success: function (res) {
                        if (res.statusCode === 200) {
                          that.setData({
                            ticket: res.tempFilePath
                          }, function () {
                            that.canvasposter(poster);
                          })
                        }
                      }
                    })


                  })
                }
              }
            })
          })
        }
      }
    })
  },


  canvasposter: function (poster) {
    let that = this;
    that.setData({
      loadhide: false,
    })
    let userinfo = wx.getStorageSync('user_info');
    let phone = wx.getSystemInfoSync();
    let widowwidth = phone.screenWidth;
    let windewheight = phone.windowHeight;
    let bili = widowwidth / 375;
    var context = wx.createCanvasContext('myCanvas');
    context.setFillStyle('#ffffff')
    context.fillRect(0, 0, widowwidth, windewheight)
    //用户图像
    context.drawImage(that.data.avatar, 25, 10, 50 * bili, 50 * bili);
    //用户昵称
    context.setFillStyle('#000000');
    context.setFontSize(22);
    context.setTextAlign('left');
    let nickname = userinfo.nickname
    context.fillText(nickname, 50 * bili + 50, 40 * bili);
    //商品图
    context.drawImage(that.data.goodsimg, 25, 50 * bili + 20, widowwidth - 50, widowwidth - 50);

    //商品页二维码
    context.drawImage(that.data.ticket, 25, widowwidth - 20 + 50 * bili, 100, 100);

    //商品名称
    context.setTextAlign('left');
    context.setFontSize(17);
    let goods_name = poster.goods_name
    // let goodslength = goods_name.length;
    let goodslength = GetLength(goods_name);
    
    context.setFillStyle('#000000');
    if (goodslength > 15) {
      let gname1 = goods_name.substring(0, 12);
      context.fillText(gname1, 140, widowwidth + 50 * bili + 10);
      let gname2 = goods_name.substring(12, 24) + '...';
      context.fillText(gname2, 140, widowwidth + 50 * bili + 30);
    } else {
      context.fillText(goods_name, 140, widowwidth + 50 * bili + 10);
    }
    //商品价格
    context.setTextAlign('left');
    context.setFontSize(17);
    context.setFillStyle('#f35150');
    let shop_price = poster.shop_price
    let market_price = poster.market_price
    let price = '￥' + shop_price;
    if (goodslength > 15) {
      context.fillText(price, 140, widowwidth + 50 * bili + 60);
    } else {
      context.fillText(price, 140, widowwidth + 50 * bili + 40);
    }


    //提示长按识别
    let changstr = "长按识别二维码"
    let changwidth = 375 / 2 * bili;
    context.setTextAlign('center');
    context.setFillStyle('#333333');
    context.setFontSize(14);
    context.fillText(changstr, changwidth, widowwidth + 50 * bili + 110);
    context.save();
    context.draw();
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          that.setData({
            imgurl: res.tempFilePath,
            cavhide: true,
            imghide: false,
            loadhide: true
          })
        }
      })
    }, 1000);
  },
  savePic: function () {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imgurl,
      success(res) {
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

    this.initplacard(this.data.options);
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