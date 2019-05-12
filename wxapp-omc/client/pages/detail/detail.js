// pages/detail/detail.js
let datas = require('../../datas/list-data');
let appData = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},
    isCollected: false,
    index: 0
  },
  // 点击处理收藏文章的方法
  handleCollection(){
    let isCollected = !this.data.isCollected;

    // 存储之前先获取之前的数据
    let obj = wx.getStorageSync('isCollected');
    obj[this.data.index] = isCollected;
    
    // 提示用户收藏的状态
    let title = isCollected?'收藏成功': '取消收藏';
    wx.showToast({
      title,
      icon: 'success'
    });
    wx.setStorage({
      key: 'isCollected',
      data: obj
    });
    this.setData({isCollected});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 获取传递过来的数据，更新当前的data
    this.setData({detailObj:datas.list_data[options.id], index: options.id});
    // 获取本地存储数据
    let storageObj = wx.getStorageSync('isCollected');
    console.log(storageObj);
    // 判断是否存储过数据
    if(!storageObj){
      storageObj = {};
      wx.setStorage({
        key: 'isCollected',
        data: storageObj
      });
    }else {
      // 根据是否收藏当前页面文章的的标识动态生成isCollected
      let isCollected = storageObj[options.id]?true: false;
      // 更新isCollected的值。
      this.setData({isCollected});
    }
  },
  // 点击分享按钮
  handleShare(){
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享到qq空间', '分享到微信好友'],
      itemColor: '#666'
    })
  }

})