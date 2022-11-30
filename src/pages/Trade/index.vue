<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>

      <div class="address clearFix" v-for="address in addressInfo" :key="address.id">
        <span class="username" :class="{ selected: address.isDefault == 1 }">{{ address.consignee }}</span>
        <p @click="changeDefault(address, addressInfo)">
          <span class="s1">{{ address.fullAddress }}</span>
          <span class="s2">{{ address.phoneNum }}</span>
          <span class="s3" v-show="address.isDefault == 1">默认地址</span>
        </p>
      </div>

      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username" style="margin-left:5px;">货到付款</span>

      </div>
      <div class="line"></div>
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <div class="detail">
        <h5>商品清单</h5>
        <ul class="list clearFix" v-for=" order in orderInfo.detailArrayList" :key="order.skuId">
          <li>
            <img :src="order.imgUrl" style="width: 100px;height: 100px;" alt="">
          </li>
          <li>
            <p>{{ order.skuName }}</p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>￥{{ order.orderPrice }}</h3>
          </li>
          <li>X{{ order.skuNum }}</li>
          <li>有货</li>
        </ul>
      </div>
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea placeholder="建议留言前先与商家沟通确认" class="remarks-cont" v-model="msg"></textarea>

      </div>
      <div class="line"></div>
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b><i>{{ orderInfo.totalNum }}</i>件商品，总商品金额</b>
          <span>¥{{ orderInfo.totalAmount }}.00</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">应付金额:　<span>¥{{ orderInfo.totalAmount }}.00</span></div>
      <div class="receiveInfo">
        寄送至:
        <span>{{ userDefaultAdress.fullAddress }}</span>
        收货人：<span>{{ userDefaultAdress.consignee }}</span>
        <span>{{ userDefaultAdress.phoneNum }}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <a class="subBtn" @click="submitOrder">提交订单</a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Trade',
  data() {
    return {
      msg: '',
      orderId:''//订单号
    }
  },
  methods: {
    // 提交订单
    async submitOrder() {
      // 需要带参数交易编码
      let { tradeNo } = this.orderInfo
      let data = {
        consignee: this.userDefaultAdress.consignee,//收件人姓名
        consigneeTel: this.userDefaultAdress.phoneNum,//收件人电话
        deliveryAddress: this.userDefaultAdress.fullAddress,//收件人地址
        paymentWay: "ONLINE",//支付方式
        orderComment: this.msg,//留言信息
        orderDetailList: this.orderInfo.detailArrayList,//购物车商品列表
      }
      let result = await this.$API.reqSubmitOrder(tradeNo, data)
      if (result.code == 200) {
        this.orderId = result.data
        this.$router.push('/pay?orderId='+this.orderId)
      } else {
        console.log('错误',result.message)
      }
    },
    // 修改默认地址
    changeDefault(address, addressInfo) {
      addressInfo.forEach(item => item.isDefault = 0)
      address.isDefault = 1
    }
  },
  computed: {
    // 将来提交订单的收货人
    userDefaultAdress() {
      // 查找数组中符合条件的
      return this.addressInfo.find(item => item.isDefault == 1) || {}
    },
    ...mapState({
      addressInfo: state => state.trade.address,
      orderInfo: state => state.trade.orderInfo
    })
  },
  mounted() {
    // 获取用户地址
    this.$store.dispatch('getUserAddress')
    // 获取交易信息
    this.$store.dispatch('getOrderInfo')
  }
}
</script>

<style scoped>
.trade-container .title {
  width: 1200px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 21px;
}

.trade-container .content {
  width: 1200px;
  margin: 10px auto 0;
  border: 1px solid #dddddd;
  padding: 25px;
  box-sizing: border-box;
}

.trade-container .content .receive,
.trade-container .content .pay {
  line-height: 36px;
  margin: 18px 0;
}

.trade-container .content .address {
  padding-left: 20px;
  margin-bottom: 15px;
}

.trade-container .content .address .username {
  float: left;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  position: relative;
}

.trade-container .content .address .username::after {
  content: "";
  display: none;
  width: 13px;
  height: 13px;
  position: absolute;
  right: 0;
  bottom: 0;
  background: url(images/choosed.png) no-repeat;
}

.trade-container .content .address .username.selected {
  border-color: #e1251b;
}

.trade-container .content .address .username.selected::after {
  display: block;
}

.trade-container .content .address p {
  width: 610px;
  float: left;
  line-height: 30px;
  margin-left: 10px;
  padding-left: 5px;
  cursor: pointer;
}

.trade-container .content .address p .s1 {
  float: left;
}

.trade-container .content .address p .s2 {
  float: left;
  margin: 0 5px;
}

.trade-container .content .address p .s3 {
  float: left;
  width: 56px;
  height: 24px;
  line-height: 24px;
  margin-left: 10px;
  background-color: #878787;
  color: #fff;
  margin-top: 3px;
  text-align: center;
}

.trade-container .content .address p:hover {
  background-color: #ddd;
}

.trade-container .content .line {
  height: 1px;
  background-color: #ddd;
}

.trade-container .content .way {
  width: 1080px;
  height: 110px;
  background: #f4f4f4;
  padding: 15px;
  margin: 0 auto;
}

.trade-container .content .way h5 {
  line-height: 50px;
}

.trade-container .content .way .info {
  margin-top: 20px;
}

.trade-container .content .way .info .s1 {
  float: left;
  border: 1px solid #ddd;
  width: 120px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-right: 10px;
}

.trade-container .content .way .info p {
  line-height: 30px;
}

.trade-container .content .detail {
  width: 1080px;
  background: #feedef;
  padding: 15px;
  margin: 2px auto 0;
}

.trade-container .content .detail h5 {
  line-height: 50px;
}

.trade-container .content .detail .list {
  display: flex;
  justify-content: space-between;
}

.trade-container .content .detail .list li {
  line-height: 30px;
}

.trade-container .content .detail .list li p {
  margin-bottom: 20px;
}

.trade-container .content .detail .list li h4 {
  color: #c81623;
  font-weight: 400;
}

.trade-container .content .detail .list li h3 {
  color: #e12228;
}

.trade-container .content .bbs {
  margin-bottom: 15px;
}

.trade-container .content .bbs h5 {
  line-height: 50px;
}

.trade-container .content .bbs textarea {
  width: 100%;
  border-color: #e4e2e2;
  line-height: 1.8;
  outline: none;
  resize: none;
}

.trade-container .content .bill h5 {
  line-height: 50px;
}

.trade-container .content .bill div {
  padding-left: 15px;
}

.trade-container .money {
  width: 1200px;
  margin: 20px auto;
}

.trade-container .money ul {
  width: 220px;
  float: right;
}

.trade-container .money ul li {
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}

.trade-container .money ul li i {
  color: red;
}

.trade-container .trade {
  box-sizing: border-box;
  width: 1200px;
  padding: 10px;
  margin: 10px auto;
  text-align: right;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
}

.trade-container .trade div {
  line-height: 30px;
}

.trade-container .trade .price span {
  color: #e12228;
  font-weight: 700;
  font-size: 14px;
}

.trade-container .trade .receiveInfo {
  color: #999;
}

.trade-container .sub {
  width: 1200px;
  margin: 0 auto 10px;
}

.trade-container .sub .subBtn {
  float: right;
  width: 164px;
  height: 56px;
  font: 700 18px "微软雅黑";
  line-height: 56px;
  text-align: center;
  color: #fff;
  background-color: #e1251b;
}
</style>