// pages/user/bindMobile/bindMobile.js
import dg from '../../../utils/dg.js';
import request from '../../../utils/requestUtil.js';
import _DuoguanData, { duoguan_host_api_url as API_HOST } from '../../../utils/data.js';
import listener from '../../../utils/listener.js';
import _ from '../../../utils/underscore.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAli: dg.os.isAlipay(),
        baseUrl: API_HOST + '/index.php/addon/DuoguanUser',
        action: 'bind', // 'bind'绑定 或 'edit'编辑 用户手机号
        mobile: '', // 返回的手机号
        input_mobile: '', // 输入的手机号
        input_mobile_disabled: false,
        message_auth_code: '', // 输入短信验证码
        reload_verify_time: '获取验证码',
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
        let mobile = this.data.mobile;
        this.fireEventListener(mobile != '' ? {mobile: mobile} : {});
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
    //   onShareAppMessage: function () {

    //   },

    /**
     * 初始化
     */
    init: function (options) {
        let action = options.action == 'bind' ? 'bind' : 'edit';
        dg.setNavigationBarTitle({
            title: action == 'bind' ? '绑定用户手机号' : '更新用户手机号'
        });
        this.setData({
            action: action
        });
    },

    /**
     * 绑定用户信息
     */
    bindUserMobile: function(e) {
        if (!e.detail.encryptedData) return ;
        
        let that = this;
        dg.authLogin({
            success: function(res) {
                let requestUrl = that.data.baseUrl + '/CardApi/openCardByWechatPhone.html';
                let requestData = {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    code: res.code,
                    name: '',
                    ver: '0.0.1',
                    is_open_card: 'no', // 兼容参数                    
                };

                request.post(requestUrl, requestData, function(info){
                    // 不做处理
                }, that, {
                    isShowLoading: true, loadingText: '获取中', completeAfter: function(res){
                        let data = res.data.data;
                        if (data.phone) {
                            that.save(data.phone, that);
                        }
                    }
                });
            },
        });
    },

    /**
     * 触发input事件
     */
    input: function (e) {
        let field = e.target.dataset.field;
        let value = e.detail.value;
        let info = {};
        if (field == 'input_mobile') {
            info.input_mobile = value;
        } else if (field == 'message_auth_code') {
            info.message_auth_code = value;
        }
        this.setData({
            ...info,
        });
    },

    /**
     * 提交保存
     */
    submit: function (e) {
        let that = this;
        let requestUrl = this.data.baseUrl + "/MobileApi/verifySmsCode.html";
        let requestData = {
            phone: this.data.input_mobile,
            code: this.data.message_auth_code,
        };
        request.get(requestUrl, requestData, function(res){
            // 此处不处理
        }, this, {
            isShowLoading: true, loadingText: '验证中', completeAfter: function (res) {
                let data = res.data.data;
                if (data.phone) {
                    that.save(data.phone, that);
                }
            }
        });
    },

    /**
     * 获取手机验证码
     */
    getVerifyCode: function (e) {
        let that = this;
        let requestUrl = this.data.baseUrl + '/CardApi/sendPhoneVerifyCode.html';
        let requestData = {
            phone: this.data.input_mobile
        };
        request.post(requestUrl, requestData, function(res){
            dg.showToast({ title: '验证码发送成功，请注意查收！', });
            let reload_verify_time = 60;
            that.setData({
                input_mobile_disabled: true,
            })
            const handler = () => {
                if (reload_verify_time > 0) {
                    that.setData({
                        reload_verify_time: reload_verify_time--
                    });
                    setTimeout(handler, 1000);
                } else {
                    that.setData({
                        reload_verify_time: "获取验证码",
                        input_mobile_disabled: false,
                    });
                }
            };
            handler();
        });
    },

    /**
     * 触发监听器
     * @param info {mobile: '18812341234'}
     */
    fireEventListener: function (info) {
        listener.fireEventListener('user.mobile.action', [info]);
        // dg.navigateBack();
    },

    /**
     * 保存起来
     */
    save: function (mobile, that) {
        mobile = mobile || "";
        if (mobile != "") {
            let requestUrl = that.data.baseUrl + "/MobileApi/info";
            let requestData = { mobile: mobile, request_method: 'patch'};
            request.post(requestUrl, requestData, function(info){
                // 不做处理
            }, that, {
                isShowLoading: true, loadingText: '保存中', completeAfter: function (res) {
                    let data = res.data.data;
                    if (data.phone) {
                        that.setData({
                            mobile: data.phone,
                        })
                        dg.showToast({
                            title: '保存成功',
                            duration: 4000,
                            complete: function(res) {
                                dg.navigateBack();
                            }
                        })
                    }
                }
            });
        }
    },
})