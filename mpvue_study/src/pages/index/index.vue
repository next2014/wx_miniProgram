<template>
  <div class="indexContainer">
      <img class="index_img" src="/static/images/index/cart.jpg" alt="">
      <Button open-type="getUserInfo" @getuserinfo="getUserInfo">点击获取用户信息</Button>
      <p class="userName">hello mpvue</p>
      <div class="goStudy">
          <p>开启小程序之旅</p>
      </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            userInfo: {}
        }
    },
    onLoad(){
        console.log('---onLoad---');
    },
    beforeMount(){
        console.log('---beforeMount----');
        //获取用户登录信息
        wx.getUserInfo({
            success: (data) => {
               console.log(data);
            },
            fail: () => {
                console.log('获取失败');
            }
        })
    },
    mounted(){
        console.log('---mounted----')
    },
    methods: {
        getUserInfo(data){
          console.log(data);
        }
    }
}
</script>
<style>
  page {
    background: #8ed145;
  }
  .indexContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .index_img {
    width: 200rpx;
    height: 200rpx;
    border-radius: 100rpx;
    margin: 100rpx 0;
  }

  .userName {
    font-size: 40rpx;
    font-weight: bold;
    margin: 100rpx 0;
  }

  .goStudy {
    width: 220rpx;
    height: 80rpx;
    border: 1rpx solid #eee;
    font-size: 24rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 10rpx;
  }

  .btn {
    width: 300rpx;
    height: 300rpx;
    border-radius: 150rpx;
    margin:50rpx 0;
    line-height: 300rpx;
    text-align: center;
    font-size: 26rpx;
  }

</style>


