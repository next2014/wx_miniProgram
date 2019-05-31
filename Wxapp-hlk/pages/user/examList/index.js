// pages/user/examList/index.js
const app = getApp();
const requestUtil = require('../../../utils/requestUtil');
const _DgData = require('../../../utils/data');
Page({

  data: {
    pages: 1,
    num: 20,
    list:[],
    showMore:true
  },

  onLoad: function (options) {
    
    this.loadData()
  },
  loadData: function () {
    var that = this;
    if (!that.data.showMore) return
    requestUtil.get(_DgData.duoguan_host_api_url + '/index.php?s=/addon/Examuser/ExamApi/examList.html', { _page: that.data.pages, num: that.data.num }, (data) => {
      if (data == null) return
      if (data.length < 20) {
        that.setData({ showMore: false })
      }
      data = that.data.list.concat(data)
      that.setData({ list: data })
      
      
    }, this);
  },
  showMore: function (e) {
    let index = e.currentTarget.dataset.index, that = this
    wx.createSelectorQuery().select('#a' + index).fields({ size: true }).exec(
      function (e) {
        if (that.data.list[index].height < e[0].height || that.data.list[index].height == undefined) {
          that.data.list[index].height = e[0].height
        } else {
          that.data.list[index].height = 80
        }
        that.setData(that.data)
      })
  },
  onReachBottom: function () {
    this.data.pages++
    this.loadData()
  }
})