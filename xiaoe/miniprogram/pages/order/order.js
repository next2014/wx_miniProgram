// pages/order/order.js
const {Field,extend} = require('../../zanui/index.js');

Page(extend({},Field,{
  data: {
    array: [{
      price: '¥49.80',
      num: '2',
      desc: '布伦南一家刚刚从澳大利亚南部的塔斯马尼亚搬到北部的莫维伦巴。',
      title: '悠长的告别'
    }],
    value:{
       title: '优惠券',
       type: 'input',
       placeholder: '请输入您的优惠码',
       inputType: 'number',
       name:'code'
    }
  }
}))