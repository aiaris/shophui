<template>
  <div>
    <!-- 三级联动全局组件：三级联动已经注册全局组件，因此不需要引入 -->
    <TypeNav/>
    <!--列表-->
    <ListContainer></ListContainer>
    <!-- 今日推荐 -->
    <Recommend></Recommend>
    <!-- 商品排行 -->
    <Rank></Rank>
    <!-- 猜你喜欢 -->
    <Like></Like>
    <!-- 楼层 -->
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor"></Floor>
    <!-- 商标 -->
    <Brand></Brand>
  </div>
</template>

<script>
import ListContainer from "./ListContainer/index.vue";
import Recommend from "./Recommend/index.vue";
import Rank from "./Rank/index.vue";
import Like from "./Like/index.vue";
import Floor from "./Floor/index.vue";
import Brand from "./Brand/index.vue";
import { mapState } from 'vuex';
export default {
  components: { ListContainer, Recommend, Rank, Like, Floor, Brand },
  mounted() {
    // 获取floor的数据
    this.$store.dispatch('getFloorList')
  },
  computed: {
    ...mapState({
      floorList:state=>state.home.floorList
      })
    }
}
</script>

<style scoped>

</style>