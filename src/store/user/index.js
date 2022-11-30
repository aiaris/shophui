import {
  reqGetCode,
  reqUserRegister,
  reqUserLogin,
  reqUserInfo,
  reqLogout,
} from "@/api";
import { setToken, getToken } from "@/utils/token";
// search模块的小仓库
const state = {
  code: "",
  token: getToken(),
  userInfo: {},
};
const mutations = {
  GETCODE(state, code) {
    state.code = code;
  },
  USERLOGIN(state, token) {
    state.token = token;
  },
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  CLEAR(state) {
    state.token = "";
    state.userInfo = {};
    localStorage.removeItem("TOKEN")
  },
};
const actions = {
  // 退出登录
  async userLogout({ commit }) {
    let result = await reqLogout();
    // 如果成功清除所有数据
    if (result.code == 200) {
      // 清除所有数据token action不能操作数据state
      commit("CLEAR");
      return 'ok'
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // 验证用户信息带着token向服务器要数据
  async getUserInfo({ commit }) {
    let result = await reqUserInfo();
    if (result.code == 200) {
      commit("GETUSERINFO", result.data);
      return 'ok'
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // 用户登录[token]
  async userLogin({ commit }, data) {
    let result = await reqUserLogin(data);
    // 服务器下发的token是某一个用户的唯一标识通过token找服务器要数据
    if (result.code == 200) {
      commit("USERLOGIN", result.data.token);
      // 持久化存储
      setToken(result.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // 用户注册
  async userRegister({ commit }, user) {
    let result = await reqUserRegister(user);
    if (result.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // 获取验证码
  async getCode({ commit }, phone) {
    // 获取验证码的接口把验证码返回来，正常情况是发送到用户手机
    let result = await reqGetCode(phone);
    if (result.code == 200) {
      commit("GETCODE", result.data);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
};
let getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
