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
  近一周:[dayjs().subtract(1, 'week').startOf('day').add(1, 'day'), dayjs().endOf('day')],
  本周以来:[dayjs().startOf('week'), dayjs().endOf('day')],
  本月以来:[dayjs().startOf('month'), dayjs().endOf('day')],
  今年以来:[dayjs().startOf('year'), dayjs().endOf('day')]
}

export const gutter = 40

export const MSG_EXPORT_NO_DATA = '当前条件下无可查数据，请重新选择！'

export const MSG_LOCKING_TEXT = '该数据已被锁定，需联系管理员解锁后才可操作！'

export const MSG_NO_HEAD_REPORT = '暂时无法生成全勤指挥部出动的相关报表！'

export const MSG_IS_CANCEL = '该数据已申请作废，正处于审批中，不允许重复申请！'

export const MSG_IS_EDIT = '该数据已申请更正，正处于审批中，不允许重复申请！'

export const MSG_LOCKING_ADMIN = '包含已被锁定数据，需联系管理员解锁后才可操作！'

export const dispatchInjuryType = [
  {
    label: '受伤',
    value: '1',
  },
  {
    label: '死亡',
    value: '2',
  },
]

export const injuryType = [
  {
    label: '轻伤',
    value: '1',
  },
  {
    label: '重伤',
    value: '2',
  },
  {
    label: '死亡',
    value: '3',
  },
]

export const isNot = [
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '2',
  },
]

export const isCase = [
  {
    label: '已立案',
    value: '1',
  },
  {
    label: '未立案',
    value: '2',
  },
]

export const install = [
  {
    label: '已安装',
    value: '1',
  },
  {
    label: '未安装',
    value: '2',
  },
]

export const uninstall = [
  {
    label: '不需要安装',
    value: '1',
  },
  {
    label: '违反规定',
    value: '2',
  },
]

export const start = [
  {
    label: '已启动',
    value: '1',
  },
  {
    label: '未启动',
    value: '2',
  },
]

export const notStart = [
  {
    label: '故障',
    value: '1',
  },
  {
    label: '其他',
    value: '2',
  },
]

export const effect = [
  {
    label: '有效',
    value: '1',
  },
  {
    label: '无效',
    value: '2',
  },
]

export const regulation = [
  {
    label: '设置、管理符合规定',
    value: '1',
  },
  {
    label: '设置、管理不符合规定',
    value: '2',
  },
]

export const fireSafetyUnits = [
  {
    label: '一般消防安全重点单位',
    value: '1',
  },
  {
    label: '火灾高危单位',
    value: '2',
  },
]

export const severity = [
  {
    label: '轻微火灾',
    value: '1',
  },
  {
    label: '非轻微火灾',
    value: '2',
  },
]

export const lightNonConformance = [
  {
    label: '未安装',
    value: '1',
  },
  {
    label: '损坏',
    value: '2',
  },
  {
    label: '其他',
    value: '3',
  },
]

export const gender = [
  {
    label: '男',
    value: '1',
  },
  {
    label: '女',
    value: '2',
  },
  {
    label: '未知',
    value: '3',
  },
]

export const exitNonConformance = [
  {
    label: '上锁',
    value: '1',
  },
  {
    label: '其他',
    value: '2',
  },
]

export const routeNonConformance = [
  {
    label: '堵塞',
    value: '1',
  },
  {
    label: '其他',
    value: '2',
  },
]

export const networkAlarm = [
  {
    label: '系统自动报警',
    value: '1',
  },
  {
    label: '其他方式报警',
    value: '2',
  },
]

export const networking = [
  {
    label: '已联网',
    value: '1',
  },
  {
    label: '未联网',
    value: '2',
  },
]

export const isResearch = [
  {
    label: '正在调查，待完善',
    value: '1',
  },
  {
    label: '调查完毕，全部完成',
    value: '2',
  },
]

export const dispatchType = [
  {
    value: '1',
    label: '主战',
  }, {
    value: '2',
    label: '增援',
  }, {
    value: '3',
    label: '指挥',
  },
]

export const isDispatch = [
  {
    value: '1',
    label: '出动',
  }, {
    value: '2',
    label: '未出动',
  },
]

export const approval = [
  {
    value: '1',
    label: '审核通过',
  },
  {
    value: '2',
    label: '退回起草人',
  },
  {
    value: '3',
    label: '退回上一级',
  },
]

export const applyRecordType = [
  {
    value: '1',
    label: '警情更正申请',
  },
  {
    value: '2',
    label: '出动更正申请',
  },
  {
    value: '3',
    label: '火灾更正申请',
  },
  {
    value: '4',
    label: '警情作废申请',
  },
  {
    value: '5',
    label: '火灾作废申请',
  },
]
export const isRemark = [
  {
    label: '全部',
    value: '0',
  },
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '2',
  },
]
export const applyStatus = [
  {
    value: '1',
    label: '待审批',
  },
  {
    value: '2',
    label: '审批中',
  },
  {
    value: '3',
    label: '已通过',
  },
  {
    value: '4',
    label: '不通过',
  },
]

export const applyType = [
  {
    label: '重要信息更正',
    value: '1',
  },
  {
    label: '普通信息更正',
    value: '2',
  },
]

export const rejectApplyType = [
  {
    label: "高级驳回",
    value: "1",
  },
  {
    label: "普通驳回",
    value: "2",
  },
];

export const statisticalTime = [
  {
    label: '近三天',
    value: '1',
  },
  {
    label: '近一周',
    value: '2',
  },
  {
    label: '近一月',
    value: '3',
  },
  {
    label: '近半年',
    value: '4',
  },
]

export const sceneType = [
  {
    label: '警情报表',
    value: 1,
  },
  {
    label: '出动报表',
    value: 2,
  },
  {
    label: '火灾报表',
    value: 3,
  },
]

export const scopeType = [
  {
    label: '本级单位',
    value: 1,
  },
  {
    label: '本级及下级单位',
    value: 2,
  },
]

export const currentLook = [
  {
    label: '本级可见',
    value: '1',
  },
  {
    label: '本级及下级可见',
    value: '2',
  },
]

export const statType = [
  {
    label: '警情',
    value: 1,
  },
  {
    label: '出动',
    value: 2,
  },
  {
    label: '火灾',
    value: 3,
  },
]

export const tagType = [
  {
    label: '警情标签',
    value: '1',
  },
  {
    label: '出动标签',
    value: '2',
  },
  {
    label: '火灾标签',
    value: '3',
  },
]

export const isDeptNormal = [
  {
    label: '正常',
    value: '0',
  },
  {
    label: '停用',
    value: '1',
  },
]

export const isNormal = [
  {
    label: '正常',
    value: '1',
  },
  {
    label: '停用',
    value: '0',
  },
]

export const isOpen = [
  {
    label: '正常',
    value: '1',
  },
  {
    label: '停用',
    value: '2',
  },
]

export const isNotice = [
  {
    label: '发布',
    value: '1',
  },
  {
    label: '撤回',
    value: '2',
  },
]

export const userType = [
  {
    label: '指挥员',
    value: '1',
  },
  {
    label: '消防员',
    value: '2',
  },
  {
    label: '文员',
    value: '3',
  },
]

export const loanFlag = [
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
  },
]

export const isShow = [
  {
    label: '显示',
    value: '1',
  },
  {
    label: '隐藏',
    value: '0',
  },
]

export const reportStyle = [
  {
    label: '固定报表',
    value: '1',
  },
  {
    label: '自定义报表',
    value: '2',
  },
]

export const countRange = [
  {
    label: '按年统计',
    value: '1',
  },
  {
    label: '按月统计',
    value: '2',
  },
]

export const auditStatus = [
  {
    label: '已完成审核',
    value: '1',
  },
  {
    label: '未完成审核',
    value: '2',
  },
]

export const isLock = [
  {
    label: '已锁定',
    value: '1',
  },
  {
    label: '未锁定',
    value: '2',
  },
]

export const flagType = [
  {
    label: '通用',
    value: '通用',
  },
  {
    label: '派生',
    value: '派生',
  },
]

export const noticeType = [
  {
    label: '通报',
    value: '1',
  },
  {
    label: '公告',
    value: '2',
  },
  {
    label: '通知',
    value: '3',
  },
  {
    label: '报告',
    value: '4',
  },
  {
    label: '学习资料',
    value: '5',
  },
]

export const fireHeadLevel = [{
  dictName: '总队全勤指挥部',
  boDictId: '2',
},
{
  dictName: '支队全勤指挥部',
  boDictId: '3',
},
{
  dictName: '大队全勤指挥部',
  boDictId: '4',
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

export const month = [
  {
    label: '1月',
    value: '1',
  },
  {
    label: '2月',
    value: '2',
  },
  {
    label: '3月',
    value: '3',
  },
  {
    label: '4月',
    value: '4',
  },
  {
    label: '5月',
    value: '5',
  },
  {
    label: '6月',
    value: '6',
  },
  {
    label: '7月',
    value: '7',
  },
  {
    label: '8月',
    value: '8',
  },
  {
    label: '9月',
    value: '9',
  },
  {
    label: '10月',
    value: '10',
  },
  {
    label: '11月',
    value: '11',
  },
  {
    label: '12月',
    value: '12',
  },
]

export const reinforceOptionsList = [
  {
    label: '跨省增援',
    value: 1,
  },
  {
    label: '跨市增援',
    value: 2,
  },
]

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
