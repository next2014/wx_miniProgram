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
    sharinfo: {
      pic: {
        goods_pic: '/images/default.png',
        head_pic: '/images/ico_vip.png'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取分享网页面的数据
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/share.html', { sid: options.sid, share_type: options.share_type, version: 393 }, (data) => {
      that.initData(data);
    }, this, { isShowLoading: false })
  },
  initData: function (data) {
    var that = this;
    var pic = {};
    //开始绘制海报

    that.data.sharinfo.text = data.text;
    that.setData({
      sharinfo: that.data.sharinfo
    })
    // 下载图片
    wx.downloadFile({
      url: data.pic.goods_pic,
      success: function (res) {
        that.data.sharinfo.pic.goods_pic = res.tempFilePath
        // that.drawPoster()
        wx.downloadFile({
          url: _DuoguanData.duoguan_host_api_url + data.pic.qr_pic,
          success: function (res) {
            that.data.sharinfo.pic.qr_pic = res.tempFilePath
            wx.downloadFile({
              url: data.pic.head_pic,
              success:function(res){
                that.data.sharinfo.pic.head_pic = res.tempFilePath
                wx.downloadFile({
                  url: data.pic.logo_pic,
                  complete: function (res) {
                    console.log(that.data.sharinfo.pic)
                    that.data.sharinfo.pic.logo_pic = res.tempFilePath
                    that.drawPoster()
                  }
                })
              }
            })

          }
        })
      }
    })
    

  },
  drawPoster: function () {
    var that = this
    // 获取手机信息
    var phoneMsg = wx.getSystemInfoSync();
    //当天前手机的我宽度
    let pWidth = phoneMsg.windowWidth;
    //制订同意的长度单位
    let mpx = pWidth / 375;
    //当前的海报高度
    var nowH = 0;
    console.log(phoneMsg);
    var context = wx.createCanvasContext('myCanvas');
    //绘制背景色
    context.setFillStyle("#ffffff");
    context.fillRect(0, 0, pWidth, 2 * pWidth);
    //放置商品图片

    //获取图片数据
    wx.getImageInfo({
      src: that.data.sharinfo.pic.goods_pic,
      success: function (res) {
        if (res.width > 0 && res.height > 0) {
          // 计算商品图片应有的宽高
          var g_w = pWidth - 60 *mpx;//商品名图片与手机屏幕宽度一致
          //通过宽度比例计算图片应有高度
          var g_h = (g_w / res.width) * res.height;
          //绘制商品图片
          console.log(g_w, g_h);
          context.drawImage(that.data.sharinfo.pic.goods_pic, 30 * mpx, 50 * mpx, g_w, g_h);
          //标记当前海报的高度
          nowH = g_h + 100 * mpx;
          context.setFillStyle("#ffffff")
          //绘制一个圆形,半径56*mpx  距离左边50*mpx,作为头像的底色 ,头像放在元的中线,多余的白色 作为边框
          // context.arc(50 * mpx, nowH, 28 * mpx, 0, 2 * Math.PI)
          // context.fill();
          // context.drawImage(that.data.sharinfo.pic.head_pic, 25 * mpx, nowH - 25 * mpx, 50 * mpx, 50 * mpx);
          //放置用户头像
          context.fill();
          context.drawImage(that.data.sharinfo.pic.head_pic, 20 * mpx, 15 * mpx, 28 * mpx, 28 * mpx);
          //放置用户名字
          context.setFillStyle("#98A1B2")
          context.setFontSize(16 * mpx)
          var u_name = that.data.sharinfo.text.username_text
          var name_n = Math.ceil(GetLength(u_name));
          if(name_n > 5){
            u_name = u_name.substring(0, 4) + '...'
          }
          var g_n_x = 60 * mpx;
          var g_n_y = 35 * mpx;
          context.fillText(u_name, g_n_x, g_n_y);
          //分享标语
          context.setFillStyle("black")
          context.setFontSize(16 * mpx)
          var g_n_x = 60 * mpx;
          var g_n_y = 35 * mpx;
          context.fillText('发现好物, 分享给你', g_n_x + 80 * mpx, g_n_y, 200);
          //用户邀请信息
          // context.setFontSize(14 * mpx);
          // context.setFillStyle("#333333")
          // context.fillText(that.data.sharinfo.text.username_text + ' ' + that.data.sharinfo.text.inite_text, 76 * mpx, nowH + 14 * mpx, 200);
          //标记当前高度
          nowH = nowH - 45 * mpx;
          // 放置商品名
          context.setFillStyle("black")
          context.setFontSize(20 * mpx)
          var g_name = that.data.sharinfo.text.title_text;
          //最大书写宽度
          var max_w = pWidth - 60 * mpx;
          //最多字数
          var max_n = Math.floor(max_w / (20 * mpx));
          console.log(max_n, max_w);
          //放置初始的位置
          var g_n_x = 36 * mpx;
          var g_n_y = nowH;
          //最多行数
          var max = Math.ceil(GetLength(g_name) / 2 / max_n);
          var b, e;
          for (var i = 1; i <= max; i++) {
            var b = (i - 1) * max_n;
            var e = i * max_n;
            if (i <= 1) {
              var sub_name = g_name.substring(b, e);
              context.fillText(sub_name, g_n_x, i * 22 * mpx + g_n_y, max_w);
            } else {
              var sub_name = g_name.substring(b, b + Math.floor(max_n / 2));
              context.fillText(sub_name + '...', g_n_x, i * 22 * mpx + g_n_y, max_w);
              max = 2;
              break
            }
          }
          
          //价格
          var price_n = Math.ceil(GetLength(that.data.sharinfo.text.msg_text) - 1);
          var price_w = price_n * 20 * mpx;
          console.log('price_n:' + price_n)
          context.setFontSize(16 * mpx);
          context.setFillStyle("red");
          context.fillText('￥', g_n_x, (max + 1.5) * 22 * mpx + g_n_y, 100);
          context.setFontSize(24 * mpx);
          context.setFillStyle("red");
          context.fillText(that.data.sharinfo.text.msg_text, g_n_x + 16 * mpx, (max + 1.5) * 22 * mpx + g_n_y, 100);
          //销量
          // context.setFontSize(14 * mpx);
          // context.setFillStyle("#989898");
          // context.fillText('销量 ' + that.data.sharinfo.text.sale_number, g_n_x + 12 * mpx + price_w, (max + 1.2) * 22 * mpx + g_n_y, 100);
          //提示
          context.setFontSize(16 * mpx);
          context.setFillStyle("#333333");
          
          context.fillText("长按识别二维码", g_n_x, (max + 4) * 22 * mpx + g_n_y, max_w);

          context.setFontSize(15 * mpx);
          context.setFillStyle("#989898");
          context.fillText("查看详情", g_n_x, (max + 5) * 22 * mpx + g_n_y, max_w);
          
          var g_n_y = nowH + 18 * mpx;
          context.drawImage(that.data.sharinfo.pic.qr_pic, g_n_x + max_w * 0.58, (max + 0.5) * 22 * mpx + g_n_y, max_w * 0.35, max_w * 0.35)
          nowH = (max + 1) * 22 * mpx + g_n_y + max_w * 0.35;
          context.save();
          context.draw()
          setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'myCanvas',
              height: nowH,
              fileType: 'jpg',
              success: function (res) {
                console.log(res.tempFilePath);
                that.setData({
                  imgurl: res.tempFilePath,
                  canvasHiden: true,
                  loadhide: false
                })
              }
            })
          }, 1500);
        }
      }
    })
    // context.save();
    // context.draw()

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
  }
})