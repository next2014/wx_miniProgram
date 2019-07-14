//malldetail.js
const requestUtil = require('../../../utils/requestUtil');
const $ = require('../../../utils/underscore');
const _DuoguanData = require('../../../utils/data');
const WxParse1 = require('./wxParse/wxParse.js');
const util = require('../../../utils/util');
const md5 = require('../../shop/common/utils/md5');
const app = getApp()
Page({
  data: {
    goods_info: {},
    goods_specification: [],
    wxParseData: '',
    shop_config: [],
    this_goods_id: 0,
    this_g_nav: 1,
    is_add_cart_view: false,
    is_buy_now_view: false,
    cart_default_number: 1,
    goods_attr_select: {},
    btn_add_cart_disabled: false,
    glo_is_load: true,
    indicatorDots: false,
    swiperCurrent: 0,
    scrollTop: 0,
    floorstatus: true,
    shop_attr_price: [],
    is_shop_vip: 0,
    show_share: false,
    //属性新增
    property_select: [],
    goods_property: { 'shop_price': undefined, 'vip_price': undefined, 'g_img_url': '', 'sell_num': undefined, 'last_num': undefined },
    show_property: true,
    show_coupon: false,
    property_num: null,
    seckill_config: {},
    time: {},
    sec: 0,
    shop_quan_info: [],

    is_autoplay: false,
    swiper_type: 'other',

    list: [], // 商品评论列表
    listOptions: { // 商品评论列表分页参数
      page: 1,
      limit: 2,
      hasMore: true,
    },
    animationData: {},
    touchStartDot: '',
    touchVideoStartDot: '',
    touchVideoEndDot: '',
    goods_show_price: '',
    rich_text: {},
    comon_more: true,
    share_type: '',
    selectService: false,
    buy_vip:false,
    msgMoreShow: false,
    aniStyle:false,
    goods_show_vip_price:'',
    goods_show_shop_price:'',
  },
  moveVideoStart(e) {
    let touchVideoStartDot = e.touches[0].pageX;
    this.data.touchVideoStartDot = touchVideoStartDot
  },
  moveVideoEnd(e) {
    let touchVideoEndDot = e.changedTouches[0].pageX
    this.data.touchVideoEndDot = touchVideoEndDot

    let diff = touchVideoEndDot - this.data.touchVideoStartDot
    if (diff >= 0) {
      return false
    } else {
      this.showSwiper()
    }
  },
  showSwiper() {
    //暂停视频播放
    wx.createVideoContext('vedio').pause()
    let animationData = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    animationData.translateX(-1 * this.data.swiper_width).step()
    this.setData({
      swiperCurrent: 0,
      is_autoplay: true,
      animationData: animationData.export()
    })
  },
  moveStart(e) {
    let touchStartDot = e.touches[0].pageX
    this.setData({
      animationData: {},
      touchStartDot: touchStartDot
    })
  },
  moveEnd(e) {
    let touchEndDot = e.changedTouches[0].pageX
    this.setData({
      touchEndDot: touchEndDot
    })
    let diff = touchEndDot - this.data.touchStartDot

    if (diff <= 0) {
      return false
    } else {
      this.showVideo()
    }
  },
  videoPlay: function () {
    this.setData({ select_show: false })
  },
  videoPause: function () {
    this.setData({ select_show: true })
  },
  videoEnded: function () {
    this.setData({ select_show: true })
  },
  showVideo: function () {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation;
    animation.translateX(0).step()
    this.setData({
      swiperCurrent: 0,
      is_autoplay: false,
      animationData: animation.export()
    })
  },
  showProperty: function () {
    this.setData({ show_property: this.data.show_property ? false : true })
  },
  // 关闭规格弹窗
  closeProperty:function(){
    this.setData({ show_property: this.data.show_property ? false : true })
  },
  showCoupon: function () {
    this.setData({ show_coupon: this.data.show_coupon ? false : true })
  },
  toggleMore: function () {
    this.setData({
      msgMoreShow: this.data.msgMoreShow ? false : true,
      aniStyle: this.data.aniStyle ? false : true
     })
  },
  goTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goHome: function (e) {
    if (_DuoguanData.duoguan_app_is_superhome) {
      wx.switchTab({
        url: _DuoguanData.duoguan_app_index_path
      })
    } else {
      wx.switchTab({
        url: '/pages/shop/mall/mall'
      })
    }
  },
  fxgoods: function (e) {
    wx.navigateTo({
      url: '../share/share?sid=' + this.data.this_goods_id + '&share_type=' + this.data.share_type
    })
  },

  onLoad: function (options) {
    util.trySyncUserInfo();
    console.log(options);
    var that = this
    var seckill_config = {};
    seckill_config.is_today = 1;
    that.setData({ seckill_config: seckill_config })
    var otheruid = 0;
    var self_address_id = 0;
    var colonel_uid = 0;
    if (options.shareuid > otheruid) {
      otheruid = options.shareuid;
    }
    if (options.self_address_id > 0) {
      self_address_id = options.self_address_id;
    }
    if (options.colonel_uid > 0) {
      colonel_uid = options.colonel_uid;
    }
    var scene = decodeURIComponent(options.scene)
    if (scene != 'undefined') {
      var my_options = scene.split("#");
      that.setData({ scene: my_options });
      options.self_address_id = my_options[2];
      console.log('self_address_id', my_options[2])
      self_address_id = my_options[2];
      options.sid = my_options[1];
      otheruid = my_options[0];
      console.log('otheruid' + otheruid)
    }
    //加载用户信息
    requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
      that.setData({
        openId: data.openId,
        uid: data.user_id
      });
      if ($.has(data, 'is_shop_vip')) {
        that.setData({
          is_shop_vip: data.is_shop_vip
        })
      } else {
        that.setData({
          is_shop_vip: 0
        })
      }
      if (otheruid > 0) {
        that.makeRelation(otheruid);
      }
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunityConfig.html', {}, (info) => {
        that.setData({ community_config: info })
        if ((self_address_id > 0 || info.default_address > 0) && info.is_open == 1) {
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/onShowBuildCommunityRelation.html', {
            my_uid: data.user_id,
            other_uid: colonel_uid,
            self_address_id: self_address_id,
            version:528
          }, (info) => {
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getGoodsInfo.html', { sid: post_id, version: 200 },
              (data) => {
                if (data.seckill_id > 0) this.setData({ share_type: 'miaosha' })
                that.initGoodsInfoData(data)
                that.makearticle(data);
              }, this, {
                isShowLoading: false, completeAfter: function (obj) {
                  if (obj.data.code == 0) {
                    that.setData({
                      goods_info: ''
                    })
                  }
                }
              });
           }, that, {
              isShowLoading: false
            });
        }else{
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getGoodsInfo.html', { sid: post_id, version: 200 },
            (data) => {
              console.log(321)
              if (data.seckill_id > 0) this.setData({ share_type: 'miaosha' })
              that.initGoodsInfoData(data)
              that.makearticle(data);
            }, this, {
              isShowLoading: false, completeAfter: function (obj) {
                if (obj.data.code == 0) {
                  that.setData({
                    goods_info: ''
                  })
                }
              }
            });
        }
      }, that, { isShowLoading: false });
    });
    //获取手机系统信息
    wx.getSystemInfo({
      success: function (res) {
        var sys = res.system;
        //根据系统给不同的轮播视频样式
        if (sys.substr(0, 3) == 'iOS') {
          that.setData({ swiper_type: 'ios', swiper_width: res.screenWidth })
        } else {
          that.setData({ swiper_type: 'other', swiper_width: res.screenWidth })
        }
      }
    })

    var post_id = options.sid;
    that.setData({
      this_goods_id: post_id
    });

    //请求商品详情
    //清空购物车显示价格
    that.setData({
      goods_show_price: '',
      goods_show_vip_price: '',
      goods_show_shop_price: ''
    })
    
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getConfig.html', {},
      (data) => {
        that.initshopConfigData(data)
        that.loadList({});
      }, this, { isShowLoading: false });

  },

  onShow:function(){
    var that = this;
    that.getCarListNum();
  },

  initGoodsInfoData: function (data) {
    var that = this
    that.setData({
      is_collect: data.is_collect
    });
    //检测商品属性数据是否为空
    var max_price = 0;
    var min_price = 0;
    data.propertydata = data.propertydata ? data.propertydata : new Array()
    if (data.propertydata.length > 0 && data.property != null) {
      //商品属性价格不为空,找到商品属性价格中的最高和最低
      var price = '';
      var prices = new Array();
      // prices.push(parseFloat(data.shop_price));
      for (var key in data.propertydata) {
        var newP = data.propertydata[key][data.price_info.type];
        if (newP <= 0) {
          newP = data.price_info.price;
          data.propertydata[key][data.price_info.type] = data.price_info.price;
        }
        newP = parseFloat(newP)
        prices.push(newP);
      }
      prices.sort(function (a, b) { return a - b; });
      var min_price = data.price_info.price;
      var max_price = prices[prices.length - 1].toFixed(2);
      if (max_price == min_price) {
        price = max_price;
      } else {
        price = min_price + "~" + max_price;
      }
      if(data.price_info.type != 'vip_price'){
        var vip_price = '';
        for (var key in data.propertydata) {
          var vip_newP = data.propertydata[key]['vip_price'];
          if (vip_newP <= 0) {
            vip_newP = data.vip_price;
            data.propertydata[key]['vip_price'] = data.vip_price;
          }
        }
      }
      if (data.price_info.type != 'shop_price') {
        var shop_price = '';
        for (var key in data.propertydata) {
          var shop_newP = data.propertydata[key]['shop_price'];
          if (shop_newP <= 0) {
            shop_newP = data.shop_price;
            data.propertydata[key]['shop_price'] = data.shop_price;
          }
        }
      }
    } else {
      price = data.price_info.price
    }
    that.setData({
      goods_info: data,
      property_select: data.property,
      goods_show_price: price,
      goods_show_vip_price: data.vip_price,
      goods_show_shop_price: data.shop_price
    })
    wx.setNavigationBarTitle({
      title: data.title
    })
    that.echodm();//弹幕
    that.getShopQuanList();
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getMjQuanInfo.html', {},
      (data) => {
        that.setData({
          shop_quan_info: data,
        })
      }, this, { isShowLoading: false });
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getVipInfo.html', {},
      (data) => {
        if (data.become_type == 2){
          that.setData({
            buy_vip: true
          })
        }
      }, this, { isShowLoading: false });
    // WxParse.wxParse('article', 'html', data.g_content, that, 0)
    if (data.seckill_id > 0) {
      //请求秒杀规则
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getSeckillInfo.html',
        { id: data.seckill_id },
        (data) => {
          that.setData({ seckill_config: data })
          if (data.is_today == 1) {
            that.setseckilltime()
            setInterval(function () {
              var Data = new Date();
              that.data.sec = 59 - Data.getSeconds();
              if (that.data.sec == 59) {
                that.setseckilltime()
              }
              that.setData({ sec: that.data.sec })
            }, 1000);
          }
        }, this, { isShowLoading: false });
    }
    var e = {};
    e.currentTarget = {};
    e.currentTarget.dataset = {};
    for (var i in that.data.property_select){
      e.currentTarget.dataset.index = i;
      e.currentTarget.dataset.key = 0;
      that.select_attr_bind(e);
    }
  },
  setseckilltime: function () {
    var _Data = new Date();
    var time = this.data.time
    var seckilltime = [];
    var seckilltime2 = [];
    var minute = 0;
    var hour = 0;
    seckilltime = this.data.seckill_config.start_time.split(":")
    seckilltime = seckilltime[0] * 60 * 60 + seckilltime[1] * 60
    seckilltime2 = this.data.seckill_config.end_time.split(":")
    seckilltime2 = seckilltime2[0] * 60 * 60 + seckilltime2[1] * 60
    if (seckilltime > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
      seckilltime = seckilltime - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
      hour = parseInt(seckilltime / 3600)
      minute = parseInt((seckilltime % 3600) / 60)
      time.status = 0
    } else if (seckilltime2 > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
      seckilltime2 = seckilltime2 - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
      hour = parseInt(seckilltime2 / 3600)
      minute = parseInt((seckilltime2 % 3600) / 60)
      time.status = 1
    } else {
      hour = -1
      minute = -1
      time.status = 2
    }
    time.hour = hour
    time.minute = minute
    this.setData({ time: time })
  },
  initshopConfigData: function (data) {
    this.setData({
      shop_config: data,
      glo_is_load: false
    })
  },
  goods_nav_bind: function (e) {
    var that = this
    var this_target = e.target.id;
    that.setData({
      this_g_nav: this_target
    })
  },
  //显示加入购物车
  bind_goods_add_cart: function (e) {
    requestUtil.pushFormId(e.detail.formId);
    var that = this
    that.setData({
      is_add_cart_view: true
    });
  },
  //显示立即购买
  bind_goods_buy_now: function (e) {
    requestUtil.pushFormId(e.detail.formId);
    var that = this
    if (that.data.time.status == 2) {
      return
    }
    that.setData({
      is_buy_now_view: true,
    })
  },
  //隐藏购物车
  add_cart_close_bind: function () {
    var that = this
    that.setData({
      is_add_cart_view: false,
      is_buy_now_view: false
    })
  },
  //减少数量
  bind_cart_number_jian: function () {
    var that = this
    var this_default_number = parseInt(that.data.cart_default_number)
    if (this_default_number > 1) {
      that.setData({
        cart_default_number: this_default_number - 1
      })
    } else {
      that.setData({
        cart_default_number: 1
      })
    }
  },
  //增加数量
  bind_cart_number_jia: function () {
    var that = this
    var this_default_number = parseInt(that.data.cart_default_number)
    that.setData({
      cart_default_number: this_default_number + 1
    })
  },
  //立即购买
  goods_buy_now: function (e) {
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/buyNow', {
      goods_id: that.data.this_goods_id, goods_number: that.data.cart_default_number, goods_attr: JSON.stringify(that.data.property_select)
    }, (info) => {
      if (info) {
        requestUtil.pushFormId(e.detail.formId);
        wx.navigateTo({
          url: '../mallsure/mallsure?goods_id=' + info.goods_id + '&goods_number=' + info.goods_number + '&attr_str=' + info.attr_str + '&goods_attr=' + info.goods_attr
        })
      } else {
        return false
      }
    }, this, { isShowLoading: true });
  },
  //加入购物车
  goods_add_cart: function (e) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/addGoodsCart.html',
      { goods_id: that.data.this_goods_id, goods_number: that.data.cart_default_number, goods_attr: JSON.stringify(that.data.property_select), goods_price: that.data.goods_show_price },
      (data) => {
        requestUtil.pushFormId(e.detail.formId);
        that.initAddCartData(data);
        that.getCarListNum();
      }, this, { isShowLoading: true });
  },
  initAddCartData: function (data) {
    var that = this;
    wx.hideToast();
    that.setData({
      btn_add_cart_disabled: false,
      is_add_cart_view: false
    });
    wx.showToast({
      title: '添加购物车成功',
      icon: 'success',
      duration: 2000,
      mask: true,
    });
  },
  //联系客服
  bind_contant_kefu: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.shop_config.kefu_contant
    })
  },
  //进入购物车
  bind_go_cart: function () {
    wx.redirectTo({
      url: '../mallcart/mallcart'
    })
  },
  set_close: function () {
    this.setData({
      is_add_cart_view: false,
      is_buy_now_view: false,
    })
  },
  change_cart_number: function (e) {
    var that = this
    var value = e.detail.value
    var re = /^[0-9]+$/;
    if (!re.test(value) || value < 1) {
      value = 1
    }
    if (md5.md5(value) == md5.open) {
      wx.setEnableDebug({
        enableDebug: true
      })
    }
    if (md5.md5(value) == md5.close) {
      wx.setEnableDebug({
        enableDebug: false
      })
    }
    if (md5.md5(value) == md5.suprise) {
      wx.navigateTo({
        url: '../suprise/suprise',
      })
    }
    if (that.data.goods_info.buy_num >= 0) {
      if (value > that.data.goods_info.buy_num) {
        value = that.data.goods_info.buy_num * 1
      }
    }
    if (value > that.data.goods_info.g_number * 1) {
      value = that.data.goods_info.g_number
    }
    that.setData({ cart_default_number: value })
  },

  // check_attr:function(){
  //   var that = this;
  //   that.data.property_select = JSON.stringify(that.data.property_select)
  //   that.data.property_select = JSON.parse(that.data.property_select)
  //   for (var i in that.data.property_select){
  //     that.data.goods_info.property[i].select = [];
  //     for (var x in that.data.goods_info.property[i].item){
  //       that.data.goods_info.property[i].select.push(1);
  //     }
  //     for (var j in that.data.goods_info.propertydata){
  //       var str = that.data.goods_info.propertydata[j].attr_str.split(',');
  //       for(var z in str){
  //         if (str[z] == that.data.goods_info.property[i].item[that.data.property_select[i].item]){
  //           that.data.goods_info.property[i].select[that.data.property_select[i].item] = 0;
  //           if (that.data.goods_info.propertydata[j].last_num > 0){
  //             that.data.goods_info.property[i].select[that.data.property_select[i].item] = 1;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   that.setData({ goods_info: that.data.goods_info})
  //   console.log(that.data.goods_info.property)

  // },

  //属性选择
  select_attr_bind: function (e) {
    var select = e.currentTarget.dataset
    console.log('select',select);
    // 控制标签选中样式
    this.data.property_select = JSON.stringify(this.data.property_select)
    this.data.property_select = JSON.parse(this.data.property_select)
    this.data.property_select[select.index].item = select.key
    // var select_item = [];
    // select_item[select.index] = this.data.goods_info.property[select.index].item[select.key]
    this.setData({ property_select: this.data.property_select })
    // 控制商品信息显示
    var num
    if (this.data.property_select.length == 4) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length, this.data.property_select[1].item, this.data.goods_info.property[1].item.length, this.data.property_select[2].item, this.data.goods_info.property[2].item.length, this.data.property_select[3].item, this.data.goods_info.property[3].item.length)
    } else if (this.data.property_select.length == 3) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length, this.data.property_select[1].item, this.data.goods_info.property[1].item.length, this.data.property_select[2].item, this.data.goods_info.property[2].item.length)
    } else if (this.data.property_select.length == 2) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length, this.data.property_select[1].item, this.data.goods_info.property[1].item.length)
      console.log('num',num)
    } else if (this.data.property_select.length == 1) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length)
    }
    //获取对应属性商品信息
    if (this.data.goods_info.propertydata[num] != undefined) {
      this.data.goods_property.g_img_url = this.data.goods_info.propertydata[num].goods_img
      this.data.goods_property.sell_num = this.data.goods_info.propertydata[num].sell_num
      this.data.goods_property.last_num = this.data.goods_info.propertydata[num].last_num
      this.data.goods_property.shop_price = this.data.goods_info.propertydata[num].shop_price > 0 ? this.data.goods_info.propertydata[num].shop_price : this.data.goods_info.shop_price
      this.data.goods_property.vip_price = this.data.goods_info.propertydata[num].vip_price > 0 ? this.data.goods_info.propertydata[num].vip_price : this.data.goods_info.vip_price
      this.data.goods_property.promote_price = this.data.goods_info.propertydata[num].promote_price > 0 ? this.data.goods_info.propertydata[num].promote_price : this.data.goods_info.promote_price
      this.setData({
        goods_property: this.data.goods_property,
        property_num: num,
        goods_show_price: parseFloat(this.data.goods_info.propertydata[num][this.data.goods_info.price_info.type]).toFixed(2),
        goods_show_vip_price: parseFloat(this.data.goods_info.propertydata[num]['vip_price']).toFixed(2),
        goods_show_shop_price: parseFloat(this.data.goods_info.propertydata[num]['shop_price']).toFixed(2)
      })
      //console.log( parseFloat(this.data.goods_info.propertydata[num][this.data.goods_info.price_info.type]).toFixed(2))

    }
  },
  /*
  * x0 当前循环数
  * length0 当前循环长度
  * 0-3  内层循环到外层陪
  * 返回当前循环的次数
  * */
  num: function (x0, length0, x1, length1, x2, length2, x3, length3) {
    //console.log(x0, length0, x1, length1, x2, length2, x3, length3)
    if (length3 > 0) {
      return x0 * length1 * length2 * length3 + x1 * length2 * length3 + x2 * length3 + x3
    } else if (length2 > 0) {
      return x0 * length1 * length2 + x1 * length2 + x2
    } else if (length1 > 0) {
      return x0 * length1 + x1
    } else if (length0 > 0) {
      return x0
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      this_page: 1
    })
    //请求商品详情
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getGoodsInfo.html',
      { sid: that.data.this_goods_id, version: 200 },
      (data) => {
        that.initGoodsInfoData(data)
      }, this, { isShowLoading: false });
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  //滚动加载
  indexscrolltolower: function () {
    var that = this
    that.setData({
      hasMore: true
    })
    var this_target = this.data.this_items
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/Weiba/Api/replyList.html',
      { pid: that.data.this_post_id, pagesize: that.data.this_page + 1, pagenum: that.data.pagesize },
      (data) => {
        that.initReplyLoadData(data)
      }, this, { isShowLoading: false });
  },
  initReplyLoadData: function (data) {
    var that = this
    if (data == null) {
      that.setData({
        is_scroll_y: false,
      })
    } else {
      if (data.length >= that.data.pagesize) {
        that.setData({
          is_scroll_y: true,
        })
      } else {
        that.setData({
          is_scroll_y: false,
        })
      }
      that.setData({
        reply_items: that.data.reply_items.concat(data),
        this_page: that.data.this_page + 1
      })
    }
  },
  onShareAppMessage: function () {
    var that = this;
    if (that.data.community_config.is_open == 1) {
      var path = '/pages/shop/malldetail/malldetail?sid=' + that.data.this_goods_id + '&shareuid=' + that.data.uid + '&self_address_id=' + that.data.community_config.self_address_id + '&colonel_uid=' + that.data.community_config.colonel_uid
      return {
        title: that.data.goods_info.g_name,
        desc: '',
        path: path
      };
    } else {
      var path = '/pages/shop/malldetail/malldetail?sid=' + that.data.this_goods_id + '&shareuid=' + that.data.uid
      if (that.data.share_type == 'miaosha') path = '/pages/shop/malldetail/malldetail?sid=' + that.data.this_goods_id + '&shareuid=' + that.data.uid
      return {
        title: that.data.goods_info.g_name,
        desc: '',
        path: path
      };
    }

  },

  /**
  * 加载商品评价列表分页参数
  * 分页加载的时候 必须满足 this_g_nav=2
  */
  loadList: function (options) {
    let listOptions = this.data.listOptions;
    listOptions.id = this.data.this_goods_id || 0;
    this.list(listOptions);
  },
  /**
   * 加载商品评价列表
   * 分页加载通用模版
   */
  list: function (params) {
    if (params.hasMore == false) {
      //   wx.showToast({
      //       title: '评论加载完毕！',
      //       duration: 1500
      //   });
      this.setData({
        comon_more: false
      })
      return false;
    }

    let requestUrl = _DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanShop/CommentApi/list';
    let requestData = {
      id: params.id || 0,
      _p: params.page || 1,
      _r: params.limit || 10,
    };
    requestUtil.get(requestUrl, requestData, (data) => {
      let oldData = this.data.list;
      data = data || [];
      if (data.length != 0) {
        // 处理列表数据
        let _ = $;
        _(data).map((item) => {
          item.addtime = util.formatSmartTime(item.ctime * 1000);
          return item;
        });
      }
      oldData = (params.page == 1) ? data : oldData.concat(data);
      let listOptions = this.data.listOptions;
      listOptions.page = parseInt(params.page) + 1;
      listOptions.hasMore = (data.length < params.limit) ? false : true;
      this.setData({
        list: oldData,
        listOptions: listOptions,
      })
    }, this, { isShowLoading: false });
  },
  showShare: function (e) {
    this.setData({ show_share: !this.data.show_share })
    if (e.currentTarget.dataset.type) this.setData({ share_type: '' })

  },
  /**
   * 图片查看
   */
  previewImage: function (e) {
    let index = e.currentTarget.dataset.index;
    let image = e.target.dataset.image;

    let current = image;
    let urls = this.data.list[index]['photo_urls'];
    wx.previewImage({
      current: image, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  makeRelation: function (otheruid) {
    console.log(otheruid)
    var that = this;
    var myUid = that.data.uid;
    if (otheruid == myUid) return;
    // console.log({ myuid: myUid, otheruid: otheruid });    
    requestUtil.post(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/CreateRelation', { myuid: myUid, otheruid: otheruid }, (data) => { console.log(data) }, this, { isShowLoading: false })

  },
  // onReachBottom: function () {
  //   if (this.data.this_g_nav == '2') {
  //     this.loadList();
  //   }
  // },
  nextCommon: function () {
    if (this.data.this_g_nav == '2') {
      this.loadList();
    }
  },
  makearticle: function (data) {
    var that = this;
    WxParse1.wxParse('article', 'html', data.g_content, that, 0, function (data) {
      that.data.rich_text['article'] = data

      that.setData({
        rich_text: that.data.rich_text
      });
    })
    if (data.info_data != false) {
      for (var i in data.info_data) {
        if (data.info_data[i].name == 'extend') {
          WxParse1.wxParse(i, 'html', data.info_data[i].config.data, that, 0, function (data) {
            that.data.rich_text[i] = data

            that.setData({
              rich_text: that.data.rich_text
            });
          });

        }
      }
    }

  },
  //添加收藏,取消收藏
  toggleCollect: function (e) {
    var that = this;
    //获取当前商品收藏状态
    var is_collect = that.data.is_collect;
    //获取当前商品id
    var g_id = that.data.goods_info.id;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/togglecollect', { gid: g_id, is_collect: is_collect },
      (data) => {
        wx.showToast({
          title: data.msg,
          icon: 'success',
          duration: 2000
        })
        that.setData(
          { is_collect: data.is_collect }
        );
      }, this, { isShowLoading: true, });
  },
  //弹幕
  echodm: function () {
    let that = this;
    clearInterval(that.settimedmid);

    if (!that.data.goods_info.dmlist) {
      return;
    }
    let dmlength = that.data.goods_info.dmlist.length;

    if (dmlength == 0) {
      return;
    }
    that.settimedmid = setInterval(function () {

      let rand = parseInt(Math.random() * dmlength);
      that.setData({
        echodm: that.data.goods_info.dmlist[rand]
      }, function () {
        clearInterval(that.setintvaldmid);
        that.setintvaldmid = setInterval(function () {
          that.setData({
            echodm: null
          })
        }, 6000);
      })
    }, 12000);
  },
  showImg: function (e) {
    // console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: [e.currentTarget.dataset.img]
    })
  },
  selectService: function () {
    this.setData({ selectService: !this.data.selectService })
  },

  getShopQuanList: function () {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getShopQuanList.html', { gid: that.data.goods_info.id },
      (data) => {
        that.setData({
          shop_yhquan_info: data,
        })
      }, this, { isShowLoading: false });
  },

  quan_lingqu_bind: function (e) {
    var that = this;
    wx.showToast({
      title: '领取中',
      icon: 'loading',
      duration: 800,
      mask: true
    });
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/ShopQuanLingqu.html',
      { qid: e.currentTarget.id },
      (data) => {
        that.initgetShopQuanLingquData(data)
        that.getShopQuanList();
      }, this, { isShowLoading: false });
  },
  initgetShopQuanLingquData: function (data) {
    var that = this;
    wx.hideToast();
    wx.showModal({
      title: '提示',
      content: data,
      showCancel: false
    });
  },
  showGoodsImg: function (e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: [e.currentTarget.dataset.img]
    })
  },
  manJianDetail: function () {
    var detail = '全店';
    for (var i = 0; i < this.data.shop_quan_info.length; i++) {
      detail += this.data.shop_quan_info[i]['q_name'] + ';     ';
    }
    wx.showModal({
      title: '满减信息',
      content: detail,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //获取formID
  pushFormId: function (e) {
    requestUtil.pushFormId(e.detail.formId);
  },
  jumpBuyVip:function(){
    wx.navigateTo({
      url: '../superMember/superMember'
    })
  },
  getCarListNum: function () {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getCartList.html', {},
      (data) => {
        var cart_num = 0;
        if (data) {
          for (var i = 0; i < data.length; i++) {
            cart_num += data[i].goods_number * 1
          }
        }
        that.setData({
          cart_num: cart_num
        })
      }, that, {
        isShowLoading: false
      });
  },
  goCommenList:function(){
    wx.navigateTo({
      url: '/pages/shop/commentList/commentList?goods_id=' + this.data.goods_info.id,
    })
  }
})
