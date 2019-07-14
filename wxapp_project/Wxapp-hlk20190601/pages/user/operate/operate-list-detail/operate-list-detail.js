// pages/user/operate/operate-list-detail/operate-list-detail.js
const app = getApp();
import requestUtil from '../../../../utils/requestUtil';
import _DuoguanData from '../../../../utils/data';
import WxParse from '../../../../wxParse/wxParse.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({id:id})
    this.getList();
  },

  //请求获取文章详情
  getList: function (isShowLoading) {
    var that = this;
    isShowLoading = isShowLoading || false;
    var id = that.data.id;

    var requestData = {};
    requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/Operatinguser/OperatinguserApi/getOperateDetail.html", {id:id}, (data) => {
      that.setData({info: data});
      WxParse.wxParse('content', 'html', data.desc, that);//富文本

    }, this, { completeAfter: wx.stopPullDownRefresh, isShowLoading: isShowLoading });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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