<template>
	
	<view class="uni-padding-wrap uni-common-pb">
		<!-- 折叠面板外层列表 -->
		<view class="uni-card" v-for="(list,index) in lists" :key="list.cat_ID">
			<view class="uni-list">
				<view class="uni-list-cell uni-collapse">
					<!-- 外层列表单元格 -->
					<view class="uni-list-cell-navigate uni-navigate-bottom" hover-class="uni-list-cell-hover" :class="list.open ? 'uni-active' : ''"
					 @click="triggerCollapse(index)">
						{{list.cat_name}}
					</view>
					<view class="uni-list uni-collapse" :class="list.open ? 'uni-active' : ''">
						<!-- 折叠面板内层列表 -->
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index2) in lists[index].subCats" :key="item.cat_ID" @click="goDetailPage(index,index2)">
							<!-- 内层单元格 -->
							<view class="uni-list-cell-navigate uni-navigate-right"> {{item.cat_name}} </view>
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
				// open:false,
				lists: []
			}
		},
		
		
		onLoad() {
			uni.showLoading({
				title:'加载中...'
			})
			//============================网络请求================================
			var domain = common.domain
			uni.request({
				url:domain + '/catelist',
				success: (res) => {
					console.log(res.data)
					this.lists = res.data;
					// this.lists = [];
					uni.hideLoading()
				}
			})
		},
		methods: {
			//=======================折叠面板事件================================
			triggerCollapse(e) {
				// 如果没有子类执行
				if (!this.lists[e].subCats) {
					this.goDetailPage(this.lists[e].subCats);
					return;
				}
				for (var i = 0; i < this.lists.length; ++i) {
					if (e === i) {
						this.lists[i].open = !this.lists[e].open;
					} else {
						this.lists[i].open = false;
					}
				}
			},
			//=========================进入列表页============================================
			goDetailPage(index,index2) {
				uni.navigateTo({
					// 将选中行的文本传到列表页
					url: '/pages/index/list?name='+this.lists[index].subCats[index2].cat_name
				})
			}
			
		}
	}
</script>

<style>
	
</style>
