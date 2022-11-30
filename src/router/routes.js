// 路由配置信息
export default [
  {
    path: "/center",
    name: "center",
    component: ()=>import('@/pages/Center'),
    meta: { show: true },
    // 子路由
    children: [
      {
        path: "myorder",
        component: ()=>import('@/pages/Center/myOrder'),
      },
      {
        path: "grouporder",
        component: ()=>import('@/pages/Center/groupOrder'),
      },
      {
        path: "/center",
        redirect: "/center/myorder",
      },
    ],
  },
  {
    path: "/paysuccess",
    name: "paysuccess",
    component:  ()=>import('@/pages/PaySuccess'),
    meta: { show: true },
  },
  {
    path: "/pay",
    name: "pay",
    component:()=>import('@/pages/Pay') ,
    meta: { show: true },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      // 去支付页必须从交易来来
      if (from.path == "/trade") {
        next();
      } else {
        // 其他组件来的停留在当前
        next(false);
      }
    },
  },
  {
    path: "/trade",
    name: "trade",
    component: ()=>import('@/pages/Trade'),
    meta: { show: true },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      // 去交易页必须从购物车来
      if (from.path == "/shopcart") {
        next();
      } else {
        // 其他组件来的停留在当前
        next(false);
      }
    },
  },
  {
    path: "/shopcart",
    name: "shopcart",
    component: ()=>import('@/pages/ShopCart'),
    meta: { show: true },
  },
  {
    path: "/addcartsuccess",
    name: "addcartsuccess",
    component: ()=>import('@/pages/AddCartSuccess'),
    meta: { show: true },
  },
  {
    path: "/detail/:skuid",
    component: ()=>import('@/pages/Detail'),
    meta: { show: true },
  },
  {
    path: "/home",
    component:()=>import('@/pages/Home'),
    meta: { show: true },
  },
  {
    path: "/search/:keyword?",
    name: "search",
    component: ()=>import('@/pages/Search'),
    meta: { show: true },
    // 路由组件传递props数据
    // 布尔值写法:params
    // props:true
    // 对象写法:额外的给路由组件传递一些props
    // props:{a:1,b:2}
    // 函数写法：可以把params参数，query参数，通过props传递给路由组件
    props: ($route) => ({
      keyword: $route.params.keyword,
      k: $route.query.k,
    }),
  },
  {
    path: "/login",
    component: ()=>import('@/pages/Login'),
    meta: { show: false },
  },
  {
    path: "/register",
    component: ()=>import('@/pages/Register'),
    meta: { show: false },
  },
  {
    // 重定向,在项目跑起来的时候，访问/,立马让他定向到首页
    path: "*",
    redirect: "/home",
  },
];
