const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
Page({
  data: {
    goods_data: null,
    this_cate_id: 0,
    this_pinpai_id: 0,
    this_keywords: '',
    this_page_size: 1,
    this_page_num: 10,
    glo_is_load: true,
    list_type: true,
    select_type: '',
    select_jiage_type: '',
    is_select_jiage: false,
    is_loadmore: true,
    scrollTop: 0,
    floorstatus: false,
    son_cate:[],
    select_cate:0
  },
  //获取formID
  pushFormId: function (e) {
    requestUtil.pushFormId(e.detail.formId);
  },
  //切换分类
  change_cate:function(e){
    this.setData({ select_cate:e.target.dataset.val})
    this.data.goods_data = null
    this.data.this_page_size = 1
    this.data.is_loadmore = true
    this.load_data()
  },
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({options: options})
    var this_cate_id = options.cid ? options.cid : 0;
    var this_pinpai_id = options.pid ? options.pid : 0;
    var this_keywords = options.keywords == undefined ? '' : options.keywords;
    that.setData({ this_cate_id: this_cate_id, this_pinpai_id: this_pinpai_id, this_keywords: this_keywords, select_cate:this_cate_id });
    if (this_cate_id > 0){
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCateSonList', { pid: this_cate_id }, (info) => {
        that.setData({ son_cate: info })
      });
    }
  },
  onShow: function () {
    this.load_data()
  },
  load_data:function(){
    var that = this;
    var requestData = {};
    requestData.cid = that.data.select_cate;
    requestData.ppid = that.data.this_pinpai_id;
    requestData.pagesize = 1;
    requestData.pagenum = that.data.this_page_num;
    requestData.keywords = that.data.this_keywords;
    requestData.stype = that.data.select_type;
    requestData.stype_jiage = that.data.select_jiage_type;
    if (that.data.goods_data == null) {
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', { searchData: requestData }, (info) => {
        if (info == null) {
          that.setData({ is_loadmore: false });
        } else {
          if (info.length < 10) {
            that.setData({ is_loadmore: false });
          }
        }
        that.setData({ goods_data: info, glo_is_load: false });

      }, this, { isShowLoading: false });
    }
  },
  onReachBottom: function (e) {
    var that = this;
    wx.showNavigationBarLoading();
    if (that.data.is_loadmore == false) {
      wx.hideNavigationBarLoading();
      return false;
    }
    var this_cate_id = that.data.select_cate;
    var searchData = {};
    searchData.cid = that.data.select_cate;
    searchData.ppid = that.data.this_pinpai_id;
    searchData.keywords = that.data.this_keywords;
    searchData.stype = that.data.select_type;
    searchData.stype_jiage = that.data.select_jiage_type;
    searchData.pagesize = that.data.this_page_size + 1;
    searchData.pagenum = that.data.this_page_num;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', { searchData: searchData }, (info) => {
      wx.hideNavigationBarLoading();
      if (info == null) {
        that.setData({ is_loadmore: false });
      } else {
        if (info.length < 10) {
          that.setData({ is_loadmore: false });
        }
        that.setData({ goods_data: that.data.goods_data.concat(info), this_page_size: searchData.pagesize, glo_is_load: false });
      }

    }, this, { isShowLoading: false });
  },
  select_goods_list: function (e) {
    var that = this;
    var s_type = e.currentTarget.dataset.stype;
    that.setData({ select_jiage_type: '' });
    if (s_type == 'jiage') {
      if (that.data.is_select_jiage == true) {
        that.setData({ select_jiage_type: 'jiage_sheng', is_select_jiage: false });
      } else {
        that.setData({ select_jiage_type: 'jiage_jiang', is_select_jiage: true });
      }
    }
    that.setData({ select_type: s_type, this_page_size: 1, is_loadmore: true });
    that.onShow();
    var requestData = {};
    requestData.cid = that.data.select_cate;
    requestData.ppid = that.data.this_pinpai_id;
    requestData.pagesize = 1;
    requestData.pagenum = that.data.this_page_num;
    requestData.keywords = that.data.this_keywords;
    requestData.stype = that.data.select_type;
    requestData.stype_jiage = that.data.select_jiage_type;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', { searchData: requestData }, (info) => {
      if (info == null) {
        that.setData({ is_loadmore: false });
      } else {
        if (info.length < 10) {
          that.setData({ is_loadmore: false });
        }
      }
      that.setData({ goods_data: info, glo_is_load: false });

    }, this, { isShowLoading: false });
  },
  toggle_list_type_bind: function () {
    var that = this;
    that.setData({ list_type: that.data.list_type == true ? false : true });
  },
  detail: function (e) {
    wx.navigateTo({
      url: '../malldetail/malldetail?sid=' + e.currentTarget.id
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '发现好货,邀您共享',
      path: '/shop/shop/malllist/malllist?cid=' + that.data.options.cid + '&pid=' + that.data.options.pid + '&keywords=' + that.data.options.keywords
    }
  },
})