import axios from 'axios'

export * from './system/login.js'

// 地址位置编码查询
export function searchLocation(params) {
    const instance = axios.create({
        baseURL: 'https://api.tianditu.gov.cn',
        withCredentials: false,
    })
    return instance.get(`/geocoder?ds=${params.ds}&tk=${params.tk}`)
}