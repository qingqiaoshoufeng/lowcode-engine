import { reactive,toRefs,onMounted, nextTick,watch} from 'vue'
import { showLoadingToast,closeToast  } from 'vant';
import router from '@/router/index.js'
import Time from '@/utils/time.js'
import { cardList} from '../config.js'
import { gethomePageInfo,getFireNotice} from '@/apis/index.js'
import store from '@/store'

export default function useSearch({dataPickerRef,statisticsInfoRef,YearRankRef}){
  const ORGLEVEL = store.state.userInfo?.userInfo?.ORGLEVEL
  const state = reactive({
    currentTime:getCurrentTime(),
    isShow:{
      time:false
    },
    isStanding:ORGLEVEL === 5,
    cardList,
    FireInfoList:'', // 百万人口火灾
    DispatchInfoList: '', // 出动平均时长列表
    InitialFuelsList:[],// 高频起火场所
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
    noticeList:[],
    FireAreaList:'',
    FireSiteList:'',
    // DispatchInfoList:[] // 出动平均时长列表
    generalInfo:[],
    formInfo: [],
    dataUpdatedTime:'',
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
  const getStatisticsInfoList = (res) => {
    const data = res.dateAnalysisHeadResult
    if (state.isStanding === false) {
      if (data) {
        const allMapData = {
          ...data.dispatchStatisticsVO || {},
          ...data.fireHeadStatisticsVo || {},
          ...data.warningHeadStatisticsVo || {},
        }
        state.statisticsList = [
          ...getStatisticsInfo(allMapData, 'firelistMap', state.isStanding, 'dispatchStatisticsVO'),
          ...getStatisticsInfo(allMapData, 'policelistMap', state.isStanding, 'dispatchStatisticsVO'),
          ...getStatisticsInfo(allMapData, 'dispatchListMap', state.isStanding, 'dispatchStatisticsVO'),
        ]
      }
    }
    else {
      if(data){
        const allMapData = {
          ...data.dispatchStatisticsVO || {},
          ...data.warningHeadStatisticsVo || {},
        }
        state.fitghtList = getStatisticsInfo(res.dateAnalysisFiveResult || {}, 'fightListMap2', state.isStanding)
        state.policelist = getStatisticsInfo(allMapData, 'policelistMap2', state.isStanding, 'dispatchStatisticsVO')
        state.dispatchList = getStatisticsInfo(allMapData, 'dispatchListMap2', state.isStanding, 'dispatchStatisticsVO')
      }
    }
  }
  const getFireAllocationList = (res) => {
    const data = res?.dispatchSituationVO?.dispatchAreaVO
    if (data) {
      state.FireAllocationList = [
        { value: data?.cssq, name: '城市市区' },
        { value: data?.jzzq, name: '集镇镇区' },
        { value: data?.kfq, name: '开发区' },
        { value: data?.lyq, name: '旅游区' },
        { value: data?.rural, name: '乡村' },
        { value: data?.xccq, name: '县城城区' },
      ]
    }
  }

  // 获取接警出动情况
  const getDealAllocationList = (res) => {
    const data = res?.dispatchSituationVO
    if (data) {
      state.DealAllocationList = [
        { value: data.implement, name: '到场实施处置' },
        { value: data.noImplement, name: '到场未实施处置' },
        { value: data.middleReturn, name: '中途返回' },
      ]
    }
  }

  // 获取火灾相关信息
  const getFireInfo = async (res) => {
    // state.FireInfoList = res?.dateAnalysisFourResult?.dateAnalysisFourResultListFire
    // state.InitialFuelsList = res?.dateAnalysisSevenResult?.dateAnalysisSevenResultList || []
    state.FireSiteList = res?.dateAnalysisFirePlaceResult?.firePlaceResultList?.reverse() || ''
  }

  // 获取榜单列表
  const getRank = async (params = {}) => {
    const key = (params.annual === 1) ? 'warList' : 'fireList'

    state.rankList = state.rankListMap?.[key] || ''
  }
  const getAnsweringAlarmList = (params) => {
    const key = (params.annual === 2) ? 'reinforcement' : 'tripRespond'
    state.AnsweringAlarmList = state.AnsweringAlarmInfoList?.[key]?.map((item) => {
      return {
        type: key,
        ...item,
      }
    })?.sort((a, b) => (a.totalDispatch - b.totalDispatch)) || ''
  }

  const getInitialFuelsList = (res) => {
    const data = res?.dateAnalysisFirePlaceResult || []
    if (data) {
      state.InitialFuelsList = data.qhwResult
    }
  }
  // 获取百万人口火灾
  const getFireInfoList = (res) => {    
    state.FireInfoList = res.fireCountList || ''
    // const key = (params.annual === 2) ? 'deCount' : 'hzCount'
    // state.FireInfoList = state.FireInfoListMap?.[key] || ''
  }
  // 获取途中分布时长
  const getWayTimeList = (res) => {
    const data = res.dateAnalysisSixResult
    if (data) {
      state.WayTimeList = [
        [
          data.dateOne,
          data.dateTwo,
          data.dateThree,
          data.dateFour,
        ],
      ]
    }
  }
  // 获取战斗时长分布
  const getFightingTimeList = (res) => {
    const data = res.dateAnalysisSevenResult
    if (data) {
      state.FightingTimeList = [
        [
          data.dateOne,
          data.dateTwo,
          data.dateThree,
          data.dateFour,
          data.dateFive,
          data.dateSix,
        ],
      ]
    }
  }
  // 获取卡片信息
  const getCardInfo = (res) =>{
    const data = res.dateAnalysisHeadResult
    if (data) {
      state.policeCardInfo={
        name:'警情总数',
        percent:data.warningHeadStatisticsVo?.qsWarningNumYOY,
        number:data.warningHeadStatisticsVo?.qsWarningNum
      },
      state.dispatchCardInfo={
        name:'火灾起数',
        percent:data.fireHeadStatisticsVo?.fireCountYOY,
        number:data.fireHeadStatisticsVo?.fireCount
      },
      state.fireCardInfo={
        name:'出动总队次',
        percent:data.dispatchStatisticsVO?.totalDispatchPro,
        number:data.dispatchStatisticsVO?.totalDispatch
      }
    }
  }
  
  // 获取火灾平均时长
  const getDispatchInfoList = async (res) => {
    state.DispatchInfoList = (res?.fireAvgTimeVO?.fireAvgTimeVOList || [])?.sort((a, b) => (b.avgTime - a.avgTime))
  }
  // 获取参展形式列表
  const getStyle = async (res) => {
    const data = res.dateAnalysisCzResultList
    if (data) {
      state.FireAreaList = data
    }
  }

  // 获取概况文本
  // 格式化数据
  const formatGeneralInfo = (val) => {
    const r = /[0-9][\.]*/g
    // const r = /[^\d\.]/g
    return val.replace(r, (str) => {
      return `<span style="color:#FC5B3F">${str}</span>`
    })
  }
  const getGeneralInfo = (res) => {
    state.generalInfo = [
      formatGeneralInfo(res?.warningOverview || '').slice(0, -1),
      formatGeneralInfo(res?.dispatchOverview || '').slice(0, -1),
      formatGeneralInfo(res?.fireOverview || '').slice(0, -1),
    ]
  }
  // 获取形式分析数据
  const getFormInfo = (res) => {
    if (res?.formalAnalysis && res?.formalAnalysis?.length) {
      state.formInfo = res?.formalAnalysis.map((item) => {
        return formatGeneralInfo(item)
      })
    }
  }
  // 获取页面数据
  const postHomePageInfo = async () => {
    const res = await gethomePageInfo({
      ...formatParams(),
      isStanding: state.isStanding,
    })
    if (state.isStanding) {
      getStatisticsInfoList(res)
      getWayTimeList(res)
      getFightingTimeList(res)
      getStyle(res)
    }
    else {
      state.rankListMap = res.homePageAnnualVO || {}
      state.AnsweringAlarmInfoList = res.dispatchSituationVO || {}
      state.FireInfoListMap = res.fireCountList?.reduce((current, item) => {
        const { county, hzCount, deCount } = item
        current.hzCount.push({
          name: county,
          value: hzCount,
          type: 'hzCount',
        })
        current.deCount.push({
          name: county,
          value: deCount,
          type: 'deCount',
        })
        return current
      }, {
        hzCount: [],
        deCount: [],
      })
      getFireInfo(res)
      getStatisticsInfoList(res)
      getDispatchInfoList(res)
      getCardInfo(res),
      getRank({ annual: 1 })
      getFireAllocationList(res)
      getDealAllocationList(res)
      getAnsweringAlarmList({ annual: 1 })
      getInitialFuelsList(res)
      getFireInfoList(res)
      getGeneralInfo(res)
      getFormInfo(res)
    }
    state.dataUpdatedTime = res.dataUpdatedTime
  }

  // 获取通知列表
  const getFireNoticeList = async()=>{
    const res = await getFireNotice({status:1}) || []
    state.noticeList = res.filter((item,index)=>(index<3))
  } 

  const goNotice=()=>{
    router.push({
      path:'./noticeList'
    })
  }
  const getAllData = ()=>{
    YearRankRef && YearRankRef.value && (YearRankRef.value.currentTab = 1)
    const toast = showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    });
    Promise.all([
      postHomePageInfo(),
      getFireNoticeList()
    ]).then((res)=>{
      closeToast();
    })
  }
  getAllData()
  watch(()=>state.currentTime,(val)=>{
    getAllData()
  })
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
    label: '警情（总起数）',
    numberKey: 'qsWarningNum',
    YOYkey: 'qsWarningNumYOY',
  },
  {
    label: '火灾扑救（起数）',
    numberKey: 'hzpjWarningNum',
    YOYkey: 'hzpjWarningNumYOY',
  },
  {
    label: '抢险救援（起数）',
    numberKey: 'qxjyWarningNum',
    YOYkey: 'qxjyWarningNumYOY',
  },
  {
    label: '社会救助（起数）',
    numberKey: 'shjzWarningNum',
    YOYkey: 'shjzWarningNumYOY',
  },
  {
    label: '安保勤务（起数）',
    numberKey: 'abqwWarningNum',
    YOYkey: 'abqwWarningNumYOY',
  },
  {
    label: '虚假警（起数）',
    numberKey: 'xjjWarningNum',
    YOYkey: 'xjjWarningNumYOY',
  },
  {
    label: '指挥部出动警情（起数）',
    numberKey: 'headWarningNum',
    YOYkey: 'headWarningNumPro',
  },
  {
    label: '跨省跨市警情（起数）',
    numberKey: 'otherNum',
    YOYkey: 'otherNumPro',
  },
]

const firelistMap = [
  {
    label: '火灾（总起数）',
    numberKey: 'fireCount',
    YOYkey: 'fireCountYOY',
  },
  {
    label: '非轻微火灾（起数）',
    numberKey: 'nonMinorFireCount',
    YOYkey: 'nonMinorFireCountYOY',
  },
  {
    label: '未出动火灾（起数）',
    numberKey: 'noFireOccurredCount',
    YOYkey: 'noFireOccurredCountYOY',
  },
  {
    label: '死亡（人数）',
    numberKey: 'deCount',
    YOYkey: 'deCountYOY',
  },
  {
    label: '受伤（人数）',
    numberKey: 'ssCount',
    YOYkey: 'ssCountYOY',
  },
  {
    label: '直接经济损失(万元)',
    numberKey: 'disCount',
    YOYkey: 'disCountYOY',
  },
]

const dispatchListMap = [
  {
    label: '队站出动（队次）',
    numberKey: 'totalDispatch',
    YOYkey: 'totalDispatchPro',
  },
  {
    label: '队站出动（人次）',
    numberKey: 'person',
    YOYkey: 'personPro',
  },
  {
    label: '火灾扑救（队次）',
    numberKey: 'hzpj',
    YOYkey: 'hzpjPro',
  },
  {
    label: '抢险救援（队次）',
    numberKey: 'qxjy',
    YOYkey: 'qxjyPro',
  },
  {
    label: '国家队出动（队次）',
    numberKey: 'national',
    YOYkey: 'nationalPro',
  },
  {
    label: '专职队出动（队次）',
    numberKey: 'dedicated',
    YOYkey: 'dedicatedPro',
  },
  {
    label: '全勤指挥部出动（队次）',
    numberKey: 'headquarters',
    YOYkey: 'headquartersPro',
  },
  {
    label: '抢救被困（人数）',
    numberKey: 'rescueNum',
    YOYkey: 'rescueNumPro',
  }, {
    label: '抢救财产价值（万元）',
    numberKey: 'emergencyNum',
    YOYkey: 'emergencyNumPro',
  },
  {
    label: '保护财产价值（万元）',
    numberKey: 'protectNum',
    YOYkey: 'protectNumPro',
  },
]

// 队站枚举
const policelistMap2 = [
  ...policelistMap.filter(item=>!['指挥部出动警情（起数）', '跨省跨市警情（起数）'].includes(item.label))
]
const dispatchListMap2 = [
  {
    label: '出动（队次）',
    numberKey: 'totalDispatch',
    YOYkey: 'totalDispatchPro',
  },
  {
    label: '出动车辆（辆次）',
    numberKey: 'car',
    YOYkey: 'carPro',
  },
  {
    label: '出动（人次）',
    numberKey: 'person',
    YOYkey: 'personPro',
  },
  {
    label: '抢险救援（队次）',
    numberKey: 'qxjy',
    YOYkey: 'qxjyPro',
  },
  {
    label: '火灾扑救（队次）',
    numberKey: 'hzpj',
    YOYkey: 'hzpjPro',
  },
]

const fightListMap2 = [
  {
    label: '抢救（人数）',
    numberKey: 'rescueNum',
    YOYkey: 'rescueNumPro',
  },
  {
    label: '疏散转移（人数）',
    numberKey: 'evacuateNum',
    YOYkey: 'evacuateNumPro',
  },
  {
    label: '抢救财产价值（万元） ',
    numberKey: 'mergencyNum:',
    YOYkey: 'mergencyNumPro',
  },
  {
    label: '保护财产价值（万元）',
    numberKey: 'protectNum',
    YOYkey: 'protectNumPro',
  },
]



const getStatisticsInfo = (data, type, flag) => {
  let map
  const typeMap = {
    policelistMap: 1,
    firelistMap: 3,
    dispatchListMap: 2,
  }
  if (flag) {
    map = {
      policelistMap2,
      dispatchListMap2,
      fightListMap2,
    }
  }
  else {
    map = {
      policelistMap,
      firelistMap,
      dispatchListMap,
    }
  }
  return map[type].map((item) => {
    // let number, percent
    // if (['dispatchListMap', 'dispatchListMap2'].includes(type)) {
    const number = data?.[item.numberKey]
    const percent = data?.[item.YOYkey]
    // }
    // else {
    //   // debugger
    //   number = data?.[item.numberKey]
    //   percent = data?.[item.YOYkey]
    //   // number = data[item.numberKey]
    //   // percent = data[item.YOYkey]
    // }
    return {
      title: item.label,
      number,
      percent,
      type: typeMap[type],
    }
  })
}


