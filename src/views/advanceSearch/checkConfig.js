import { showToast, showLoadingToast, closeToast } from "vant";

// type--1-输入类input-2-数值类-3-时间类time-4-select-5-area-6-modal-7-cascader-8-时间periodTime（含统计范围）-9-radio
export const checkBoxs = [
  // 警情类查询条件--基本信息
  {
    fieldKeyOne: 'warningDateStart',
    fieldKeyTwo: 'warningDateEnd',
    label: '接警时间',
    type: '8',
  },
  {
    fieldKeyOne: 'areaGroup',
    label: '警情所属队伍',
    type: '6',
    selectLeaf: false,
    params: { permission: true },
    labelWidth: '116px',
  },
  {
    fieldKeyOne: 'boAreaId',
    label: '行政区域',
    type: '5',
  },
  {
    fieldKeyOne: 'warningAddr',
    label: '警情地址',
    type: '1',
    maxlength: 100,
  },
  {
    fieldKeyOne: 'warningType',
    label: '警情类型',
    type: '7',
    dict: 'warningType',
  },
  {
    fieldKeyOne: 'warningLevel',
    label: '警情等级',
    type: '4',
    dict: 'warningLevel',
  },
  {
    fieldKeyOne: 'warningCode',
    label: '警情编号',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'warningName',
    label: '警情标题',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'warningCodeYyj',
    label: '119警情编号',
    type: '1',
    maxlength: 50,
    labelWidth: '116px',
  },
  {
    fieldKeyOne: 'warningOrgname',
    label: '单位/户主/个体户名称',
    type: '1',
    maxlength: 50,
    labelWidth: '156px',
  },
  {
    fieldKeyOne: 'warningTel',
    label: '报警人联系方式',
    type: '1',
    maxlength: 12,
    labelWidth: '124px',
  },
  {
    fieldKeyOne: 'warningInfo',
    label: '警情描述',
    type: '1',
    maxlength: 100,
  },
  {
    fieldKeyOne: 'warningTag',
    label: '警情标签',
    type: '4',
    dict: 'warningTag',
    field: { value: 'boDictId', label: 'dictName' }
  },
  {
    fieldKeyOne: 'createOrgId',
    label: '录入单位',
    type: '6',
    selectLeaf: false,
    params: { permission: true },
  },
  {
    fieldKeyOne: 'warningStatus',
    label: '警情状态',
    type: '4',
    dict: 'warningStatus',
  },
  {
    fieldKeyOne: 'warningDealStatus',
    label: '警情处置情况',
    type: '4',
    mode: 'single',
    dict: 'warningDealStatus',
    labelWidth: '104px',
    field: { value: 'boDictId', label: 'dictName' }
  },
  // 警情类查询--投入力量
  {
    fieldKeyOne: 'dispatchGroup',
    label: '出动队伍',
    type: '6',
    params: { permission: true },
  },
  {
    fieldKeyOne: 'mainGroup',
    label: '主战队伍',
    type: '6',
    params: { permission: true },
  },
  {
    fieldKeyOne: 'firstGroup',
    label: '首到队伍',
    type: '6',
    params: { permission: true },
  },
  {
    fieldKeyOne: 'dispatchGroupCountMin',
    fieldKeyTwo: 'dispatchGroupCountMax',
    label: '出动队伍数',
    type: '2',
  },
  {
    fieldKeyOne: 'dispatchNumMin',
    fieldKeyTwo: 'dispatchNumMax',
    label: '作战人员数',
    type: '2',
  },
  {
    fieldKeyOne: 'dispatchTruckMin',
    fieldKeyTwo: 'dispatchTruckMax',
    label: '作战车辆数',
    fireType: '1',
    type: '2',
  },
  {
    fieldKeyOne: 'isHeadquarters',
    label: '全勤指挥部出动',
    type: '9',
    dict: 'isNot',
    labelWidth: '116px',
  },
  {
    fieldKeyOne: 'fireHeadLevel',
    label: '指挥部层级',
    type: '4',
    dict: 'fireHeadLevel',
  },
  {
    fieldKeyOne: 'fireHead',
    label: '指挥部名称',
    type: '6',
    selectLeaf: false,
    checkStrictly: true,
    headersDisabled: true,
  },
  {
    fieldKeyOne: 'dispatchHeadCountMin',
    fieldKeyTwo: 'dispatchHeadCountMax',
    label: '指挥部出动数',
    type: '2',
    labelWidth: '104px',
  },
  {
    fieldKeyOne: 'dealMinStart',
    fieldKeyTwo: 'dealMinEnd',
    label: '警情处置时长（分钟）',
    fireType: '1',
    type: '2',
    precision: 2,
    labelWidth: '156px',
  },
  {
    fieldKeyOne: 'areaDutyGroup',
    label: '火灾调查单位',
    type: '6',
    single: false,
    selectLeaf: false,
    params: { permission: true },
  },
  {
    fieldKeyOne: 'dutyGroup',
    label: '责任队站',
    type: '6',
    params: { permission: true },
  },
  {
    fieldKeyOne: 'isDuty',
    label: '责任区主战',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isDutyGroupDispatch',
    label: '责任区出动',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isOnlyFull',
    label: '仅专职队出动',
    type: '9',
    dict: 'isNot',
    labelWidth: '116px',
  },
  // 警情类查询条件--其他信息
  {
    fieldKeyOne: 'isNaturalDisaster',
    label: '自然灾害引发',
    type: '9',
    dict: 'isConnect',
    labelWidth: '104px',
  },
  {
    fieldKeyOne: 'naturalDisasterType',
    label: '自然灾害类型',
    type: '7',
    dict: 'naturalDisasterType',
    labelWidth: '104px',
  },
  {
    fieldKeyOne: 'isOtherProvince',
    label: '跨省增援',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isOtherCity',
    label: '跨市增援',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'temperatureMin',
    fieldKeyTwo: 'temperatureMax',
    label: '气温',
    type: '2',
    min: -100,
    max: 100,
    precision: 2,
  },
  {
    fieldKeyOne: 'weather',
    label: '天气',
    type: '4',
    dict: 'weather',
  },
  {
    fieldKeyOne: 'wind',
    label: '风力',
    type: '4',
    dict: 'wind',
  },
  {
    fieldKeyOne: 'windDirection',
    label: '风向',
    type: '4',
    dict: 'windDirection',
  },
  {
    fieldKeyOne: 'trappedPersonMin',
    fieldKeyTwo: 'trappedPersonMax',
    label: '现场被困人数',
    type: '2',
    labelWidth: '104px',
  },
  {
    fieldKeyOne: 'isPublicFireHydrant',
    label: '是否采用公共消防栓供水',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'fireHydrantSituation',
    label: '公共消防栓供水情况',
    type: '4',
    dict: 'fireHydrantSituation',
  },
  {
    fieldKeyOne: 'notUseFireHydrantReason',
    label: '不使用公共消防栓原因',
    type: '4',
    dict: 'notUseFireHydrantReason',
  },
  {
    fieldKeyOne: 'isZf',
    label: '有政府指挥',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isLinkDepartment',
    label: '有联动力量',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isOtherDepartment',
    label: '有其他救援力量',
    type: '9',
    dict: 'isNot',
    labelWidth: '116px',
  },
  {
    fieldKeyOne: 'orgName',
    label: '志愿队名称',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'isHappenFire',
    label: '交通事故是否发生火灾',
    type: '9',
    dict: 'isNot',
    labelWidth: '168px',
  },
  // 单位性质
  {
    fieldKeyOne: 'groupType',
    label: '志愿队类型',
    type: '4',
    dict: 'groupType',
  },
  // 出动信息（队站）--基本信息
  {
    fieldKeyOne: 'dispatchCode',
    label: '出动编号',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'dispatchOrg',
    label: '出动单位',
    type: '6',
    selectLeaf: false,
  },
  {
    fieldKeyOne: 'deptNature',
    label: '队伍性质',
    type: '7',
    dict: 'deptNature',
  },
  {
    fieldKeyOne: 'dispatchType',
    label: '参战形式',
    type: '4',
    dict: 'dispatchType',
  },
  {
    fieldKeyOne: 'dealSituation',
    label: '处置情况',
    type: '4',
    dict: 'dealSituation',
  },
  {
    fieldKeyOne: 'fireSituation',
    label: '到场时火灾情况',
    type: '4',
    dict: 'fireSituation',
  },
  {
    fieldKeyOne: 'fireDistanceStart',
    fieldKeyTwo: 'fireDistanceEnd',
    label: '行驶路程（公里）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'attendanceTimeStart',
    fieldKeyTwo: 'attendanceTimeEnd',
    label: '到场时长（分钟）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'speedStart',
    fieldKeyTwo: 'speedEnd',
    label: '到场时速（km/h）',
    type: '2',
    precision: 2,
  },
  // 归队时速过慢原因
  {
    fieldKeyOne: 'returnLateReason',
    label: '到场时速异常原因',
    type: '4',
    dict: 'returnLateReason',
  },
  {
    fieldKeyOne: 'dealMinStart',
    fieldKeyTwo: 'dealMinEnd',
    label: '处置（执勤）时长（分钟）',
    fireType: '2',
    type: '2',
    precision: 2,
  },
  // {
  //   fieldKeyOne: 'isProvice',
  //   label: '是否跨省增援',
  //   type: '9',
  //   dict: 'isNot',
  // },
  // {
  //   fieldKeyOne: 'isCity',
  //   label: '是否跨市增援',
  //   type: '9',
  //   dict: 'isNot',
  // },
  {
    fieldKeyOne: 'dispatchStatus',
    label: '报告状态',
    type: '4',
    dict: 'dispatchStatus',
  },
  // 出动信息（队站）--时间信息
  {
    fieldKeyOne: 'dispatchDateStart',
    fieldKeyTwo: 'dispatchDateEnd',
    label: '出动时间',
    type: '3',
  },
  {
    fieldKeyOne: 'attendanceDateStart',
    fieldKeyTwo: 'attendanceDateEnd',
    label: '到场时间',
    type: '3',
  },
  {
    fieldKeyOne: 'carryoutDateStart',
    fieldKeyTwo: 'carryoutDateEnd',
    label: '展开时间',
    type: '3',
  },
  {
    fieldKeyOne: 'waterflowDateStart',
    fieldKeyTwo: 'waterflowDateEnd',
    label: '出水时间',
    type: '3',
  },
  {
    fieldKeyOne: 'controllingDateStart',
    fieldKeyTwo: 'controllingDateEnd',
    label: '控制时间',
    type: '3',
  },
  {
    fieldKeyOne: 'washDateStart',
    fieldKeyTwo: 'washDateEnd',
    label: '洗消时间',
    type: '3',
  },
  {
    fieldKeyOne: 'extinctDateStart',
    fieldKeyTwo: 'extinctDateEnd',
    label: '扑灭时间',
    type: '3',
  },
  {
    fieldKeyOne: 'endDateStart',
    fieldKeyTwo: 'endDateEnd',
    label: '结束时间',
    type: '3',
  },
  {
    fieldKeyOne: 'evacuateDateStart',
    fieldKeyTwo: 'evacuateDateEnd',
    label: '撤离时间',
    type: '3',
  },
  {
    fieldKeyOne: 'returnDateStart',
    fieldKeyTwo: 'returnDateEnd',
    label: '归队时间',
    type: '3',
  },
  {
    fieldKeyOne: 'midwayReturnDateStart',
    fieldKeyTwo: 'midwayReturnDateEnd',
    label: '中返时间',
    type: '3',
  },
  // 出动信息（队站）--投入力量
  // {
  //   fieldKeyOne: 'teamNature',
  //   label: '队伍性质',
  //   type: '4',
  //   dict: 'teamNature',
  // },
  {
    fieldKeyOne: 'commanderNumMin',
    fieldKeyTwo: 'commanderNumMax',
    label: '指挥员人数',
    fireType: '2',
    type: '2',
  },
  {
    fieldKeyOne: 'firemenNumMin',
    fieldKeyTwo: 'firemenNumMax',
    label: '消防员人数',
    type: '2',
  },
  {
    fieldKeyOne: 'headPersonType',
    label: '带队指挥员职务',
    type: '7',
    dict: 'fireHeadLvl',
    field: { value: 'boDictId', label: 'dictName' },
  },
  {
    fieldKeyOne: 'groupLeader',
    label: '带队指挥员',
    fireType: '2',
    type: '10',
    dict: 'deptMembers',
    field: { value: 'userId', label: 'userNameJob' },
    modalTitle: '请选择带队指挥员',
  },
  {
    fieldKeyOne: 'fireUserIds',
    label: '指战员姓名',
    fireType: '2',
    type: '10',
    dict: 'deptMembers',
    field: { value: 'userId', label: 'userNameJob' },
    modalTitle: '请选择指战员姓名',
  },
  // 是否有出动车辆
  {
    fieldKeyOne: 'isDispatchTruck',
    label: '是否有车辆出动',
    type: '9',
    dict: 'isNot',
  },
  // 出动车辆信息
  {
    fieldKeyOne: 'dispatchTruckInfo',
    label: '消防车辆信息',
    type: '11',
    dict: 'dispatchTruckInfo',
    field: { value: 'boFireTruckId', label: 'truckNumber' },
  },
  {
    fieldKeyOne: 'truckType',
    label: '车辆类型',
    type: '4',
    dict: 'truckType',
  },
  {
    fieldKeyOne: 'dispatchTruckMin',
    fieldKeyTwo: 'dispatchTruckMax',
    label: '车辆数',
    fireType: '2',
    type: '2',
  },
  {
    fieldKeyOne: 'fireBoatNumMin',
    fieldKeyTwo: 'fireBoatNumMax',
    label: '艇数',
    type: '2',
  },
  {
    fieldKeyOne: 'fireAirplaneNumMin',
    fieldKeyTwo: 'fireAirplaneNumMax',
    label: '消防直升机数',
    type: '2',
  },
  {
    fieldKeyOne: 'rescueDogNumMin',
    fieldKeyTwo: 'rescueDogNumMax',
    label: '搜救犬数',
    type: '2',
  },
  {
    fieldKeyOne: 'uavMin',
    fieldKeyTwo: 'uavMax',
    label: '无人机数',
    type: '2',
  },
  // 出动信息（队站）--参战伤亡
  {
    fieldKeyOne: 'deathCountMin',
    fieldKeyTwo: 'deathCountMax',
    label: '亡人数',
    type: '2',
  },
  {
    fieldKeyOne: 'injuryCountMin',
    fieldKeyTwo: 'injuryCountMax',
    label: '伤人数',
    type: '2',
  },
  {
    fieldKeyOne: 'name',
    label: '姓名',
    type: '1',
    maxlength: 20,
  },
  {
    fieldKeyOne: 'nation',
    label: '民族',
    type: '4',
    dict: 'nation',
  },
  {
    fieldKeyOne: 'politicalOutlook',
    label: '政治面貌',
    type: '4',
    dict: 'politicalOutlook',
  },
  {
    fieldKeyOne: 'idNumber',
    label: '身份证号码',
    fireType: '2',
    type: '1',
    maxlength: 18,
  },
  {
    fieldKeyOne: 'ageMin',
    fieldKeyTwo: 'ageMax',
    label: '年龄',
    type: '2',
  },
  {
    fieldKeyOne: 'gender',
    label: '性别',
    type: '4',
    dict: 'gender',
  },
  {
    fieldKeyOne: 'rescueRank',
    label: '消防救援衔',
    type: '7',
    dict: 'rescueRank',
  },
  // {
  //   fieldKeyOne: 'titleRank',
  //   label: '衔级',
  //   type: '1',
  //   maxlength: 20,
  // },
  {
    fieldKeyOne: 'duty',
    label: '职务',
    type: '7',
    dict: 'duty',
  },
  {
    fieldKeyOne: 'teamEntryTimeStart',
    fieldKeyTwo: 'teamEntryTimeEnd',
    label: '入队时间（进入消防系统）',
    type: '3',
  },
  {
    fieldKeyOne: 'period',
    label: '事发阶段',
    type: '4',
    dict: 'period',
  },
  {
    fieldKeyOne: 'protectDevice',
    label: '防护装备情况',
    type: '4',
    dict: 'protectDevice',
  },
  // 受伤原因
  {
    fieldKeyOne: 'injuryReason',
    label: '伤亡原因',
    type: '4',
    dict: 'injuryReason',
  },
  {
    fieldKeyOne: 'injuryPart',
    label: '受伤/致命部位',
    fireType: '2',
    type: '4',
    dict: 'injuryPart',
  },
  {
    fieldKeyOne: 'isInstantDeath',
    label: '是否当场死亡',
    type: '9',
    dict: 'isNot',
  },
  // 出动信息（队站）--战斗成果
  {
    fieldKeyOne: 'rescueNumMin',
    fieldKeyTwo: 'rescueNumMax',
    label: '抢救人数',
    type: '2',
  },
  {
    fieldKeyOne: 'surviveNumMin',
    fieldKeyTwo: 'surviveNumMax',
    label: '生还人数',
    type: '2',
  },
  {
    fieldKeyOne: 'deathNumMin',
    fieldKeyTwo: 'deathNumMax',
    label: '死亡人数',
    type: '2',
  },
  {
    fieldKeyOne: 'evacuateNumMin',
    fieldKeyTwo: 'evacuateNumMax',
    label: '疏散人数',
    type: '2',
  },
  {
    fieldKeyOne: 'transferNumMin',
    fieldKeyTwo: 'transferNumMax',
    label: '转移人数',
    type: '2',
  },
  {
    fieldKeyOne: 'emergencyNumMin',
    fieldKeyTwo: 'emergencyNumMax',
    label: '抢救财产价值（元）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'protectNumMin',
    fieldKeyTwo: 'protectNumMax',
    label: '保护财产价值（元）',
    type: '2',
    precision: 2,
  },
  // 出动信息（队站）--其他信息
  {
    fieldKeyOne: 'isBlocking',
    label: '消防通道堵塞',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'blockingTimeStart',
    fieldKeyTwo: 'blockingTimeEnd',
    label: '疏通耗时（分钟）',
    type: '2',
    precision: 2,
  },
  // 是否有损耗车辆
  {
    fieldKeyOne: 'isWastageTruck',
    label: '是否有车辆损耗',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'fireProcess',
    label: '处置经过',
    type: '1',
    maxlength: 100,
  },
  // 出动信息（指挥部）--基本信息
  {
    fieldKeyOne: 'dispatchCode',
    label: '出动编号',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'FireHeadLvl',
    label: '全勤指挥部级别',
    type: '4',
    dict: 'dispatchFireHeadLvl',
  },
  {
    fieldKeyOne: 'fireHead',
    label: '全勤指挥部名称',
    fireType: '3',
    type: '1',
    maxlength: 50,
    headersDisabled: true,
  },
  {
    fieldKeyOne: 'groupLeader',
    label: '指挥人员姓名',
    fireType: '3',
    type: '10',
    dict: 'deptMembers',
    field: { value: 'userId', label: 'userNameJob' },
    modalTitle: '请选择指挥人员姓名',
  },
  {
    fieldKeyOne: 'commanderNumMin',
    fieldKeyTwo: 'commanderNumMax',
    label: '指挥人数',
    fireType: '3',
    type: '2',
  },
  {
    fieldKeyOne: 'headCarName',
    label: '指挥车辆名称',
    type: '11',
    dict: 'dispatchTruckInfo',
  },
  {
    fieldKeyOne: 'headCarNumMin',
    fieldKeyTwo: 'headCarNumMax',
    label: '指挥车辆数',
    type: '2',
  },
  {
    fieldKeyOne: 'headTimeMin',
    fieldKeyTwo: 'headTimeMax',
    label: '指挥时长（小时）',
    type: '2',
    precision: 2,
  },
  // 火灾类查询条件--基本信息
  {
    fieldKeyOne: 'fireDateStart',
    fieldKeyTwo: 'fireDateEnd',
    label: '起火时间',
    type: '8',
  },
  {
    fieldKeyOne: 'areaDutyGroupFire',
    label: '火灾调查单位',
    type: '6',
    single: false,
    selectLeaf: false,
    params: { permission: true },
  },
  {
    fieldKeyOne: 'fireDirection',
    label: '起火地点',
    type: '1',
    maxlength: 100,
  },
  {
    fieldKeyOne: 'area',
    label: '区域',
    type: '7',
    dict: 'area',
  },
  {
    fieldKeyOne: 'firePlace',
    label: '起火场所',
    type: '7',
    dict: 'firePlace',
  },
  {
    fieldKeyOne: 'fireCause',
    label: '起火原因',
    type: '7',
    dict: 'fireCause',
  },
  {
    fieldKeyOne: 'burnedAreaMin',
    fieldKeyTwo: 'burnedAreaMax',
    label: '过火面积（平方米）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'fireLevel',
    label: '火灾等级',
    type: '4',
    dict: 'fireLevel',
  },
  {
    fieldKeyOne: 'fireCode',
    label: '火灾编号',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'severity',
    label: '是否轻微火灾',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'fireSite',
    label: '起火位置',
    type: '7',
    dict: 'fireSite',
  },
  {
    fieldKeyOne: 'initialFuelsType',
    label: '起火物类型',
    type: '7',
    dict: 'initialFuelsType',
  },
  {
    fieldKeyOne: 'igniteSourceType',
    label: '引火源类型',
    type: '7',
    dict: 'igniteSourceType',
  },
  {
    fieldKeyOne: 'firePattern',
    label: '事故形态',
    type: '7',
    dict: 'firePattern',
  },
  {
    fieldKeyOne: 'liveType',
    label: '居住场所形式',
    type: '4',
    dict: 'liveType',
  },
  {
    fieldKeyOne: 'isPoorHouse',
    label: '是否属于扶贫安置房',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isChangeUseType',
    label: '是否变更使用性质',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'useType',
    label: '变更后使用性质',
    type: '4',
    dict: 'useType',
  },
  {
    fieldKeyOne: 'isSafetyAccident',
    label: '生产安全事故',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isResearch',
    label: '是否正在调查',
    type: '4',
    dict: 'isResearch',
  },
  // {
  //   fieldKeyOne: 'fireTel',
  //   label: '失火单位/户主电话',
  //   type: '1',
  //   maxlength: 12,
  // },
  {
    fieldKeyOne: 'socialCreditCode',
    label: '单位统一社会信用代码',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'industry',
    label: '所属行业',
    type: '7',
    dict: 'industry',
  },
  {
    fieldKeyOne: 'industryDepartment',
    label: '行业主管部门',
    type: '4',
    dict: 'industryDepartment',
  },
  {
    fieldKeyOne: 'economicType',
    label: '经济类型',
    type: '4',
    dict: 'economicType',
  },
  {
    fieldKeyOne: 'leadInspectionOrg',
    label: '事故牵头调查部门',
    type: '4',
    dict: 'leadInspectionOrg',
  },
  {
    fieldKeyOne: 'isInsurance',
    label: '是否保险',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'insuranceInfo',
    label: '保险类型',
    type: '4',
    dict: 'insuranceInfo',
  },
  {
    fieldKeyOne: 'isOnesided',
    label: '是否单方面火灾',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'fireInspection',
    label: '监督检查情况',
    type: '4',
    dict: 'fireInspection',
  },
  {
    fieldKeyOne: 'firePersonAgeMin',
    fieldKeyTwo: 'firePersonAgeMax',
    label: '引起火灾人员年龄',
    type: '2',
  },
  {
    fieldKeyOne: 'schooling',
    label: '受教育程度',
    type: '4',
    dict: 'schooling',
  },
  {
    fieldKeyOne: 'injuryCause',
    label: '伤亡原因',
    type: '4',
    dict: 'injuryCauseFire',
  },
  {
    fieldKeyOne: 'health',
    label: '健康状况',
    type: '4',
    dict: 'health',
  },
  {
    fieldKeyOne: 'fireBase',
    label: '未出动火灾',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'fireStatus',
    label: '报告状态',
    type: '4',
    dict: 'fireStatus',
  },
  // 火灾类查询条件--人员伤亡
  {
    fieldKeyOne: 'isInjury',
    label: '是否有人员伤亡',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'injuryType',
    label: '伤亡情况',
    type: '4',
    dict: 'injuryType',
  },
  {
    fieldKeyOne: 'zsCountMin',
    fieldKeyTwo: 'zsCountMax',
    label: '重伤人数',
    type: '2',
  },
  {
    fieldKeyOne: 'qsCountMin',
    fieldKeyTwo: 'qsCountMax',
    label: '轻伤人数',
    type: '2',
  },
  {
    fieldKeyOne: 'idType',
    label: '证件类型',
    type: '4',
    dict: 'idType',
  },
  {
    fieldKeyOne: 'idNumber',
    label: '证件号码',
    fireType: '4',
    type: '1',
    maxlength: 50,
  },
  {
    fieldKeyOne: 'injurySource',
    label: '人员来源',
    type: '4',
    dict: 'injurySource',
  },
  {
    fieldKeyOne: 'job',
    label: '职业',
    type: '4',
    dict: 'job',
  },
  {
    fieldKeyOne: 'injurySchooling',
    label: '受教育程度',
    type: '4',
    dict: 'schooling',
  },
  {
    fieldKeyOne: 'injuryHealth',
    label: '健康状况',
    type: '4',
    dict: 'health',
  },
  {
    fieldKeyOne: 'humanCause',
    label: '人为因素',
    type: '4',
    dict: 'humanCause',
  },
  {
    fieldKeyOne: 'injuryBehavior',
    label: '受伤/害时行为',
    type: '4',
    dict: 'injuryBehavior',
  },
  {
    fieldKeyOne: 'injuryPart',
    label: '受伤部位',
    fireType: '4',
    type: '4',
    dict: 'injuryPartFire',
  },
  {
    fieldKeyOne: 'mainSymptoms',
    label: '身体主要症状',
    type: '4',
    dict: 'mainSymptoms',
  },
  {
    fieldKeyOne: 'bodyLocation',
    label: '发现尸体位置',
    type: '4',
    dict: 'bodyLocation',
  },
  {
    fieldKeyOne: 'deathDate',
    label: '死亡时间',
    type: '7',
    dict: 'deathDate',
  },
  // 火灾类查询条件--经济损失
  {
    fieldKeyOne: 'inspectMethod',
    label: '调查方式',
    type: '4',
    dict: 'inspectMethod',
  },
  {
    fieldKeyOne: 'costSource',
    label: '损失来源',
    type: '4',
    dict: 'costSource',
  },
  {
    fieldKeyOne: 'directEconomicLossMin',
    fieldKeyTwo: 'directEconomicLossMax',
    label: '直接经济损失（元）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'directDamageMin',
    fieldKeyTwo: 'directDamageMax',
    label: '直接财产损失（元）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'fireDisposalCostMin',
    fieldKeyTwo: 'fireDisposalCostMax',
    label: '火灾现场处置费用（元）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'fireInjuryCostMin',
    fieldKeyTwo: 'fireInjuryCostMax',
    label: '人员伤亡医疗支出（元）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'affectedHouseMin',
    fieldKeyTwo: 'affectedHouseMax',
    label: '受灾户数（户）',
    type: '2',
  },
  // 火灾类查询条件--交通工具
  {
    fieldKeyOne: 'vehicleType',
    label: '交通工具类型',
    type: '7',
    dict: 'vehicleType',
  },
  {
    fieldKeyOne: 'chargeState',
    label: '起火时充电状态',
    type: '4',
    dict: 'chargeState',
  },
  {
    fieldKeyOne: 'batteryType',
    label: '电池类型',
    type: '4',
    dict: 'batteryType',
  },
  {
    fieldKeyOne: 'isRepack',
    label: '电力助动车-是否改装',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'carNumber',
    label: '车牌号',
    type: '1',
    maxlength: 20,
  },
  {
    fieldKeyOne: 'vinCode',
    label: '车辆VIN码',
    type: '1',
    maxlength: 20,
  },
  {
    fieldKeyOne: 'driveState',
    label: '行驶状态',
    type: '4',
    dict: 'driveState',
  },
  // 火灾类查询条件--建筑信息
  {
    fieldKeyOne: 'buildTag',
    label: '建筑标签',
    type: '4',
    dict: 'buildTag',
  },
  {
    fieldKeyOne: 'buildType',
    label: '建筑类别',
    type: '4',
    dict: 'buildType',
  },
  {
    fieldKeyOne: 'fireResistanceRating',
    label: '耐火等级',
    type: '4',
    dict: 'fireResistanceRating',
  },
  {
    fieldKeyOne: 'buildStructure',
    label: '建筑结构',
    type: '4',
    dict: 'buildStructure',
  },
  {
    fieldKeyOne: 'buildFloorMin',
    fieldKeyTwo: 'buildFloorMax',
    label: '建筑总楼层',
    type: '2',
  },
  {
    fieldKeyOne: 'fireFloorMin',
    fieldKeyTwo: 'fireFloorMax',
    label: '失火楼层',
    type: '2',
  },
  {
    fieldKeyOne: 'housingLifeMin',
    fieldKeyTwo: 'housingLifeMax',
    label: '房龄（年）',
    type: '2',
  },
  {
    fieldKeyOne: 'buildUse',
    label: '建筑使用用途',
    type: '7',
    dict: 'buildUse',
  },
  {
    fieldKeyOne: 'isSpread',
    label: '是否蔓延',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isLoud',
    label: '是否发生轰燃',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'isWindowOpened',
    label: '建筑门窗过程中是否开启',
    type: '9',
    dict: 'isNot',
  },
  // 火灾类查询条件--消防设施
  {
    fieldKeyOne: 'isFirefightFacility',
    label: '是否安装消防设施',
    type: '9',
    dict: 'isNot',
  },
  {
    fieldKeyOne: 'autoAlarm',
    label: '是否安装自动报警系统',
    type: '9',
    dict: 'install',
  },
  {
    fieldKeyOne: 'autoFireFight',
    label: '是否安装自动灭火系统',
    type: '9',
    dict: 'install',
  },
  {
    fieldKeyOne: 'indoorHydrant',
    label: '是否安装室内消防栓系统',
    type: '9',
    dict: 'install',
  },
  {
    fieldKeyOne: 'smokeControl',
    label: '是否安装防排烟系统',
    type: '9',
    dict: 'install',
  },
  {
    fieldKeyOne: 'fireShutter',
    label: '是否安装防火卷帘',
    type: '9',
    dict: 'install',
  },
  {
    fieldKeyOne: 'emergencyLight',
    label: '应急疏散照明',
    type: '4',
    dict: 'regulation',
  },
  {
    fieldKeyOne: 'networking',
    label: '联网情况',
    type: '4',
    dict: 'networking',
  },
  {
    fieldKeyOne: 'fireCompartment',
    label: '防火分区',
    type: '4',
    dict: 'regulation',
  },
  {
    fieldKeyOne: 'compartmentAreaMin',
    fieldKeyTwo: 'compartmentAreaMax',
    label: '分区面积（平方米）',
    type: '2',
    precision: 2,
  },
  {
    fieldKeyOne: 'fireSeparation',
    label: '防火间距',
    type: '4',
    dict: 'regulation',
    precision: 2,
  },
  {
    fieldKeyOne: 'separationMeterMin',
    fieldKeyTwo: 'separationMeterMax',
    label: '间距（米）',
    type: '2',
  },
  {
    fieldKeyOne: 'escapeRoute',
    label: '疏散通道',
    type: '4',
    dict: 'regulation',
  },
  {
    fieldKeyOne: 'emergencyExit',
    label: '紧急出口',
    type: '4',
    dict: 'regulation',
  },
  // 火灾类查询条件--其他信息
  {
    fieldKeyOne: 'firePassage',
    label: '起火经过',
    type: '1',
    maxlength: 100,
  },
  {
    fieldKeyOne: 'handleTwoCase',
    label: '两案处理-是否立案',
    type: '9',
    dict: 'isCase',
  },
  {
    fieldKeyOne: 'penaltyNumMin',
    fieldKeyTwo: 'penaltyNumMax',
    label: '追究人数（人）',
    type: '2',
  },
  {
    fieldKeyOne: 'suggestDealNumMin',
    fieldKeyTwo: 'suggestDealNumMax',
    label: '建议处理人数（人）',
    type: '2',
  },
  {
    fieldKeyOne: 'firePenalty',
    label: '火灾处罚-是否立案',
    type: '9',
    dict: 'isCase',
  },
]

export const getSearchParams = (form) => {
  form.fieldFlag = '1'
  form.date = new Date().getTime()
  if (form.type === '1') {
    form.fieldText = `${form.label}：${form.fieldValueOne} `
  }
  if (form.type === '8' || form.type === '2' || form.type === '3') {
    form.fieldValueOne = `${form.valueOne[0]}`
    form.fieldValueTwo = `${form.valueOne[1]}`
    if (form.type === '2') {
      form.fieldValueOne = `${!form.valueOne[0] && form.valueOne[0] !== 0 ? -2000000000 : form.valueOne[0]}`
      form.fieldValueTwo = `${!form.valueOne[1] && form.valueOne[1] !== 0 ? 2000000000 : form.valueOne[1]}`
    }
    if (form.type === '8') {
      form.fieldText = `${form.label}：${form.valueOne.join('至')}`
      if (form.valueTwoText) {
        form.fieldText += `，统计范围：${form.valueTwoText}`
      }
      if (form.edit === '1' && form.valueTwo) {
        form.fieldValueThree = form.valueTwo
        form.fieldKeyThree = 'statisticRangeHoliday'
      }
      if (form.valueTwo?.length > 0) {
        if (form.edit === '2') {
          form.fieldKeyThree = 'statisticRangeSeasonMin'
          form.fieldKeyFour = 'statisticRangeSeasonMax'
        }
        if (form.edit === '3') {
          form.fieldKeyThree = 'statisticRangeMonthMin'
          form.fieldKeyFour = 'statisticRangeMonthMax'
        }
        if (form.edit === '4') {
          form.fieldKeyThree = 'statisticRangeDayMin'
          form.fieldKeyFour = 'statisticRangeDayMax'
        }
        if (form.edit === '5') {
          form.fieldKeyThree = 'statisticRangeHourMin'
          form.fieldKeyFour = 'statisticRangeHourMax'
        }
        form.fieldValueThree = form.valueTwo[0]
        form.fieldValueFour = form.valueTwo[1]
      }
    }
  }
  return form
}

export const useDictName = (value, dict) => {
  return dict?.find(val => value === val.boDictId)?.dictName
}

export const validateForm = (arr, item) => {
  if (arr.length === 0 && item.fieldFlag === '2' && !(item.fieldType === '3' || item.fieldType === '4')) {
    showToast('不能以运算符开始或结束(除了和括号除外)')
    return false
  }
  const leftObj = arr.filter(val => val.fieldType !== '4')
  const rightObj = arr.filter(val => val.fieldType !== '5')
  if (leftObj[leftObj.length - 1] && (leftObj[leftObj.length - 1].fieldFlag === '1' || leftObj[leftObj.length - 1].fieldType === '5')) {
    if (item.fieldFlag === '1') {
      showToast('不能连续添加两个条件，请先选择运算符！')
      return false
    }
    if (item.fieldType === '4') {
      showToast('左括号前不能以条件结束！')
      return false
    }
  }
  if (rightObj[rightObj.length - 1] && rightObj[rightObj.length - 1].fieldFlag === '2') {
    if (item.fieldFlag === '2' && item.fieldType !== '4') {
      showToast('不能连续添加两个运算符，请先选择条件！')
      return false
    }
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validateList = (arr, fireType) => {
  if (arr.length === 0) {
    showToast('请添加条件！')
    return false
  }
  const warningDateObj = arr.find(val => val.fieldKeyOne === 'warningDateStart')
  const fireDateObj = arr.find(val => val.fieldKeyOne === 'fireDateStart')
  if (!warningDateObj && !fireDateObj) {
    showToast('请先选择接警时间或起火时间！')
    return false
  }
  const arr4 = arr.filter(val => val.fieldType === '4')
  const arr5 = arr.filter(val => val.fieldType === '5')
  if (arr4.length !== arr5.length) {
    showToast('条件中括号未成对，请修改！')
    return false
  }
  let msg = null
  arr.forEach((val, index) => {
    if (index === 0 && !(val.fieldFlag === '1' || val.fieldType === '3' || val.fieldType === '4')) {
      msg = '不能以运算符开始(除了和左括号除外)'
    }
    if (index === arr.length - 1 && val.fieldFlag === '2' && val.fieldType !== '5') {
      msg = '不能以运算符结束(右括号除外)'
    }
    const leftObj = arr.filter((val, objIndex) => val.fieldType !== '4' && objIndex < index)
    const rightObj = arr.filter((val, objIndex) => val.fieldType !== '5' && objIndex < index)
    if (leftObj[leftObj.length - 1] && (leftObj[leftObj.length - 1].fieldFlag === '1' || leftObj[leftObj.length - 1].fieldType === '5')) {
      if (val.fieldFlag === '1') {
        msg = '不能连续添加两个条件，请先选择运算符！'
      }
      if (val.fieldType === '4') {
        msg = '左括号前不能以条件结束！'
      }
    }
    if (rightObj[rightObj.length - 1] && rightObj[rightObj.length - 1].fieldFlag === '2') {
      if (val.fieldFlag === '2' && val.fieldType !== '4') {
        msg = '不能连续添加两个运算符，请先选择条件！'
      }
    }
    if (val.fieldType === '5' && rightObj[rightObj.length - 1] && rightObj[rightObj.length - 1].fieldFlag === '2') {
      msg = '括号中不能无内容！'
    }
    if (val.fieldType === '5' && !(index - leftObj.length > index - rightObj.length)) {
      msg = '条件中括号未成对，请修改！'
    }
  })
  if (msg) {
    showToast(msg)
    return false
  }
  return true
}
