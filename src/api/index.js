// 当前这个模块：API接口进行统一管理
import requests from "./request";
import mockRequests from "./mockAjax";

// 三级联动接口
// /api/product/getBaseCategoryList get请求 无参数
// 发请求:axios发请求返回的结果是Promise对象
export const reqCategoryList = () =>
  requests({ url: "/product/getBaseCategoryList", method: "get" });
// 获取banner轮播图接口
export const reqGetBannerList = () =>
  mockRequests({ url: "/banner", method: "get" });
// 获取floor数据
export const reqFloorList = () =>
  mockRequests({ url: "/floor", method: "get" });

// 获取Search模块数据 地址:/api/list 请求方式post 需要携带参数
// 当前这个接口，给服务器传递参数params，至少是一个空对象
export const reqSearchList = (data) =>
  requests({ url: "/list", method: "post", data });
// 获取产品详情信息的接口
export const reqGoodsInfo = (skuId) =>
  requests({ url: `/item/${skuId}`, method: "get" });
//将产品添加到购物车获取更新某一个产品的个数 /api/cart/addToCart/{ skuId }/{ skuNum }  POST
export const reqAddOrUpdateShopCart = (skuId, skuNum) =>
  requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" });
// /api/cart/cartList GET 获取购物车列表
export const reqCartList = () =>
  requests({ url: "/cart/cartList", method: "get" });
// /api/cart/deleteCart/{skuId}  DELETE 删除购物车产品
export const reqDeleteCartById = (skuId) =>
  requests({ url: `/cart/deleteCart/${skuId}`, method: "delete" });
// /api/cart/checkCart/{skuID}/{isChecked} GET 切换产品选中状态
export const reqUpdateCheckedById = (skuId, isChecked) =>
  requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: "get" });
// /api/user/passport/sendCode/{phone} Get 获取验证码接口
export const reqGetCode = (phone) =>
  requests({ url: `/user/passport/sendCode/${phone}`, method: "get" });
// /api/user/passport/register POST 用户注册接口，必带 phone password code
export const reqUserRegister = (data) =>
  requests({ url: "/user/passport/register", method: "post", data });
// 登录 /api/user/passport/login POST 必选参数phone，password
export const reqUserLogin = (data) =>
  requests({ url: "/user/passport/login", method: "post", data });
// 登录后用户信息的展示【带着token想服务器要数据】/user/passport/auth/getUserInfo
export const reqUserInfo = () =>
  requests({ url: "/user/passport/auth/getUserInfo", method: "get" });
// /api/user/passport/logout  GET 退出登录接口
export const reqLogout = () =>
  requests({ url: "/user/passport/logout", method: "get" });
// /api/user/userAddress/auth/findUserAddressList 获取用户地址信息接口 get
export const reqAddressInfo = () =>
  requests({ url: "/user/userAddress/auth/findUserAddressList", method: "get" });
// /api/order/auth/trade 获取订单交易页信息 get
export const reqOrderInfo = () =>
  requests({ url: "/order/auth/trade", method: "get" });
// /api/order/auth/submitOrder?tradeNo={tradeNo}  POST提交订单
export const reqSubmitOrder= (tradeNo,data) =>
  requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, method: "post", data });
// /api/payment/weixin/createNative/{orderId} get 获取订单支付信息
export const reqPayInfo= (orderId) =>
  requests({ url: `/payment/weixin/createNative/${orderId}`, method: "get", });
// /api/payment/weixin/queryPayStatus/{orderId} get 获取支付状态
export const reqPayStatus= (orderId) =>
  requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: "get", });
// /api/order/auth/{page}/{limit} get 获取我的订单列表
export const reqMyOrderList= (page,limit) =>
  requests({ url: `/order/auth/${page}/${limit}`, method: "get", });