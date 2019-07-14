//app.js
var _DuoguanData = require('./utils/data.js');
var listener = require('./utils/listener.js');
const requestUtil = require('./utils/requestUtil');

App({
    index_route: null,

  onLaunch: function () {
        var local_utoken = wx.getStorageSync("utoken");
        wx.onAppRouteDone(res => {
            if (!this.index_route) this.index_route = res.path;
            listener.fireEventListener('onAppRouteDone',[res]);
        });
        wx.onAppUnhang(res => {
            listener.fireEventListener('onAppUnhang', [res]);
        });
    },
    setLog: function (token, utoken) {
    },

    onShow: function (options){
      if (JSON.stringify(options.query) != '{}' && options.query.scene != undefined && options.query.scene.split('!')[1] == 'fx') {
        requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
          var that = this;
          var other_openId = unescape(options.query.scene).split('!')[0];
          var openId = data.openId;
          var xpath = options.path;
          var xcid = unescape(options.query.scene).split('!')[2];
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanUser/DistributionApi/make_relation.html', { other_openid: other_openId, user_openid: openId },
            (data) => { }, this, {});
          if (_DuoguanData.duoguan_app_is_superhome == 1) {
            if (xpath == 'pages/giftCard/index/index' && xcid != undefined) {
            } else {
              wx.switchTab({ url: _DuoguanData.duoguan_app_index_path });
            }
          }
        });
      }
      if (JSON.stringify(options.query) != '{}' && options.query.sharetype != undefined && options.query.sharetype == 'fx') {
        var otheruid = 0;
        if (options.query.shareuid > otheruid) {
          otheruid = options.query.shareuid;
          if (otheruid > 0) {
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanUser/DistributionApi/CreateRelation.html', { otheruid: otheruid }, (data) => { console.log(data) }, this, { isShowLoading: false })
          }
        }
      }
        if (options.query._path) {
            const path = decodeURIComponent(options.query._path);
            wx.navigateTo({ url: path, });
        }
    },

    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            var utoken = wx.getStorageSync("utoken");
            wx.login({
                success: function (res) {
                    var code = res.code;
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo;
                            wx.request({
                                url: _DuoguanData.duoguan_auth_login_url,
                                method: "POST",
                                data: {
                                    utoken: utoken,
                                    code: code,
                                    token: _DuoguanData.duoguan_user_token,
                                    encryptedData: res.encryptedData,
                                    iv: res.iv
                                },
                                fail: function (res) {
                                    console.dir(res);
                                },
                                success: function (res) {
                                    var utoken = res.data.utoken;
                                    wx.setStorageSync("utoken", utoken);
                                    that.globalData.utoken = utoken;
                                    that.globalData.userInfo.utoken = utoken;
                                    typeof cb == "function" && cb(that.globalData.userInfo)
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    getNewToken: function (cb) {
        var that = this
        var utoken = wx.getStorageSync("utoken");
        wx.login({
            success: function (res) {
                console.log(res)
                var code = res.code;
                wx.getUserInfo({
                    success: function (res) {
                        that.globalData.userInfo = res.userInfo;
                        wx.request({
                            url: _DuoguanData.duoguan_auth_login_url,
                            method: "POST",
                            data: {
                                utoken: utoken,
                                code: code,
                                token: _DuoguanData.duoguan_user_token,
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            },
                            fail: function (res) {
                                console.dir(res);
                            },
                            success: function (res) {
                                var utoken = res.data.utoken;
                                wx.setStorageSync("utoken", utoken);
                                that.globalData.utoken = utoken;
                                that.globalData.userInfo.utoken = utoken;
                                typeof cb == "function" && cb(utoken)
                            }
                        })
                    }, fail: function (res) {
                        console.log(res);
                    }
                })
            }, fail: function (res) {
                console.log(res);
            }
        })
    },
    globalData: {
        userInfo: '',
        utoken: ''
    }
})