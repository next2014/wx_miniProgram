const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
Page({
  data: {
    cate_one_data: [],
    this_cate_id: 0,
    classifyViewed: 0,
    glo_is_load: true,
    this_page_size: 1,
    this_page_num: 10,
    goods_data: null,
    is_select_jiage: '',
    select_type: '',
    select_jiage_type: '',
    show_cate: false,
    this_keywords: '',
    is_loadmore: false,
    is_show_card: false,
    cart_num: 0,
    id: -1
  },
  swiper_top_bind: function(e) {
    var that = this;
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  goods_search_bind: function(e) {
    var s_key = e.detail.value;
    wx.navigateTo({
      url: '../malllist/malllist?keywords=' + s_key
    });
  },
  mall_list_bind: function(e) {
    wx.navigateTo({
      url: '../malllist/malllist?cid=' + e.currentTarget.id
    })
  },
  onLoad: function(options) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCateList', {}, (info) => {
      that.setData({
        cate_one_data: info,
        glo_is_load: false
      })
      var e = {};
      e.currentTarget = {};
      e.currentTarget.dataset = {};
      e.currentTarget.dataset.sid = info[that.data.classifyViewed].id;
      that.select_classify(e)
    });
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunityConfig.html', {}, (info) => {
      that.setData({ community_config: info })
    }, that, { isShowLoading: false });
  },
  onShow: function(){
    var that = this;
    that.getCarListNum();
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunityConfig.html', {}, (info) => {
      that.setData({ community_config: info })
      if (info.is_open == 1) {
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCateList', {}, (info) => {
          that.setData({
            cate_one_data: info,
            glo_is_load: false
          })
          var e = {};
          e.currentTarget = {};
          e.currentTarget.dataset = {};
          e.currentTarget.dataset.sid = info[that.data.classifyViewed].id;
          that.select_classify(e)
        });
      }
    }, that, { isShowLoading: false });
  },
  getCarListNum:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getCartList.html', {},
      (data) => {
        var cart_num = 0;
        if(data){
          for (var i = 0; i < data.length; i++) {
            cart_num += data[i].goods_number * 1
          }
        }
        that.setData({ cart_num: cart_num })
      }, that, { isShowLoading: false });
  },
  cate_item_bind: function(e) {
    var that = this;
    var cate_id = e.currentTarget.id;
    var seid = e.target.dataset.index;
    that.setData({
      this_cate_id: cate_id,
      classifyViewed: seid,
      goods_data: null,
      this_page_size: 1,
      is_loadmore: false,
      show_cate: false,
      this_keywords: '',
      id:-1
    });
    var e = {};
    e.currentTarget = {};
    e.currentTarget.dataset = {};
    e.currentTarget.dataset.sid = that.data.cate_one_data[that.data.classifyViewed].id;
    that.select_classify(e)
  },
  select_classify: function(e) {
    var that = this;
    var second_id = e.currentTarget.dataset.sid
    if (e.currentTarget.id){
      var index = e.currentTarget.id.slice(5);
      that.setData({
        id: index
      })
    }
    
    that.setData({
      second_id: second_id,
      show_cate: false
    })
    that.data.goods_data = null
    that.data.this_page_size = 1
    that.data.is_loadmore = false
    var requestData = {};
    requestData.cid = second_id;
    requestData.pagesize = 1;
    requestData.pagenum = that.data.this_page_num;
    requestData.stype = that.data.select_type;
    requestData.stype_jiage = that.data.select_jiage_type;
    requestData.keywords = that.data.this_keywords;
    if (that.data.goods_data == null) {
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', {
        searchData: requestData
      }, (info) => {
        if (info == null) {
          that.setData({
            is_loadmore: false
          });
        } else {
          if (info.length < 10) {
            that.setData({
              is_loadmore: false
            });
          } else { that.setData({ is_loadmore: true });}
        }
        that.setData({
          goods_data: info,
          glo_is_load: false
        });

      }, this, {
        isShowLoading: false
      });
    }

  },
  select_goods_list: function(e) {
    var that = this;
    var s_type = e.currentTarget.dataset.stype;
    that.setData({
      select_jiage_type: ''
    });
    if (s_type == 'jiage') {
      if (that.data.is_select_jiage == 'jiang') {
        that.setData({
          select_jiage_type: 'jiage_sheng',
          is_select_jiage: 'sheng'
        });
      } else {
        that.setData({
          select_jiage_type: 'jiage_jiang',
          is_select_jiage: 'jiang'
        });
      }
    }else{
      that.setData({
        select_jiage_type: '',
        is_select_jiage: ''
      });
    }
    that.setData({
      select_type: s_type,
      this_page_size: 1,
      is_loadmore: false
    });
    that.onShow();
    var requestData = {};
    requestData.cid = that.data.second_id;
    requestData.pagesize = 1;
    requestData.pagenum = that.data.this_page_num;
    requestData.keywords = that.data.this_keywords;
    requestData.stype = that.data.select_type;
    requestData.stype_jiage = that.data.select_jiage_type;
    if (that.data.goods_data != null) {
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', {
        searchData: requestData
      }, (info) => {
        if (info == null) {
          that.setData({
            is_loadmore: false
          });
        } else {
          if (info.length < 10) {
            that.setData({
              is_loadmore: false
            });
          } else { that.setData({ is_loadmore: true }); }
        }
        that.setData({
          goods_data: info,
          glo_is_load: false
        });

      }, this, {
        isShowLoading: false
      });
    }

  },
  onReachBottom: function(e) {
    var that = this;
    wx.showNavigationBarLoading();
    if (that.data.is_loadmore == false) {
      wx.hideNavigationBarLoading();
      return false;
    }
    var searchData = {};
    searchData.cid = that.data.second_id;
    searchData.keywords = that.data.this_keywords;
    searchData.stype = that.data.select_type;
    searchData.stype_jiage = that.data.select_jiage_type;
    searchData.pagesize = that.data.this_page_size + 1;
    searchData.pagenum = that.data.this_page_num;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', {
      searchData: searchData
    }, (info) => {
      wx.hideNavigationBarLoading();
      if (info == null) {
        that.setData({
          is_loadmore: false
        });
      } else {
        if (info.length < 10) {
          that.setData({
            is_loadmore: false
          });
        } else { that.setData({ is_loadmore: true }); }
        that.setData({
          goods_data: that.data.goods_data.concat(info),
          this_page_size: searchData.pagesize,
          glo_is_load: false
        });
      }

    }, this, {
      isShowLoading: true
    });
  },
  show_cate:function(){
    this.setData({ show_cate: !this.data.show_cate})
  },
  goods_search_bind:function(e){
    var that = this;
    this.setData({ 
      this_keywords: e.detail.value,
      this_page_size: 1,
      select_type: '',
      select_jiage_type: '',
      })
    var e = {};
    e.currentTarget = {};
    e.currentTarget.dataset = {};
    e.currentTarget.dataset.sid = 0;
    that.select_classify(e)
  },
  bind_go_cart: function () {
    wx.navigateTo({
      url: '../mallcart/mallcart'
    })
  },
  addCart:function(e){
    this.getCarListNum();
  },
  //获取formID
  pushFormId: function (e) {
    requestUtil.pushFormId(e.detail.formId);
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.shareInfo.title,
      desc: that.data.shareInfo.desc,
      path: 'pages/shop/mallcate/mallcate',
      success: () => {
        requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php/addon/MarketingLuckDraw/ApiShare/shareSetData", {}, (info) => { });
      }
    }
  },
  
})