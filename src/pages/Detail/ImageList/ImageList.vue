<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(slide,index) in skuImageList" :key="slide.id">
        <img :src="slide.imgUrl" :class="{active:currentIndex==index}" @click="changeCurrentIndex(index)">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import 'swiper/dist/js/swiper'
import Swiper from "swiper"
export default {
  name: "ImageList",
  props: ['skuImageList'],
  data() {
    return {
      currentIndex:0
    }
  },
  methods: {
    changeCurrentIndex(index) {
      this.currentIndex = index
      // 通知兄弟组件当前索引
      this.$bus.$emit('getIndex',index)
    }
  },
  watch: {
    // 监听skuImageList数据的变化
    skuImageList(newValue, oldValue) {
      // 因为dispatch当中涉及到异步语句，导致v-for遍历的时候结构还没有完全因此不行
      // netxTick:在下次DOM更新循环结束之后在修改数据后立即使用这个方法获取更新后的DOM
      this.$nextTick(() => {
        // 当执行回调的时候保证服务器数据回来v-for执行完毕
        new Swiper(this.$refs.cur, {
          // 如果需要前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          // 一页显示的图片数量
          slidesPerView: 3,
          // 定义一组的数量
          slidesPerGroup:1,
        })
      })
    }
  },
}
</script>

<style scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;
}

.swiper-container .swiper-slide {
  width: 56px;
  height: 56px;
}

.swiper-container .swiper-slide img {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  padding: 2px;
  width: 50px;
  height: 50px;
  display: block;
}

.swiper-container .swiper-slide img.active {
  border: 2px solid #f60;
  padding: 1px;
}

/* .swiper-container .swiper-slide img:hover {
  border: 2px solid #f60;
  padding: 1px;
} */

.swiper-container .swiper-button-next {
  left: auto;
  right: 0;
}

.swiper-container .swiper-button-prev {
  left: 0;
  right: auto;
}

.swiper-container .swiper-button-next,
.swiper-container .swiper-button-prev {
  box-sizing: border-box;
  width: 12px;
  height: 56px;
  background: #ebebeb;
  border: 1px solid #cccccc;
  top: 0;
  margin-top: 0;
}

.swiper-container .swiper-button-next::after,
.swiper-container .swiper-button-prev::after {
  font-size: 12px;
}
</style>