const app = getApp();
const $ = require('../../../utils/underscore');
import requestUtil from '../../../utils/requestUtil';
import _DuoguanData from '../../../utils/data';
import util from '../../../utils/util';
import dg from '../../../utils/dg';
import plugUtil from '../../../utils/plugUtil';

function GetDateDiff(DiffTime) {
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式   
  return DiffTime.replace(/\-/g, "/");
}
Page({
  data: {
    shareopenid: '',
    userInfo: '',
    swiper_data: [],
    index_data: [],
    glo_is_load: true,
    shareInfo: '',
    page: 1,
    load_more: true,
    text: '',
    is_show_notice: false,
    index_set: [],
    address: "北京市...",
    popup: true,
    swiper_index: 0,
    cart_num: 0,
    community_cate_id: -1,
    active_type: 1,
    show_share: false,
    bind_type:0,
    open_address:true,
    scroll_left: 0
  },
  //读取首页数据
  onLoad: function(options) {
    wx.removeStorageSync('all_info');
    plugUtil.popup(this, 'DuoguanShop');
    var that = this
    var scene = decodeURIComponent(options.scene)
    var sopenid = options.shareopenid;
    if (sopenid != undefined) {
      that.setData({
        shareopenid: sopenid
      });
      //加载用户信息
      requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
        that.setData({
          userInfo: data
        });
        that.loaddata()
      });
    } else if (scene != 'undefined') {
      that.setData({
        shareopenid: scene
      });
      var my_options = scene.split("#");
      that.setData({ other_uid : my_options[0]})
      //加载用户信息
      requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
        that.setData({
          userInfo: data
        });
        that.loaddata()
      });
    } else if (options.other_uid) {
      requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
        that.setData({
          userInfo: data,
          other_uid: options.other_uid
        });
        that.loaddata();
      });
    } else {
      requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
        that.setData({
          userInfo: data,
          other_uid: ''
        });
        that.loaddata();
      });
    }

    // wx.setNavigationBarTitle({
    //    title: "可以在这里设置首页标题",
    //  })
  },
  loaddata: function() {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getIndexDataList', {
      other_openid: that.data.shareopenid,
      user_openid: that.data.userInfo.openId,
      version: 120,
      my_uid: that.data.userInfo.uid,
    }, (info) => {
      that.setData({
        index_data: info,
        glo_is_load: false,
        text: info.public.shop_notice,
        load_more: true,
        page: 1,
        index_set: info.index_set,
        time: info.index_set
      });
      var k = 0;
      for (var i = 0; i < that.data.time.length; i++) {
        if (that.data.time[i].name == 'seckill' && that.data.time[i].config.seckill_config != null && (that.data.index_data.community_config == undefined || that.data.index_data.community_config.is_open != 1)) {
          if (k == 0) {
            k++;
            that.setseckilltime()
            setInterval(function() {
              var Data = new Date();
              that.data.sec = 59 - Data.getSeconds();
              if (that.data.sec == 59) {
                that.setseckilltime()
              }
              if (that.data.sec < 10) {
                that.data.sec = '0' + that.data.sec;
              }
              that.setData({
                sec: that.data.sec
              })
            }, 1000);
          }
        }
      }
      that.setData({
        index_set: that.data.index_set
      })
      that.getShareInfo();

      if (that.data.index_data.community_config && that.data.index_data.community_config.is_open == 1) {
        that.communityGetCate();
        wx.getLocation({
          type: 'wgs84',
          success: function(res) {
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            if (that.data.other_uid) { //分享绑关系
              if (that.data.other_uid == info.colonel_uid){//同一团长
                requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressByColonel.html', {
                  colonel_uid: that.data.other_uid,
                  lat: that.data.latitude,
                  lng: that.data.longitude
                }, (info) => {
                  that.setData({
                    all_address: info[0]
                  })
                  if (that.data.all_address) {
                    that.onShowBuildCommunityRelation(that.data.userInfo.uid, that.data.other_uid, that.data.all_address.id);
                    that.communityIndexBarrage(that.data.all_address.id);
                    that.selfAddressGoods(that.data.all_address.id, 1, that.data.community_cate_id);
                  }
                }, that, {
                    isShowLoading: false
                  });
              }else{//不同团长
                that.setData({ bind_type: 1});
                if (that.data.open_address){
                  that.selectSelfAddress();
                }
              }
              
            } else if (info.colonel_uid) { //已有团长
              console.log('info.colonel_uid:' + info.colonel_uid)
              var colonel_uid = info.colonel_uid;
              requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressByColonel.html', {
                colonel_uid: info.colonel_uid,
                lat: that.data.latitude,
                lng: that.data.longitude
              }, (info) => {
                if (info) {
                  that.setData({
                    all_address: info[0]
                  })
                } else {
                  all_address: false
                }
                if (info) {
                  that.onShowBuildCommunityRelation(that.data.userInfo.uid, colonel_uid, that.data.all_address.id);
                  that.communityIndexBarrage(that.data.all_address.id);
                  that.selfAddressGoods(that.data.all_address.id, 1, that.data.community_cate_id);
                } else {
                  requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddress.html', {
                    lat: that.data.latitude,
                    lng: that.data.longitude
                  }, (info) => {
                    that.setData({
                      all_address: info[0]
                    })
                    if (that.data.all_address) {
                      that.onShowBuildCommunityRelation(that.data.userInfo.uid, that.data.all_address.default_colonel_uid, that.data.all_address.id);
                    }
                    that.communityIndexBarrage(that.data.all_address.id);
                    that.selfAddressGoods(info[0].id, 1, that.data.community_cate_id);
                  }, that, {
                    isShowLoading: false
                  });
                }
              }, that, {
                isShowLoading: false
              });
            } else {//自己进来
              that.setData({ bind_type: 2 });
              that.selectSelfAddress();
              // requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddress.html', {
              //   lat: that.data.latitude,
              //   lng: that.data.longitude
              // }, (info) => {
              //   that.setData({
              //     all_address: info[0]
              //   })
              //   if (that.data.all_address) {
              //     that.onShowBuildCommunityRelation(that.data.userInfo.uid, that.data.all_address.default_colonel_uid, that.data.all_address.id);
              //   }
              //   that.communityIndexBarrage(that.data.all_address.id);
              //   that.selfAddressGoods(info[0].id, 1, that.data.community_cate_id);
              // }, that, {
              //   isShowLoading: false
              // });
            }
          },
          fail:function(res){//获取定位失败
            console.log(res)
            if (that.data.other_uid){
              if (that.data.other_uid == info.colonel_uid){
                requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressByColonelNoLocation.html', { colonel_uid: that.data.other_uid }, (info) => {
                  that.setData({
                    all_address: info
                  })
                  if (that.data.all_address) {
                    that.onShowBuildCommunityRelation(that.data.userInfo.uid, that.data.other_uid, that.data.all_address.id);
                    that.communityIndexBarrage(that.data.all_address.id);
                    that.selfAddressGoods(that.data.all_address.id, 1, that.data.community_cate_id);
                  }
                }, that, {
                    isShowLoading: false
                  });
              }else{
                that.setData({ bind_type: 1 });
                that.selectSelfAddress();
              }
              
            } else if (info.colonel_uid){
              console.log('info.colonel_uid:' + info.colonel_uid)
              var colonel_uid = info.colonel_uid;
              requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressByColonelNoLocation.html', {
                colonel_uid: info.colonel_uid
              }, (info) => {
                if (info) {
                  that.setData({
                    all_address: info
                  })
                } else {
                  all_address: false
                }
                if (info) {
                  that.onShowBuildCommunityRelation(that.data.userInfo.uid, colonel_uid, that.data.all_address.id);
                  that.communityIndexBarrage(that.data.all_address.id);
                  that.selfAddressGoods(that.data.all_address.id, 1, that.data.community_cate_id);
                } else {
                  requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressNoLocation.html', { }, (info) => {
                    that.setData({
                      all_address: info
                    })
                    if (that.data.all_address) {
                      that.onShowBuildCommunityRelation(that.data.userInfo.uid, that.data.all_address.default_colonel_uid, that.data.all_address.id);
                    }
                    that.communityIndexBarrage(that.data.all_address.id);
                    that.selfAddressGoods(info.id, 1, that.data.community_cate_id);
                  }, that, {
                      isShowLoading: false
                    });
                }
              }, that, {
                  isShowLoading: false
                });
            }else{
              that.setData({ bind_type: 2 });
              that.selectSelfAddress();
              // requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getSelfAddressNoLocation.html', {}, (info) => {
              //   that.setData({
              //     all_address: info
              //   })
              //   if (that.data.all_address) {
              //     that.onShowBuildCommunityRelation(that.data.userInfo.uid, that.data.all_address.default_colonel_uid, that.data.all_address.id);
              //   }
              //   that.communityIndexBarrage(that.data.all_address.id);
              //   that.selfAddressGoods(info[0].id, 1, that.data.community_cate_id);
              // }, that, {
              //     isShowLoading: false
              //   });
            }
          }
        })


      }

      if (that.data.index_data.public['is_position'] == 1) {
        var address_shop = wx.getStorageSync('address_shop')
        if (address_shop) {
          that.setData({
            address: address_shop
          });
        } else {
          wx.getLocation({
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
              var qqmapsdk = util.getMapSdk()
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success: (res) => {
                  that.setData({
                    address: res.result.address
                  });
                  wx.setStorageSync('address_shop', res.result.address)
                }
              });
            }
          })
        }
      }
    }, this, {
      isShowLoading: false
    });
  },
  getmin: function() {
    var info = this.data.community_time;
    let timeall = [];
    let that = this;
    let thistime = new Date().getTime();
    // for (var i = 0; i < info.length; i++) {
    let end_time = Date.parse(GetDateDiff(info.end_time));
    let start_time = Date.parse(GetDateDiff(info.begin_time));
    timeall.push({
      end_time: end_time,
      start_time: start_time
    });
    that.start_goods(start_time, thistime, end_time, timeall[0]);
    // }
    that.setData({
      timeall: timeall,
    })
  },
  start_goods: function(start_time, thistime, end_time, info) {
    let cha = start_time - thistime;
    let that = this;
    info = $.extend(info, {
      cutdaowbefore: true
    });
    if (cha <= 0) {
      cha = 0;
      that.end_goods(end_time, thistime, info);
    }
    that.time_meter(cha, info);
  },
  end_goods: function(end_time, thistime, info) {
    let cha = end_time - thistime;
    let that = this;
    info = $.extend(info, {
      cutdaowbefore: false
    });
    cha -= 1000;
    if (cha <= 0) {
      cha = 0;
      info = $.extend(info, {
        notcut: true
      });
      return;
    }
    that.time_meter(cha, info);
  },
  time_meter: function(timer, info) {
    if (info.notcut || timer <= 0) {
      return;
    }
    let that = this;
    let dd = parseInt(timer / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
    dd = that.checkTime(dd);
    let hh = parseInt(timer / 1000 / 60 / 60 % 24, 10); //计算剩余的小时数
    hh = that.checkTime(hh);
    let mm = parseInt(timer / 1000 / 60 % 60, 10); //计算剩余的分钟数
    mm = that.checkTime(mm);
    let cutdown = dd + '天' + hh + '时' + mm + '分';
    info = $.extend(info, {
      cutdown: cutdown,
      dd: dd,
      hh: hh,
      mm: mm
    });
  },
  checkTime: function(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  onShow: function() {
    var that = this;
    var launch_options = wx.getLaunchOptionsSync();
    if (launch_options.scene == 1089) {
      that.setData({ is_collect: true })
    } else {
      wx.checkSession({
        success() {
          that.setData({ is_collect: true })
        },
        fail() {
          that.setData({ is_collect: false })
        }
      })
    }
    that.getCarListNum();
    if (that.data.index_data.community_config && that.data.index_data.community_config.is_open == 1) {
      if (wx.getStorageSync('all_info')) {
        that.setData({
          all_address: wx.getStorageSync('all_info')
        })
        wx.removeStorageSync('all_info');
        if (that.data.all_address) {
          that.onShowBuildCommunityRelation(that.data.userInfo.uid, that.data.all_address.default_colonel_uid, that.data.all_address.id);
          that.communityIndexBarrage(that.data.all_address.id);
          requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/selfAddressGoods.html', {
            address_id: that.data.all_address.id,
            community_cate_id: that.data.community_cate_id,
            version: 200
          }, (info) => {
            that.setData({
              address_goods: info.goods_list,
              community_time: info.community_time
            })
            if (info.goods_list == false || info.goods_list == '') {
              wx.showModal({
                title: '提示',
                content: '活动已不存在,请切换至其他自提点',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    that.setData({
                      timeall: '',
                      seconds: ''
                    })
                    clearInterval(that.setintvalid);
                    that.selectSelfAddress();
                    return;
                  }
                }
              })
            }
            that.getmin();
            clearInterval(that.setintvalid);
            that.setintvalid = setInterval(function() {
              let seconds = new Date().getSeconds();
              if (seconds == 0) {
                that.getmin();
              }
              that.setData({
                seconds: that.checkTime(59 - seconds)
              })
            }, 1000);
          }, that, {
            isShowLoading: false
          });
        }
      } else {
        // that.onPullDownRefresh();
      }
    }
  },
  //location
  location: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          address: res.address
        })
      },
      fail: function(res) {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.openSetting({
                success: (res) => {}
              })
            }
          }
        })
      }
    })
  },
  navigateto: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  is_show_notice: function() {
    var that = this
    if (that.data.is_show_notice) {
      that.setData({
        is_show_notice: false
      })
    } else {
      that.setData({
        is_show_notice: true
      })
    }
  },
  detail: function(e) {
    wx.navigateTo({
      url: '../malldetail/malldetail?sid=' + e.currentTarget.id
    })
  },
  mall_list_bind: function(e) {
    wx.navigateTo({
      url: '../malllist/malllist?cid=' + e.currentTarget.id
    })
  },
  mall_list_bind2: function(e) {
    wx.navigateTo({
      url: '../malllist/malllist?pid=' + e.currentTarget.id
    })
  },
  goods_search_bind: function(e) {
    if (e.type == "confirm") {
      var s_key = e.detail.value;
    } else {
      var s_key = e.detail.value['k-word'];
    }
    console.log('s_key',s_key)
    wx.navigateTo({
      url: '../malllist/malllist?keywords=' + s_key
    });
  },
  shop_ad_bind: function(e) {
    var that = this;
    if (e.currentTarget.dataset.url == '') {
      return
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  swiper_top_bind: function(e) {
    console.log(e);
    var that = this;
    if (e.currentTarget.dataset.url){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    }
  },
  shop_saoma_bind: function() {
    wx.scanCode({
      success: (res) => {}
    });
  },
  setseckilltime: function() {
    var _Data = new Date();
    var time = this.data.time
    var seckilltime = [];
    var seckilltime2 = [];
    var minute = 0;
    var hour = 0;
    for (var index = 0; index < time.length; index++) {
      if (time[index].name == 'seckill' && time[index].config.seckill_config != null) {
        seckilltime = time[index].config.seckill_config.start_time.split(":")
        seckilltime = seckilltime[0] * 60 * 60 + seckilltime[1] * 60
        seckilltime2 = time[index].config.seckill_config.end_time.split(":")
        seckilltime2 = seckilltime2[0] * 60 * 60 + seckilltime2[1] * 60
        if (seckilltime > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
          seckilltime = seckilltime - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
          hour = parseInt(seckilltime / 3600)
          minute = parseInt((seckilltime % 3600) / 60)
          time[index].status = 0
        } else if (seckilltime2 > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
          seckilltime2 = seckilltime2 - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
          hour = parseInt(seckilltime2 / 3600)
          minute = parseInt((seckilltime2 % 3600) / 60)
          time[index].status = 1
        } else {
          hour = -1
          minute = -1
          time[index].status = 2
        }
        if (hour < 10) hour = '0' + hour
        if (minute < 10) minute = '0' + minute
        time[index].hour = hour
        time[index].minute = minute
      }
    }
    this.setData({
      time: time
    })
  },
  go_quan_info_bind: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../mallquan/index?qid=' + e.currentTarget.id
    });
  },
  getShareInfo: function() {
    //获取分享信息
    requestUtil.get(_DuoguanData.duoguan_get_share_data_url, {
      mmodule: 'duoguanshop'
    }, (info) => {
      this.setData({
        shareInfo: info
      });
    });
  },
  onShareAppMessage: function() {
    var that = this;
    if (that.data.index_data.community_config && that.data.index_data.community_config.is_open == 1) {
      console.log(that.data.all_address.default_colonel_uid)
      return {
        title: that.data.shareInfo.title,
        path: 'pages/shop/mall/mall?other_uid=' + that.data.all_address.default_colonel_uid,
      }
    } else {
      return {
        title: that.data.shareInfo.title,
        desc: that.data.shareInfo.desc,
        path: 'pages/shop/mall/mall',
        success: () => {
          requestUtil.get(_DuoguanData.duoguan_host_api_url + "/index.php/addon/MarketingLuckDraw/ApiShare/shareSetData", {}, (info) => {}, this, {
            error: () => false
          });
        }
      }
    }

  },
  //下拉刷新
  onPullDownRefresh: function() {
    plugUtil.popup(this, 'DuoguanShop');
    this.setData({open_address:false})
    this.loaddata()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  //进入购物车
  bind_go_cart: function() {
    wx.navigateTo({
      url: '../mallcart/mallcart'
    })
  },
  onReachBottom: function() {
    var that = this
    if (that.data.index_data.community_config && that.data.index_data.community_config.is_open == 1) {
      that.data.page = that.data.page + 1
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/selfAddressGoods.html', {
        address_id: that.data.all_address.id,
        page: that.data.page,
        community_cate_id: that.data.community_cate_id,
        version: 200
      }, (info) => {
        if (info.goods_list) {
          var address_goods = that.data.address_goods.concat(info.goods_list)
          that.setData({
            address_goods: address_goods,
            community_time: info.community_time
          })
        }
        that.getmin();
        clearInterval(that.setintvalid);
        that.setintvalid = setInterval(function() {
          let seconds = new Date().getSeconds();
          if (seconds == 0) {
            that.getmin();
          }
          that.setData({
            seconds: that.checkTime(59 - seconds)
          })
        }, 1000);
      }, that, {
        isShowLoading: false
      });
    } else if (that.data.load_more) {
      that.data.page = that.data.page + 1
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getIndexGoodsList', {
        page: that.data.page
      }, (data) => {
        that.data.index_data['index_new_list'] = that.data.index_data['index_new_list'].concat(data)
        if (data == null) {
          that.setData({
            load_more: false
          })
        } else {
          that.setData({
            index_data: that.data.index_data
          })
        }
      }, this, {
        isShowLoading: true
      })
    }
  },
  //关闭优惠券弹窗
  close_popup: function() {
    this.setData({
      popup: !this.data.popup
    })
  },
  getSeckillInfo: function(id) {
    var that = this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/listSeckillGoods.html', {
        id: id
      },
      (data) => {
        var seckill_info = {};
        seckill_info.seckill_config = data.seckill_info;
        seckill_info.seckill_list = data.goods_list.slice(0, 9);
        that.setData({
          seckill_info: seckill_info
        })
      }, this, {
        isShowLoading: false
      });
  },
  //获取formID
  pushFormId: function(e) {
    requestUtil.pushFormId(e.detail.formId);
  },
  swiperIndex: function(e) {
    this.setData({
      swiper_index: e.detail.current
    })
  },
  selectSelfAddress: function () {
    var that = this;
    if(that.data.bind_type == 1){
      wx.navigateTo({
        url: '../business-address/index?address_type=' + 2 + '&bind_type=' + that.data.bind_type + '&colonel_uid=' + that.data.other_uid
      })
    } else if (that.data.bind_type == 2){
      wx.navigateTo({
        url: '../business-address/index?address_type=' + 2 + '&bind_type=' + that.data.bind_type
      })
    }else{
      wx.navigateTo({
        url: '../business-address/index?address_type=' + 2 + '&bind_type=' + that.data.bind_type
      })
    }
    
  },
  // selectVillage: function (bind_type){
  //   wx.navigateTo({
  //     url: '../business-address/index?address_type=' + 2
  //   })
  // },
  shopDetail: function(e) {

    wx.navigateTo({
      url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id,
    })

  },
  timeData: function() {
    var that = this;
    that.setData({
      address_goods: []
    })
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/delCommunityShopCart.html', {
      my_uid: that.data.userInfo.uid,
    }, (info) => {}, that, {
      isShowLoading: false
    });
    plugUtil.popup(this, 'DuoguanShop');
    this.loaddata()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)

  },

  communitySwiper: function(self_address_id) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getCommunitySwiper.html', {
      self_address_id: self_address_id,
    }, (info) => {
      that.setData({
        swiper_data: info
      })
    }, that, {
      isShowLoading: false
    });
  },

  communityIndexBarrage: function(self_address_id) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/communityIndexBarrage.html', {
      self_address_id: self_address_id,
    }, (info) => {
      that.setData({
        barrage_data: info
      })
    }, that, {
      isShowLoading: false
    });
  },

  getCarListNum: function() {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getCartList.html', {},
      (data) => {
        var cart_num = 0;
        if (data) {
          for (var i = 0; i < data.length; i++) {
            cart_num += data[i].goods_number * 1
          }
        }
        that.setData({
          cart_num: cart_num
        })
      }, that, {
        isShowLoading: false
      });
  },

  addCart: function(e) {
    this.getCarListNum();
  },

  onShowBuildCommunityRelation: function(my_uid, other_uid, self_address_id) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/onShowBuildCommunityRelation.html', {
      my_uid: my_uid,
      other_uid: other_uid,
      self_address_id: self_address_id,

    }, (info) => {
      that.communitySwiper(that.data.all_address.id);
    }, that, {
      isShowLoading: false
    });
  },

  selfAddressGoods: function (address_id, page, community_cate_id) {
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/selfAddressGoods.html', {
      address_id: address_id,
      page: page,
      community_cate_id: community_cate_id,
      version: 200
    }, (info) => {
      that.setData({
        address_goods: info.goods_list,
        community_time: info.community_time,
        active_type: info.active_type
      })
      if (info.goods_list == false || info.goods_list == '') {
        wx.showModal({
          title: '提示',
          content: '活动已不存在,请切换至其他自提点',
          showCancel: false
        })
        that.setData({
          timeall: '',
          seconds: ''
        })
        clearInterval(that.setintvalid);
        return;
      }
      that.getmin();
      clearInterval(that.setintvalid);
      that.setintvalid = setInterval(function() {
        let seconds = new Date().getSeconds();
        if (seconds == 0) {
          that.getmin();
        }
        that.setData({
          seconds: that.checkTime(59 - seconds)
        })
        if ((that.data.timeall[0].cutdown == '00天00时00分' && that.data.seconds == 0) || that.data.community_time.begin_time == undefined) {
          clearInterval(that.setintvalid);
          that.timeData();
        }
      }, 1000);
    }, that, {
      isShowLoading: false
    });
  },

  communityGetCate:function(){
    var that = this;
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/communityGetCate.html', {}, (info) => {
      if(info){
        that.setData({community_cate: info})
      }else{
        that.setData({ community_cate: ''})
      }
     }, that, {
        isShowLoading: false
      });
  },

  community_cate_item_bind:function(e){
    console.log(e)
    var that = this;
    that.setData({ 
      community_cate_id : e.currentTarget.id,
      page : 1
    })
    that.selfAddressGoods(that.data.all_address.id, 1, e.currentTarget.id);
    var left = e.currentTarget.offsetLeft;
    that.setData({scroll_left:left - 120});
  },

  jumpToVip:function(){
    wx.navigateTo({
      url: '/pages/shop/superMember/superMember'
    })
  },

  jumpToVipShop: function () {
    util.trySyncUserInfo(function () {
      wx.navigateTo({
        url: '/pages/shop/memberGoods/memberGoods'
      })
    })
  },
  
  showShare: function (e) {
    this.setData({ show_share: !this.data.show_share })
    if (e.currentTarget.dataset.type) this.setData({ share_type: '' })

  },
  communityPoster: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../community-poster/community-poster?colonel_uid=' + that.data.all_address.default_colonel_uid
    })
  },
  closeCollect: function () {
    var that = this;
    that.setData({ is_collect: true });
  },
  shop_colonel_apply: function () {
    wx.navigateTo({
      url: '/pages/shop/audit/audit?type=1'
    })
  },
  shop_supplier_apply: function () {
    wx.navigateTo({
      url: '/pages/shop/audit/audit?type=2'
    })
  }

  //新品推荐点击查看更多
  // allCase:function(){
  //   var that = this
  //   if (that.data.load_more) {
  //     that.data.page = that.data.page + 1
  //     requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getIndexGoodsList', { page: that.data.page }, (data) => {
  //       that.data.index_data['index_new_list'] = that.data.index_data['index_new_list'].concat(data)
  //       if (data == null) {
  //         that.setData({
  //           load_more: false
  //         })

  //       } else {
  //         that.setData({
  //           index_data: that.data.index_data
  //         })
  //       }
  //     }, this, { isShowLoading: true })
  //   }
  // },
})