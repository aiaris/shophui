import {v4 as uuidv4} from 'uuid'
// 封装游客临时身份的模块生产成一个随机字符串(不能在变)游客身份还要持久存储
export const getUUID = () => {
    // 先从本地存储获取uuid
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    // 如果没有生成
    if (!uuid_token) {
        // 生成游客临时身份
        uuid_token = uuidv4()
        // 本地存储
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    // 一定要有返回值不然是undefined
    return uuid_token
}