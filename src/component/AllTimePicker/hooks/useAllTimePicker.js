
import { reactive,toRefs,onMounted, nextTick,computed} from 'vue'
import {genarateDefaultColumns} from '../config.js'
export default function useAllTimePicker(props,emit){
  const state = reactive({
  })
  const columsData = computed(()=>{
    if(props.colums){
      return props.colums.map(insertDefaultIndex)
    }else{
      return genarateDefaultColumns(null,props.formatter).map(insertDefaultIndex)
    }
    function insertDefaultIndex(item,index){
      const values = item.values
      const defaultIndex = values.findIndex((itm)=>(itm === props.formatter(props.defaultValue[index]) || item ===props.defaultValue[index]) )
      item.defaultIndex = defaultIndex
      return item
    }
  })

  // const onConfirm = (val)=>{
  //   emit('update:default',val)
  //   emit('update:show',false)
  // }
  // const onCancel = ()=>{
  //   emit('update:show',false)
  // }
  return {
    ...toRefs(state),
    // isShow,
    columsData,
    // onConfirm,
    // onCancel
  }
}