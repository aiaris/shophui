// 专门处理token
// 存储
export const setToken = (token) => {
  // 持久化存储token
  localStorage.setItem("TOKEN", token);
};
// 获取token
export const getToken = () => {
  // 持久化存储token
  return localStorage.getItem("TOKEN");
};
