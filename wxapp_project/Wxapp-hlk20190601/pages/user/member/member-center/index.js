// pages/user/member/member-center/index.js
import {
  duoguan_host_api_url as API_URL,
} from '../../../../utils/data.js';
import requestUtil from '../../../../utils/requestUtil.js';
import listener from '../../../../utils/listener';
import _ from '../../../../utils/underscore.js';
const wxParse = require('../../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recharge: {
      data: [],
      show: false
    },
    conditions_index: 0, // 默认值
    open_card_info: {
      phone: '', // 开通会员时的手机号
      isDisabled: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onPullDownRefresh();
    listener.addEventListener('user.recharge', this.onRechargeChange);
  },

  /**
   * 余额被改变
   */
  onRechargeChange: function(recharge) {
    this.data.card.recharge = recharge;
    this.setData({
      card: this.data.card
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.asPullDownRefresh();
  },

  /**
   * 模拟下拉刷新
   */
  asPullDownRefresh: function() {
    requestUtil.get(API_URL + "/index.php?s=/addon/DuoguanUser/CardApi/getInfo.html", {}, (info) => {
      // 计算折扣
      let discount = (100 - parseFloat(info.level.discount || 1)).toString();
      let length = discount.length;
      info.level.discount_text = discount.substring(0, length - 1) + '.' + discount.substring(length - 1, length);

      this.setData({
        card: info
      });
    }, this, {
      completeAfter: wx.stopPullDownRefresh
    });
    requestUtil.get(API_URL + "/index.php?s=/addon/DuoguanUser/CardApi/getRechargeList.html", {}, (data) => {
      _(data).map((item) => {
        _(item.conditions).map((items) => {
          items.text = "充" + items.condition + "送" + items.money;
          items.conditions_index = 0;
          return items;
        });
        return item
      })
      this.setData({
        recharge_list: data
      });
    }, this, {
      completeAfter: wx.stopPullDownRefresh
    });
    requestUtil.get(API_URL + "/index.php?s=/addon/DuoguanUser/CardApi/getOtherConfig.html", {}, (data) => {
      this.setData({
        other_config: data
      });
      wxParse.wxParse('description', 'html', data.content, this);
    }, this, {
        completeAfter: wx.stopPullDownRefresh
      });
  },

  /**
   * 设置Page data 中的值
   */
  onSetValueTap: function(e) {
    const dataset = e.currentTarget.dataset,
      name = dataset.name,
      isMulti = dataset.isMulti || false;
    if (isMulti) {
      let values = JSON.parse(dataset.value);
      if (name) {
        const data = {};
        data[name] = Object.assign(this.data[name], values);
        this.setData(data);
      } else {
        for (let x in values) {
          values[x] = Object.assign(this.data[x] || {}, values[x]);
        }
        this.setData(values);
      }
    } else {
      const value = dataset.value;
      const data = {};
      data[name] = value;
      this.setData(data);
    }
  },

  /**
   * 金额输入
   */
  onMoneyInput: function(e) {
    var value = e.detail.value,
      dotIndex = value.indexOf(".");
    if (dotIndex != -1 && value.length - dotIndex > 3) {
      value = value.substring(0, dotIndex + 3);
    }
    if (parseFloat(value) >= 100000) value = "100000";
    return value;
  },
  /**
   * 关闭开通会员弹出框（开通会员卡2.0使用）
   */
  closeOpenCardPopUpBox: function(e) {
    let card = this.data.card;
    card.show = false;
    this.setData({
      card: card
    });
  },
  /**
 * 输入用户名称（开通会员卡2.0使用）
 */
  inputName: function (e) {
    let value = e.detail.value;
    this.card_name = value;
    let open_card_info = this.data.open_card_info;
    open_card_info.card_name = value;
    open_card_info.isDisabled = value.length >= 2 ? true : false;

    this.setData({
      open_card_info: open_card_info,
    });
  },
  /**
 * 获取手机号码
 */
  onGetPhoneNumber: function (e) {

    let that = this;

    if (!e.detail.encryptedData) {
      if (this.data.open_card_version == '2') {
        util.userMobile("bind", function (res) {
          let open_card_info = that.data.open_card_info;
          open_card_info.isDisabled = true;
          if (res.mobile) {
            that.phone = res.mobile;
            open_card_info.phone = res.mobile;
            that.setData({
              open_card_info: open_card_info,
            });
            that.onOpenTap();
          } else {
            // 获取手机号失败
            that.setData({
              open_card_info: open_card_info,
            });
          }
        });
      }
      return;
    }

    const handler = (code) => {
      const url = API_URL + '/index.php?s=/addon/DuoguanUser/CardApi/openCardByWxPhone.html';
      requestUtil.post(url, {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        code: code,
        name: this.card_name || '',
        ver: '0.0.1',
        is_open_card: 'no', // 兼容参数
      }, (info) => {
        // this.session_key = info.session_key;

        // wx.showToast({ title: '开卡成功！' });
        // const card_info = this.data.card_info;
        // card_info.show = false;
        // card_info.status = 1;
        // this.setData({ card_info: card_info });
      }, this, {
        isShowLoading: true, loadingText: '获取中', completeAfter: function (res) {
          // 兼容处理 此次为兼容支付宝小程序
          let info = res.data.data;

          let open_card_info = this.data.open_card_info;
          open_card_info['phone'] = info['open_card_status'] == 'no' ? info['phone'] : open_card_info['phone'];
          open_card_info['isDisabled'] = this.data.open_card_version == "2" ? true : false;

          this.phone = open_card_info['phone']; // 兼容处理onInputValue方法

          this.setData({
            open_card_info: open_card_info,
          });
          this.onOpenTap();
        
        }
        });
    };
    handler()
  },
  /**
 * 开卡操作
 */
  onOpenTap: function () {
    const url = API_URL + '/index.php?s=/addon/DuoguanUser/CardApi/openCard.html';
    requestUtil.post(url, {
      phone: this.phone,
      code: this.verify_code,
      name: this.card_name || '',
      ver: '0.0.1',
      open_card_version: this.data.open_card_version, // 兼容处理
    }, (info) => {
      wx.showToast({ title: '开卡成功！', duration: 2500 });
      const card = this.data.card;
      card.show = false;
      card.status = 1;

      this.setData({ card: card });
    });
  },

  /**
   * 充值
   */
  onRechargeSubmit: function(e) {
    const values = e.detail.value;
    let that = this
    requestUtil.pushFormId(e.detail.formId);
    if (requestUtil.isLoading(this.rechargeRQID)) return;

    const url = API_URL + "/index.php?s=/addon/Card/CardApi/recharge.html";
    this.rechargeRQID = requestUtil.get(url, values, (info) => {
      wx.requestPayment(_.extend(info, {
        success: (res) => {
          wx.showToast({
            title: '充值成功！',
            duration: 1500,
          });
          let recharge = this.data.recharge;
          recharge.show = false;
          that.setData({
            recharge: recharge,
          });
          that.asPullDownRefresh(); // 触发刷新

        },
        fail: (res) => {
          console.error(res);
        }
      }));
    },this);
  },

  /**
   * 跳转页面
   */
  onNavigateTap: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  /**
   * 充值活动选择
   */
  onRechargeSelect: function(e) {
    const dataset = e.detail.target.dataset,
      index = dataset.index;
    requestUtil.pushFormId(e.detail.formId);
    if (requestUtil.isLoading(this.rechargeSelectID)) return;

    const conditions = this.data.recharge_list[index].conditions;
    if (conditions.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '无法充值这个活动',
        showCancel: false,
      });
      return;
    }
    if (conditions.length == 1) { // 普通赠送
      this.recharge(conditions, 0);
    }
  },

  /**
   * 充值
   */
  recharge: function(conditions, index) {
    let that = this;
    let money = conditions[index].condition; // 充值金额
    let reward_id = conditions[index].reward_id; // 充值条件
    let condition_id = conditions[index].id; // 充值条件

    const url = API_URL + "/index.php?s=/addon/Card/CardApi/recharge.html";
    this.rechargeRQID = requestUtil.get(url, {
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
          let recharge = this.data.recharge;
          recharge.show = false;
          that.setData({
            recharge: recharge,
          });
          that.asPullDownRefresh(); // 触发刷新
        },
        fail: (res) => {
          console.error(res);
        }
      }));
    });
  },

  /**
   * 选择器事件
   */
  bindPickerChange: function(e) {
    let dataset = e.currentTarget.dataset,
      index = dataset.index,
      value = e.detail.value;
    const conditions = this.data.recharge_list[index].conditions;
    if (conditions.length == 0 || value >= conditions.length) {
      wx.showModal({
        title: '温馨提示',
        content: '无法充值这个活动',
        showCancel: false,
      });
      return;
    }
    // 多级赠送
    this.recharge(conditions, value);
  },
});