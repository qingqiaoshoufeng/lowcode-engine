import { reactive, toRefs, watch } from 'vue'
import { showLoadingToast, closeToast } from 'vant';
import router from '@/router/index.js'
import Time from '@/utils/time.js'
import { cardList } from '../config.js'
import { gethomePageInfo, getFireNotice } from '@/apis/index.js'
import store from '@/store'

export default function useSearch({ dataPickerRef, statisticsInfoRef, YearRankRef }) {
  const ORGLEVEL = store.state.userInfo?.userInfo?.ORGLEVEL
  const state = reactive({
    currentTime: getCurrentTime(),
    isShow: {
      time: false
    },
    isStanding: ORGLEVEL === 5,
    cardList,
    FireInfoList: '', // 百万人口火灾
    DispatchInfoList: '', // 出动平均时长列表
    InitialFuelsList: [],// 高频起火场所
    WayTimeList: "", // 到场时间列表
    FightingTimeList: '',
    rankList: [], // 排行榜
    policeCardInfo: {},
    dispatchCardInfo: {},
    fireCardInfo: {},
    statisticsList: [],
    fitghtList: [],
    policelist: [], //
    dispatchList: [],
    noticeList: [],
    FireAreaList: '',
    FireSiteList: '',
    // DispatchInfoList:[] // 出动平均时长列表
    generalInfo: [],
    formInfo: [],
    dataUpdatedTime: '',
  })

  const openTimePop = () => {
    state.isShow.time = true
  }

  const closeTimePop = () => {
    state.isShow.time = false
  }

  const confirmTime = (val) => {
    closeTimePop()
  }

  const formatParams = () => {
    const [year, month] = state.currentTime
    const params = month === '全年' ? {
      yearFlag: 1,
      year
    } : {
      monthFlag: 1,
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
      if (data) {
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
  const getCardInfo = (res) => {
    const data = res.dateAnalysisHeadResult
    if (data) {
      state.policeCardInfo = {
        name: '警情总数',
        percent: data.warningHeadStatisticsVo?.qsWarningNumYOY,
        number: data.warningHeadStatisticsVo?.qsWarningNum
      },
        state.dispatchCardInfo = {
          name: '火灾起数',
          percent: data.fireHeadStatisticsVo?.fireCountYOY,
          number: data.fireHeadStatisticsVo?.fireCount
        },
        state.fireCardInfo = {
          name: '出动总队次',
          percent: data.dispatchStatisticsVO?.totalDispatchPro,
          number: data.dispatchStatisticsVO?.totalDispatch
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
      return `<span style="color:#2F6BFF">${str}</span>`
    })
  }
  // 获取形式分析数据
  const getFormInfo = (res) => {
    if (res?.formalAnalysis && res?.formalAnalysis?.length) {
      state.formInfo = res?.formalAnalysis.map((item, index) => {
        if (!index) {
          return `${item?.split('，')[0]}，${formatGeneralInfo(item?.split('，')?.filter((item, index) => index).join('，') || '')}`
        }
        return formatGeneralInfo(item)
      })
    }
    else {
      state.formInfo = ''
    }
  }
  const getGeneralInfo = (res) => {
    state.generalInfo = [
      `${res?.warningOverview?.split('，')[0]}，${formatGeneralInfo(res?.warningOverview?.split('，')?.filter((item, index) => index).join('，') || '')}`,
      formatGeneralInfo(res?.dispatchOverview || ''),
      formatGeneralInfo(res?.fireOverview || ''),
    ]
  }
  // const getGeneralInfo = (res) => {
  //   state.generalInfo = [
  //     formatGeneralInfo(res?.warningOverview || '').slice(0, -1),
  //     formatGeneralInfo(res?.dispatchOverview || '').slice(0, -1),
  //     formatGeneralInfo(res?.fireOverview || '').slice(0, -1),
  //   ]
  // }
  // // 获取形式分析数据
  // const getFormInfo = (res) => {
  //   if (res?.formalAnalysis && res?.formalAnalysis?.length) {
  //     state.formInfo = res?.formalAnalysis.map((item) => {
  //       return formatGeneralInfo(item)
  //     })
  //   }
  // }
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
  const getFireNoticeList = async () => {
    const res = await getFireNotice({ status: 1 }) || []
    // console.log();
    state.noticeList = [
      ...res.filter((item, index) => (index < 3))
    ]
  }

  const goNotice = () => {
    router.push({
      path: './noticeList'
    })
  }
  const getAllData = () => {
    YearRankRef && YearRankRef.value && (YearRankRef.value.currentTab = 1)
    const toast = showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    });
    Promise.all([
      postHomePageInfo(),
      getFireNoticeList()
    ]).then((res) => {
      closeToast();
    })
  }
  getAllData()
  watch(() => state.currentTime, (val) => {
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

const getCurrentTime = () => {
  const year = Time.of().getYear()
  const month = Time.of().getMonth()
  return [year, month]
}

const policelistMap = [
  {
    label: '警情总数',
    numberKey: 'qsWarningNum',
    YOYkey: 'qsWarningNumYOY',
    color: 'blue',
    unit: '起',
  },
  {
    label: '火灾扑救',
    numberKey: 'hzpjWarningNum',
    YOYkey: 'hzpjWarningNumYOY',
    color: 'red',
    unit: '起',
  },
  {
    label: '抢险救援',
    numberKey: 'qxjyWarningNum',
    YOYkey: 'qxjyWarningNumYOY',
    color: 'red',
    unit: '起',
  },
  {
    label: '社会救助',
    numberKey: 'shjzWarningNum',
    YOYkey: 'shjzWarningNumYOY',
    color: 'red',
    unit: '起',
  },
  {
    label: '安保勤务',
    numberKey: 'abqwWarningNum',
    YOYkey: 'abqwWarningNumYOY',
    color: 'red',
    unit: '起',
  },
  {
    label: '虚假警',
    numberKey: 'xjjWarningNum',
    YOYkey: 'xjjWarningNumYOY',
    color: 'red',
    unit: '起',
  },
  {
    label: '指挥部出动警情',
    numberKey: 'headWarningNum',
    YOYkey: 'headWarningNumPro',
    color: 'green',
    unit: '起',
  },
  {
    label: '跨省跨市警情',
    numberKey: 'otherNum',
    YOYkey: 'otherNumPro',
    color: 'green',
    unit: '起',
  },
]

const firelistMap = [
  {
    label: '火灾总数',
    numberKey: 'fireCount',
    YOYkey: 'fireCountYOY',
    color: 'blue',
    unit: '起',
  },
  {
    label: '非轻微火灾',
    numberKey: 'nonMinorFireCount',
    YOYkey: 'nonMinorFireCountYOY',
    color: 'red',
    unit: '起',
  },
  // {
  //   label: '未出动火灾',
  //   numberKey: 'noFireOccurredCount',
  //   YOYkey: 'noFireOccurredCountYOY',
  //   color: 'red',
  //   unit: '起',
  // },
  {
    label: '死亡人数',
    numberKey: 'deCount',
    YOYkey: 'deCountYOY',
    color: 'green',
    unit: '人',
  },
  {
    label: '死亡人数（较大火灾）',
    numberKey: 'largerFireDeathCount',
    YOYkey: 'largerFireDeathCountYOY',
    color: 'red',
    unit: '人',
  },
  {
    label: '重伤人数',
    numberKey: 'zsCount',
    YOYkey: 'zsCountYOY',
    color: 'green',
    unit: '人',
  },
  {
    label: '受伤人数',
    numberKey: 'ssCount',
    YOYkey: 'ssCountYOY',
    color: 'green',
    unit: '人',
  },
  {
    label: '直接经济损失',
    numberKey: 'disCount',
    YOYkey: 'disCountYOY',
    color: 'green',
    unit: '万元',
  },
  {
    label: '直接财产损失',
    numberKey: 'disProCount',
    YOYkey: 'disProCountYOY',
    color: 'green',
    unit: '万元',
  },
]

const dispatchListMap = [
  {
    label: '队站出动队次',
    numberKey: 'totalDispatch',
    YOYkey: 'totalDispatchPro',
    color: 'blue',
    unit: '队次',
  },
  {
    label: '队站出动人次',
    numberKey: 'person',
    YOYkey: 'personPro',
    color: 'blue',
    unit: '人次',
  },
  {
    label: '火灾扑救',
    numberKey: 'hzpj',
    YOYkey: 'hzpjPro',
    color: 'red',
    unit: '队次',
  },
  {
    label: '抢险救援',
    numberKey: 'qxjy',
    YOYkey: 'qxjyPro',
    color: 'red',
    unit: '队次',
  },
  {
    label: '国家队出动',
    numberKey: 'national',
    YOYkey: 'nationalPro',
    color: 'red',
    unit: '队次',
  },
  {
    label: '专职队出动',
    numberKey: 'dedicated',
    YOYkey: 'dedicatedPro',
    color: 'red',
    unit: '队次',
  },
  {
    label: '全勤指挥部出动',
    numberKey: 'headquarters',
    YOYkey: 'headquartersPro',
    color: 'red',
    unit: '队次',
  },
  {
    label: '抢救被困',
    numberKey: 'rescueNum',
    YOYkey: 'rescueNumPro',
    color: 'green',
    unit: '人',
  }, {
    label: '抢救财产价值',
    numberKey: 'emergencyNum',
    YOYkey: 'emergencyNumPro',
    color: 'green',
    unit: '万元',
  },
  {
    label: '保护财产价值（万元）',
    numberKey: 'protectNum',
    YOYkey: 'protectNumPro',
    color: 'green',
    unit: '万元',
  },
]

// 队站枚举
const policelistMap2 = [
  ...policelistMap.filter(item => !['指挥部出动警情', '跨省跨市警情'].includes(item.label)),
]

const dispatchListMap2 = [
  {
    label: '出动队次',
    numberKey: 'totalDispatch',
    YOYkey: 'totalDispatchPro',
    unit: '队次',
  },
  {
    label: '出动车辆',
    numberKey: 'car',
    YOYkey: 'carPro',
    unit: '辆次',
  },
  {
    label: '出动人次',
    numberKey: 'person',
    YOYkey: 'personPro',
    unit: '人次',
  },
  {
    label: '抢险救援',
    numberKey: 'qxjy',
    YOYkey: 'qxjyPro',
    unit: '队次',
  },
  {
    label: '火灾扑救',
    numberKey: 'hzpj',
    YOYkey: 'hzpjPro',
    unit: '队次',
  },
]

const fightListMap2 = [
  {
    label: '抢救人数',
    numberKey: 'rescueNum',
    YOYkey: 'rescueNumPro',
    unit: '人',
  },
  {
    label: '疏散转移人数',
    numberKey: 'evacuateNum',
    YOYkey: 'evacuateNumPro',
    unit: '人',
  },
  {
    label: '抢救财产价值',
    numberKey: 'emergencyNum',
    YOYkey: 'emergencyNumPro',
    unit: '万元',
  },
  {
    label: '保护财产价值',
    numberKey: 'protectNum',
    YOYkey: 'protectNumPro',
    unit: '万元',
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
      color: item.color,
      unit: item.unit,
    }
  })
}


