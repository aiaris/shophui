<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口 -->
    <router-view></router-view>
    <!-- 在Home、Search是显示的，在登录注册隐藏 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from './components/Header/index.vue';
import Footer from './components/Footer/index.vue';
export default {
  components: { Header, Footer },
  mounted() {
    // 通知Vuex发请求，获取数据，存储于仓库当中
    // 派发action获取商品分类的三级列表数据
    this.$store.dispatch('categoryList')
  }
}
</script>

<style>

</style>
