// pages/user/company/index.js
import requestUtil from '../../../utils/requestUtil';
import wxParse from '../../../wxParse/wxParse.js'
import {
	duoguan_host_api_url as API_URL
} from "../../../utils/data";

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

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
		requestUtil.get(API_URL + "/index.php?s=/addon/DuoguanUser/Api/getCompany.html", {}, (res) => {
			res.isLoaded = true;
			this.setData(res);
			wxParse.wxParse('content', 'html', res.content, this) // 处理富文本
		}, this, { completeAfter: wx.stopPullDownRefresh });
	},

	/**
	 * 拨打电话
	 */
	onCallPhoneTap: function () {
		wx.makePhoneCall({
			phoneNumber: this.data.tel,
		});
	},

	/**
	 * 复制信息
	 */
	onCopyTap: function (e) {
		const dataset = e.currentTarget.dataset, value = dataset.value;
		wx.setClipboardData({
			data: value,
			success: function (res) {
				wx.showToast({ title: '复制成功！' });
			}
		});
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

  // 更新距离顶部像素距离
  updateTabOffsetTop() {
    const selectorQuery = wx.createSelectorQuery();
    selectorQuery.select('#leavmsg').boundingClientRect();
    selectorQuery.selectViewport().scrollOffset();
    selectorQuery.exec((res) => {
      if (!res[0] || !res[1]) return;
      if (res[1].scrollTop > 0) {
        if (res[0].top > 0) {
          this.tabOffsetTop = res[1].scrollTop + res[0].top;
        } else {
          this.tabOffsetTop = (res[1].scrollTop - Math.abs(res[0].bottom)) + res[0].height * 2;
        }
      } else {
        this.tabOffsetTop = res[0].top;
      }
      //滚动到留言位置
      wx.pageScrollTo({
        scrollTop: this.tabOffsetTop,
      })
    });
  },

  //滚动用户留言位置
  toLeavmsg:function(){
    this.updateTabOffsetTop();
  },

  //选择意向
  changeType:function(e){
    const yx_type = e.detail.value;
    this.setData({ 
      yx_type: yx_type
    })
  },

  //用户提交留言
  toLeaving:function(e){
    var that = this;
    const dataset = e.detail, formId = dataset.formId, value = dataset.value;
    requestUtil.pushFormId(formId);//收集formid处理
    
    const formData = value;
    formData.formid = formId;
    formData.yx_type = that.data.yx_type ? that.data.yx_type:'';
    requestUtil.post(API_URL + "/index.php?s=/addon/DuoguanUser/Api/toLeaving.html", formData, (data) => {
      if(data.code==1){
        wx.showToast({
          title: '留言成功',
          icon: 'success',
        })
        setTimeout(function(){
          //重置刷新
          that.setData({
            u_name: '',
            u_phone: '',
            leave_msg: '',
          })
          that.onPullDownRefresh();
        },1000)
      }
      
    }, this, {});
  },

  //提示框
  showModalTips: function (msg, isShowCancel = false) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: isShowCancel,
      success: function (res) {
        return false;
      }
    });
  },

})