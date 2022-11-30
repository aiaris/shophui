// 配置路由的地方
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
// 使用插件
Vue.use(VueRouter);
// 引入store
import store from "@/store";

// 先把VueRouter原型对象的push和replace,先保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

// 重写push与replace
// 第一个参数：告诉原来的push方法，你往哪里跳(传递哪些参数)
// 第二个参数：成功回调
// 第三个参数：失败回调
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    // call与apply区别：相同点(都可以调用函数一次，都可以篡改函数的上下文一次)，区别(call传递参数多个参数用逗号隔开，apply要传递数组)
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    // call与apply区别：相同点(都可以调用函数一次，都可以篡改函数的上下文一次)，区别(call传递参数多个参数用逗号隔开，apply要传递数组)
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
// 配置路由
const router = new VueRouter({
  // 配置路由
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 };
  },
});

export default router;
// 全局守卫：前置守卫(路由跳转之前进行判断)
router.beforeEach(async (to, from, next) => {
  // to:到哪去，from：从哪来，next，放行 next(path)放行到指定的路由
  // 获取token，用户登录了才会有token
  let token = store.state.user.token;
  let name = store.state.user.userInfo.name;
  if (token) {
    // 用户已经登陆了不能再去login路由
    if (to.path == "/login") {
      next("/home");
    } else {
      // 登录了去的不是login路由判断有没有用户信息在放行
      if (name) {
        next();
      } else {
        try {
          // 没有用户信息先派发action在跳转
          //获取用户信息在首页展示
          await store.dispatch("getUserInfo");
          next();
        } catch (error) {
          // 获取用户信息失败token失效
          // 清除token并且回退到登录页
          await store.dispatch("userLogout");
          next("/login");
        }
      }
    }
  } else {
    //用户未登录||目前的判断都是放行.增加一些判断
    //用户未登录:不能进入/trade、/pay、/paysuccess、/center、/center/myorder  /center/teamorder
    let toPath = to.path;
    if (
      toPath.indexOf("/rade") != -1 || toPath.indexOf("/pay") != -1 || toPath.indexOf("/center") != -1) {
      next("/login?redirect=" + toPath);
    } else {
      next();
    }
  }
});
