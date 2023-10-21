import { reactive,toRefs,onMounted, nextTick} from 'vue'

export default function useTab({list,defaultTab,handleChange,paramsKey}){
  const state = reactive({
    tabList:list,
    currentTab:defaultTab,
  })
  const tabChange = (val,callback)=>{
    state.currentTab = val
    debugger
    handleChange && handleChange({ 
      [paramsKey]:val
    })
  }
  return {
    ...toRefs(state),
    tabChange
  }
}