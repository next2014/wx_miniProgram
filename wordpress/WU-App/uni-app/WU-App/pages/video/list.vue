<template>
	<view class="page">
		
		<uni-list v-for="(item,index) in list" :key='item.cat_ID'>
			<uni-list-item :title="item.post_title" @click='tapCell(item.videoURL)'></uni-list-item>
			
		</uni-list>
		
		
	</view>	
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import common from '../../common/common.js'
	export default{
		components: {uniList,uniListItem},
		data(){
			return {
				list:[]
			}
		},
		onLoad(option) {
			uni.request({
				url:common.domain + '/video/posts?cat_ID='+option.cat_ID+'&limit=-1&page=0',
				method:'GET',
				success: (res) => {
					this.list = res.data
				}
			})
		},
		methods:{
			tapCell(videourl){
				uni.setStorage({
					key:'videourl',
					data:videourl,
					success: () => {
						uni.navigateTo({
							url:'detail'
						})
					}
				})
			}
		}
		
	}
	
</script>

<style>
	
</style>
