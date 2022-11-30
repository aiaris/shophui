<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{ orderId }}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{ payInfo.totalFee }}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg"></li>
              <li><img src="./images/pay11.jpg"></li>
              <li><img src="./images/pay12.jpg"></li>
              <li><img src="./images/pay13.jpg"></li>
              <li><img src="./images/pay14.jpg"></li>
              <li><img src="./images/pay15.jpg"></li>
              <li><img src="./images/pay16.jpg"></li>
              <li><img src="./images/pay17.jpg"></li>
              <li><img src="./images/pay18.jpg"></li>
              <li><img src="./images/pay19.jpg"></li>
              <li><img src="./images/pay20.jpg"></li>
              <li><img src="./images/pay21.jpg"></li>
              <li><img src="./images/pay22.jpg"></li>

            </ul>
          </div>

        </div>
        <div class="hr"></div>

        <div class="submit">
          <a class="btn" @click="open">立即支付</a>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'Pay',
  data() {
    return {
      payInfo: {}
    }
  },
  computed: {
    orderId() {
      return this.$route.query.orderId
    }
  },
  mounted() {
    this.getPayInfo()
  },
  methods: {
    // 二维码弹框
    //立即支付按钮
    async open() {
      //生成一个二维码URL
      let url = await QRCode.toDataURL(this.payInfo.codeUrl);
      //第一个参数:即为内容区域
      //第二个参数:标题
      //第三个参数:组件的配置项
      this.$alert(`<img src=${url} />`, "请你微信扫码支付", {
        dangerouslyUseHTMLString: true, //将字符串转换为标签
        center: true, //居中
        showClose: false, //右上角的关闭按钮不显示
        confirmButtonText: "已支付成功", //确定按钮的文本
        showCancelButton: true, //显示取消按钮
        cancelButtonText: "支付遇见问题", //取消按钮的文本
        closeOnClickModal: true, //点击遮罩层关闭messagebox
        // 关闭弹出框的配置
        beforeClose: (action, instance, done) => { //在消息盒子关闭之前会触发
          //action参数:可以区分用户点击的是取消【cancel】、确定【confirm】
          //instance参数:当前消息框组件VC
          //done参数：是一个函数,函数可以关闭消息盒子
          if (action == 'cancel') {
            alert('请联系客服')
            // 清除定时器
            clearInterval(this.timer);
            this.timer = null
            done()
          } else {
            // 开发后门
            // if (this.code == 200) {
              // 清除定时器
              clearInterval(this.timer);
              this.timer = null
              done()
              //在路由跳转
              this.$router.push('/paysuccess');
            // }
          }
        }
      });
      //查询支付结果,开启定时器每隔一段时间询问支付结果 长轮询
      // 你需要知道支付成功或失败
      // 定时器没有，开启一个定时器
      if (!this.timer) {
        this.timer = setInterval(async () => {
          //发请求获取支付结果
          let result = await this.$API.reqPayStatus(this.orderId);
          //返回数据当中：code=200代表支付成功  code=205支付中
          if (result.code == 200) {
            //支付成功了清除定时器
            clearInterval(this.timer);
            this.timer = null
            //存储一下支付成功的code数值，通过他判断支付是否成功
            this.code = result.code;
            //关闭messagebox
            this.$msgbox.close();
            //在路由跳转
            this.$router.push('/paysuccess');
          } else {
            //未支付
            this.code = result.code;
          }
        }, 1000);
      }
    },
    async getPayInfo() {
      let result = await this.$API.reqPayInfo(this.orderId)
      if (result.code == 200) {
        this.payInfo = result.data
      }
    }
  }
}
</script>

<style scoped>
.pay-main {
  margin-bottom: 20px;
}

.pay-main .pay-container {
  margin: 0 auto;
  width: 1200px;
}

.pay-main .pay-container a:hover {
  color: #4cb9fc;
}

.pay-main .pay-container .orange {
  color: #e1251b;
}

.pay-main .pay-container .money {
  font-size: 18px;
}

.pay-main .pay-container .zfb {
  color: #e1251b;
  font-weight: 700;
}

.pay-main .pay-container .checkout-tit {
  padding: 10px;
}

.pay-main .pay-container .checkout-tit .tit-txt {
  font-size: 14px;
  line-height: 21px;
}

.pay-main .pay-container .checkout-tit .tit-txt .success-icon {
  width: 30px;
  height: 30px;
  display: inline-block;
  background: url(images/icon.png) no-repeat 0 0;
}

.pay-main .pay-container .checkout-tit .tit-txt .success-info {
  padding: 0 8px;
  line-height: 30px;
  vertical-align: top;
}

.pay-main .pay-container .checkout-tit .paymark {
  overflow: hidden;
  line-height: 26px;
  text-indent: 38px;
}

.pay-main .pay-container .checkout-tit .paymark .fl {
  float: left;
}

.pay-main .pay-container .checkout-tit .paymark .fr {
  float: right;
}

.pay-main .pay-container .checkout-tit .paymark .fr .lead {
  margin-bottom: 18px;
  font-size: 15px;
  font-weight: 400;
  line-height: 22.5px;
}

.pay-main .pay-container .checkout-info {
  padding-left: 25px;
  padding-bottom: 15px;
  margin-bottom: 10px;
  border: 2px solid #e1251b;
}

.pay-main .pay-container .checkout-info h4 {
  margin: 9px 0;
  font-size: 14px;
  line-height: 21px;
  color: #e1251b;
}

.pay-main .pay-container .checkout-info ol {
  padding-left: 25px;
  list-style-type: decimal;
  line-height: 24px;
  font-size: 14px;
}

.pay-main .pay-container .checkout-info ul {
  padding-left: 25px;
  list-style-type: disc;
  line-height: 24px;
  font-size: 14px;
}

.pay-main .pay-container .checkout-steps {
  border: 1px solid #ddd;
  padding: 25px;
}

.pay-main .pay-container .checkout-steps .hr {
  height: 1px;
  background-color: #ddd;
}

.pay-main .pay-container .checkout-steps .step-tit {
  line-height: 36px;
  margin: 15px 0;
}

.pay-main .pay-container .checkout-steps .step-cont {
  margin: 0 10px 12px 20px;
}

.pay-main .pay-container .checkout-steps .step-cont ul {
  font-size: 0;
}

.pay-main .pay-container .checkout-steps .step-cont ul li {
  margin: 2px;
  display: inline-block;
  padding: 5px 20px;
  border: 1px solid #ddd;
  cursor: pointer;
  line-height: 18px;
}

.pay-main .pay-container .submit {
  text-align: center;
}

.pay-main .pay-container .submit .btn {
  display: inline-block;
  padding: 15px 45px;
  margin: 15px 0 10px;
  font: 18px "微软雅黑";
  font-weight: 700;
  border-radius: 0;
  background-color: #e1251b;
  border: 1px solid #e1251b;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
}
</style>