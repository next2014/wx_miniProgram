 // pages/user/address/index.js
import dg from '../../../utils/dg.js';
import request from '../../../utils/requestUtil.js';
import { duoguan_host_api_url as API_HOST } from '../../../utils/data.js';

import _ from '../../../utils/underscore.js';
import listener from '../../../utils/listener.js';
import util from '../../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAli: dg.os.isAlipay(), // 是否为ali小程序，默认为是
        baseUrl: API_HOST + '/index.php/addon/DuoguanUser',
        isCallback: false, // 是否为回调页面，默认为否 
        showPage: 'list', // list列表 form表单
        mode: 'select_map_point', // 地图上选择点 select_map_point 和 选择地址列表 select_address_list
        // 列表页面使用的数据
        listUrl: '/AddressApi/info',
        list: [],
        pageNumber: 1, // 分页参数
        pageSize: 20,
        hasMore: true,
        isShowLoading: false,
        // form表单使用的数据
        is_use_app_address_detail_info: false, // 是否使用从APP地址中获取的详细地址
        buttonIsDisabled: false,
        url: '/AddressApi/info',
        id: 0, // 默认为0表示添加操作
        is_default: 0, // 是否设置为默认
        label: 1,
        longitude: 0, // 地图上获取的经度
        latitude: 0, // 地图上获取的纬度
        callbackAddress: {}, // 回调之后的地址信息
        address: '', // 除去详细地址之后的地址
        pickerIndex: 1, // 电话选择国家，索引默认为0，即中国
        pickerData: [
            {
                'country': '其它',
                'phone_country_area_code': '0',
                'placeholder': '国家区号+您的手机号码',
            },
            {
                'country': '中国',
                'phone_country_area_code': '86',
                'placeholder': '请输入您的手机号码',
            },
        ], // 电话选择国家数据
        country_list: {}, // 国家列表
        province_list: {}, // 省份列表
        city_list: {}, // 市份列表
        area_list: {}, // 区域列表
        country_index: 0,
        province_index: 0,
        city_index: 0,
        area_index: 0,

        // @2018-06-13 openSetting API 调整为 button 组件的open-type='openSetting' 兼容参数
        userLocationAuth: true, // 微信用户的地址位置授权
        addressAuth: true, // 微信通讯地址的授权
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            isCallback: (typeof (options.isCallback) != "undefined") ? true : false,
        });

        this.setPageTitle('list');
        // 获取收取地址模式
        let mode = this.data.mode;
        let requestUrl = this.data.baseUrl + "/AddressApi/getUserReceiveAddressMode";
        let requestData = { _p: options.pageNumber, _r: options.pageSize, search: options.search, mode: mode }
        request.get(requestUrl, requestData, (data) => {
            let mode = data.mode || this.data.mode;
            let res = _.indexOf(['select_map_point', 'select_address_list'], mode);
            if (res == -1) {
                mode = "select_map_point";
            }

            this.setData({
                mode: mode,
            });
            this.initialize(options);
        },this);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        if (this.data.isCallback) {
            let info = this.data.callbackAddress;
            listener.fireEventListener('address.choose.confirm', [info]);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // 防止表单页面下拉刷新数据
        if (this.data.showPage == 'form') {
            dg.stopPullDownRefresh();
            return false;
        }

        this.refresh(); // 模拟下拉刷新
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let options = {}
        let search = {}
        // 需要分页的调用
        options = {
            pageNumber: this.data.pageNumber,
            pageSize: this.data.pageSize,
            hasMore: this.data.hasMore,
            url: this.data.listUrl,
            search: search,
        }
        this.list(options)
    },

    /**
     * 用户点击右上角分享
     */
    //   onShareAppMessage: function () {

    //   },

    /**
     * 处理苹果手机 下拉刷新失败的情况
     */
    refresh: function () {
        this.setData({
            list: [],
            pageNumber: 1
        })

        let options = {}
        let search = {}
        // 需要分页的调用
        options = {
            pageNumber: 1,
            pageSize: this.data.pageSize,
            hasMore: true,
            url: this.data.listUrl,
            search: search,
        }
        this.list(options)
    },

    // 以下为列表页面使用的方法

    /**
     * 初始化
     */
    initialize: function (options) {
        // 需要分页的调用
        options = {
            pageNumber: 1,
            pageSize: this.data.pageSize,
            hasMore: true,
            url: this.data.listUrl,
            search: [],
        }
        this.list(options)
    },

    /**
     * 触底分页
     */
    list: function (options) {
        // 分页加载通用模版
        if (!options.hasMore) {
            this.setData({ isShowLoading: false })
            dg.stopPullDownRefresh();
            return false;
        }
        let requestUrl = this.data.baseUrl + options.url;
        let requestData = { _p: options.pageNumber, _r: options.pageSize, search: options.search, mode: this.data.mode };
        request.get(requestUrl, requestData, (data) => {
            let orginData = this.data.list;
            data = data || [];
            orginData = (options.pageNumber == 1) ? data : orginData.concat(data);

            // 调整默认地址在最上面
            orginData = _(orginData).sortBy(function (item) {
                return -item.is_default;
            });

            this.setData({
                isShowLoading: false,
                hasMore: (data.length < this.data.pageSize) ? false : true,
                pageNumber: options.pageNumber + 1,
                list: orginData,
                nodata: orginData.length == 0 ? false : true,
            });
        }, this, {
                isShowLoading: false,
                completeAfter: (e) => {
                    dg.stopPullDownRefresh();
                }
            })
    },

    /**
     * 新增
     */
    add: function (e) {
        this.setPageTitle('add');

        if (this.data.mode == 'select_address_list') {
            let requestUrl = this.data.baseUrl + "/RegionApi/shopRegionInitAdd";
            let requestData = {};
            request.get(requestUrl, requestData, function(data){
                this.setData({
                    ...data,
                });
            }, this);
        }

        this.setData({
            showPage: 'form',
            id: 0,
            name: '',
            gender: 1,
            mobile: '',
            address: '',
            detail_info: '',
            address: '',
            label: 1,
            postcode: '',
        });
    },

    /**
     * 编辑
     */
    edit: function (e) {
        this.setPageTitle('edit');

        let id = e.currentTarget.dataset.id;
        this.setData({
            showPage: 'form',
            id: id,
        })
        let values = { id: id }
        let requestUrl = this.data.baseUrl + this.data.url
        let requestData = values
        request.get(requestUrl, requestData, (info) => {
            let pickerIndex = 0;
            _(this.data.pickerData).map((item, index) => {
                // 兼容处理
                if (item.phone_country_area_code == info.phone_country_area_code && info.phone_country_area_code == 0) {
                    info.pickerIndex = 0;
                    return item
                }
            });

            this.setData({
                ...info,
            })
        }, this)
    },

    // 以下为表单页面使用的方法

    /**
     * 取消
     */
    cancel: function (e) {
        this.setPageTitle('list');

        this.setData({
            showPage: 'list',
            pickerIndex: 1,
            id: 0,
            is_use_app_address_detail_info: false,
        });
    },

    /**
     * 删除
     */
    remove: function (e) {
        let that = this;
        let id = e.currentTarget.dataset.id;
        dg.confirm("确定要删除收货地址吗？", function (res) {
            if (res.confirm) {
                that.delete(id)
            }
        }, '删除提示');
    },

    /**
     * 删除请求
     */
    delete: function (id) {
        let values = [];
        values['id'] = id;
        values['request_method'] = "DELETE"; // 删除请求

        this.setData({
            buttonIsDisabled: true,
        })
        let requestUrl = this.data.baseUrl + this.data.url;
        let requestData = values;
        request.get(requestUrl, requestData, (info) => {
            // 不做处理
            let data = data;
            // 提交是否成功
            if (data == "success") {
                dg.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000,
                })
            }
            this.setData({
                showPage: 'list',
                buttonIsDisabled: false,
                id: 0,
                name: '',
                gender: 1,
                mobile: '',
                address: '',
                detail_info: '',
                label: 1,
                postcode: '',
            })

            this.refresh(); // 模拟下拉刷新
        }, this, {
                isShowLoading: false, completeAfter: function (res) {
                    this.setData({
                        buttonIsDisabled: false,
                    });
                }
            });
    },

    /**
    * 选择性别
    */
    chooseGender: function (e) {
        let gender = e.currentTarget.dataset.gender || 1;
        this.setData({
            gender: gender
        })
    },

    /**
     * 选择地址标签
     */
    chooseLabel: function (e) {
        let label = e.currentTarget.dataset.label || 1;
        this.setData({
            label: label
        })
    },

    /**
     * 电话选择国家时的picker事件
     */
    pickerChange: function (e) {
        let index = e.detail.value;
        this.setData({
            pickerIndex: index,
        });
    },

    /**
     * 设置当前页面的标题
     */
    setPageTitle: function (type) {
        let title = "";
        if (type == 'add') {
            title = "新增收货地址";
        } else if (type == 'edit') {
            title = "编辑收货地址";
        } else if (type == 'list') {
            title = this.data.isCallback ? "选择收货地址" : "我的地址";
        }

        dg.setNavigationBarTitle({ title: title });
    },

    /**
     * form表单提交
     */
    formSubmit: function (e) {
        let values = e.detail.value;

        if (values.mode == "select_map_point") { // 经纬度方式 
            values.longitude = this.data.longitude * 1;
            values.latitude = this.data.latitude * 1;
            if (values.longitude < 0.01 || values.latitude < 0.01) {
                dg.showToast({
                    title: '经纬度未获取',
                    icon: 'none',
                    duration: 2000,
                });
                return false;
            }
            values.is_use_location = 1; // 强制获取经纬度
        } else { // 三级地区方式 mode == select_address_list
            values.region_id = this.data['area_list'][this.data.area_index]['region_id'] || 0; // 0
        }
        values.address = this.data.address;
        values.phone_country_area_code = this.data.pickerData[this.data.pickerIndex].phone_country_area_code; // 电话国家代码

        if (this.data.id == 0) { // 添加操作
            values.request_method = "POST";
        } else { // 编辑操作
            values.request_method = "PUT";
            values.id = this.data.id;
        }

        this.setData({
            buttonIsDisabled: true,
        })

        let requestUrl = this.data.baseUrl + this.data.url
        let requestData = values
        request.post(requestUrl, requestData, (info) => {
            // 不做处理
            let data = info;
            // 提交是否成功
            if (data.length == 0) {
                this.setData({
                    buttonIsDisabled: false,
                })
                return false;
            } else {
                dg.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000,
                })
                this.setData({
                    showPage: 'list',
                    id: 0,
                    pickerIndex: 1,
                    buttonIsDisabled: false,
                    is_use_app_address_detail_info: false,
                })

                this.refresh(); // 模拟下拉刷新
            }
        }, this, {
                isShowLoading: false, completeAfter: function (res) {
                    this.setData({
                        buttonIsDisabled: false,
                    })
                }
            });
    },

    /**
     * 地图上选点获取经纬度
     */
    location: function (e) {
        let that = this;
        dg.chooseLocation({
            fail: function (res) {
                if (that.data.isAli) {
                    // @2018-03-29 支付宝目前不需要授权
                } else { // 微信
                    if (res.errMsg.indexOf("auth") != -1) {
                        // @2018-06-13 兼容处理，能使用组件功能，就不再使用接口功能
                        if (dg.canIUse("button.open-type.openSetting")) {
                            that.setData({
                                userLocationAuth: false,
                            });
                            dg.showToast({
                                title: "请先开启“地理位置”权限",
                                icon: "none",
                            });
                        } else {
                            dg.confirm("请授权用户地理位置", function (res) {
                                if (res.confirm) {
                                    wx.openSetting({
                                        success: (res) => {
                                            if (res.authSetting && res.authSetting['scope.userLocation']) {
                                                that.location();
                                                return false;
                                            }
                                            dg.showToast({
                                                title: "授权失败",
                                                icon: "none",
                                            });
                                        }
                                    });
                                }
                            }, "温馨提示");
                        }
                    }
                }
            },
            success: function (res) {
                let address = that.data.address;
                address = res.address || "";
                let detail_info = that.data.detail_info;
                if (res.name) {
                    if (that.data.is_use_app_address_detail_info) {
                        // 保留从APP地址中获取的详细地址
                    } else {
                        detail_info = res.name;
                    }
                }
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    address: address,
                    detail_info: detail_info,
                    // is_use_app_address_detail_info: false,
                });

                if (address == "") { // 没有地址的情况
                    dg.alert("请在补充信息中填写完整的地址");
                }
                if (res.address == res.name && !that.data.isAli) {
                    // wx.chooseLocation API的BUG
                    let qqmap = util.getMapSdk();
                    qqmap.reverseGeocoder({
                        location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                        },
                        success: function (res) {
                            that.setData({
                                address: res.result.address,
                            })
                        },
                    });
                }
            }
        });
    },

    /**
     * 选择App的收货地址
     * 
     * @date 2017-12-29
     * @todo 支付宝小程序此时没有相应的接口
     */
    chooseAppAddress: function (e) {
        let that = this;
        wx.chooseAddress({
            success: function (res) {
                if (that.data.mode == "select_map_point") { // 经纬度方式
                    that.add({}); // 跳转到添加页面
                    that.setData({
                        mobile: res.telNumber,
                        name: res.userName,
                        detail_info: res.detailInfo,
                        is_use_app_address_detail_info: true,
                    });
                } else { // 三级地区方式
                    res.isAli = that.data.isAli;
                    let requestUrl = that.data.baseUrl + '/AddressApi/saveNativeAppAddress';
                    let requestData = res;
                    request.post(requestUrl, requestData, function(data){
                        that.refresh();
                    }, that, { loadingText: '保存中' });
                }
            },
            fail: function (res) {
                if (res.errMsg.indexOf('deny') !== -1 || res.errMsg.indexOf('denied') > 0) {
                    // @2018-06-13 兼容处理，能使用组件功能，就不再使用接口功能
                    if (dg.canIUse("button.open-type.openSetting")) {
                        that.setData({
                            addressAuth: false,
                        });
                        dg.showToast({
                            title: "请先开启“通讯地址”权限",
                            icon: "none",
                        });
                    } else {
                        dg.confirm("是否重新授权获取通讯地址？", function (res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: (res) => {
                                        if (res.authSetting && res.authSetting['scope.address']) {
                                            that.chooseAppAddress({});
                                            return false;
                                        }
                                        dg.showToast({
                                            title: "授权失败",
                                            icon: "none",
                                        });
                                    }
                                });

                            }
                        }, '授权失败');
                    }
                }
            }
        })
    },


    /**
     * 其它模块选择地址
     */
    radioChange: function (e) {
        const index = e.detail.value;
        const item = this.data.list[index];
        if (this.data.isCallback) {
            this.setData({
                callbackAddress: item
            });
            if (this.data.mode == "select_map_point") {
                /**
                 * @2018-05-04 isUseLocation 不再使用
                 * 强制获取经纬度
                 */
                if (item.longitude * 1 < 0.01) {
                    dg.alert("此地址无经纬度，编辑或重选", null, '温馨提示');
                    return false;
                } else if (item.qqmap_address.data == 'invalid') {
                    dg.alert("此地址请先编辑或重选", null, '温馨提示');
                    return false;
                }
            }
            dg.navigateBack();
        } else { // 设为默认地址
            let id = item.id;
            let requestUrl = this.data.baseUrl + "/AddressApi/setDefaultAddress";
            let requestData = { id: id };
            request.get(requestUrl, requestData, (info) => {
                this.refresh(); // 模拟下拉刷新
            }, this, { isShowLoading: false });
            return false;
        }
    },

    /**
     * 省市区列表选择
     */
    pickerChangeSelect: function (e) {
        let level = e.currentTarget.dataset.level, index = e.detail.value;
        let list_name = level + "_list", index_name = level + "_index";
        let data = this.data;
        if (data[index_name] == index) { // 判断是否为原先的数据
            return ;
        }
        if (level == 'area') { // 选择区份之后不再发起请求
            this.setData({
                area_index: index,
            });
            return ;
        }

        let requestUrl = this.data.baseUrl + "/RegionApi/shopRegionLevel";
        let requestData = {
            level: level,
            region_id: data[list_name][index]['region_id'],
        };
        request.get(requestUrl, requestData, function(data){
            data[index_name] = index;
            this.setData({
                ...data,
            });
        }, this);
    },

    /**
     * 开关
     */
    switchChange: function(e) {
        let value = e.detail.value, name = e.currentTarget.dataset.name;
        let objects = {};

        if (name == "is_default") {
            value = value == true ? 1 : 0;
        }
        
        objects[name] = value;
        this.setData({
            ...objects,
        });
    },

    /**
     * 阻止冒泡
     */
    stopBubbling: function(e) {
        console.log("action_name: stopBubbling,阻止冒泡");
    },

    /**
     * 授权页面
     */
    openSetting: function(e) {
        let dataset = e.currentTarget.dataset;
        let scope = dataset.scope;
        let authSetting = e.detail.authSetting;
        if (scope == 'userLocation') { // 地址位置
            if (authSetting['scope.userLocation']) {
                this.setData({
                    userLocationAuth: true,
                });
                this.location();
                return false;
            }
        }
        if (scope == 'address') { // 通讯地址
            if (authSetting['scope.address']) {
                this.setData({
                    addressAuth: true,
                });
                this.chooseAppAddress();
                return false;
            }
        }
        
        dg.showToast({
            title: "授权失败",
            icon: "none",
        });
    }
})