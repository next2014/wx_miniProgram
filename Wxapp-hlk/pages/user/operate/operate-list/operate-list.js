// pages/user/operate/operate-list/operate-list.js
const app = getApp();
import requestUtil from '../../../../utils/requestUtil';
import _DuoguanData from '../../../../utils/data';
import {
  duoguan_app_is_superhome as is_super,
  duoguan_config_version as park_version
} from "../../../../utils/data";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    this_page_size: 1,
    this_page_num: 20,
    is_load_more: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();//请求文章列表
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


  //请求获取文章列表
  getList: function (isShowLoading) {
    var that = this;
    var this_data = that.data.list;
    isShowLoading = isShowLoading || false;

    var requestData = {};
    
    requestData.pagesize = that.data.this_page_size;
    requestData.pagenum = that.data.this_page_num;
    requestData.park_version = park_version;//版本号
    requestData.is_super = is_super;//是否超首页

    requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php?s=/addon/Operatinguser/OperatinguserApi/getOperateList.html", requestData, (data) => {
      if (data == null || data == '') {
        that.setData({ is_load_more: false });
      } else {
        if (that.data.this_page_size == 1 && data.length < that.data.this_page_num) {
          that.setData({ list: data, is_load_more: false });
        } else if (that.data.this_page_size == 1 && data.length == that.data.this_page_num) {
          that.setData({ list: data, is_load_more: true });
        } else if (that.data.this_page_size > 1) {
          this_data = this_data.concat(data);
          that.setData({ list: this_data, is_load_more: true });
        }
      }

    }, this, { completeAfter: wx.stopPullDownRefresh, isShowLoading: isShowLoading });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ this_page_size: 1 });
    that.getList();//请求文章列表
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.is_load_more == false) {
      wx.hideNavigationBarLoading();
      return false;
    } else {
      that.setData({ this_page_size: ++that.data.this_page_size });
      that.getList(true);//请求内容列表
    }
  },

  /**
   * 跳转详情页
   */
  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/user/operate/operate-list-detail/operate-list-detail?id='+id,
    })
  }

 
})