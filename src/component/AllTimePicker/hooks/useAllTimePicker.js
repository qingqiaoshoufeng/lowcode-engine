
import { reactive,toRefs,onMounted, nextTick,computed} from 'vue'
import {genarateDefaultColumns} from '../config.js'
export default function useAllTimePicker(props,emit){
  const state = reactive({
  })
  const columsData = computed(()=>{
    // function insertDefaultIndex(item,index){
    //   const typeList= ['year','month']
    //   const values = item.values
    //   const defaultIndex = values.findIndex((itm)=>(itm === props.formatter(typeList[index],props.defaultValue[index]) || (itm ===props.defaultValue[index])))
    //   item.defaultIndex = defaultIndex
    //   return item
    // }
    if(props.columns.length){
      return props.columns
      // .map(insertDefaultIndex)
    }else{
      const list = genarateDefaultColumns(props.formatter)      
      const data = list
      // .map(insertDefaultIndex)
      console.log(data);
      return data
    }
  })
  console.log(columsData);
  const isShow = computed({
    get(){
      return !!props.show
    },
    set(val){
      emit('update:show',val)
    }
  })

  const onConfirm = ({selectedValues})=>{
    const typeList = ['year','month']
    emit('update:defaultValue',selectedValues)
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