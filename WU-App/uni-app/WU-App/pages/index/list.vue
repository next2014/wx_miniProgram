<template>
	<view>
		<!-- 轮播图 -->
		<swiper class="screen-swiper" :class="'square-dot'" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item,index) in swiperList" :key="item.ID" @click="gobannerDetail(index)">
				<image :src="item.icon" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- 文章列表 -->
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in listData" :key="value.ID" @click="goDetail(value)">
				<view class="uni-media-list">
					<!-- 缩略图 -->
					<image class="uni-media-list-logo" :src="value.icon"></image>
					<view class="uni-media-list-body">
						<!-- 标题 -->
						<view class="uni-media-list-text-top">{{value.post_title}}</view>
						<!-- 作者和发布时间 -->
						<view class="uni-media-list-text-bottom">
							<text>{{value.author}}</text>
							<text>{{value.post_date}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from '../../common/common.js'

	export default {
		data() {
			return {
				banner: {},
				listData: [],
				last_id: "",
				reload: false,
				page:0,
				pageSize:10,
				swiperList: [],
				serchName:''
			}
		},
		onLoad(option) {
			this.serchName = option.name;
			this.getBanner();
			this.getList(this.serchName);
		},
		//======================监听用户下拉动作============================================
		onPullDownRefresh() {
			this.reload = true;
			this.last_id = "";
			this.getBanner();
			this.getList();
		},
		//======================页面上拉触底事件的处理函数=====================================
		onReachBottom() {
			this.getList(this.serchName);
		},
		methods: {
			//======================进入banner详情============================================
			gobannerDetail(index){
				uni.navigateTo({
					url:'detail?url='+this.swiperList[index].guid
				})
			},
			//======================获取banner列表============================================
			getBanner() {
				uni.request({
					url:common.domain+'/bannerlist',
					success: (res) => {
						// console.log('=============>>'+JSON.stringify(res.data['data']));
						this.swiperList = res.data;
					}
				})
			},
			//======================获取文章列表============================================
			getList(cateName) {
				var domain = common.domain
				uni.request({
					url:domain + '/articlelist?cat_name='+cateName+'&limit='+this.pageSize+'&page='+this.page,
					method:"GET",
					success: (res) => {
						let list = res.data
						this.listData = this.reload ? list : this.listData.concat(list)
						this.reload = false
						this.page+=1
					}
				})
			},
			//======================进入详情页============================================
			goDetail: function (e) {
				uni.navigateTo({
					url:'detail?url='+e.guid
				})
			},
			
		},
	}
</script>

<style>
	/* colorUI */
	@import "../../common/colorui/main.css";
	@import "../../common/colorui/icon.css";
	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}

	.uni-media-list-logo {
		width: 180upx;
		height: 140upx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
