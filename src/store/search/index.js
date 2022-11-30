import { reqSearchList } from "@/api";
// search模块的小仓库
const state = {
    searchList:{}
};
const mutations = {
    GETSEARCHLIST(state,searchList) {
        state.searchList=searchList
    }
};
const actions = {
  // 获取search模块数据
  // 通过API里面的接口函数调用，向服务器发请求，获取服务器数据
  async getSearchList({ state, dispatch, commit }, searchParams) {
    let result = await reqSearchList(searchParams);
    console.log('first',result)
    if (result.code == 200) {
         commit('GETSEARCHLIST', result.data);
    }
  },
};
// 计算属性
// 项目中getters的主要作用是简化仓库数据(简化数据而生)
// 可以吧我们在组件中需要用到的数据简化，组件在获取数据时候就方便了
let getters = {
  //计算新的属性:state,当前小仓库的数据
  goodsList(state) {
       return state.searchList.goodsList;
  },
  //品牌的数据
  trademarkList(state) {
       return state.searchList.trademarkList;
  },
  //商品属性
  attrsList(state) {
       return state.searchList.attrsList;
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};
