<template>
  <div>
    <!-- 三级列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑，带有x的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i
                @click="removeCategoryName">×</i></li>
            <!-- 关键字面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyword">×</i></li>
            <!-- 品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(":")[1] }}<i
                @click="removeTradeMark">×</i></li>
            <!-- 平台售卖属性面包屑 -->
            <li class="with-x" v-for="(attrValue, index) in searchParams.props" :key="index">
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i></li>
          </ul>
        </div>

        <!--selector子组件-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--排序结构-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a>综合
                    <span v-show="isOne" class="iconfont" :class="{ 'icon-DOWN': isDesc, 'icon-UP': isAsc }"></span>
                  </a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a>价格
                    <span v-show="isTwo" class="iconfont" :class="{ 'icon-DOWN': isDesc, 'icon-UP': isAsc }"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转时带参数 -->
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">
                      {{ good.title }}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" continues="5"
            @getPageNo="getPageNo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SearchSelector from './SearchSelector'
export default {
  name: 'Search',
  components: {
    SearchSelector
  },
  data() {
    return {
      // 带给服务器的数据
      searchParams: {
        // 一级分类id
        category1Id: "",
        // 二级分类id
        category2Id: "",
        // 三级分类id
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 关键字
        keyword: "",
        // 排序初始状态应该是综合降序
        order: "1:desc",
        // 分页器
        pageNo: 1,
        // 每一页展示数据个数
        pageSize: 5,
        // 平台售卖属性带的参数
        props: [],
        // 品牌
        trademark: ""
      }

    }
  },
  computed: {
    ...mapState({
      total: state => state.search.searchList.total
    }),
    // mapGetters里面的写法传递的数组，因为getters计算是不分模块的
    ...mapGetters(['goodsList']),
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
  },
  beforeMount() {
    // 发请求之前要带给服务器数据
    // Object.assign:es6新增语法合并对象
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 分页器自定义事件
    getPageNo(pageNo) {
      // 整理参数
      this.searchParams.pageNo = pageNo
      this.getData()
    },
    // 改变排序
    changeOrder(flag) {
      // flag综合，代表用户点击的是综合还是价格
      let originFlag = this.searchParams.order.split(':')[0]
      let originSort = this.searchParams.order.split(':')[1]
      // 准备一个新的order的属性值
      let newOrder = ''
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSort == "desc" ? "asc" : "desc"}`
      } else {
        // 点击的是价格
        newOrder = `${flag}:${"desc"}`
      }
      this.searchParams.order = newOrder
      this.getData()
    },
    // 删除平台售卖属性面包屑
    removeAttr(index) {
      // 再次整理参数
      this.searchParams.props.splice(index, 1)
      // 再次发请求
      this.getData()
    },
    // 收集平台属性的回调
    attrInfo(attr, attrValue) {
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
      // 数组去重判断
      if (this.searchParams.props.indexOf(props) == -1) this.searchParams.props.push(props)
      // 再次发请求
      this.getData()
    },
    // 品牌面包屑删除
    removeTradeMark() {
      this.searchParams.trademark = undefined
      this.getData()
    },
    // 自定义事件的回调
    trademarkInfo(trademark) {
      // 整理品牌参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      this.getData()
    },
    // 删除面包屑数据
    // 关键字
    removeKeyword() {
      this.searchParams.keyword = undefined
      this.getData()
      // 通知header组件清空关键字
      this.$bus.$emit('clear')
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query })
      }
    },
    // 名字
    removeCategoryName() {
      // 把带给服务器的参数置空，还需要发请求
      // 带给服务器的参数是可有可无的，如果是空字符串还是会带给服务器
      // 改为undefined就不会带给服务器了
      this.searchParams.categoryName = undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      this.getData()
      // 路由信息也需要清空,进行路由跳转
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params })
      }
    },
    // 向服务器发请求获取search根据参数不同返回不同数据
    // 把请求封装一个函数当需要调用时调用即可
    getData() {
      // 派发action
      this.$store.dispatch('getSearchList', this.searchParams)
    }
  },
  // 监听组件路由信息是否发生变化
  watch: {
    $route(newValue, oldValue) {
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
      // 再次发请求
      this.getData()
      // 每次请求完成应该置空123级分类id
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
    }
  }
}
</script>

<style scoped>
.main {
  margin: 10px 0;
}

.main .py-container {
  width: 1200px;
  margin: 0 auto;
}

.main .py-container .bread {
  margin-bottom: 5px;
  overflow: hidden;
}

.main .py-container .bread .sui-breadcrumb {
  padding: 3px 15px;
  margin: 0;
  font-weight: 400;
  border-radius: 3px;
  float: left;
}

.main .py-container .bread .sui-breadcrumb li {
  display: inline-block;
  line-height: 18px;
}

.main .py-container .bread .sui-breadcrumb li a {
  color: #666;
  text-decoration: none;
}

.main .py-container .bread .sui-breadcrumb li a:hover {
  color: #4cb9fc;
}

.main .py-container .bread .sui-tag {
  margin-top: -5px;
  list-style: none;
  font-size: 0;
  line-height: 0;
  padding: 5px 0 0;
  margin-bottom: 18px;
  float: left;
}

.main .py-container .bread .sui-tag .with-x {
  font-size: 12px;
  margin: 0 5px 5px 0;
  display: inline-block;
  overflow: hidden;
  color: #000;
  background: #f7f7f7;
  padding: 0 7px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #dedede;
  white-space: nowrap;
  transition: color 400ms;
  cursor: pointer;
}

.main .py-container .bread .sui-tag .with-x i {
  margin-left: 10px;
  cursor: pointer;
  font: 400 14px tahoma;
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.main .py-container .bread .sui-tag .with-x:hover {
  color: #28a3ef;
}

.main .py-container .details {
  margin-bottom: 5px;
}

.main .py-container .details .sui-navbar {
  overflow: visible;
  margin-bottom: 0;
}

.main .py-container .details .sui-navbar .filter {
  min-height: 40px;
  padding-right: 20px;
  background: #fbfbfb;
  border: 1px solid #e2e2e2;
  padding-left: 0;
  border-radius: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);
}

.main .py-container .details .sui-navbar .filter .sui-nav {
  position: relative;
  left: 0;
  display: block;
  float: left;
  margin: 0 10px 0 0;
}

.main .py-container .details .sui-navbar .filter .sui-nav li {
  float: left;
  line-height: 18px;
}

.main .py-container .details .sui-navbar .filter .sui-nav li a {
  display: block;
  cursor: pointer;
  padding: 11px 15px;
  color: #777;
  text-decoration: none;
}

.main .py-container .details .sui-navbar .filter .sui-nav li.active a {
  background: #e1251b;
  color: #fff;
}

.main .py-container .details .goods-list {
  margin: 20px 0;
}

.main .py-container .details .goods-list ul {
  display: flex;
  flex-wrap: wrap;
}

.main .py-container .details .goods-list ul li {
  height: 100%;
  width: 20%;
  margin-top: 10px;
  line-height: 28px;
}

.main .py-container .details .goods-list ul li .list-wrap .p-img {
  padding-left: 15px;
  width: 215px;
  height: 255px;
}

.main .py-container .details .goods-list ul li .list-wrap .p-img a {
  color: #666;
}

.main .py-container .details .goods-list ul li .list-wrap .p-img a img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

.main .py-container .details .goods-list ul li .list-wrap .price {
  padding-left: 15px;
  font-size: 18px;
  color: #c81623;
}

.main .py-container .details .goods-list ul li .list-wrap .price strong {
  font-weight: 700;
}

.main .py-container .details .goods-list ul li .list-wrap .price strong i {
  margin-left: -5px;
}

.main .py-container .details .goods-list ul li .list-wrap .attr {
  padding-left: 15px;
  width: 85%;
  overflow: hidden;
  margin-bottom: 8px;
  min-height: 38px;
  cursor: pointer;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.main .py-container .details .goods-list ul li .list-wrap .attr a {
  color: #333;
  text-decoration: none;
}

.main .py-container .details .goods-list ul li .list-wrap .commit {
  padding-left: 15px;
  height: 22px;
  font-size: 13px;
  color: #a7a7a7;
}

.main .py-container .details .goods-list ul li .list-wrap .commit span {
  font-weight: 700;
  color: #646fb0;
}

.main .py-container .details .goods-list ul li .list-wrap .operate {
  padding: 12px 15px;
}

.main .py-container .details .goods-list ul li .list-wrap .operate .sui-btn {
  display: inline-block;
  padding: 2px 14px;
  box-sizing: border-box;
  margin-bottom: 0;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 0;
  background-color: transparent;
  margin-right: 15px;
}

.main .py-container .details .goods-list ul li .list-wrap .operate .btn-bordered {
  min-width: 85px;
  background-color: transparent;
  border: 1px solid #8c8c8c;
  color: #8c8c8c;
}

.main .py-container .details .goods-list ul li .list-wrap .operate .btn-bordered:hover {
  border: 1px solid #666;
  color: #fff !important;
  background-color: #666;
  text-decoration: none;
}

.main .py-container .details .goods-list ul li .list-wrap .operate .btn-danger {
  border: 1px solid #e1251b;
  color: #e1251b;
}

.main .py-container .details .goods-list ul li .list-wrap .operate .btn-danger:hover {
  border: 1px solid #e1251b;
  background-color: #e1251b;
  color: white !important;
  text-decoration: none;
}

.main .py-container .details .page {
  width: 733px;
  height: 66px;
  overflow: hidden;
  float: right;
}

.main .py-container .details .page .sui-pagination {
  margin: 18px 0;
}

.main .py-container .details .page .sui-pagination ul {
  margin-left: 0;
  margin-bottom: 0;
  vertical-align: middle;
  width: 490px;
  float: left;
}

.main .py-container .details .page .sui-pagination ul li {
  line-height: 18px;
  display: inline-block;
}

.main .py-container .details .page .sui-pagination ul li a {
  position: relative;
  float: left;
  line-height: 18px;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #e0e9ee;
  margin-left: -1px;
  font-size: 14px;
  padding: 9px 18px;
  color: #333;
}

.main .py-container .details .page .sui-pagination ul li.active a {
  background-color: #fff;
  color: #e1251b;
  border-color: #fff;
  cursor: default;
}

.main .py-container .details .page .sui-pagination ul li.prev a {
  background-color: #fafafa;
}

.main .py-container .details .page .sui-pagination ul li.disabled a {
  color: #999;
  cursor: default;
}

.main .py-container .details .page .sui-pagination ul li.dotted span {
  margin-left: -1px;
  position: relative;
  float: left;
  line-height: 18px;
  text-decoration: none;
  background-color: #fff;
  font-size: 14px;
  border: 0;
  padding: 9px 18px;
  color: #333;
}

.main .py-container .details .page .sui-pagination ul li.next a {
  background-color: #fafafa;
}

.main .py-container .details .page .sui-pagination div {
  color: #333;
  font-size: 14px;
  float: right;
  width: 241px;
}
</style>