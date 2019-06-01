const app = getApp();
import _ from '../../utils/underscore';
import requestUtil from '../../utils/requestUtil';
import _DuoguanData, { duoguan_host_api_url as API_HOST } from '../../utils/data';
import _function from '../../utils/functionData';
import util from '../../utils/util';
import dg from '../../utils/dg';
import plugUtil from '../../utils/plugUtil';
import wxParse from '../../wxParse/wxParse';
import listener from '../../utils/listener';


const sys = typeof wx ==='undefined'? my : wx;

function getModularStyle(options) {
	if (!options) return '';

	const result = [];
	if (options.backgroundSize) result.push('background-size: ' + options.backgroundSize);
	if (options.backgroundRepeat) result.push('background-repeat: ' + options.backgroundRepeat);
	if (options.backgroundColor) result.push('background-color: ' + options.backgroundColor);
	if (options.backgroundImage) result.push('background-image: url(' + options.backgroundImage + ')');
	if (options.backgroundPosition) result.push('background-position: ' + options.backgroundPosition);

	if (options.padding) {
		result.push('padding-left: ' + (options.padding.left * 2) + 'rpx');
		result.push('padding-top: ' + (options.padding.top * 2) + 'rpx');
		result.push('padding-right: ' + (options.padding.right * 2) + 'rpx');
		result.push('padding-bottom: ' + (options.padding.bottom * 2) + 'rpx');
	}
	return result.join(';');
}

function getModularClass(options) {
	if (!options) return '';

	const result = [];
	if (options.controlMargin) result.push('module-bottom-space');
	if (options.textColor) result.push(options.textColor);

	options.isContainerBackground = options.isContainerBackground !== false;
	result.push(options.isContainerBackground ? 'containerBackground' : '');

	return result.join(' ');
}

Page({
    
    data:{
        dgGlobal_options:null,
        
        dgShop_shareopenid: '',
        dgShop_userInfo: '',
        dgShop_swiper_data: [],
        dgShop_index_data: [],
        dgShop_glo_is_load: true,
        dgShop_shareInfo: '',
        dgShop_page: 1,
        dgShop_load_more: true,
        dgShop_text: '',
        dgShop_is_show_notice: false,
        dgShop_index_set: [],
        dgShop_address: "北京市...",
        //购买与加入购物车所需参数
        dgShop_is_show_card: false,
        dgShop_this_goods_id: 0,
        dgShop_goods_info: [],
        dgShop_goods_specification: [],
        dgShop_goods_attr_select: {},
        dgShop_shop_attr_price: [],
        dgShop_cart_default_number: 1,
        dgShop_btn_add_cart_disabled: false,
        //属性新增
        dgShop_property_select: [],
        dgShop_goods_property: { 'shop_price': undefined, 'vip_price': undefined, 'g_img_url': '', 'sell_num': undefined, 'last_num': undefined },
        dgShop_show_property: true,
        dgShop_property_num: null,
        dgShop_time: { 'hour': 0,'minute':0,'status':0},
        dgShop_sec: 0,
        
    },
    onLoad:function(options) {
        this.setData({dgGlobal_options:options});
        this.loadControlOptions(options);
    },
    /**
    * 加载页面组件配置数据
    */
    loadControlOptions: function (options) {
        var that = this;
        var _this = this;
        const url = API_HOST + '/index.php/addon/DuoguanUser/Api/getCustomConfig';
        requestUtil.get(url, { id: 88420 }, (data) => {
        	for (const key in data) {
                const item = data[key];
                data[key] = Object.assign({}, item, {
                    classList: getModularClass(item),
                    style: getModularStyle(item)
                });
            }
			that.setData({ config_options: data });
			that.parseVideoUrl(data);
			
        that.dgShop_shop_mall_onload(options);
        
        });
    },

	/**
	 * 解析视频地址
	 */
    parseVideoUrl: function (options) {
        const videos = [];
        for (const key in options) {
            const item = options[key];
            if (item.autoplay !== undefined && item.src !== undefined) {
                videos.push(item);
            }
        }
        if (videos.length === 0) return;

        requestUtil.post(API_HOST + '/index.php/home/utils/parseVideoUrls', {
            urls: JSON.stringify(videos.map(item => item.src))
        }, (data) => {
            for (let i = 0; i < data.length; i++) {
                const url = data[i];
                videos[i].src = url;
            }
            this.setData({ config_options: options });
        });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        that.onLoad(that.data.dgGlobal_options);
        setTimeout(() => {
            sys.stopPullDownRefresh();
        }, 1000);
    },
    
    // 分享信息
    onShareAppMessage: function () {
        var that = this;
        var shareTitle = '瑞通源人文家居';
        var shareDesc = '新页面';
        var sharePath = 'pages/custom/custom_821159890';
        return {
            title: shareTitle,
            desc: shareDesc,
            imageUrl:'',
            path: sharePath
        }
    },
    /**
     * 拨打电话
     */
    onCallTap: function (e) {
        const dataset = e.currentTarget.dataset || e.target.dataset, mobile = dataset.mobile,tips = dataset.tips;
        if (!mobile) return;
        const msg = tips || '你将要拨打电话：' + mobile;

		if(typeof wx === 'undefined'){
			sys.confirm({
				title: '温馨提示',
				content: msg,
				success: (res) => {
					if (!res.confirm) return;
					sys.makePhoneCall({ number: mobile, });
				}
			});
		}else{
			sys.showModal({
				title: '温馨提示',
				content: msg,
				success: (res) => {
					if (res.cancel) return;
					sys.makePhoneCall({ phoneNumber: mobile, });
				}
			});
		}
    },

    /**
     * 跳转页面
     */
    onNavigateTap: function (e) {
       const dataset = e.detail.target ? e.detail.target.dataset : e.currentTarget.dataset;
        const url = dataset.url, type = dataset.type, nav = { url: url }, appId = dataset.appId;
        if (dataset.invalid) return console.warn('链接已被禁用');
        console.warn('页面地址未配置');

        if (e.detail.formId) requestUtil.pushFormId(e.detail.formId);

        if (type === 'mini') {
            sys.navigateToMiniProgram({
                appId: appId, path: url, fail: (err) => {
                    console.error(err);
                }
            });
        } else {
            sys.navigateTo({
                url: url, fail: () => {
                    sys.switchTab({
                        url: url,
                    });
                }
            });
        }
    },

    /**
     * 预览视图
     */
    onPreviewTap: function (e) {
        let dataset = e.target.dataset, index = dataset.index, url = dataset.url;
        if (index === undefined && url === undefined) return;

        let urls = e.currentTarget.dataset.urls;
        urls = urls === undefined ? [] : urls;
        if (index !== undefined && !url) url = urls[index];
        sys.previewImage({ current: url, urls: urls });
    },
    /**
    * 充值
    */
    recharge: function (e) {
        let that = this;
        var key = e.currentTarget.dataset.key;
        var config_options = that.data.config_options;
        config_options[key].select_index = e.currentTarget.dataset.index;
        that.setData({ config_options: config_options})
        if (that.data.config_options[key].is_member == 1){
          wx.showModal({
            title: '提示',
            content: '确认购买？',
            success(res) {
              if (res.confirm) {
                let money = e.currentTarget.dataset.money; // 充值金额
                let reward_id = e.currentTarget.dataset.reward_id; // 充值条件
                let condition_id = e.currentTarget.dataset.condition_id; // 充值条件

                const url = API_HOST + "/index.php?s=/addon/Card/CardApi/recharge.html";
                requestUtil.get(url, {
                  money: money,
                  reward_id: reward_id,
                  condition_id: condition_id
                }, (info) => {
                  wx.requestPayment(_.extend(info, {
                    success: (res) => {
                      wx.showToast({
                        title: '充值成功！',
                        duration: 1500,
                      });
                      that.onPullDownRefresh(); // 触发刷新
                    },
                    fail: (res) => {
                      console.error(res);
                    }
                  }));
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '您还不是会员',
            content: '立即开通会员?',
            success(res){
              if (res.confirm){
                wx.navigateTo({
                  url: '/pages/user/member/member-center/index',
                })
              }
            }
          })
        }
    },
    
    dgShop_location: function () {
        var that = this
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    dgShop_address: res.address
                })
            },
            fail: function (res) {
                wx.getSetting({
                    success(res) {
                        if (!res.authSetting['scope.userLocation']) {
                            wx.openSetting({
                                success: (res) => {

                            }
                        })
                        }
                    }
                })
            }
        })
    },
    //立即购买与加入购物车
    dgShop_is_show_card: function (e) {
        var that = this
        that.setData({ dgShop_goods_property: { 'shop_price': undefined, 'vip_price': undefined, 'g_img_url': '', 'sell_num': undefined, 'last_num': undefined } })
        if (that.data.dgShop_is_show_card) {
            that.setData({ dgShop_is_show_card: false })
        } else {
            //请求商品详情
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/getGoodsInfo.html',
                { sid: e.currentTarget.dataset.id },
                (data) => {
                that.dgShop_initGoodsInfoData(data)
        }, this, { isShowLoading: false });
            that.setData({
                dgShop_is_show_card: true,
                dgShop_this_goods_id: e.currentTarget.dataset.id,
                dgShop_cart_default_number: 1,
                dgShop_property_num: null,
                dgShop_btn_add_cart_disabled: false
            })
        }
    },
    dgShop_initGoodsInfoData: function (data) {
        var that = this
        that.setData({
            dgShop_goods_info: data,
            dgShop_property_select: data.property,
            dgShop_goods_specification: []
        })
    },
    dgShop_change_cart_number: function (e) {
        var that = this
        var value = e.detail.value
        var re = /^[0-9]+$/;
        if (!re.test(value) || value < 1) {
            value = 1
        }
        if (that.data.dgShop_goods_info.buy_num >= 0) {
            if (value > that.data.dgShop_goods_info.buy_num) {
                value = that.data.dgShop_goods_info.buy_num * 1
            }
        }
        if (value > that.data.dgShop_goods_info.g_number * 1) {
            value = that.data.dgShop_goods_info.g_number
        }
        that.setData({ dgShop_cart_default_number: value })
    },
    // 关闭购物车
    dgShop_set_close: function () {
        this.setData({
            dgShop_is_show_card: false
        })
    },
    //属性选择
    dgShop_select_attr_bind: function (e) {
        var select = e.currentTarget.dataset
        // 控制标签选中样式
        this.data.dgShop_property_select[select.index].item = select.key
        this.setData({ dgShop_property_select: this.data.dgShop_property_select })
        // 控制商品信息显示
        var num
        if (this.data.dgShop_property_select.length == 4) {
            num = this.dgShop_num(this.data.dgShop_property_select[0].item, this.data.dgShop_goods_info.property[0].item.length, this.data.dgShop_property_select[1].item, this.data.dgShop_goods_info.property[1].item.length, this.data.dgShop_property_select[2].item, this.data.dgShop_goods_info.property[2].item.length, this.data.dgShop_property_select[3].item, this.data.dgShop_goods_info.property[3].item.length)
        } else if (this.data.dgShop_property_select.length == 3) {
            num = this.dgShop_num(this.data.dgShop_property_select[0].item, this.data.dgShop_goods_info.property[0].item.length, this.data.dgShop_property_select[1].item, this.data.dgShop_goods_info.property[1].item.length, this.data.dgShop_property_select[2].item, this.data.dgShop_goods_info.property[2].item.length)
        } else if (this.data.dgShop_property_select.length == 2) {
            num = this.dgShop_num(this.data.dgShop_property_select[0].item, this.data.dgShop_goods_info.property[0].item.length, this.data.dgShop_property_select[1].item, this.data.dgShop_goods_info.property[1].item.length)
        } else if (this.data.dgShop_property_select.length == 1) {
            num = this.dgShop_num(this.data.dgShop_property_select[0].item, this.data.dgShop_goods_info.property[0].item.length)
        }
        //获取对应属性商品信息
        if (this.data.dgShop_goods_info.propertydata[num] != undefined) {
            this.data.dgShop_goods_property.g_img_url = this.data.dgShop_goods_info.propertydata[num].goods_img
            this.data.dgShop_goods_property.sell_num = this.data.dgShop_goods_info.propertydata[num].sell_num
            this.data.dgShop_goods_property.last_num = this.data.dgShop_goods_info.propertydata[num].last_num
            this.data.dgShop_goods_property.shop_price = this.data.dgShop_goods_info.propertydata[num].shop_price > 0 ? this.data.dgShop_goods_info.propertydata[num].shop_price : this.data.dgShop_goods_info.shop_price
            this.data.dgShop_goods_property.vip_price = this.data.dgShop_goods_info.propertydata[num].vip_price > 0 ? this.data.dgShop_goods_info.propertydata[num].vip_price : this.data.dgShop_goods_info.vip_price
            this.data.dgShop_goods_property.promote_price = this.data.dgShop_goods_info.propertydata[num].promote_price > 0 ? this.data.dgShop_goods_info.propertydata[num].promote_price : this.data.dgShop_goods_info.promote_price
            this.setData({ dgShop_goods_property: this.data.dgShop_goods_property, dgShop_property_num: num })
        }
    },
    /*
    * x0 当前循环数
    * length0 当前循环长度
    * 0-3  内层循环到外层
    * 返回当前循环的次数
    * */
    dgShop_num: function (x0, length0, x1, length1, x2, length2, x3, length3) {
        if (length3 > 0) {
            return x0 * length1 * length2 * length3 + x1 * length2 * length3 + x2 * length3 + x3
        } else if (length2 > 0) {
            return x0 * length1 * length2 + x1 * length2 + x2
        } else if (length1 > 0) {
            return x0 * length1 + x1
        } else if (length0 > 0) {
            return x0
        }
    },
    //属性选择
    dgShop_select_attr_bind_old: function (e) {
        var that = this
        var this_attr_id = e.currentTarget.id
        var this_attr_name = e.currentTarget.dataset.type
        var datas = that.data.dgShop_goods_specification
        var this_spec_price = 0;
        var a_datas = that.data.dgShop_goods_attr_select
        var g_datas = that.data.dgShop_goods_info
        var dgShop_shop_attr_price = that.data.dgShop_shop_attr_price
        var this_shop_price = 0
        var all_shop_price = 0
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].name == this_attr_name) {
                a_datas[datas[i].name] = null
                for (var j = 0; j < datas[i].values.length; j++) {
                    datas[i].values[j].ischeck = false
                    if (datas[i].values[j].id == this_attr_id) {
                        datas[i].values[j].ischeck = true
                        a_datas[datas[i].name] = this_attr_id
                        if (datas[i].values[j].format_price > 0) {
                            this_shop_price = datas[i].values[j].format_price
                        }
                    }
                }
                dgShop_shop_attr_price[i] = this_shop_price
                that.setData({
                    dgShop_shop_attr_price: dgShop_shop_attr_price
                })
            }
            if (that.data.dgShop_shop_attr_price[i]) {
                all_shop_price = that.data.dgShop_shop_attr_price[i] * 1 + all_shop_price * 1
                all_shop_price = all_shop_price.toFixed(2);
            }
        }
        if (all_shop_price > 0) {
            g_datas.shop_price = all_shop_price
        }
        that.setData({
            dgShop_goods_specification: datas,
            dgShop_goods_attr_select: a_datas,
            dgShop_goods_info: g_datas
        })
    },
    //减少数量
    dgShop_bind_cart_number_jian: function () {
        var that = this
        var this_default_number = parseInt(that.data.dgShop_cart_default_number)
        if (this_default_number > 1) {
            that.setData({
                dgShop_cart_default_number: this_default_number - 1
            })
        } else {
            that.setData({
                dgShop_cart_default_number: 1
            })
        }
    },
    //增加数量
    dgShop_bind_cart_number_jia: function () {
        var that = this
        var this_default_number = parseInt(that.data.dgShop_cart_default_number)
        that.setData({
            dgShop_cart_default_number: this_default_number + 1
        })
    },
    //立即购买
    dgShop_goods_buy_now: function (e) {
        var that = this
        // var attr_str = that.data.dgShop_goods_info.propertydata[that.data.dgShop_property_num].attr_str
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/buyNow', {
            goods_id: that.data.dgShop_this_goods_id, goods_number: that.data.dgShop_cart_default_number, goods_attr: JSON.stringify(that.data.dgShop_property_select)
        }, (info) => {
            if (info) {
                wx.navigateTo({
                    url: '/pages/shop/mallsure/mallsure?goods_id=' + info.goods_id + '&goods_number=' + info.goods_number + '&attr_str=' + info.attr_str + '&goods_attr=' + info.goods_attr
                })
            } else {
                return false
            }
        }, this, { isShowLoading: true });
    },
    //加入购物车
    dgShop_goods_add_cart: function () {
        var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000,
            mask: true
        });
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/addGoodsCart.html',
            { goods_id: that.data.dgShop_this_goods_id, goods_number: that.data.dgShop_cart_default_number, goods_attr: JSON.stringify(that.data.dgShop_property_select) },
            (data) => {
            that.dgShop_initAddCartData(data)
    }, this, { isShowLoading: true });
    },
    dgShop_initAddCartData: function (data) {
        var that = this;
        wx.hideToast();
        that.setData({
            dgShop_btn_add_cart_disabled: false,
            dgShop_is_show_card: false
        });
        wx.showToast({
            title: '添加购物车成功',
            icon: 'success',
            duration: 2000,
            mask: true,
        });
    },
    //end
    dgShop_navigateto: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.link
        })
    },
    dgShop_is_show_notice: function () {
        var that = this
        if (that.data.dgShop_is_show_notice) {
            that.setData({ dgShop_is_show_notice: false })
        } else {
            that.setData({ dgShop_is_show_notice: true })
        }
    },
    dgShop_detail: function (e) {
        wx.navigateTo({
            url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id
        })
    },
    dgShop_mall_list_bind: function (e) {
        wx.navigateTo({
            url: '/pages/shop/malllist/malllist?cid=' + e.currentTarget.id
        })
    },
    dgShop_mall_list_bind2: function (e) {
        wx.navigateTo({
            url: '/pages/shop/malllist/malllist?pid=' + e.currentTarget.id
        })
    },
    dgShop_goods_search_bind: function (e) {
        if (e.type == "confirm") {
            var s_key = e.detail.value;
        } else {
            var s_key = e.detail.value['k-word'];
        }
        wx.navigateTo({
            url: '/pages/shop/malllist/malllist?keywords=' + s_key
        });
    },
    dgShop_shop_ad_bind: function (e) {
        var that = this;
        if (e.currentTarget.dataset.url == '') {
            return
        }
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        });
    },
    dgShop_swiper_top_bind: function (e) {
        var that = this;
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        });
    },
    dgShop_shop_saoma_bind: function () {
        wx.scanCode({
            success: (res) => {
        }
    });
    },
    dgShop_shop_mall_onload: function (options) {
        plugUtil.popup(this, 'DuoguanShop');
        var that = this
        var scene = decodeURIComponent(options.scene)
        var sopenid = options.shareopenid;
        if (sopenid != undefined) {
            that.setData({
                dgShop_shareopenid: sopenid
            });
            //加载用户信息
            requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
                that.setData({ dgShop_userInfo: data });
            that.dgShop_loaddata()
        });
        } else if (scene != 'undefined') {
            that.setData({
                dgShop_shareopenid: scene
            });
            //加载用户信息
            requestUtil.get(_DuoguanData.duoguan_user_info_url, {}, (data) => {
                that.setData({ dgShop_userInfo: data });
            that.dgShop_loaddata()
        });
        } else {
            that.dgShop_loaddata()
        }
        // wx.setNavigationBarTitle({
        //    title: "可以在这里设置首页标题",
        //  })
    },
    dgShop_loaddata: function () {
        var that = this;
        var options = { other_openid: that.data.dgShop_shareopenid, user_openid: that.data.dgShop_userInfo.openId, version: 108 };
        var config_options = that.data.config_options;
        console.log(that.data)
        console.log(config_options['duoguan-shop-newArrivals'])
        var hotSize = config_options['duoguan-shop-newArrivals'] ? config_options['duoguan-shop-newArrivals'].rowNum : 10;
        var newSize = config_options['duoguan-shop-newGoods'] ? config_options['duoguan-shop-newGoods'].rowNum : 10;
        var storeSize = config_options['duoguan-shop-recommend'] ? config_options['duoguan-shop-recommend'].rowNum:10;
        options.hotSize = hotSize;
        options.newSize = newSize;
        options.storeSize = storeSize;
        options.shopversion = 120;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getIndexDataList', options, (info) => {
            that.setData({ dgShop_index_data: info, dgShop_glo_is_load: false, dgShop_text: info.public.shop_notice, dgShop_load_more: true, dgShop_page: 1, dgShop_index_set: info.index_set });
        if (that.data.dgShop_index_data.public['is_position'] == 1) {
            var address_shop = wx.getStorageSync('address_shop')
            if (address_shop) {
                that.setData({
                    dgShop_address: address_shop
                });
            } else {
                wx.getLocation({
                    type: 'wgs84', //返回可以用于wx.openLocation的经纬度
                    success: function (res) {
                        var qqmapsdk = util.getMapSdk()
                        qqmapsdk.reverseGeocoder({
                            location: {
                                latitude: res.latitude,
                                longitude: res.longitude
                            },
                            success: (res) => {
                            that.setData({
                            dgShop_address: res.result.address
                        });
                        wx.setStorageSync('address_shop', res.result.address)
                    }
                    });
                    }
                })
            }
        }
    }, this, { isShowLoading: false });
    },
    dgShop_settime: function(){
        var k = 0;
        for (var i = 0; i < that.data.dgShop_time.length; i++) {
            if (that.data.dgShop_time[i].name == 'seckill' && that.data.dgShop_time[i].config.seckill_config != null) {
                if (k == 0) {
                    k++;
                    that.dgShop_setseckilltime()
                    setInterval(function () {
                        var Data = new Date();
                        that.data.dgShop_sec = 59 - Data.getSeconds();
                        if (that.data.dgShop_sec == 59) {
                            that.dgShop_setseckilltime()
                        }
                        that.setData({ dgShop_sec: that.data.dgShop_sec })
                    }, 1000);
                }
            }
        }
    },
    dgShop_setseckilltime: function () {
        var _Data = new Date();
        var time = this.data.config_options['duoguan-shop-seckill'].link
        var seckilltime = [];
        var seckilltime2 = [];
        var minute = 0;
        var hour = 0;
        seckilltime = time.seckill_config.start_time.split(":")
        seckilltime = seckilltime[0] * 60 * 60 + seckilltime[1] * 60
        seckilltime2 = time.seckill_config.end_time.split(":")
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

        this.setData({ dgShop_time: time })
    },
    dgShop_go_quan_info_bind: function (e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/shop/mallquan/index?qid=' + e.currentTarget.id
        });
    },
    //进入购物车
    dgShop_bind_go_cart: function () {
        wx.navigateTo({
            url: '/pages/shop/mallcart/mallcart'
        })
    },
    
})