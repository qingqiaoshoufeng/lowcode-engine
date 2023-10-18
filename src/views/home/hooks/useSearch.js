import { reactive,toRefs,onMounted, nextTick} from 'vue'
import Time from '@/utils/time.js'
import { cardList} from '../config.js'

export default function useSearch({dataPickerRef}){
  const state = reactive({
    currentTime:getCurrentTime(),
    isShow:{
      time:false
    },
    cardList,
  })
  const openTimePop = ()=>{
    state.isShow.time =true
  }
  const closeTimePop = ()=>{
    state.isShow.time =false
  }
  const confirmTime = (val)=>{
    closeTimePop()
  }
  onMounted(()=>{
    
  })
  return {
    ...toRefs(state),
    openTimePop,
    confirmTime,
  }
}

const getCurrentTime = ()=>{
  const year = Time.of().getYear()
  const month =  Time.of().getMonth()
  return [year,month]
}
