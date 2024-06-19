import dayjs from 'dayjs'

export const dateTimeRange = {
  今日: [dayjs().startOf('day'), dayjs().endOf('day')],
  昨日: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
  本周: [dayjs().startOf('week'), dayjs().endOf('week')],
  上周: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')],
  本月: [dayjs().startOf('month'), dayjs().endOf('month')],
  上月: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
  本年: [dayjs().startOf('year'), dayjs().endOf('year')],
  去年: [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')],
  // 近一周: [dayjs().subtract(1, 'week').startOf('day').add(1, 'day'), dayjs().endOf('day')],
  近一个月: [dayjs().subtract(1, 'month').startOf('day').add(1, 'day'), dayjs().endOf('day')],
}

export const gutter = 40

export const MSG_EXPORT_NO_DATA = '当前条件下无可查数据，请重新选择！'

export const injuryType = [
  {
    dictName: '轻伤',
    boDictId: '1',
  },
  {
    dictName: '重伤',
    boDictId: '2',
  },
  {
    dictName: '死亡',
    boDictId: '3',
  },
]

export const isNot = [
  {
    dictName: '是',
    boDictId: '1',
  },
  {
    dictName: '否',
    boDictId: '2',
  },
]

export const isCase = [
  {
    dictName: '已立案',
    boDictId: '1',
  },
  {
    dictName: '未立案',
    boDictId: '2',
  },
]

export const install = [
  {
    dictName: '已安装',
    boDictId: '1',
  },
  {
    dictName: '未安装',
    boDictId: '2',
  },
]

export const uninstall = [
  {
    dictName: '不需要安装',
    boDictId: '1',
  },
  {
    dictName: '违反规定',
    boDictId: '2',
  },
]

export const start = [
  {
    dictName: '已启动',
    boDictId: '1',
  },
  {
    dictName: '未启动',
    boDictId: '2',
  },
]

export const notStart = [
  {
    dictName: '故障',
    boDictId: '1',
  },
  {
    dictName: '其他',
    boDictId: '2',
  },
]

export const effect = [
  {
    dictName: '有效',
    boDictId: '1',
  },
  {
    dictName: '无效',
    boDictId: '2',
  },
]

export const regulation = [
  {
    dictName: '设置、管理符合规定',
    boDictId: '1',
  },
  {
    dictName: '设置、管理不符合规定',
    boDictId: '2',
  },
]

export const fireSafetyUnits = [
  {
    dictName: '一般消防安全重点单位',
    boDictId: '1',
  },
  {
    dictName: '火灾高危单位',
    boDictId: '2',
  },
]

export const severity = [
  {
    dictName: '轻微火灾',
    boDictId: '1',
  },
  {
    dictName: '非轻微火灾',
    boDictId: '2',
  },
]

export const lightNonConformance = [
  {
    dictName: '未安装',
    boDictId: '1',
  },
  {
    dictName: '损坏',
    boDictId: '2',
  },
  {
    dictName: '其他',
    boDictId: '3',
  },
]

export const gender = [
  {
    dictName: '男',
    boDictId: '1',
  },
  {
    dictName: '女',
    boDictId: '2',
  },
  {
    dictName: '未知',
    boDictId: '3',
  },
]

export const exitNonConformance = [
  {
    dictName: '上锁',
    boDictId: '1',
  },
  {
    dictName: '其他',
    boDictId: '2',
  },
]

export const routeNonConformance = [
  {
    dictName: '堵塞',
    boDictId: '1',
  },
  {
    dictName: '其他',
    boDictId: '2',
  },
]

export const networkAlarm = [
  {
    dictName: '系统自动报警',
    boDictId: '1',
  },
  {
    dictName: '其他方式报警',
    boDictId: '2',
  },
]

export const networking = [
  {
    dictName: '已联网',
    boDictId: '1',
  },
  {
    dictName: '未联网',
    boDictId: '2',
  },
]

export const isResearch = [
  {
    dictName: '正在调查，待完善',
    boDictId: '1',
  },
  {
    dictName: '调查完毕，全部完成',
    boDictId: '2',
  },
]

export const dispatchType = [
  {
    boDictId: '1',
    dictName: '主战',
  }, {
    boDictId: '2',
    dictName: '增援',
  }, {
    boDictId: '3',
    dictName: '指挥',
  },
]

export const isDispatch = [
  {
    boDictId: '1',
    dictName: '出动',
  }, {
    boDictId: '2',
    dictName: '未出动',
  },
]

export const approval = [
  {
    boDictId: '1',
    dictName: '审核通过',
  },
  {
    boDictId: '2',
    dictName: '退回起草人',
  },
  {
    boDictId: '3',
    dictName: '退回上一级',
  },
]

export const applyRecordType = [
  {
    boDictId: '1',
    dictName: '警情更正申请',
  },
  {
    boDictId: '2',
    dictName: '出动更正申请',
  },
  {
    boDictId: '3',
    dictName: '火灾更正申请',
  },
  {
    boDictId: '4',
    dictName: '警情作废申请',
  },
]

export const applyStatus = [
  {
    boDictId: '1',
    dictName: '待审批',
  },
  {
    boDictId: '2',
    dictName: '审批中',
  },
  {
    boDictId: '3',
    dictName: '已审批',
  },
  {
    boDictId: '4',
    dictName: '被终结',
  },
]

export const applyType = [
  {
    dictName: '重要信息更正',
    boDictId: '1',
  },
  {
    dictName: '普通信息更正',
    boDictId: '2',
  },
]

export const statisticalTime = [
  {
    dictName: '近三天',
    boDictId: '1',
  },
  {
    dictName: '近一周',
    boDictId: '2',
  },
  {
    dictName: '近一月',
    boDictId: '3',
  },
  {
    dictName: '近半年',
    boDictId: '4',
  },
]

export const sceneType = [
  {
    dictName: '警情报表',
    boDictId: 1,
  },
  {
    dictName: '出动报表',
    boDictId: 2,
  },
  {
    dictName: '火灾报表',
    boDictId: 3,
  },
]

export const scopeType = [
  {
    dictName: '本级单位',
    boDictId: 1,
  },
  {
    dictName: '本级及下级单位',
    boDictId: 2,
  },
]

export const statType = [
  {
    dictName: '警情',
    boDictId: 1,
  },
  {
    dictName: '出动',
    boDictId: 2,
  },
  {
    dictName: '火灾',
    boDictId: 3,
  },
]

export const isConnect = [
  {
    dictName: '是',
    boDictId: '1',
  },
  {
    dictName: '否',
    boDictId: '2',
  },
]
export const minorInjury = [
  {
    dictName: '受伤',
    boDictId: '1',
  },
  {
    dictName: '死亡',
    boDictId: '2',
  },
]
export const fireType = [{
  dictName: '警情查询',
  boDictId: '1',
},
{
  dictName: '出动查询',
  boDictId: '2',
},
{
  dictName: '出动查询(全勤指挥部)',
  boDictId: '3',
},
{
  dictName: '火灾查询',
  boDictId: '4',
}]

export const searchParams = [{
  dictName: '警情信息',
  boDictId: '1',
},
{
  dictName: '出动信息(队站)',
  boDictId: '2',
},
{
  dictName: '出动信息(全勤指挥部)',
  boDictId: '3',
},
{
  dictName: '火灾信息',
  boDictId: '4',
}]

export const searchRange = [{
  dictName: '仅自己',
  boDictId: '1',
},
{
  dictName: '本级单位',
  boDictId: '2',
},
{
  dictName: '本级及下级单位',
  boDictId: '3',
}]

export const fieldType = [{
  dictName: '而且',
  boDictId: '1',
},
{
  dictName: '或者(+)',
  boDictId: '2',
},
{
  dictName: '除了(-)',
  boDictId: '3',
},
{
  dictName: '(',
  boDictId: '4',
},
{
  dictName: ')',
  boDictId: '5',
}]

export const statisticRange = [{
  dictName: '节假日',
  boDictId: '1',
},
{
  dictName: '按季',
  boDictId: '2',
},
{
  dictName: '按月',
  boDictId: '3',
},
{
  dictName: '按日',
  boDictId: '4',
},
{
  dictName: '按时',
  boDictId: '5',
}]

export const seasonRange = [{
  dictName: '一季度',
  boDictId: '1',
},
{
  dictName: '二季度',
  boDictId: '2',
},
{
  dictName: '三季度',
  boDictId: '3',
},
{
  dictName: '四季度',
  boDictId: '4',
}]

export const fireHeadLevel = [{
  dictName: '总队全勤指挥部',
  boDictId: '3',
},
{
  dictName: '支队全勤指挥部',
  boDictId: '4',
},
{
  dictName: '大队全勤指挥部',
  boDictId: '5',
}]

export const warningDealStatus = [{
  dictName: '到场实施处置',
  boDictId: '1',
},
{
  dictName: '到场未实施处置',
  boDictId: '2',
},
{
  dictName: '全部中返',
  boDictId: '3',
}]
