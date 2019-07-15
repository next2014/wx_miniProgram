var app = getApp();
var requestUtil = require('../../../../utils/requestUtil');
var _DuoguanData = require('../../../../utils/data');
Component({
	/**
	 * 组件的属性列表
	 */
    properties: {
        ad_type:{
            type:String,
            value:'',
            observer: function (newVal, oldVal, changedPath){
                this.get_ad_api(newVal);
            }
        }
    },

	/**
	 * 组件的初始数据
	 */
    data: {
        this_is_show:false,
        this_ad_id:''
    },

	/**
	 * 组件已创建事件
	 */
    methods:{
        get_ad_api: function (ad_type) {
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DgPromotion/Api/getAdId.html', { ad_type: ad_type }, (info) => {
                this.setData({this_ad_id: info, this_is_show:true});
            }, this);
        }
    }
});
