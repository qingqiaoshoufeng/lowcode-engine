export const isType = (data,type)=>{
  return Object.prototype.toString.call(data).includes(type)
}