import Vue from 'vue'
import App from './App.vue'
// 三级联动组件--全局组件
import TypeNav from '@/components/TypeNav'
// 轮播图全局组件
import Carousel from '@/components/Carousel'
// 分页器组件
import Pagination from '@/components/Pagination'
// 第一个参数是全局组件的名字第二个参数是哪一个组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Carousel.name,Carousel)
Vue.component(Pagination.name,Pagination)
// 引入路由
import router from '@/router'
// 引入仓库
import store from "@/store"
// 引入mockserve.js
import "@/mock/mockServe"
// yinruswiper样式
import 'swiper/dist/css/swiper.css'
// 统一接收api文件夹里面的全部请求函数
// 统一引入
import * as API from '@/api'
// elementui按需引入
import { MessageBox } from 'element-ui'
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
// 引入图片懒加载
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
loading: require("./assets/lazylogo.png"), // 懒加载默认图片
});



// 引入表单验证效验插件
import "@/plugins/validate"
new Vue({
  render: h => h(App),
  // 配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus=this
    Vue.prototype.$API=API
  },
  // 注册路由:底下写法是key-value一致，省略value[router是小写]
  // 注册路由信息：当这里书写router的时候，组件身上都有$router,$route属性
  router,
  // 注册仓库:组件实例身上会多一个$store属性
  store
}).$mount('#app')
