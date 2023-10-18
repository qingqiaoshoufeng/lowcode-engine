import { reactive,toRefs,onMounted, nextTick} from 'vue'
import Time from '@/utils/time.js'

export default function useSearch({dataPickerRef}){
  const state = reactive({
    currentTime:getCurrentTime(),
    minDate:getMinDate(),
    maxDate:getMaxDate(),
    isShow:{
      time:true
    }
  })
  const openTimePop = ()=>{
    state.isShow.time =true
  }
  const closeTimePop = ()=>{
    state.isShow.time =false
  }
  const confirmTime = (val)=>{
    state.currentTime =new Date(val[0], val[1] - 1)
    closeTimePop()
  }
  const formatter = (type, val) => {
    if (type === 'year') {
      return `${val}年`;
    }
    if (type === 'month') {
      return `${val}月`;
    }
    return val;
  };
  onMounted(()=>{
    
  })
  const filterOptions = (type, options)=>{
    if(type === 'month'){
      return ['全部',...options]
    }
    return options
  }
  return {
    ...toRefs(state),
    openTimePop,
    confirmTime,
    formatter,
    filterOptions
  }
}




const getCurrentTime = (val=null)=>{
  const year = Time.of(val).getYear()
  const month =  Time.of(val).getMonth() - 1
  const currentTime =  new Date(year, month)
  return currentTime
}

const formatterTime = (val)=>{
  
}

const getMinDate = ()=>{
  // 获取近二十年
  const year = Time.of().getYear() - 20
  const MinDate =  new Date(year, 0)
  return MinDate
}

const getMaxDate = ()=>{
  const year = Time.of().getYear()
  const maxDate =  new Date(year, 11)
  return maxDate
}