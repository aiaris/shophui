<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big" />
    </div>
    <!-- 绿色蒙版 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  props: ['skuImageList'],
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    handler(event) {
      let mask = this.$refs.mask
      let big = this.$refs.big
      let left = event.offsetX - mask.offsetWidth / 2
      let top = event.offsetY - mask.offsetHeight / 2
      // 约束范围
      if (left <= 0) left = 0
      if (left >= mask.offsetWidth) left = mask.offsetWidth
      if (top <= 0) top = 0
      if (top >= mask.offsetHeight) top = mask.offsetHeight
      // 修改元素的left和top属性值
      mask.style.left = left + 'px'
      mask.style.top = top + 'px'
      big.style.left = -2 * left + 'px'
      big.style.top = -2 * top + 'px'
    }
  },
  computed: {
    imgObj() {
      return this.skuImageList[this.currentIndex] || {}
    }
  },
  mounted() {
    this.$bus.$on('getIndex', (index) => {
      // 修改响应式数据
      this.currentIndex = index
    })
  }
}
</script>

<style scoped>
@import './index.css';
</style>