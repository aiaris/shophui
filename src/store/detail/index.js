import { reqGoodsInfo, reqAddOrUpdateShopCart } from "@/api";
// 封装游客临时身份的模块生产成一个随机字符串(不能在变)
import {getUUID} from '@/utils/uuid_token'
// search模块的小仓库
const state = {
  goodInfo: {},
  // 游客临时身份
  uuid_token:getUUID()
};
const mutations = {
  GETGOODINFO(state, goodInfo) {
    state.goodInfo = goodInfo;
  },
};
const actions = {
  // 获取产品信息数据
  // 通过API里面的接口函数调用，向服务器发请求，获取服务器数据
  async getGoodInfo({ commit }, skuId) {
    let result = await reqGoodsInfo(skuId);
    if (result.code == 200) {
      commit("GETGOODINFO", result.data);
    }
  },
  // 加入购物车前台只是带给服务器参数并没有返回其他数据
  // 因为服务器没有返回其余数据，因此我们不需要三连环存储
  async addOrUpdateShopCart({ commit }, {skuId,skuNum}) {
    let result = await reqAddOrUpdateShopCart(skuId, skuNum);
    // 当前这个函数如果执行返回的是Promise
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
};
// 计算属性
// 项目中getters的主要作用是简化仓库数据(简化数据而生)
// 可以吧我们在组件中需要用到的数据简化，组件在获取数据时候就方便了
let getters = {
  categoryView(state) {
    // 当前计算出来的至少要是空对象面包屑
    return state.goodInfo.categoryView || {};
  },
  skuInfo(state) {
    // 当前计算出来的至少要是空对象面包屑
    return state.goodInfo.skuInfo || {};
  },
  // 产品售卖属性列表
  spuSaleAttrList(state) {
    // 当前计算出来的至少要是空对象面包屑
    return state.goodInfo.spuSaleAttrList || [];
  },
};
export default {
  state,
  mutations,
  actions,
  getters,
};
