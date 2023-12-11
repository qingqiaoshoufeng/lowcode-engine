
import { request as axios } from '@/plugins/axios/index.js'

//  我的消息--已读
// export function updateMessage(params) {
//   return axios.get('/acws/rest/biz/firestatistics/usermessage/update', { params })
// }

export function getMessageInfo(params) {
  const {page,limit,...rest} = params || {}
  const status = params?.status
  return axios.get('/acws/rest/biz/firestatistics/usermessage/query', { params:rest }).then((res)=>{
    return status === 1 ? { 
      ...res,
      list:res.userMessageList,
      total:res.userMessageList.length
    } :{
      ...res,
      list:res.userMessageList
    }
  })
}