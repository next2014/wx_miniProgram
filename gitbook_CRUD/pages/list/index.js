// pages/list/index.js
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
    var _this = this;
    //进行请求,获取列表
    wx.request({
      url:  'http://gitbook.test.wangmingchang.com/api/zengshangaicha/list',
      header: {
        'content-type': 'application/json'// 默认值
      },
      success(res) {
        console.log(res.data.msg)
        _this.setData({
          list:res.data.msg
        })
      }
    })

  },
  //删除
  deleteDiary: function (event) {
    var _this = this;
    var objectId = event.target.dataset.id;
    console.log(event)
    wx.showModal({
      title: '操作提示',
      content: '确定要删除？',
      success: function (res) {
        if (res.confirm) {
          //进行请求
          wx.request({
            url: 'http://gitbook.test.wangmingchang.com/api/zengshangaicha/del?id=' + objectId,
            header: {
              'content-type': 'application/json'// 默认值
            },
            success(res) {
              if (res.data.result = 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'loading',
                  duration: 1000,
                  mask: true
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'loading',
                  duration: 1000,
                  mask: true
                })
              }
              //刷新数据
              _this.onLoad()
              

            }
          })
        }
      }
    })
  },
  // 修改
  editDiary: function (event) {
    //获取ID
    var nowId = event.target.dataset.id;
    //跳转到编辑页面
    wx.navigateTo({
      url: '/pages/edit/index?id=' + nowId,
    })
  },

  
})