
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
    space_style: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    mode: {
      type: String,
      value: 'item-recombox',
    },
    data:{
      type: Array,
      value:[],
    },
    timeall:{
      type: Array,
      value: [],
    },
    seconds:{
      type: String,
      value: '',
    },
    close_page:{
      type: Boolean,
      value:false
    },
    phone:{
      type: String,
      value: '',
    },
    active_type: {
      type: String,
      value: 1,
    },
    community_config:{
      type: Object,
      value:{}
    }, 
    address_id:{
      type: String,
      value:''
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
    dgShop_detail: function (e) {
      console.log('e',e);
      if(this.data.close_page){
        wx.redirectTo({
          url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id + '&self_address_id=' + e.currentTarget.dataset.address_id
        })
      }else{
        wx.navigateTo({
          url: '/pages/shop/malldetail/malldetail?sid=' + e.currentTarget.id + '&self_address_id=' + e.currentTarget.dataset.address_id,
        })
      }
    },
    //立即购买与加入购物车
    dgShop_is_show_card: function (e) {
      var that = this
      that.setData({ dgShop_goods_property: { 'shop_price': undefined, 'vip_price': undefined, 'g_img_url': '', 'sell_num': undefined, 'last_num': undefined } })
      if (that.data.dgShop_is_show_card) {
        that.setData({ dgShop_is_show_card: false })
      } else {
        //请求商品详情
        that.setData({ dgShop_goods_info:{}})
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
      if (this.data.dgShop_property_select[select.index].item == select.key) {
        return false;
      }
      // 控制标签选中样式
      this.data.dgShop_property_select = JSON.stringify(this.data.dgShop_property_select)
      this.data.dgShop_property_select = JSON.parse(this.data.dgShop_property_select)
      
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
      var goods_price = that.data.dgShop_goods_property[that.data.dgShop_goods_info.price_info.type] > 0 ? that.data.dgShop_goods_property[that.data.dgShop_goods_info.price_info.type] : that.data.dgShop_goods_info.price_info.price;
      requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/DuoguanShopApi/addGoodsCart.html',
        { goods_id: that.data.dgShop_this_goods_id, goods_number: that.data.dgShop_cart_default_number, goods_attr: JSON.stringify(that.data.dgShop_property_select), goods_price: goods_price },
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
      that.triggerEvent('dgShop_goods_add_cart', {}, {})
      wx.showToast({
        title: '添加购物车成功',
        icon: 'success',
        duration: 2000,
        mask: true,
      });
    },
    dgShop_showImg: function (e) {
      console.log(e)
      wx.previewImage({
        current: e.currentTarget.dataset.img,
        urls: [e.currentTarget.dataset.img]
      })
    },
    dgShop_show_more:function(){
      var that = this;
      that.triggerEvent('dgShop_show_more', {}, {})
    },
    //电话
    dgShop_phone: function () {
      var that = this
      wx.makePhoneCall({
        phoneNumber: that.data.phone
      })
    },
    dgShop_colonel_apply:function(){
      wx.navigateTo({
        url: '/pages/shop/audit/audit?type=1'
      })
    },
    dgShop_supplier_apply:function(){
      wx.navigateTo({
        url: '/pages/shop/audit/audit?type=2'
      })
    }
  //end
  }
});

