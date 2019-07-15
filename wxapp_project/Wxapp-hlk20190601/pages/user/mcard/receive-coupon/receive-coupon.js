import dg from "../../../../utils/dg.js";
import { duoguan_host_api_url as API_HOST } from "../../../../utils/data.js";
import requestUtil from "../../../../utils/requestUtil.js";
import util from "../../../../utils/util.js";
import _ from "../../../../utils/underscore.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAli: dg.os.isAlipay(),
        baseUrl: API_HOST + "/index.php/addon",
        data: [],
        addon_name: "", // 插件名称
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.init(options);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },

    /**
     * 初始化
     */
    init: function (options) {
        if (options.addon_name) {
            this.setData({
                addon_name: options.addon_name,
            });          
        }

        let title = "领券中心";
        if (options.title) {
            if (options.title.length && options.title != '') {
                title = options.title + title;
            }
        }
        dg.setNavigationBarTitle({
            title: title,
        });

        this.list(options);
    },

    /**
     * 获取列表数据
     */
    list: function (options) {
        let requestUrl = this.data.baseUrl + "/Card/CardApi/getCoupons.html";
        let requestData = {
            addon_name: this.data.addon_name,
        };
        requestUtil.get(requestUrl, requestData, function(data){
            _(data).map((item) => {
                item.use_start_date = util.format(item.use_start_time * 1000, "yyyy-MM-dd");
                item.use_end_date = util.format(item.use_end_time * 1000, "yyyy-MM-dd");
                return item;
            });
            this.setData({
                data: data,
            });
        }, this);
    },

    /**
     * 领取优惠券
     */
    goCoupon: function (e) {
        let dataset = e.currentTarget.dataset, index = dataset.index;
        let requestUrl = this.data.baseUrl + "/Card/CardApi/goCoupon.html";
        let requestData = {
            id: index,
        };
        requestUtil.get(requestUrl, requestData, function(data){
            dg.showToast({
                title: '领取成功！',
                icon: 'success',
                duration: 3000,
            });
        }, this);
    },
})