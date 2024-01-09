import store from "@/store/index.js";
export default {
  alias: 'p',
  config: {
    mounted(el, binding) {
      // console.log(store,'mounted');
      // const permissionList = getPermissionList()
      // const mergeList = [...new Set([...permissionList, ...binding.value])]
      // const flag = mergeList.length === (binding.value.length + permissionList.length)
      const list = binding.value || []
      if(!list || !list.length){
        return
      }
      const permissionMap = store?.getters?.['userInfo/permission'] || {}
      const flag = list.find((item)=>{
        return permissionMap[item]
      })
      if (!flag) {
        el.parentNode.removeChild(el)
      }
    },
  }
}


const getPermissionList = () => {
  return ['11', 'admin']
}