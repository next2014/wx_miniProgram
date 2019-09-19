// pages/edit/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var _this =  this;
    wx.request({
      url: 'http://gitbook.test.wangmingchang.com/api/zengshangaicha/edit?id='+id,
      header: {
        'content-type': 'application/json'// 默认值
      },
      success(res) {
        console.log(res.data.msg)
        _this.setData({
          res: res.data.msg
        })
      }
    })
  },
  editMan: function (event) {
    console.log("event", event)
    var id = event.detail.value.id;
    var title = event.detail.value.title;
    var age = event.detail.value.age;
    var summary = event.detail.value.summary;
    if (!title) {
      // showTip("标题不能为空", "loading");
      //弹出错误
    } else {
      //写入数据库
      var _this = this;
      //发起请求
      wx.request({
        url: 'http://gitbook.test.wangmingchang.com/api/zengshangaicha/edit',
        header: {
          'content-type': 'application/json'// 默认值
        },
        method: "post",
        data: {
          title, age, summary,id
        },
        success(res) {
          if (res.data.result = 1) {
            wx.showToast({
              title: '修改成功',
              icon: 'loading',
              duration: 1000,
              mask: true
            })
          } else {
            wx.showToast({
              title: '添加失败',
              icon: 'loading',
              duration: 1000,
              mask: true
            })
          }
          wx.navigateTo({
            url: '/pages/list/index',
          })
        }
      })
    }
  },
})