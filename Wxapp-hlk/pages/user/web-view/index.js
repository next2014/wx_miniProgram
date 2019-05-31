// pages/user/web-view/index.js
import dg from '../../../utils/dg';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAli: dg.os.isAlipay(),
        url: '', // 网页url decodeURIComponent(url)为url解码 encodeURIComponent(url)为编码
        title: '', // 网页标题
    },

    /**
     * 生命周期函数--监听页面加载
     * @param options 如下
     *｛ 
     *    url： encodeURIComponent(url), // encodeURIComponent 之后的url
     *    title: "标题"
     * }
     */
    onLoad: function (options) {
        console.log(options);
        if (!dg.canIUse('web-view')) { // 兼容处理
            let app_name = this.data.isAli ? "支付宝APP" : "微信APP";
            dg.alert('基础库版本太低，请先升级您的' + app_name, (res)=>{
                dg.navigateBack({});
            }, '温馨提示');
        }

        let url = options.url || '网页';
        url = decodeURIComponent(url); // url解码
        let title = options.title || '';

        dg.setNavigationBarTitle({
            title: title,
        });

        this.setData({
            url: url,
            title: title,
        });
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
    onShareAppMessage: function () {
        let title = this.data.title || '网页';
        let url = this.data.url || '';
        let route = this.route; // 当前页面 path ，必须是以 / 开头的完整路径
        if (route.substr(0, 1) != '/') route = '/' + route;
        let path = route + '?title=' + title + '&url=' + encodeURIComponent(url);

        return {
            title: title,
            path: path,
        }
    },
})