import { reqAddressInfo, reqOrderInfo } from "@/api";
// trade模块的小仓库
const state = {
  address: [],
  orderInfo: {},
};
const mutations = {
  GETUSERADDRESS(state, address) {
    state.address = address;
  },
  GETORDERINFO(state, orderInfo) {
    state.orderInfo = orderInfo;
  },
};
const actions = {
  // 获取订单交易信息
  async getOrderInfo({ commit }) {
    let result = await reqOrderInfo();
    if (result.code == 200) {
      commit("GETORDERINFO", result.data);
    }
  },
  // 获取用户地址
  async getUserAddress({ commit }) {
    let result = await reqAddressInfo();
    if (result.code == 200) {
      commit("GETUSERADDRESS", result.data);
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
