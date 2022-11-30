<template>
  <div class="login-container">
    <!-- 登录 -->
    <div class="login-wrap">
      <div class="login">
        <div class="loginform">
          <ul class="tab clearFix">
            <li>
              <a href="##" style="border-right: 0;">扫描登录</a>
            </li>
            <li>
              <a href="##" class="current">账户登录</a>
            </li>
          </ul>

          <div class="content">
            <form>
              <div class="input-text clearFix">
                <span></span>
                <input placeholder="邮箱/用户名/手机号" v-model="phone" name="phone"
                  v-validate="{ required: true, regex: /^1\d{10}$/ }" :class="{ invalid: errors.has('phone') }" />
                <p class="error-msg">{{ errors.first("phone") }}</p>
              </div>
              <div class="input-text clearFix">
                <span class="pwd"></span>
                <input type="password" placeholder="请输入你的登录密码" v-model="password" name="password"
                  v-validate="{ required: true, regex: /^[0-9A-Za-z]{6,16}$/ }"
                  :class="{ invalid: errors.has('password') }">
                <p class="error-msg">{{ errors.first("password") }}</p>
              </div>
              <div class="setting clearFix">
                <label class="checkbox inline">
                  <input name="m1" type="checkbox" value="2" checked="">
                  自动登录
                </label>
                <span class="forget">忘记密码？</span>
              </div>
              <button class="btn" @click.prevent="userLogin">登&nbsp;&nbsp;录</button>
            </form>

            <div class="call clearFix">
              <ul>
                <li><img src="./images/qq.png" alt=""></li>
                <li><img src="./images/sina.png" alt=""></li>
                <li><img src="./images/ali.png" alt=""></li>
                <li><img src="./images/weixin.png" alt=""></li>
              </ul>
              <router-link class="register" to="/register">立即注册</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      phone: '',
      password: ''
    }
  },
  methods: {
    async userLogin() {
      const success = await this.$validator.validateAll(); //全部表单验证成功在发请求
      if (success) {
        try {
          const { phone, password } = this
          await this.$store.dispatch('userLogin', { phone, password })
          // 登录成功跳转到页
          let toPath = this.$route.query.redirect || '/home'
          if (toPath) this.$router.push(toPath)
        } catch (error) {
          alert('登录失败')
          console.log(error.message)
        }
      }
    }
  }
}
</script>

<style scoped>
.login-container .login-wrap {
  height: 487px;
  background-color: #e93854;
}

.login-container .login-wrap .login {
  width: 1200px;
  height: 487px;
  margin: 0 auto;
  background: url(images/loginbg.png) no-repeat;
}

.login-container .login-wrap .loginform {
  width: 420px;
  height: 406px;
  box-sizing: border-box;
  background: #fff;
  float: right;
  top: 45px;
  position: relative;
  padding: 20px;
}

.login-container .login-wrap .loginform .tab li {
  width: 50%;
  float: left;
  text-align: center;
}

.login-container .login-wrap .loginform .tab li a {
  width: 100%;
  display: block;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  border: 1px solid #ddd;
  box-sizing: border-box;
  text-decoration: none;
}

.login-container .login-wrap .loginform .tab li .current {
  border-bottom: none;
  border-top-color: #28a3ef;
  color: #e1251b;
}

.login-container .login-wrap .loginform .content {
  width: 380px;
  height: 316px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-top: none;
  padding: 18px;
}

.login-container .login-wrap .loginform .content form {
  margin: 15px 0 18px 0;
  font-size: 12px;
  line-height: 18px;
}

.login-container .login-wrap .loginform .content form .input-text {
  margin-bottom: 16px;
}

.login-container .login-wrap .loginform .content form .input-text span {
  float: left;
  width: 37px;
  height: 32px;
  border: 1px solid #ccc;
  background: url(~@/assets/icons.png) no-repeat -10px -201px;
  box-sizing: border-box;
  border-radius: 2px 0 0 2px;
}

.login-container .login-wrap .loginform .content form .input-text .pwd {
  background-position: -72px -201px;
}

.login-container .login-wrap .loginform .content form .input-text input {
  width: 302px;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-left: none;
  float: left;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 14px;
  line-height: 22px;
  padding-right: 8px;
  padding-left: 8px;
  border-radius: 0 2px 2px 0;
  outline: none;
}

.login-container .login-wrap .loginform .content form .setting label {
  float: left;
}

.login-container .login-wrap .loginform .content form .setting .forget {
  float: right;
}

.login-container .login-wrap .loginform .content form .btn {
  background-color: #e1251b;
  padding: 6px;
  border-radius: 0;
  font-size: 16px;
  font-family: 微软雅黑;
  word-spacing: 4px;
  border: 1px solid #e1251b;
  color: #fff;
  width: 100%;
  height: 36px;
  margin-top: 25px;
  outline: none;
}

.login-container .login-wrap .loginform .content .call {
  margin-top: 30px;
}

.login-container .login-wrap .loginform .content .call ul {
  float: left;
}

.login-container .login-wrap .loginform .content .call ul li {
  float: left;
  margin-right: 5px;
}

.login-container .login-wrap .loginform .content .call .register {
  float: right;
  font-size: 15px;
  line-height: 38px;
}

.login-container .login-wrap .loginform .content .call .register:hover {
  color: #4cb9fc;
  text-decoration: underline;
}

.login-container .copyright {
  width: 1200px;
  margin: 0 auto;
  text-align: center;
  line-height: 24px;
}

.login-container .copyright ul li {
  display: inline-block;
  border-right: 1px solid #e4e4e4;
  padding: 0 20px;
  margin: 15px 0;
}
</style>