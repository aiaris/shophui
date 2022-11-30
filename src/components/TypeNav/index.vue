<template>
    <!-- 商品分类导航 -->
    <div class="type-nav">
        <div class="container">
            <div @mouseleave="leaveShow" @mouseenter="enterShow">
                <h2 class="all">全部商品分类</h2>
                <!-- 三级联动过度动画 -->
                <transition name="sort">
                    <div class="sort" v-show="show">
                        <div class="all-sort-list2" @click="goSearch">
                            <div class="item" v-for="(c1,index) in categoryList" :key="c1.categoryId"
                                :class="{cur:currentIndex==index}">
                                <h3 @mouseenter="changeIndex(index)">
                                    <a :data-categoryName="c1.categoryName"
                                        :data-category1Id="c1.categoryId">{{c1.categoryName}}</a>
                                </h3>
                                <!-- 二级三级分类 -->
                                <div class="item-list clearfix" :style="{display:currentIndex==index?'block':'none'}">
                                    <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a :data-categoryName="c2.categoryName"
                                                    :data-category2Id="c2.categoryId">{{c2.categoryName}}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                                                    <a :data-categoryName="c3.categoryName"
                                                        :data-category3Id="c3.categoryId">{{c3.categoryName}}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">尚品汇超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// 这种引入是把lodash全部功能引入
// 最好的方式是按需引入
import _ from 'lodash'
export default {
    name: 'TypeNav',
    data() {
        return {
            // 存储用户鼠标移上哪一个一级分类
            currentIndex: -1,
            show: true
        }
    },
    methods: {
        // 当鼠标离开的时候，让商品分类列表进行隐藏
        leaveShow() {
            this.currentIndex = -1
            if (this.$route.path != '/home') {
                this.show = false
            }
        },
        // 当鼠标移入的时候，让商品分类列表进行展示
        enterShow() {
            if (this.$route.path != '/home') {
                this.show = true
            }
        },
        goSearch(event) {
            // 最好的解决方案就是利用编程式导航加上事件委派
            // 利用事件委派存在的问题1点击一定是a标签2如何获取参数
            // 第一个问题给a标签加上:data-categoryName其余子节点不加
            let element = event.target
            let { categoryname, category1id, category2id, category3id } = element.dataset
            // 如果标签有categoryname那么一定是a标签
            if (categoryname) {
                // 整理路由跳转的参数
                let location = { name: 'search' }
                let query = { categoryName: categoryname }
                // 一级二级三级分类的a标签
                if (category1id) {
                    query.category1Id = category1id
                } else if (category2id) {
                    query.category2Id = category2id
                } else if (category3id) {
                    query.category3Id = category3id
                }
                // 判断：如果路有跳转带params参数，也要传递
                if (this.$route.params) {
                    location.params = this.$route.params
                    // 整理完参数
                    location.query = query
                    this.$router.push(location)
                }
            }
        },
        // 三级联动节流
        // 鼠标进入修改响应式数据currentIndex
        // throttle回调函数别用箭头函数，可能出现this问题
        changeIndex: _.throttle(function (index) {
            // index:鼠标移上某一个一级分类的元素索引值
            this.currentIndex = index
        }, 50),
    },
    // 组件挂载完毕就可以向服务器发请求
    mounted() {
        // 当组件挂载完毕，如果不是home组件,让show变为false
        if (this.$route.path != '/home') {
            this.show = false
        }
    },
    computed: {
        ...mapState({
            // 对象写法右侧需要一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
            // 注入一个参数state，其实即为大仓库数据
            categoryList: state => state.home.categoryList.slice(0, 16)
        })
    }
}
</script>

<style scoped>
@import './index.css';
</style>