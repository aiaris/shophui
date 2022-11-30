import { reqCartList ,reqDeleteCartById,reqUpdateCheckedById} from "@/api";
// search模块的小仓库
const state = {
  cartList: [],
};
const mutations = {
  GETCARTLIST(state, cartList) {
    state.cartList = cartList;
  },
};
const actions = {
  // 获取产品信息数据
  // 通过API里面的接口函数调用，向服务器发请求，获取服务器数据
  async getCartList({ commit }) {
    let result = await reqCartList();
    if (result.code == 200) {
      commit("GETCARTLIST", result.data);
    }
  },
  // 删除购物车产品
  async deleteCartListBySkuId({ commit }, skuId) {
    let result = await reqDeleteCartById(skuId);
    // 当前这个函数如果执行返回的是Promise
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  // 切换产品选中状态
  async updateCheckedById({ commit }, {skuId,isChecked}) {
    let result = await reqUpdateCheckedById(skuId,isChecked);
    // 当前这个函数如果执行返回的是Promise
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  // 切换全选
  updateAllCartIsChecked({ dispatch, getters }, isChecked) {
    let PromiseAll=[]
    getters.cartList.cartInfoList.forEach(item => { 
      let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked })
      PromiseAll.push(promise)
    })
    return Promise.all(PromiseAll)
  },
  // 删除所有选中的
  deleteAllCheckedCart({dispatch,getters}) {
    // context 相当于小仓库
    // 获取购物车全部产品是一个数组
    let PromiseAll=[]
    getters.cartList.cartInfoList.forEach(item => {
      let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
      // 将每一次返回的Promise添加到数组
      PromiseAll.push(promise)
    })
    //只要全部的p1|p2都成功，返回结果即为成功，如果有一个失败，返回的即为失败
    return Promise.all(PromiseAll)
  }
};
let getters = {
  cartList(state) {
    return state.cartList[0]||{}
  },
};
export default {
  state,
  mutations,
  actions,
  getters,
};
