// pages/user/member/member-recharge/index.js
import {
  duoguan_host_api_url as API_URL,
} from '../../../../utils/data.js';
import requestUtil from '../../../../utils/requestUtil.js';
import listener from '../../../../utils/listener';
import _ from '../../../../utils/underscore.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onPullDownRefresh();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.asPullDownRefresh();
  },

  /**
 * 模拟下拉刷新
 */
  asPullDownRefresh: function () {
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
    requestUtil.get(API_URL + "/index.php?s=/addon/DuoguanUser/CardApi/getRechargeListNew.html", {}, (data) => {
      _(data).map((item) => {
          item.text = "充" + item.condition + "送" + item.money;
          return item;
        });

      this.setData({
        recharge_list: data
      });
    }, this, {
        completeAfter: wx.stopPullDownRefresh
      });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  recharge:function(e){
    var that = this;
    const dataset = e.detail.target ? e.detail.target.dataset : e.currentTarget.dataset;
    const index = dataset.index
    const money = this.data.recharge_list[index].condition //充值金额
    if (requestUtil.isLoading(this.rechargeRQID)) return;
    const url = API_URL + "/index.php?s=/addon/Card/CardApi/recharge.html";
    this.rechargeRQID = requestUtil.get(url, { money: money }, (info) => {  
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
    },this, {
        completeAfter: wx.stopPullDownRefresh
    });
  },
  rechargeBox:function(){
    var is_show = !this.data.is_show
    this.setData({
      is_show : is_show
    })
  },

  /**
   * 金额输入
   */
  onMoneyInput: function (e) {
    var value = e.detail.value, dotIndex = value.indexOf(".");
    if (dotIndex != -1 && value.length - dotIndex > 3) {
      value = value.substring(0, dotIndex + 3);
    }
    if (parseFloat(value) >= 50000) value = "50000";
    return value;
  },
  /**
   * 充值
   */
  onRechargeSubmit: function (e) {
    var that = this;
    const values = e.detail.value;
    if (values.money < 0 || values.money == '') return;
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
          this.setData({
            is_show:false
          })
          that.onPullDownRefresh(); // 触发刷新
        },
        fail: (res) => {
          console.error(res);
        }
      }));
    });
  },
})