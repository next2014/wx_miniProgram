
import requestUtil from '../../../../utils/requestUtil';
import _DuoguanData from '../../../../utils/data';
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    mode: {
      type: String,
      value: 'seckillListBox',
    },
    data:{
      type: Object,
      value:{},
    },
    close_page:{
      type: Boolean,
      value:false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },

  ready() {
    !this.data.lazy && this.onPullDownRefresh();

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPullDownRefresh(callback) {
      callback && callback();
    },
    //获取formID
    pushFormId: function (e) {
      requestUtil.pushFormId(e.detail.formId);
    },

    navigateTo: function (e) {
      if (this.data.data.seckill_config.is_today == 0) {
        return
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    },
  

  //end
  }
});

