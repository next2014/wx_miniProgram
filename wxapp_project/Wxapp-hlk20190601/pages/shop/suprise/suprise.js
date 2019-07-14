Page({
  onLoad: function (options) {
    let root = this.__route__.split("/")[1]
    let url = this.__route__.replace(/pages\//, "/" + root + "/"), mark = '?'
    for (let key in options) {
      if (url.indexOf('?') > -1) mark = '&'
      url = url + mark + key + '=' + options[key]
    }
    wx.redirectTo({
      url: url
    })
  }
})