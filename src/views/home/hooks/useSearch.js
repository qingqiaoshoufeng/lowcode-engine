import { reactive,toRefs,onMounted, nextTick,watch} from 'vue'
import { showLoadingToast,closeToast  } from 'vant';
import router from '@/router/index.js'
import Time from '@/utils/time.js'
import { cardList} from '../config.js'
import { getDataAnalysis,getFireNotice,getFirelist ,getAnnualList,getDispatchInfo,getAverageTime,getStylePercent } from '@/apis/index.js'
import store from '@/store'
console.log(store);

export default function useSearch({dataPickerRef,statisticsInfoRef}){
  const ORGLEVEL = store.state.userInfo?.userInfo?.ORGLEVEL
  const state = reactive({
    currentTime:getCurrentTime(),
    isShow:{
      time:false
    },
    isStanding:ORGLEVEL === 4,
    cardList,
    FireInfoList:'', // 百万人口火灾
    DispatchInfoList: '', // 出动平均时长列表
    InitialFuelsList:'',// 高频起火场所
    WayTimeList:"", // 到场时间列表
    FightingTimeList:'',
    rankList:[], // 排行榜
    policeCardInfo:{},
    dispatchCardInfo:{},
    fireCardInfo:{},
    statisticsList:[],
    fitghtList:[],
    policelist:[], //
    dispatchList:[],
    noticeList:[]
    // DispatchInfoList:[] // 出动平均时长列表

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

  const formatParams = ()=>{
    const [year,month] =state.currentTime
    const params = month === '全年' ? {
      yearFlag:1,
      year
    } : {
      monthFlag:1,
      year,
      month
    }
    return params
  }
  // 获取火灾相关信息
  const getFireInfo = async()=>{
    const res = await getFirelist(formatParams())
    console.log(res,'getFireInfo');
    state.FireInfoList = res?.dateAnalysisFourResult?.dateAnalysisFourResultListFire
    state.InitialFuelsList = res?.dateAnalysisThreeResult?.threeResultsFire || ''
    state.WayTimeList =[
      [
        res?.dateAnalysisSixResults?.dateOne,
        res?.dateAnalysisSixResults?.dateTwo,
        res?.dateAnalysisSixResults?.dateThree,
        res?.dateAnalysisSixResults?.dateFour
      ]
    ]
    state.FightingTimeList =[ 
      [
        res?.dateAnalysisSevenResult?.dateOne,
        res?.dateAnalysisSevenResult?.dateTwo,
        res?.dateAnalysisSevenResult?.dateThree,
        res?.dateAnalysisSevenResult?.dateFour,
        res?.dateAnalysisSevenResult?.dateFive,
        res?.dateAnalysisSevenResult?.dateSix,
      ]
    ]
    if(state.isStanding === false){
      state.statisticsList = [
        ...state.statisticsList,
        ...getStatisticsInfo(res,'firelistMap',state.isStanding)
      ]
      state.fireCardInfo = {
        name:'火灾起数',
        number:res?.dateAnalysisHeadResult?.fireCount,
        percent:res?.dateAnalysisHeadResult?.fireCountYOY
      }
    }
  }
  // 获取警情接口
  const getPoliceInfo = async()=>{
    const res = await getDataAnalysis(formatParams())
    console.log(res,'getPoliceInfo');
    state.FireInfoList = res?.dateAnalysisFourResult?.dateAnalysisFourResultListFire
    if(state.isStanding === false){
      state.statisticsList = [
        ...state.statisticsList,
        ...getStatisticsInfo(res,'policelistMap',state.isStanding)
      ]
      state.policeCardInfo = {
        name:'警情总数',
        number:res?.dateAnalysisHeadResult?.qsWarningNum,
        percent:res?.dateAnalysisHeadResult?.qsWarningNumYOY
      }
    }else{
      state.policelist = getStatisticsInfo(res,'policelistMap2',state.isStanding)
      state.fitghtList =  getStatisticsInfo(res,'fightListMap2',state.isStanding,'dateAnalysisFiveResult')
    }
  }
  // 获取榜单列表
  const getRank = async(params= {})=>{
    const res = await getAnnualList({...formatParams(),annual:1,...params,})
    console.log(res,'getRank');
    state.rankList = res
  }

  // 获取出动信息
  const getDispatch = async()=>{
    const res = await getDispatchInfo(formatParams())
    console.log(res,'getDispatch');
    if(state.isStanding === false){
      state.statisticsList = [
        ...state.statisticsList,
        ...getStatisticsInfo(res,'dispatchListMap',state.isStanding)
      ]
      state.dispatchCardInfo = {
        title:'出动次数',
        number:res?.totalDispatch || 0,
        percent:res?.totalDispatchPro || 0,
      }
    }else{
      state.policelist = getStatisticsInfo(res,'dispatchListMap2',state.isStanding)
    }
  }
  // 获取火灾平均时长
  const getDispatchInfoList = async()=>{
    const res = await getAverageTime(formatParams())
    state.DispatchInfoList = res
    console.log(res,'getDispatchInfoList');
  }

  // 获取参展形式列表
  const getStyle= async()=>{
    const res = await getStylePercent(formatParams())
    console.log(res,'getStyle');
  }

  // 获取通知列表
  const getFireNoticeList = async()=>{
    const res = await getFireNotice(formatParams())
    state.noticeList = res
    console.log(res,'getStyle');
  }

  const goNotice=()=>{
    router.push({
      path:'./noticeList'
    })
  }
  const getAllData = ()=>{
    const toast = showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    });
    Promise.all([
      getPoliceInfo(),
      getFireInfo(),
      getRank(),
      getDispatch(),
      getDispatchInfoList(),
      getStyle(),
      getFireNoticeList()
    ]).then((res)=>{
      closeToast();
    })
  }
  getAllData()
  watch(()=>state.currentTime,(val)=>{
    getAllData()
  })
  // getPoliceInfo()
  // getFireInfo()
  // getRank()
  // getDispatch()
  // getDispatchInfoList()
  // getStyle()
  // getFireNoticeList()
  // onMounted(()=>{
    
  // })
  return {
    ...toRefs(state),
    openTimePop,
    confirmTime,
    getRank,
    goNotice
  }
}

const getCurrentTime = ()=>{
  const year = Time.of().getYear()
  const month =  Time.of().getMonth()
  return [year,month]
}

// 非队站枚举
const policelistMap = [
  {
    label:'警情总数',
    numberKey:'qsWarningNum',
    YOYkey:'qsWarningNumYOY'
  },
  {
    label:'火灾扑救',
    numberKey:'fireCount',
    YOYkey:'hzpjWarningNumYOY'
  },
  {
    label:'抢险救援',
    numberKey:'qxjyWarningNum',
    YOYkey:'qxjyWarningNumYOY'
  },
  {
    label:'社会救助',
    numberKey:'shjzWarningNum',
    YOYkey:'shjzWarningNumYOY'
  },
  {
    label:'安保勤务',
    numberKey:'abqwWarningNum',
    YOYkey:'abqwWarningNumYOY'
  },
  {
    label:'虚假警',
    numberKey:'xjjWarningNum',
    YOYkey:'xjjWarningNumYOY'
  }
]

const firelistMap = [
  {
    label:'火灾起数',
    numberKey:'hzpjWarningNum',
    YOYkey:'hzpjWarningNumYOY'
  },
  {
    label:'非轻微火灾',
    numberKey:'nonMinorFireCount',
    YOYkey:'nonMinorFireCountYOY'
  },
  {
    label:'未出动火灾',
    numberKey:'noFireOccurredCount',
    YOYkey:'noFireOccurredCountYOY'
  },
  {
    label:'死亡人数',
    numberKey:'deCount',
    YOYkey:'deCountYOY'
  },
  {
    label:'受伤人数',
    numberKey:'ssCount',
    YOYkey:'ssCountYOY'
  },
  {
    label:'直接经济损失',
    numberKey:'disCount',
    YOYkey:'disCountYOY'
  },
]

const dispatchListMap = [
  {
    label:'出动总队次',
    numberKey:'totalDispatch',
    YOYkey:'totalDispatchPro'
  },
  {
    label:'火灾扑救次数',
    numberKey:'hzpj',
    YOYkey:'hzpjPro'
  },
  {
    label:'抢险救援次数',
    numberKey:'qxjy',
    YOYkey:'qxjyPro'
  },
  {
    label:'国家队出动队次',
    numberKey:'national',
    YOYkey:'nationalPro'
  },
  {
    label:'专职队出动队次',
    numberKey:'dedicated',
    YOYkey:'dedicatedPro'
  },
  {
    label:'全勤指挥部出动队次',
    numberKey:'headquarters',
    YOYkey:'headquartersPro'
  },
  {
    label:'抢救被困人数',
    numberKey:'rescueNum',
    YOYkey:'rescueNumPro'
  },{
    label:'抢救财产价值（万元）',
    numberKey:'protectNum',
    YOYkey:'protectNumPro'
  }
]

// 队站枚举
const policelistMap2 = [
  ...policelistMap
]
const dispatchListMap2 = [
  {
    label:'出动总队次',
    numberKey:'totalDispatch',
    YOYkey:'totalDispatchPro'
  },
  {
    label:'出动车辆数',
  },
  {
    label:'出动人数',
  },
  {
    label:'抢险救援次数',
    numberKey:'qxjy',
    YOYkey:'qxjyPro'
  },
  ,{
    label:'抢救财产价值（万元）',
    numberKey:'protectNum',
    YOYkey:'protectNumPro'
  }
]

const fightListMap2 = [
  {
    label:'抢救人数',
    numberKey:'rescueNum',
    YOYkey:'rescueNumPro'
  },
  {
    label:'疏散转移人数，',
    numberKey:'rescueNumMom',
    YOYkey:'rescueNumMomPro'
  },
  {
    label:'抢救财产价值、',
    numberKey:'protectNumMom',
    YOYkey:'protectNumMomPro'
  },
  {
    label:'保护财产价值，',
    numberKey:'evacuateNumMom',
    YOYkey:'evacuateNumMomPro'
  }
]



const getStatisticsInfo = (data,type,flag,infoKey = 'dateAnalysisHeadResult')=>{
  let map
  const typeMap = {
    policelistMap:1,
    firelistMap:3,
    dispatchListMap:2,
  }
  if(flag){
    map = {
      policelistMap2,
      dispatchListMap2,
      fightListMap2
    }
  }else{
    map = {
      policelistMap,
      firelistMap,
      dispatchListMap
    }
  }
  return map[type].map(item=>{
    let number,percent
    if(type === 'dispatchListMap'){
      number = data?.[item.numberKey]
      percent= data?.[item.YOYkey]
    }else{
      number = data?.[infoKey]?.[item.numberKey]
      percent= data?.[infoKey]?.[item.YOYkey]
    }
    return {
      title:item.label,
      number,
      percent,
      type:typeMap[type]
    }
  })
}

