// pages/user/setting/index.js
import dg from '../../../utils/dg.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAli: dg.os.isAlipay(),
        other_menus: [
            { name: "wechat_setting", text: "授权设置", link: "wechat_setting", icon: "icon-xitongshezhi", },
        ],
        menus: [
            { name: "my_address", text: "收货地址", link: "pages/user/address/index", icon: "icon-shouhuodizhi", },
            { name: "wechat_clear", text: "清除缓存", link: "wechat_clear", icon: "icon-duoguan-qingchuhuancun", }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 跳转页面
     */
    onNavigateTap: function (e) {
        const dataset = e.currentTarget.dataset, url = dataset.url, name = dataset.name;
        if ("wechat_clear" == name) {
            dg.showToast({ title: '正在清理中...', icon: 'loading', duration: 10 });
            dg.clearStorageSync();
            dg.showToast({ title: '清理完成', icon: 'success', duration: 1500 });
        } else {
            dg.navigateTo({ url: url });
        }
    },

    /**
     * 授权页面
     */
    openSetting: function (e) {
        console.log('手动调起授权');
    },

    /**
     * 兼容处理
     */
    openSettingCompatibleWith: function(e) {
        if (!dg.os.isAlipay() && !dg.canIUse("button.open-type.openSetting")) {
            wx.openSetting({
                success: (res) => {
                    console.log('授权成功!');
                },
            })
        }
    },
});