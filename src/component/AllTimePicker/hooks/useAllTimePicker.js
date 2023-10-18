
import { reactive,toRefs,onMounted, nextTick,computed} from 'vue'
import {genarateDefaultColumns} from '../config.js'
export default function useAllTimePicker(props,emit){
  const state = reactive({
  })
  const columsData = computed(()=>{
    function insertDefaultIndex(item,index){
      const typeList= ['year','month']
      const values = item.values
      const defaultIndex = values.findIndex((itm)=>(itm === props.formatter(typeList[index],props.defaultValue[index]) || (itm ===props.defaultValue[index])))
      item.defaultIndex = defaultIndex
      return item
    }
    if(props.columns.length){
      return props.columns.map(insertDefaultIndex)
    }else{
      const list = genarateDefaultColumns(props.formatter)
      const data = list.map(insertDefaultIndex)
      return data
    }
   
  })
  console.log(columsData);
  const isShow = computed({
    get(){
      // debugger;
      return !!props.show
    },
    set(val){
      debugger;
      emit('update:show',val)
    }
  })

  const onConfirm = (val)=>{
    const typeList = ['year','month']
    emit('update:defaultValue',val.map((item,index)=>props.clearformat(typeList[index],item)))
    emit('update:show',false)
  }
  const onCancel = ()=>{
    emit('update:show',false)
  }
  return {
    ...toRefs(state),
    isShow,
    columsData,
    onConfirm,
    onCancel
  }
}