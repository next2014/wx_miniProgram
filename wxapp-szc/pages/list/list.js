// pages/list/list.js
// let datas = require('../../datas/list-data');
// console.log(typeof datas, datas);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // datas: [],
    // grids: [0, 1, 2, 3, 4, 5, 6, 7]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  toDetail(event) {
    console.log(event);
    wx.navigateTo({
      url: '/pages/details/index'
    })
  },
  proDetail(event) {
    console.log(event);
    wx.navigateTo({
      url: '/pages/pro-details/index'
    })
  }

})