<template>
	<view>
        <view >
            <view>
                <video id="myVideo" :src="videourl"
                    @error="videoErrorCallback"
					autoplay='true'></video>
            </view>
           
        </view>
    </view>
</template>

<script>
	// 从文件获取json数据
	var data = require('./common/data.json');
	export default {
		data(){
			return {
				videourl:''
			}
		},
		onLoad() {
			uni.getStorage({
				key:'videourl',
				success: (res) => {
					this.videourl = res.data
				}
			})
		},
		onUnload() {
			uni.removeStorage({
				key:'videourl',
				success() {}
			})
		}
	}
</script>

<style>
	@import url("./common/detail.css");
</style>
