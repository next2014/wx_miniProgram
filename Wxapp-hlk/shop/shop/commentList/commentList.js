// pages/shop/order/commentList/index.js
const requestUtil = require('../../../utils/requestUtil');
const $ = require('../../../utils/underscore');
const _DuoguanData = require('../../../utils/data');
const util = require('../../../utils/util');
const md5 = require('../../shop/common/utils/md5');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 商品评论列表
    listOptions: { // 商品评论列表分页参数
      page: 1,
      limit: 2,
      hasMore: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.loadList(options);
  },

  loadList: function (options) {
    let listOptions = this.data.listOptions;
    listOptions.id = options.goods_id || 0;
    this.list(listOptions);
  },

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