<template>
	<view class="page">
		<page-head :title="title"></page-head>
		<view class="uni-product-list">
			<view class="uni-product" v-for="(product,index) in productList" :key="product.cat_ID">
				<view class="image-view">
					<image @click="imgClick(product)" v-if="renderImage" class="uni-product-image" :src="product.image"></image>
				</view>
				<view class="uni-product-title">{{product.cat_name}}</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import common from '../../common/common.js'
export default {
    data() {
        return {
            title: 'product-list',
			productList: [],
            renderImage: false,
			
        };
    },

	onLoad() {
		
	    this.loadData();
	    setTimeout(()=> {
	        this.renderImage = true;
	    }, 300);
	},
	onPullDownRefresh() {
// 	    this.loadData('refresh');
// 	    // 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
// 	    setTimeout(() => {
// 	        uni.stopPullDownRefresh();
// 	    }, 2000);
	},
	onReachBottom() {
	    this.loadData();
	},
    methods: {
		// =========================点击图片进入列表页======================================
		imgClick:function(e){
			console.log(e.cat_ID);
			uni.navigateTo({
				url:'list?cat_ID='+e.cat_ID
			})
		},
		// ==========================加载数据==============================================
        loadData(action = 'add') {
			// var datajson = require('./common/data.json');
			uni.showLoading({
				title: '加载中',
				mask: false
			});
			uni.request({
				url:common.domain + '/video/catelist',
				success: (res) => {
					this.productList = res.data;
					uni.hideLoading()
				}
			})
        }
    },
    
};
</script>

<style>
	@import url("/common/video.css");
</style>
