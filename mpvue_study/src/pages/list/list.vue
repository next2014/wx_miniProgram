<template>
 <div class="listContainer">
  <swiper indicator-dots indicator-color="pink" indicator-active-color="green">
    <swiper-item>
      <img src="/static/images/detail/carousel/01.jpg" alt="">
    </swiper-item>
    <swiper-item>
      <img src="/static/images/detail/carousel/02.jpg" alt="">
    </swiper-item>
    <swiper-item>
      <img src="/static/images/detail/carousel/03.jpg" alt="">
    </swiper-item>
    <swiper-item>
      <img src="/static/images/detail/carousel/04.jpg" alt="">
    </swiper-item>
  </swiper>
  <div>
      <ListTmp />
  </div>
 </div>
</template>
<script>
    import ListTmp from '../list_template/list_template.vue'
    export default {
        components: {ListTmp}
    }
</script>
<style>
  .listContainer swiper {
      width: 100%;
      height:  400rpx;
  }

  .listContainer swiper img {
      width: 100%;
      height: 100%;
  }
</style>

