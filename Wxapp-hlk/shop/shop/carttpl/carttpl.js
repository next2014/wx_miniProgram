import _ from '../../../utils/underscore.js';
const BASE_PAGE = {
    test:()=>{
  },
  // 关闭购物车
  set_close: function () {
    this.setData({
      is_show_card: false
    })
  },
//加载商品详情
  initGoodsInfoData: function (data) {
    var that = this
    var max_price = 0;
    var min_price = 0;
    data.propertydata = data.propertydata ? data.propertydata : new Array()
    if (data.propertydata.length > 0 && data.property != null) {
      //商品属性价格不为空,找到商品属性价格中的最高和最低
      var price = '';
      var prices = new Array();
      // prices.push(parseFloat(data.shop_price));
      for (var key in data.propertydata) {
        var newP = data.propertydata[key][data.price_info.type];
        newP = parseFloat(newP)
        prices.push(newP);
      }
      prices.sort(function (a, b) { return a - b; });
      var min_price = data.price_info.price;
      var max_price = prices[prices.length - 1].toFixed(2);
      if (max_price == min_price) {
        price = max_price;
      } else {
        price = min_price + "~" + max_price;
      }
    } else {
      price = data.price_info.price
    }
    that.setData({
      goods_info: data,
      property_select: data.property,
      cart_show_price: price
    })
  },
  //修改数量
  change_cart_number: function (e) {
    var that = this
    var value = e.detail.value
    var re = /^[0-9]+$/;
    if (!re.test(value) || value < 1) {
      value = 1
    }
    if (that.data.goods_info.buy_num >= 0) {
      if (value > that.data.goods_info.buy_num) {
        value = that.data.goods_info.buy_num * 1
      }
    }
    if (value > that.data.goods_info.g_number * 1) {
      value = that.data.goods_info.g_number
    }
    that.setData({ cart_default_number: value })
  },
  //属性选择
  select_attr_bind: function (e) {
    var select = e.currentTarget.dataset
    // 控制标签选中样式
    this.data.property_select[select.index].item = select.key
    this.setData({ property_select: this.data.property_select })
    // 控制商品信息显示
    var num
    if (this.data.property_select.length == 4) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length, this.data.property_select[1].item, this.data.goods_info.property[1].item.length, this.data.property_select[2].item, this.data.goods_info.property[2].item.length, this.data.property_select[3].item, this.data.goods_info.property[3].item.length)
    } else if (this.data.property_select.length == 3) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length, this.data.property_select[1].item, this.data.goods_info.property[1].item.length, this.data.property_select[2].item, this.data.goods_info.property[2].item.length)
    } else if (this.data.property_select.length == 2) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length, this.data.property_select[1].item, this.data.goods_info.property[1].item.length)
    } else if (this.data.property_select.length == 1) {
      num = this.num(this.data.property_select[0].item, this.data.goods_info.property[0].item.length)
    }
    //获取对应属性商品信息
    if (this.data.goods_info.propertydata[num] != undefined) {
      this.setData({
        cart_show_price: parseFloat(this.data.goods_info.propertydata[num][this.data.goods_info.price_info.type]).toFixed(2)
      });
      this.data.goods_property.g_img_url = this.data.goods_info.propertydata[num].goods_img
      this.data.goods_property.sell_num = this.data.goods_info.propertydata[num].sell_num
      this.data.goods_property.last_num = this.data.goods_info.propertydata[num].last_num
      this.data.goods_property.shop_price = this.data.goods_info.propertydata[num].shop_price > 0 ? this.data.goods_info.propertydata[num].shop_price : this.data.goods_info.shop_price
      this.data.goods_property.vip_price = this.data.goods_info.propertydata[num].vip_price > 0 ? this.data.goods_info.propertydata[num].vip_price : this.data.goods_info.vip_price
      this.data.goods_property.promote_price = this.data.goods_info.propertydata[num].promote_price > 0 ? this.data.goods_info.propertydata[num].promote_price : this.data.goods_info.promote_price
      this.setData({ goods_property: this.data.goods_property, property_num: num })
    }
  },
  //减少数量
  bind_cart_number_jian: function () {
    var that = this
    var this_default_number = parseInt(that.data.cart_default_number)
    if (this_default_number > 1) {
      that.setData({
        cart_default_number: this_default_number - 1
      })
    } else {
      that.setData({
        cart_default_number: 1
      })
    }
  },
  //增加数量
  bind_cart_number_jia: function () {
    var that = this
    var this_default_number = parseInt(that.data.cart_default_number)
    that.setData({
      cart_default_number: this_default_number + 1
    })
  },
  //购物车
  initAddCartData: function (data) {
    var that = this;
    wx.hideToast();
    that.setData({
      btn_add_cart_disabled: false,
      is_show_card: false
    });
    wx.showToast({
      title: '添加购物车成功',
      icon: 'success',
      duration: 2000,
      mask: true,
    });
  },
  //属性选择
  select_attr_bind_old: function (e) {
    var that = this
    var this_attr_id = e.currentTarget.id
    var this_attr_name = e.currentTarget.dataset.type
    var datas = that.data.goods_specification
    var this_spec_price = 0;
    var a_datas = that.data.goods_attr_select
    var g_datas = that.data.goods_info
    var shop_attr_price = that.data.shop_attr_price
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
        shop_attr_price[i] = this_shop_price
        that.setData({
          shop_attr_price: shop_attr_price
        })
      }
      if (that.data.shop_attr_price[i]) {
        all_shop_price = that.data.shop_attr_price[i] * 1 + all_shop_price * 1
        all_shop_price = all_shop_price.toFixed(2);
      }
    }

    if (all_shop_price > 0) {
      g_datas.shop_price = all_shop_price
    }
    that.setData({
      goods_specification: datas,
      goods_attr_select: a_datas,
      goods_info: g_datas
    })
  },
}
function Page2(obj) {
  Page(_.extend({},BASE_PAGE, obj));
}
module.exports = Page2;