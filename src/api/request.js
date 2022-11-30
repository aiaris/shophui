// 对于axios进行二次封装
import axios from "axios";
// 引入进度条
import nprogress from "nprogress";
// 引入进度条样式
import "nprogress/nprogress.css";
// start方法代表进度条开始 done方法代表进度条结束

// 在当前模块引入store
import store from "@/store";

// 1:利用axios对象的方法create，去创建一个axios实例
// 2：request就是axios，只不过稍微配置一下
const requests = axios.create({
  // 配置对象
  // 基础路径，发请求的时候，路径会带api
  baseURL: "http://gmall-h5-api.atguigu.cn/api",
  // 代表请求超时时间5s
  timeout: 5000,
});
// 请求拦截器：在发请求之前，请求拦截器可以监测到，可以在发请求之前做一些事情

requests.interceptors.request.use((config) => {
  // config：配置对象，对象里面有一个属性很重要，headers请求头
  // 进度条开始
  if (store.state.detail.uuid_token) {
    // 有的话带给请求头(userTempId)
    config.headers.userTempId = store.state.detail.uuid_token;
  }
  // 判断需要携带token给服务器
  if (store.state.user.token) {
    config.headers.token = store.state.user.token;
  }
  nprogress.start();
  return config;
});
// 响应拦截器
requests.interceptors.response.use(
  (res) => {
    // 服务器成功的回调函数，服务器响应数据回来以后，响应拦截器可以监测到，可以做一些事情
    // 进度条结束
    nprogress.done();
    return res.data;
  },
  (error) => {
    // 响应失败的回调函数
    return Promise.reject(new Error("faile"));
  }
);

// 对外暴露
export default requests;
