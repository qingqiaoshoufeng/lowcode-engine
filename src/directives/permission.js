export default {
  alias: 'p',
  config: {
    mounted(el, binding) {
      const permissionList = getPermissionList()
      const mergeList = [...new Set([...permissionList, ...binding.value])]
      const flag = mergeList.length === (binding.value.length + permissionList.length)
      if (flag) {
        el.parentNode.removeChild(el)
      }
    },
  }
}


const getPermissionList = () => {
  return ['11', 'admin']
}