const app = getApp();
import requestUtil from '../../../../utils/requestUtil';
import _DuoguanData from '../../../../utils/data';
Page({
  data: {
    id:0,
    seckill_config:{},
    seckill_list:[],
    time:{},
    sec:0
  },
  onLoad: function (options) {
    this.setData({id:options.id})
    this.loaddata()
  },
  loaddata:function(id){
    var that= this
    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/listSeckillGoods.html',
      { id: that.data.id },
      (data) => {
        var seckill_info = {};
        seckill_info.seckill_config = data.seckill_info;
        seckill_info.seckill_list = data.goods_list;
        that.setData({ seckill_config: data.seckill_info, seckill_list: data.goods_list, seckill_info: seckill_info, seckill_concer: data.seckill_concer})
        if (data.seckill_info.is_today == 1){
          that.setseckilltime()
          setInterval(function () {
            var Data = new Date();
            that.data.sec = 59 - Data.getSeconds();
            if (that.data.sec == 59) {
              that.setseckilltime()
            }
            that.setData({ sec: that.data.sec })
          }, 1000);
        }
      }, this, { isShowLoading: false });
  },
  onShow: function () {
  
  },
  navigateTo:function(e){
    if (this.data.seckill_config.is_today == 0){
      return
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  setseckilltime: function () {
    var _Data = new Date();
    var time = this.data.time
    var seckilltime = [];
    var seckilltime2 = [];
    var minute = 0;
    var hour = 0;
    seckilltime = this.data.seckill_config.start_time.split(":")
    seckilltime = seckilltime[0] * 60 * 60 + seckilltime[1] * 60
    seckilltime2 = this.data.seckill_config.end_time.split(":")
    seckilltime2 = seckilltime2[0] * 60 * 60 + seckilltime2[1] * 60
    if (seckilltime > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
      seckilltime = seckilltime - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
      hour = parseInt(seckilltime / 3600)
      minute = parseInt((seckilltime % 3600) / 60)
      time.status = 0
    } else if (seckilltime2 > _Data.getHours() * 3600 + _Data.getMinutes() * 60) {
      seckilltime2 = seckilltime2 - _Data.getHours() * 3600 - _Data.getMinutes() * 60 - 60
      hour = parseInt(seckilltime2 / 3600)
      minute = parseInt((seckilltime2 % 3600) / 60)
      time.status = 1
    } else {
      hour = -1
      minute = -1
      time.status = 2
    }
    time.hour = hour
    time.minute = minute
    this.setData({ time: time })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '限时活动',
      desc: '邀您参与',
      path: 'pages/shop/seckill/seckill-list/index?id='+that.data.id,
      success: () => {

      }
    }
  },
})