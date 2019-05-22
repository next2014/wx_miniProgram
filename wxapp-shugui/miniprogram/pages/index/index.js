const db = wx.cloud.database()
const book = db.collection('mybook')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    db.collection('mybook').get({
       success: res => {
          this.setData({
            book_list:res.data
          })
       }
     })
  }


})