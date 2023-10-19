import { reactive,toRefs,onMounted, nextTick} from 'vue'
import Time from '@/utils/time.js'
import { cardList} from '../config.js'
import { getFireAnalysis } from '@/apis/index.js'
import store from '@/store'
console.log(store);

export default function useSearch({dataPickerRef}){
  const ORGLEVEL = store.state.userInfo?.userInfo?.ORGLEVEL
  const state = reactive({
    currentTime:getCurrentTime(),
    isShow:{
      time:false
    },
    isStanding:ORGLEVEL === 4,
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
  // 获取火灾态势接口
  const getFireAnalysis = async()=>{
    const res = await getFireAnalysis()
    console.log(res,getFireAnalysis);
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
