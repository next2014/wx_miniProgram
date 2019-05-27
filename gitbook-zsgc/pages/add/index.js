// pages/add/index.js
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
  },
  addMan: function (event) {
    console.log("event", event)
    var title = event.detail.value.title;
    var age = event.detail.value.age;
    var summary = event.detail.value.summary;
    if (!title) {
      // showTip("标题不能为空", "loading");
      //弹出错误
    } else {
      //写入数据库
      var _this = this;
      wx.request({
        url: 'http://gitbook.test.wangmingchang.com/api/zengshangaicha/add',
        header: {
          'content-type': 'application/json'// 默认值
        },
        method:"post",
        data:{
          title,age,summary
        },
        success(res) {
          if(res.data.result=1){
            wx.showToast({
              title: '添加成功',
              icon: 'loading',
              duration: 1000,
              mask: true
            })
            wx.navigateTo({
              url: '/pages/list/index',
            })
          }else{
            wx.showToast({
              title: '添加失败',
              icon: 'loading',
              duration: 1000,
              mask: true
            })
          }
        }
      })
    }
  },
})