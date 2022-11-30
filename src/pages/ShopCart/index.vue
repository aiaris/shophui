<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked == 1" @change="updateChecked(cart, $event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('minus', -1, cart)">-</a>
            <input autocomplete="off" type="text" minnum="1" class="itxt" :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked&&cartInfoList.length>0" @change="updateAllCartChecked">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{cartInfoList.length}}</span>件商品
        </div>
        <div class="sumprice">
          <em>总价(不含运费):</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'ShopCart',
  mounted() {
    this.getData()
  },
  computed: {
    ...mapGetters(['cartList']),
    // 才是想要的计算出来的购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    // 计算一个总价
    totalPrice() {
      let sum = 0
      this.cartInfoList.forEach(item => {
        sum += item.skuNum * item.skuPrice
      })
      return sum
    },
    // 计算全选是否勾选
    isAllChecked() {
      return this.cartInfoList.every(item => item.isChecked == 1)
    }
  },
  methods: {
    // 全选操作
    async updateAllCartChecked(event) {
      try {
        let isChecked = event.target.checked ? "1" : "0"
        await this.$store.dispatch('updateAllCartIsChecked', isChecked)
        this.getData()
      } catch (error) {
        console.log(error.message)
      }
    },
    // 删除所有选中的产品不用传参，因为没法收集
    async deleteAllCheckedCart() {
      try {
        await this.$store.dispatch('deleteAllCheckedCart')
        this.getData()
        alert('删除成功')
      } catch (error) {
        console.log(error.message)
        alert('删除失败')
      }
    },
    // 切换选择框状态
    async updateChecked(cart, e) {
      try {
        // 如果修改数据成功，再次获取服务器数据
        let isChecked = e.target.checked ? '1' : '0'
        await this.$store.dispatch('updateCheckedById', { skuId: cart.skuId, isChecked })
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 删除产品
    async deleteCartById(cart) {
      try {
        await this.$store.dispatch('deleteCartListBySkuId', cart.skuId)
        // 如果成功刷新页面发请求
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 减少产品个数节流操作
    handler: _.throttle(async function (type, disNum, cart) {
      // 向服务器发请求
      switch (type) {
        case 'add':
          // 带给服务器变化的量
          disNum = 1
          break;
        case 'minus':
          // 判断产品个数是否大于1，才给服务器0代表原封不动
          disNum = cart.skuNum > 1 ? -1 : 0
          break;
        case 'change':
          // 用户输入非法
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0
          } else {
            disNum = parseInt(disNum) - cart.skuNum
          }
          break;
      }
      // 派发action
      try {
        await this.$store.dispatch('addOrUpdateShopCart', { skuId: cart.skuId, skuNum: disNum })
        // 再次发请求
        this.getData()
      } catch (error) {
        console.log(error)
      }
    }, 1000),
    getData() {
      // 获取购物车个人数据
      this.$store.dispatch('getCartList')
    }
  }
}
</script>

<style scoped>
.cart {
  width: 1200px;
  margin: 0 auto;
}

.cart h4 {
  margin: 9px 0;
  font-size: 14px;
  line-height: 21px;
}

.cart .cart-main .cart-th {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  overflow: hidden;
}

.cart .cart-main .cart-th>div {
  float: left;
}

.cart .cart-main .cart-th .cart-th1 {
  width: 25%;
}

.cart .cart-main .cart-th .cart-th1 input {
  vertical-align: middle;
}

.cart .cart-main .cart-th .cart-th1 span {
  vertical-align: middle;
}

.cart .cart-main .cart-th .cart-th2 {
  width: 25%;
}

.cart .cart-main .cart-th .cart-th3,
.cart .cart-main .cart-th .cart-th4,
.cart .cart-main .cart-th .cart-th5,
.cart .cart-main .cart-th .cart-th6 {
  width: 12.5%;
}

.cart .cart-main .cart-body {
  margin: 15px 0;
  border: 1px solid #ddd;
}

.cart .cart-main .cart-body .cart-list {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}

.cart .cart-main .cart-body .cart-list>li {
  float: left;
}

.cart .cart-main .cart-body .cart-list .cart-list-con1 {
  width: 15%;
}

.cart .cart-main .cart-body .cart-list .cart-list-con2 {
  width: 35%;
}

.cart .cart-main .cart-body .cart-list .cart-list-con2 img {
  width: 82px;
  height: 82px;
  float: left;
}

.cart .cart-main .cart-body .cart-list .cart-list-con2 .item-msg {
  float: left;
  width: 150px;
  margin: 0 10px;
  line-height: 18px;
}

.cart .cart-main .cart-body .cart-list .cart-list-con4 {
  width: 10%;
}

.cart .cart-main .cart-body .cart-list .cart-list-con5 {
  width: 17%;
}

.cart .cart-main .cart-body .cart-list .cart-list-con5 .mins {
  border: 1px solid #ddd;
  border-right: 0;
  float: left;
  color: #666;
  width: 6px;
  text-align: center;
  padding: 8px;
}

.cart .cart-main .cart-body .cart-list .cart-list-con5 input {
  border: 1px solid #ddd;
  width: 40px;
  height: 33px;
  float: left;
  text-align: center;
  font-size: 14px;
}

.cart .cart-main .cart-body .cart-list .cart-list-con5 .plus {
  border: 1px solid #ddd;
  border-left: 0;
  float: left;
  color: #666;
  width: 6px;
  text-align: center;
  padding: 8px;
}

.cart .cart-main .cart-body .cart-list .cart-list-con6 {
  width: 10%;
}

.cart .cart-main .cart-body .cart-list .cart-list-con6 .sum {
  font-size: 16px;
}

.cart .cart-main .cart-body .cart-list .cart-list-con7 {
  width: 13%;
}

.cart .cart-main .cart-body .cart-list .cart-list-con7 a {
  color: #666;
}

.cart .cart-tool {
  overflow: hidden;
  border: 1px solid #ddd;
}

.cart .cart-tool .select-all {
  padding: 10px;
  overflow: hidden;
  float: left;
}

.cart .cart-tool .select-all span {
  vertical-align: middle;
}

.cart .cart-tool .select-all input {
  vertical-align: middle;
}

.cart .cart-tool .option {
  padding: 10px;
  overflow: hidden;
  float: left;
}

.cart .cart-tool .option a {
  float: left;
  padding: 0 10px;
  color: #666;
}

.cart .cart-tool .money-box {
  float: right;
}

.cart .cart-tool .money-box .chosed {
  line-height: 26px;
  float: left;
  padding: 0 10px;
}

.cart .cart-tool .money-box .sumprice {
  width: 200px;
  line-height: 22px;
  float: left;
  padding: 0 10px;
}

.cart .cart-tool .money-box .sumprice .summoney {
  color: #c81623;
  font-size: 16px;
}

.cart .cart-tool .money-box .sumbtn {
  float: right;
}

.cart .cart-tool .money-box .sumbtn a {
  display: block;
  position: relative;
  width: 96px;
  height: 52px;
  line-height: 52px;
  color: #fff;
  text-align: center;
  font-size: 18px;
  font-family: "Microsoft YaHei";
  background: #e1251b;
  overflow: hidden;
}
</style>