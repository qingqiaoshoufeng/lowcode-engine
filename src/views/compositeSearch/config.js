import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import { generateByKeyValue, generateByCascader } from '@/utils/tools.js'
import { install, isCase, isNot, haveNull } from '@/utils/constants.js'

export const useFormConfig = () => {
  const formOrigin = {
    policeBase: {
      title: '基本信息',
      warningDate: { // 接警时间
        value: undefined,
        type: 'select-range',
        label: '接警时间',
      },
      statisticRangeHoliday: { // 统计范围--节假日
        value: undefined,
        show: '1',
      },
      statisticRangeSeasonMin: { // 统计范围--季度
        value: [null, null],
      },
      statisticRangeMonthMin: { // 统计范围--月
        value: [null, null],
      },
      statisticRangeDayMin: { // 统计范围--日
        value: [null, null],
      },
      statisticRangeHourMin: { // 统计范围--小时
        value: undefined,
      },
      areaGroup: { // 所属队伍
        value: [],
        back: false,
        type: 'select-org',
        label: '所属队伍',
        labelWidth: `var(--van-field-label-width-104)`,
        single: false,
        selectLeaf: false,
        selectLevelEqual: true,
        headersDisabled: true,
        params: { permission: true }
      },
      boAreaId: { // 行政区划
        value: undefined,
        text: undefined,
        type: 'area-cascader',
        label: '行政区划',
      },
      warningAddr: { // 警情地址
        value: '',
        type: 'input',
        label: '警情地址',
      },
      warningType: { // 警情类型
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '警情类型',
        options: 'warningType',
        selectLeaf: false,
      },
      warningLevel: { // 警情等级
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '警情等级',
        options: 'warningLevel',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      warningCode: { // 警情编号
        value: '',
        type: 'input',
        label: '警情编号',
      },
      warningName: { // 警情标题
        value: '',
        type: 'input',
        label: '警情标题',
      },
      warningCodeYyj: { // 119编号
        value: '',
        type: 'input',
        label: '119编号',
        labelWidth: `var(--van-field-label-width-104)`,
      },
      warningOrgname: { // 单位/户主名称
        value: '',
        type: 'input',
        label: '单位/户主名称',
        labelWidth: '152px',
      },
      warningTel: { // 报警人联系方式
        value: '',
        type: 'input',
        label: '报警人联系方式',
        labelWidth: `var(--van-field-label-width-116)`,
      },
      warningInfo: { // 警情描述
        value: '',
        type: 'input',
        label: '警情描述',
      },
      warningTag: { // 警情标签
        value: undefined,
        back: false,
        type: 'select-nodes',
        label: '警情标签',
        options: 'warningTag',
        fieldNames: { value: 'value', label: 'label' },
      },
      createOrgId: { // 录入单位
        value: [],
        back: false,
        type: 'select-org',
        label: '录入单位',
        single: false,
        selectLeaf: false,
        headersDisabled: true,
        selectLevelEqual: true,
        params: { permission: true }
      },
      warningStatus: { // 警情状态
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '警情状态',
        options: 'warningStatus',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      warningDealStatus: { // 警情处置情况
        value: undefined,
        back: false,
        type: 'select-single',
        label: '警情处置情况',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'warningDealStatus',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
    },
    policeInvest: {
      title: '投入力量',
      dispatchGroup: { // 出动队伍
        value: [],
        back: false,
        type: 'select-org',
        label: '出动队伍',
        single: false,
        selectLeaf: true,
        headersDisabled: true,
        params: { permission: true }
      },
      mainGroup: { // 主战队伍
        value: [],
        back: false,
        type: 'select-org',
        label: '主战队伍',
        single: false,
        selectLeaf: false,
        headersDisabled: true,
        params: { permission: true }
      },
      firstGroup: { // 首到队伍
        value: [],
        back: false,
        type: 'select-org',
        label: '首到队伍',
        single: false,
        selectLeaf: true,
        headersDisabled: true,
        params: { permission: true }
      },
      dispatchGroupCountMin: { // 出动队伍数
        value: ['', ''],
        type: 'input-range',
        label: '出动队伍数',
        numType: 'digit',
      },
      dispatchNumMin: { // 出动人员数
        value: ['', ''],
        type: 'input-range',
        label: '出动人员数',
        numType: 'digit',
      },
      dispatchTruckMin: { // 出动车辆数
        value: ['', ''],
        type: 'input-range',
        label: '出动车辆数',
        numType: 'digit',
      },
      isHeadquarters: { // 全勤指挥部出动
        value: '',
        type: 'radio-is',
        label: '全勤指挥部出动',
        labelWidth: `var(--van-field-label-width-116)`,
        options: isNot
      },
      fireHeadLevel: { // 指挥部层级
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '指挥部层级',
        options: 'fireHeadLevel',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      fireHead: { // 指挥部名称
        value: undefined,
        back: false,
        type: 'select-nodes',
        label: '指挥部名称',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'headquarters',
        fieldNames: { value: 'organizationid', label: 'name' },
      },
      personNumMin: { // 指挥部出动数
        value: ['', ''],
        type: 'input-range',
        label: '指挥部出动数',
        labelWidth: `var(--van-field-label-width-104)`,
        numType: 'digit',
      },
      dealMinStart: { // 警情处置时长（分钟）
        value: ['', ''],
        type: 'input-range',
        label: '警情处置时长（分钟）',
      },
      // areaDutyGroup: { // 责任区大队
      //   value: [],
      //   back: false,
      //   type: 'select-org',
      //   label: '责任区大队',
      //   labelWidth: `var(--van-field-label-width-104)`,
      //   single: false,
      //   selectLeaf: false,
      //   headersDisabled: true,
      // selectLevelEqual: true,
      //   params: { permission: true }
      // },
      dutyGroup: { // 辖区站
        value: [],
        back: false,
        type: 'select-org',
        label: '辖区站',
        single: false,
        selectLeaf: true,
        headersDisabled: true,
        params: { permission: true }
      },
      isDuty: { // 责任区主战
        value: '',
        type: 'radio-is',
        label: '责任区主战',
        options: isNot
      },
      isDutyGroupDispatch: { // 责任区出动
        value: '',
        type: 'radio-is',
        label: '责任区出动',
        options: isNot
      },
      isOnlyFull: { // 仅专职队出动
        value: '',
        type: 'radio-is',
        label: '仅专职队出动',
        labelWidth: `var(--van-field-label-width-104)`,
        options: isNot
      },
      isZf: { // 政府指挥
        value: '',
        type: 'radio-is',
        label: '政府指挥',
        options: haveNull
      },
      isLinkDepartment: { // 联动力量
        value: '',
        type: 'radio-is',
        label: '联动力量',
        options: haveNull
      },
      isOtherDepartment: { // 其他救援力量
        value: '',
        type: 'radio-is',
        label: '其他救援力量',
        labelWidth: '142px',
        options: haveNull
      },
    },
    policeOther: {
      title: '其他信息',
      isNaturalDisaster: { // 自然灾害引发
        value: '',
        type: 'radio-is',
        label: '自然灾害引发',
        labelWidth: `var(--van-field-label-width-104)`,
        options: isNot
      },
      naturalDisasterType: { // 自然灾害类型
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '自然灾害类型',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'naturalDisasterType',
        selectLeaf: false,
      },
      isOtherProvince: { // 跨省增援
        value: '',
        type: 'radio-is',
        label: '跨省增援',
        options: isNot
      },
      isOtherCity: { // 跨市增援
        value: '',
        type: 'radio-is',
        label: '跨市增援',
        options: isNot
      },
      temperatureMin: { // 气温
        value: ['', ''],
        type: 'input-range',
        label: '气温',
        min: -100,
        max: 100,
      },
      weather: { // 天气
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '天气',
        options: 'weather',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      wind: { // 风力
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '风力',
        options: 'wind',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      windDirection: { // 风向
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '风向',
        options: 'windDirection',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      trappedPersonMin: { // 现场被困人数
        value: ['', ''],
        type: 'input-range',
        label: '现场被困人数',
        labelWidth: `var(--van-field-label-width-104)`,
        numType: 'digit',
      },
      // isPublicFireHydrant: { // 是否采用公共消防栓供水
      //   value: '',
      // },
      // fireHydrantSituation: { // 公共消防栓供水情况
      //   value: undefined,
      //   back: false,
      // },
      // notUseFireHydrantReason: { // 不使用公共消防栓原因
      //   value: undefined,
      //   back: false,
      // },
      orgName: { // 志愿队名称
        value: '',
        type: 'input',
        label: '志愿队名称',
      },
      groupType: { // 志愿队类型
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '志愿队类型',
        options: 'groupType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      isHappenFire: { // 交通事故引发火灾
        value: '',
        type: 'radio-is',
        label: '交通事故引发火灾',
        options: isNot
      },
      warningSource: { // 报警来源
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '报警来源',
        options: 'warningSource',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
    },
    dispatchBase: {
      title: '基本信息',
      dispatchCode: { // 出动编号
        value: '',
        type: 'input',
        label: '出动编号',
      },
      dispatchGroupOrg: { // 出动单位
        value: [],
        back: false,
        type: 'select-org',
        label: '出动单位',
        single: false,
        selectLeaf: false,
        headersDisabled: true,
        selectLevelEqual: true,
        params: { permission: true }
      },
      // dispatchGroup: { // 出动队伍
      //   value: [],
      //   back: false,
      // },
      deptNature: { // 队伍性质
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '队伍性质',
        options: 'deptNature',
        selectLeaf: false,
      },
      dispatchType: { // 参战形式
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '参战形式',
        options: 'dispatchType',
      },
      dealSituation: { // 处置情况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '处置情况',
        options: 'dealSituation',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      fireSituation: { // 到场时火灾情况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '到场时火灾情况',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'fireSituation',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      fireDistanceStart: { // 行驶距离（公里）
        value: ['', ''],
        type: 'input-range',
        label: '行驶距离（公里）',
        labelWidth: '128px',
      },
      attendanceTimeStart: { // 到场时长（分钟）
        value: ['', ''],
        type: 'input-range',
        label: '到场时长（分钟）',
        labelWidth: '128px',
      },
      speedStart: { // 平均时速（km/h）
        value: ['', ''],
        type: 'input-range',
        label: '平均时速（km/h）',
        labelWidth: '136px',
      },
      returnLateReason: { // 时速异常原因
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '时速异常原因',
        labelWidth: `var(--van-field-label-width-130)`,
        options: 'returnLateReason',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      dealMinStart: { // 处置（执勤）时长（分钟）
        value: ['', ''],
        type: 'input-range',
        label: '处置（执勤）时长（分钟）',
        labelWidth: '124px',
      },
      isOtherProvince: { // 是否跨省增援
        value: '',
      },
      isOtherCity: { // 是否跨省增援
        value: '',
      },
      dispatchStatus: { // 报告状态
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '报告状态',
        options: 'dispatchStatus',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      dispatchTag: { // 出动标签
        value: undefined,
        back: false,
        type: 'select-nodes',
        label: '出动标签',
        options: 'dispatchTag',
        fieldNames: { value: 'boFireTagId', label: 'tagName' },
      },
    },
    dispatchTime: {
      title: '时间信息',
      dispatchDate: { // 出动时间
        value: undefined,
        type: 'select-range',
        label: '出动时间',
      },
      midwayReturnDate: { // 中返时间
        value: undefined,
        type: 'select-range',
        label: '中返时间',
        labelWidth: `var(--van-field-label-width-104)`,
      },
      attendanceDate: { // 到场时间
        value: undefined,
        type: 'select-range',
        label: '到场时间',
      },
      carryoutDate: { // 展开时间
        value: undefined,
        type: 'select-range',
        label: '展开时间',
      },
      waterflowDate: { // 出水时间
        value: undefined,
        type: 'select-range',
        label: '出水时间',
      },
      controllingDate: { // 控制时间
        value: undefined,
        type: 'select-range',
        label: '控制时间',
      },
      washDate: { // 洗消时间
        value: undefined,
        type: 'select-range',
        label: '洗消时间',
      },
      extinctDate: { // 扑灭时间
        value: undefined,
        type: 'select-range',
        label: '扑灭时间',
      },
      endDate: { // 结束时间
        value: undefined,
        type: 'select-range',
        label: '结束时间',
      },
      evacuateDate: { // 撤离时间
        value: undefined,
        type: 'select-range',
        label: '撤离时间',
      },
      returnDate: { // 归队时间
        value: undefined,
        type: 'select-range',
        label: '归队时间',
      },
    },
    dispatchInvest: {
      title: '投入力量',
      teamNature: { // 队伍性质
        value: undefined,
        back: false,
      },
      commanderNumMin: { // 指挥员人数
        value: ['', ''],
        type: 'input-range',
        label: '指挥员人数',
        numType: 'digit',
      },
      headPersonType: { // 带队指挥员职务
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '带队指挥员职务',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'headPersonType',
        selectLeaf: false,
      },
      groupLeader: { // 带队指挥人员
        value: undefined,
        back: false,
        type: 'select-person',
        label: '带队指挥人员',
        labelWidth: '100px',
      },
      fireUserIds: { // 指战员姓名
        value: undefined,
        back: false,
        type: 'select-person',
        label: '指战员姓名',
        labelWidth: '100px',
      },
      firemenNumMin: { // 消防员人数
        value: ['', ''],
        type: 'input-range',
        label: '消防员人数',
        numType: 'digit',
      },
      isDispatchTruck: { // 有无车辆出动
        value: '',
        type: 'radio-is',
        label: '有无车辆出动',
        labelWidth: `var(--van-field-label-width-112)`,
        options: haveNull
      },
      isReturnTruck: { // 有无车辆中返
        value: '',
        type: 'radio-is',
        label: '有无车辆中返',
        labelWidth: `var(--van-field-label-width-112)`,
        options: haveNull
      },
      dispatchTruckInfo: { // 消防车辆信息
        value: undefined,
        back: false,
        type: 'select-car',
        label: '消防车辆信息',
        labelWidth: `var(--van-field-label-width-104)`,
      },
      truckType: { // 车辆类型
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '车辆类型',
        options: 'truckType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      dispatchTruckMin: { // 车辆数
        value: ['', ''],
        type: 'input-range',
        label: '车辆数',
        numType: 'digit',
      },
      fireBoatNumMin: { // 艇数
        value: ['', ''],
        type: 'input-range',
        label: '艇数',
        numType: 'digit',
      },
      fireAirplaneNumMin: { // 消防直升机数
        value: ['', ''],
        type: 'input-range',
        label: '消防直升机数',
        labelWidth: `var(--van-field-label-width-104)`,
        numType: 'digit',
      },
      rescueDogNumMin: { // 搜救犬数
        value: ['', ''],
        type: 'input-range',
        label: '搜救犬数',
        numType: 'digit',
      },
      uavMin: { // 无人机数
        value: ['', ''],
        type: 'input-range',
        label: '无人机数',
        numType: 'digit',
      },
      robotNumMin: { // 灭火机器人（个）
        value: ['', ''],
        type: 'input-range',
        label: '灭火机器人（个）',
        labelWidth: `var(--van-field-label-width-132)`,
        numType: 'digit',
      },
    },
    dispatchCasualty: {
      title: '人员伤亡',
      injuryType: { // 伤亡情况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '伤亡情况',
        options: 'dispatchInjuryType',
      },
      deathCountMin: { // 死亡人数
        value: ['', ''],
        type: 'input-range',
        label: '死亡人数',
        numType: 'digit',
      },
      injuryCountMin: { // 受伤人数
        value: ['', ''],
        type: 'input-range',
        label: '受伤人数',
        numType: 'digit',
      },
      name: { // 姓名
        value: '',
        type: 'input',
        label: '姓名',
      },
      nation: { // 民族
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '民族',
        options: 'nation',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      politicalOutlook: { // 政治面貌
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '政治面貌',
        options: 'politicalOutlook',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      idNumber: { // 身份证号码
        value: '',
        type: 'input',
        label: '身份证号码',
      },
      gender: { // 性别
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '性别',
        options: 'gender',
      },
      ageMin: { // 年龄
        value: ['', ''],
        type: 'input-range',
        label: '年龄',
        numType: 'digit',
      },
      rescueRank: { // 消防救援衔
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '消防救援衔',
        options: 'rescueRank',
        selectLeaf: false,
      },
      titleRank: { // 衔级
        value: '',
      },
      duty: { // 职务
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '职务',
        options: 'duty',
        selectLeaf: false,
      },
      teamEntryTime: { // 入队时间
        value: undefined,
        type: 'select-range',
        label: '入队时间',
      },
      period: { // 事发阶段
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '事发阶段',
        options: 'period',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      protectDevice: { // 防护装备情况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '防护装备情况',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'protectDevice',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      injuryReason: { // 受伤原因
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '受伤原因',
        options: 'injuryReason',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      deathReason: { // 死亡原因
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '死亡原因',
        options: 'deathReason',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      injuryPart: { // 受伤部位
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '受伤部位',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'injuryPart',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      deathPart: { // 致命部位
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '致命部位',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'deathPart',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      isInstantDeath: { // 当场死亡
        value: '',
        type: 'radio-is',
        label: '当场死亡',
        labelWidth: `var(--van-field-label-width-104)`,
        options: isNot
      },
    },
    dispatchBattle: {
      title: '战斗成果',
      rescueNumMin: { // 抢救（人）
        value: ['', ''],
        type: 'input-range',
        label: '抢救（人）',
        numType: 'digit',
      },
      surviveNumMin: { // 生还（人）
        value: ['', ''],
        type: 'input-range',
        label: '生还（人）',
        numType: 'digit',
      },
      deathNumMin: { // 死亡（人）
        value: ['', ''],
        type: 'input-range',
        label: '死亡（人）',
        numType: 'digit',
      },
      evacuateNumMin: { // 疏散（人）
        value: ['', ''],
        type: 'input-range',
        label: '疏散（人）',
        numType: 'digit',
      },
      transferNumMin: { // 转移（人）
        value: ['', ''],
        type: 'input-range',
        label: '转移（人）',
        numType: 'digit',
      },
      emergencyNumMin: { // 抢救财产价值（元）
        value: ['', ''],
        type: 'input-range',
        label: '抢救财产价值（元）',
        labelWidth: '142px',
      },
      protectNumMin: { // 保护财产价值（元）
        value: ['', ''],
        type: 'input-range',
        label: '保护财产价值（元）',
        labelWidth: '142px',
      },
    },
    dispatchOther: {
      title: '其他信息',
      isBlocking: { // 消防通道堵塞
        value: '',
        type: 'radio-is',
        label: '消防通道堵塞',
        labelWidth: `var(--van-field-label-width-104)`,
        options: isNot
      },
      blockingTimeStart: { // 疏通耗时（分钟）
        value: ['', ''],
        type: 'input-range',
        label: '疏通耗时（分钟）',
        labelWidth: `var(--van-field-label-width-130)`,
      },
      isWastageTruck: { // 有无车辆损耗
        value: '',
        type: 'radio-is',
        label: '有无车辆损耗',
        labelWidth: `var(--van-field-label-width-112)`,
        options: haveNull
      },
      fireProcess: { // 处置经过
        value: '',
        type: 'input',
        label: '处置经过',
      },
    },
    dispatchHeaderMessage: {
      title: '基本信息',
      dispatchCode: { // 出动编号
        value: '',
        type: 'input',
        label: '出动编号',
      },
      FireHeadLvl: { // 全勤指挥部级别
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '全勤指挥部级别',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'dispatchFireHeadLvl',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      fireHead: { // 全勤指挥部名称
        value: undefined,
        back: false,
        type: 'select-nodes',
        label: '全勤指挥部名称',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'headquarters',
        fieldNames: { value: 'organizationid', label: 'name' },
      },
      groupLeader: { // 指挥人员姓名
        value: undefined,
        back: false,
        type: 'select-person',
        label: '指挥人员姓名',
        labelWidth: `var(--van-field-label-width-104)`,
      },
      commanderNumMin: { // 指挥人数
        value: ['', ''],
        type: 'input-range',
        label: '指挥人数',
        numType: 'digit',
      },
      headCarName: { // 指挥车辆名称
        value: undefined,
        back: false,
        type: 'select-car',
        label: '指挥车辆名称',
        labelWidth: `var(--van-field-label-width-104)`,
      },
      headCarNumMin: { // 指挥车辆数
        value: ['', ''],
        type: 'input-range',
        label: '指挥车辆数',
        numType: 'digit',
      },
      headTimeMin: { // 指挥时长（小时）
        value: ['', ''],
        type: 'input-range',
        label: '指挥时长（小时）',
        labelWidth: `var(--van-field-label-width-130)`,
      },
      dispatchHeadTag: { // 出动标签
        value: undefined,
        back: false,
        type: 'select-nodes',
        label: '出动标签',
        options: 'dispatchHeadTag',
        fieldNames: { value: 'boFireTagId', label: 'tagName' },
      },
    },
    fireBase: {
      title: '基本信息',
      // 基本信息
      fireDate: { // 起火时间
        value: undefined,
        type: 'select-range',
        label: '起火时间',
      },
      statisticRangeHoliday: { // 统计范围--节假日
        value: undefined,
        show: '1',
      },
      statisticRangeSeasonMin: { // 统计范围--季度
        value: [null, null],
      },
      statisticRangeMonthMin: { // 统计范围--月
        value: [null, null],
      },
      statisticRangeDayMin: { // 统计范围--日
        value: [null, null],
      },
      statisticRangeHourMin: { // 统计范围--小时
        value: undefined,
      },
      areaDutyGroupFire: { // 责任区大队
        value: [],
        back: false,
        type: 'select-org',
        label: '责任区大队',
        labelWidth: `var(--van-field-label-width-104)`,
        single: false,
        selectLeaf: false,
        headersDisabled: false,
        selectLevelEqual: true,
        params: { deptType: 1, deptLevel: 4, dutyGroupFlag: '1' }
      },
      fireDirection: { // 火灾地址
        value: '',
        type: 'input',
        label: '火灾地址',
      },
      area: { // 区域
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '区域',
        options: 'area',
        selectLeaf: false,
      },
      fireType: { // 火灾类型
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '火灾类型',
        options: 'fireType',
        selectLeaf: false,
      },
      firePlace: { // 起火场所
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '起火场所',
        options: 'firePlace',
        selectLeaf: false,
      },
      fireCause: { // 起火原因
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '起火原因',
        options: 'fireCause',
        selectLeaf: false,
      },
      burnedAreaMin: { // 过火面积
        value: ['', ''],
        type: 'input-range',
        label: '过火面积',
      },
      fireLevel: { // 火灾等级
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '火灾等级',
        options: 'fireLevel',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      fireCode: { // 火灾编号
        value: '',
        type: 'input',
        label: '火灾编号',
      },
      severity: { // 是否轻微火灾
        value: '',
        type: 'radio-is',
        label: '是否轻微火灾',
        labelWidth: `var(--van-field-label-width-104)`,
        options: isNot
      },
      fireSite: { // 起火位置
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '起火位置',
        options: 'fireSite',
        selectLeaf: false,
      },
      initialFuelsType: { // 起火物类型
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '起火物类型',
        options: 'initialFuelsType',
        selectLeaf: false,
      },
      initialFuels: { // 起火物名称
        value: '',
        type: 'input',
        label: '起火物名称',
      },
      igniteSourceType: { // 引火源类型
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '引火源类型',
        options: 'igniteSourceType',
        selectLeaf: false,
      },
      igniteSource: { // 引火源名称
        value: '',
        type: 'input',
        label: '引火源名称',
      },
      firePattern: { // 事故形态
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '事故形态',
        options: 'firePattern',
        selectLeaf: false,
      },
      liveType: { // 居住形式
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '居住形式',
        options: 'liveType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      isPoorHouse: { // 扶贫安置房
        value: undefined,
        type: 'radio-is',
        label: '扶贫安置房',
        labelWidth: '142px',
        options: isNot
      },
      isChangeUseType: { // 变更使用性质
        value: undefined,
        type: 'radio-is',
        label: '变更使用性质',
        labelWidth: '136px',
        options: isNot
      },
      useType: { // 变更后使用性质
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '变更后使用性质',
        labelWidth: '124px',
        options: 'useType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      isSafetyAccident: { // 生产安全事故
        value: undefined,
        type: 'radio-is',
        label: '生产安全事故',
        labelWidth: `var(--van-field-label-width-104)`,
        options: isNot
      },
      isResearch: { // 是否正在调查
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '是否正在调查',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'isResearch',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      // fireTel: { // 失火单位/户主联系电话
      //   value: '',
      //   type: 'input',
      //   label: '失火单位/户主联系电话',
      //   labelWidth: '160px',
      // },
      socialCreditCode: { // 单位统一社会信用代码
        value: '',
        type: 'input',
        label: '单位统一社会信用代码',
        labelWidth: '154px',
      },
      industry: { // 所属行业
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '所属行业',
        options: 'industry',
        selectLeaf: false,
      },
      industryDepartment: { // 行业主管部门
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '行业主管部门',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'industryDepartment',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      economicType: { // 经济类型
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '经济类型',
        options: 'economicType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      leadInspectionOrg: { // 调查部门
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '调查部门',
        labelWidth: `var(--van-field-label-width-130)`,
        options: 'leadInspectionOrg',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      isInsurance: { // 是否保险
        value: '',
        type: 'radio-is',
        label: '是否保险',
        options: isNot
      },
      insuranceInfo: { // 保险类型
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '保险类型',
        options: 'insuranceInfo',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      isOnesided: { // 单方面火灾
        value: '',
        type: 'radio-is',
        label: '单方面火灾',
        labelWidth: `var(--van-field-label-width-112)`,
        options: isNot
      },
      fireInspection: { // 监督检查情况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '监督检查情况',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'fireInspection',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      firePersonAgeMin: { // 引起火灾人员年龄
        value: ['', ''],
        type: 'input-range',
        label: '引起火灾人员年龄',
        labelWidth: `var(--van-field-label-width-130)`,
        numType: 'digit',
      },
      schooling: { // 教育程度
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '教育程度',
        options: 'schooling',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      health: { // 健康状况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '健康状况',
        options: 'health',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      undo: { // 未出动火灾
        value: '',
        type: 'radio-is',
        label: '未出动火灾',
        options: isNot
      },
      fireStatus: { // 报告状态
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '报告状态',
        options: 'fireStatus',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      fireInfoTag: { // 火灾标签
        value: undefined,
        back: false,
        type: 'select-nodes',
        label: '火灾标签',
        options: 'fireInfoTag',
        fieldNames: { value: 'boFireTagId', label: 'tagName' },
      },
      isOperating: { // 生产经营
        value: '',
        type: 'radio-is',
        label: '生产经营',
        labelWidth: `var(--van-field-label-width-132)`,
        options: isNot
      },
      plantRiskClassification: { // 火灾危险性分类
        value: undefined,
        back: false,
        type: 'select-nodes',
        label: '火灾危险性分类',
        labelWidth: `var(--van-field-label-width-132)`,
        options: 'plantRiskClassification',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
    },
    fireCasualty: {
      title: '人员伤亡',
      // 人员伤亡
      isInjury: { // 人员伤亡
        value: '',
        type: 'radio-is',
        label: '人员伤亡',
        labelWidth: `var(--van-field-label-width-112)`,
        options: haveNull
      },
      injuryType: { // 伤亡情况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '伤亡情况',
        options: 'injuryType',
      },
      deathCountMin: { // 死亡人数
        value: ['', ''],
        type: 'input-range',
        label: '死亡人数',
        numType: 'digit',
      },
      injuryCountMin: { // 受伤人数
        value: ['', ''],
        type: 'input-range',
        label: '受伤人数',
        numType: 'digit',
      },
      zsCountMin: { // 重伤人数
        value: ['', ''],
        type: 'input-range',
        label: '重伤人数',
        numType: 'digit',
      },
      qsCountMin: { // 轻伤人数
        value: ['', ''],
        type: 'input-range',
        label: '轻伤人数',
        numType: 'digit',
      },
      name: { // 姓名
        value: '',
        type: 'input',
        label: '姓名',
      },
      nation: { // 民族
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '民族',
        options: 'nation',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      idType: { // 证件类型
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '证件类型',
        options: 'idType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      idNumber: { // 证件号码
        value: '',
        type: 'input',
        label: '证件号码',
      },
      gender: { // 性别
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '性别',
        options: 'gender',
      },
      ageMin: { // 年龄
        value: ['', ''],
        type: 'input-range',
        label: '年龄',
        numType: 'digit',
      },
      injurySource: { // 人员来源
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '人员来源',
        options: 'injurySource',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      job: { // 职业
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '职业',
        options: 'job',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      injuryHealth: { // 健康状况
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '健康状况',
        options: 'health',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      injurySchooling: { // 教育程度
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '教育程度',
        options: 'schooling',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      injuryCause: { // 伤亡原因
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '伤亡原因',
        options: 'injuryCause',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      humanCause: { // 人为因素
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '人为因素',
        options: 'humanCause',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      injuryBehavior: { // 受伤/害时行为
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '受伤/害时行为',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'injuryBehavior',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      injuryPart: { // 受伤部位
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '受伤部位',
        options: 'injuryPart',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      mainSymptoms: { // 主要症状
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '主要症状',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'mainSymptoms',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      bodyLocation: { // 尸体位置
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '尸体位置',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'bodyLocation',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      deathDate: { // 死亡时间
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '死亡时间',
        options: 'deathDate',
        selectLeaf: false,
      },
    },
    fireEconomic: {
      title: '经济损失',
      // 经济损失
      inspectMethod: { // 调查方式
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '调查方式',
        options: 'inspectMethod',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      costSource: { // 损失来源
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '损失来源',
        options: 'costSource',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      directEconomicLossMin: { // 直接经济损失（元)
        value: ['', ''],
        type: 'input-range',
        label: '直接经济损失（元）',
        labelWidth: '140px',
      },
      directDamageMin: { // 直接财产损失（元）
        value: ['', ''],
        type: 'input-range',
        label: '直接财产损失（元）',
        labelWidth: '140px',
      },
      fireDisposalCostMin: { // 火灾现场处置费用（元)
        value: ['', ''],
        type: 'input-range',
        label: '火灾现场处置费用（元）',
      },
      fireInjuryCostMin: { // 人身伤亡医疗支出（元）
        value: ['', ''],
        type: 'input-range',
        label: '人身伤亡医疗支出（元）',
      },
      affectedHouseMin: { // 受灾户数（户）
        value: ['', ''],
        type: 'input-range',
        label: '受灾户数（户）',
        labelWidth: '124px',
        numType: 'digit',
      },
    },
    fireVehicle: {
      title: '交通工具',
      // 交通工具
      vehicleType: { // 交通工具类型
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '交通工具类型',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'vehicleType',
        selectLeaf: false,
      },
      chargeState: { // 起火时充电状态
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '起火时充电状态',
        labelWidth: `var(--van-field-label-width-112)`,
        options: 'chargeState',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      batteryType: { // 电池类型
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '电池类型',
        options: 'batteryType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      isRepack: { // 电力助动车-是否改装
        value: '',
        type: 'radio-is',
        label: '电力助动车-是否改装',
        options: isNot
      },
      carNumber: { // 车牌号
        value: '',
        type: 'input',
        label: '车牌号',
      },
      vinCode: { // 车辆VIN码
        value: '',
        type: 'input',
        label: '车辆VIN码',
      },
      driveState: { // 行驶状态
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '行驶状态',
        options: 'driveState',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
    },
    fireBuilding: {
      title: '建筑信息',
      // 建筑信息
      buildTag: { // 建筑标签
        value: [],
        type: 'checkbox',
        label: '建筑标签',
        // fieldNames: { value: 'boDictId', label: 'dictName' },
        options: 'buildTag',
      },
      buildType: { // 建筑类别
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '建筑类别',
        options: 'buildType',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      fireResistanceRating: { // 耐火等级
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '耐火等级',
        options: 'fireResistanceRating',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      buildStructure: { // 建筑结构
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '建筑结构',
        options: 'buildStructure',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
      buildFloorMin: { // 建筑总楼层
        value: ['', ''],
        type: 'input-range',
        label: '建筑总楼层',
        numType: 'digit',
      },
      fireFloorMin: { // 失火楼层
        value: ['', ''],
        type: 'input-range',
        label: '失火楼层',
        numType: 'number',
        min: -99,
        max: 999,
      },
      housingLifeMin: { // 房龄（年）
        value: ['', ''],
        type: 'input-range',
        label: '房龄（年）',
        numType: 'digit',
      },
      buildUse: { // 建筑使用用途
        value: undefined,
        back: false,
        type: 'cascader-multiple',
        label: '建筑使用用途',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'buildUse',
        selectLeaf: false,
      },
      isSpread: { // 是否蔓延
        value: undefined,
        type: 'radio-is',
        label: '是否蔓延',
        options: isNot
      },
      isLoud: { // 是否发生轰燃
        value: undefined,
        type: 'radio-is',
        label: '是否发生轰燃',
        labelWidth: `var(--van-field-label-width-104)`,
        options: isNot
      },
      isWindowOpened: { // 建筑门窗是否开启
        value: undefined,
        type: 'radio-is',
        label: '建筑门窗是否开启',
        labelWidth: `var(--van-field-label-width-130)`,
        options: isNot
      },
      historyBuildLevel: { // 文物古建筑级别
        value: undefined,
        back: false,
        type: 'select-multiple',
        label: '文物古建筑级别',
        options: 'historyBuildLevel',
        fieldNames: { value: 'boDictId', label: 'dictName' },
      },
    },
    fireFacilities: {
      title: '消防设施',
      // 火灾信息-消防设施
      isFirefightFacility: { // 消防设施设备
        value: undefined,
        type: 'radio-is',
        label: '消防设施设备',
        labelWidth: `var(--van-field-label-width-130)`,
        options: install
      },
      autoAlarm: { // 自动报警系统
        value: undefined,
        type: 'radio-is',
        label: '自动报警系统',
        options: install
      },
      autoFireFight: { // 自动灭火系统
        value: undefined,
        type: 'radio-is',
        label: '自动灭火系统',
        options: install
      },
      indoorHydrant: { // 室内消防栓系统
        value: undefined,
        type: 'radio-is',
        label: '室内消防栓系统',
        options: install
      },
      smokeControl: { // 防排烟系统
        value: undefined,
        type: 'radio-is',
        label: '防排烟系统',
        options: install
      },
      fireShutter: { // 防火卷帘
        value: undefined,
        type: 'radio-is',
        label: '防火卷帘',
        options: install
      },
      emergencyLight: { // 应急疏散照明
        value: undefined,
        type: 'select-multiple',
        label: '应急疏散照明',
        labelWidth: `var(--van-field-label-width-104)`,
        options: 'regulation',
      },
      networking: { // 联网情况
        value: undefined,
        type: 'select-multiple',
        label: '联网情况',
        options: 'networking',
      },
      fireCompartment: { // 防火分区
        value: undefined,
        type: 'select-multiple',
        label: '防火分区',
        options: 'regulation',
      },
      compartmentAreaMin: { // 分区面积（m2）
        value: ['', ''],
        type: 'input-range',
        label: '分区面积（平方米）',
        labelWidth: '140px',
      },
      fireSeparation: { // 防火间距
        value: undefined,
        type: 'select-multiple',
        label: '防火间距',
        options: 'regulation',
      },
      separationMeterMin: { // 间距（m）
        value: ['', ''],
        type: 'input-range',
        label: '间距（米）',
        labelWidth: '140px',
      },
      escapeRoute: { // 疏散通道
        value: undefined,
        type: 'select-multiple',
        label: '疏散通道',
        options: 'regulation',
      },
      emergencyExit: { // 紧急出口
        value: undefined,
        type: 'select-multiple',
        label: '紧急出口',
        options: 'regulation',
      },
    },
    fireOther: {
      title: '其他信息',
      // 火灾信息-其他信息
      firePassage: { // 起火经过
        value: '',
        type: 'input',
        label: '起火经过',
      },
      handleTwoCase: { // 两案处理情况
        value: undefined,
        type: 'radio-is',
        label: '两案处理情况',
        options: isCase
      },
      penaltyNumMin: { // 追究人数
        value: ['', ''],
        type: 'input-range',
        label: '追究人数（人）',
        labelWidth: '124px',
        numType: 'digit',
      },
      suggestDealNumMin: { // 建议处理人数（人）
        value: ['', ''],
        type: 'input-range',
        label: '建议处理人数（人）',
        labelWidth: '140px',
        numType: 'digit',
      },
      firePenalty: { // 火灾处罚情况
        value: undefined,
        type: 'radio-is',
        label: '火灾处罚情况',
        options: isCase
      },
    },
  }

  const form = ref(cloneDeep(formOrigin))

  const returnDate = (date, index) => {
    return date && date[index] ? date[index]?.valueOf() : ''
  }

  const returnHour = (date, index) => {
    return date && date[index] ? date[index]?.hour() : ''
  }

  const returnCascader = (selects) => {
    return selects?.length > 0 ? JSON.stringify(selects) : undefined
  }

  const returnMinMax = (value) => {
    return value === null ? '' : value
  }

  const getSearchParams = (simple, searchType) => {
    const { policeBase, policeInvest, policeOther, dispatchBase, dispatchTime, dispatchInvest, dispatchCasualty, dispatchBattle, dispatchOther, dispatchHeaderMessage, fireBase, fireCasualty, fireEconomic, fireVehicle, fireBuilding, fireFacilities, fireOther } = form.value
    if (simple) {
      const params = {
        comprehensiveWarningQueryReq: {
          warningDateStart: returnDate(policeBase.warningDate.value, 0),
          warningDateEnd: returnDate(policeBase.warningDate.value, 1),
          warningCode: policeBase.warningCode.value,
          warningType: returnCascader(policeBase.warningType.value),
          warningTypeNon: policeBase.warningType.back,
          areaGroup: policeBase.areaGroup.value
            ?.map((item) => item.organizationid)
            ?.join(","),
          areaGroupText: policeBase.areaGroup.value
            ?.map((item) => item.name)
            ?.join(","),
          areaGroupNon: policeBase.areaGroup.back,
          boAreaId:
            policeBase.boAreaId.value?.length > 0
              ? JSON.stringify(policeBase.boAreaId.value)
              : "",
          boAreaIdText:
            policeBase.boAreaId.text?.length > 0
              ? JSON.stringify(policeBase.boAreaId.text)
              : "",
          warningAddr: policeBase.warningAddr.value,
        },
        comprehensiveDispatchQueryReq: {},
        comprehensiveDispatchHeadQueryReq: {},
        comprehensiveFireQueryReq: {
          fireDateStart: returnDate(fireBase.fireDate.value, 0),
          fireDateEnd: returnDate(fireBase.fireDate.value, 1),
          fireType: fireBase.fireType.value?.map((item) => item[0]).join(","),
          firePlace: returnCascader(fireBase.firePlace.value),
          firePlaceNon: fireBase.firePlace.back,
          fireCause: returnCascader(fireBase.fireCause.value),
          fireCauseNon: fireBase.fireCause.back,
          fireLevel: fireBase.fireLevel.value?.join(","),
          fireLevelNon: fireBase.fireLevel.back,
          severity: fireBase.severity.value,
          isOperating: fireBase.isOperating.value,
        },
      };
      if (searchType === 3) {
        params.comprehensiveDispatchHeadQueryReq = {
          dispatchCode: dispatchHeaderMessage.dispatchCode.value,
          FireHeadLvl: dispatchHeaderMessage.FireHeadLvl.value?.join(","),
          FireHeadLvlNon: dispatchHeaderMessage.FireHeadLvl.back,
          fireHead: dispatchHeaderMessage.fireHead.value
            ?.map((item) => item.organizationid)
            ?.join(","),
          fireHeadText: dispatchHeaderMessage.fireHead.value
            ?.map((item) => item.name)
            ?.join(","),
          fireHeadNon: dispatchHeaderMessage.fireHead.back,
          groupLeader: dispatchHeaderMessage.groupLeader.value
            ?.map((item) => item.boFireUserId)
            ?.join(","),
          groupLeaderName: dispatchHeaderMessage.groupLeader.value
            ?.map((item) => item.userName)
            ?.join(","),
          groupLeaderNon: dispatchHeaderMessage.groupLeader.back,
          commanderNumMin: dispatchHeaderMessage.commanderNumMin.value?.[0],
          commanderNumMax: dispatchHeaderMessage.commanderNumMin.value?.[1],
          headCarName: dispatchHeaderMessage.headCarName.value
            ?.map((val) => val.boFireTruckId)
            ?.join(","),
          headCarNameText: dispatchHeaderMessage.headCarName.value
            ?.map((val) => val.truckNumber)
            ?.join(","),
          headCarNameNon: dispatchHeaderMessage.headCarName.back,
          headCarNumMin: dispatchHeaderMessage.headCarNumMin.value?.[0],
          headCarNumMax: dispatchHeaderMessage.headCarNumMin.value?.[1],
          headTimeMin: dispatchHeaderMessage.headTimeMin.value?.[0],
          headTimeMax: dispatchHeaderMessage.headTimeMin.value?.[1],
        };
      } else {
        params.comprehensiveDispatchQueryReq = {
          dispatchCode: dispatchBase.dispatchCode.value,
          dispatchGroupOrg: dispatchBase.dispatchGroupOrg.value
            ?.map((item) => item.organizationid)
            ?.join(","),
          dispatchGroupOrgText: dispatchBase.dispatchGroupOrg.value
            ?.map((item) => item.name)
            ?.join(","),
          dispatchGroupOrgNon: dispatchBase.dispatchGroupOrg.back,
          deptNature: returnCascader(dispatchBase.deptNature.value),
          deptNatureNon: dispatchBase.deptNature.back,
          dispatchType: dispatchBase.dispatchType.value
            ?.map((val) => val.value)
            ?.join(","),
          dispatchTypeText: dispatchBase.dispatchType.value
            ?.map((val) => val.label)
            ?.join(","),
          dispatchTypeNon: dispatchBase.dispatchType.back,
          dealSituation: dispatchBase.dealSituation.value?.join(","),
          dealSituationNon: dispatchBase.dealSituation.back,
          fireSituation: dispatchBase.fireSituation.value?.join(","),
          fireSituationNon: dispatchBase.fireSituation.back,
        };
      }
      return params
    }
    const params = {
      comprehensiveWarningQueryReq: {
        // 警情信息-基本信息
        warningDateStart: returnDate(policeBase.warningDate.value, 0),
        warningDateEnd: returnDate(policeBase.warningDate.value, 1),
        statisticRangeHoliday: policeBase.statisticRangeHoliday.value,
        statisticRangeHourMin: returnHour(policeBase.statisticRangeHourMin.value, 0),
        statisticRangeHourMax: returnHour(policeBase.statisticRangeHourMin.value, 1),
        statisticRangeDayMin: returnMinMax(policeBase.statisticRangeDayMin.value?.[0]),
        statisticRangeDayMax: returnMinMax(policeBase.statisticRangeDayMin.value?.[1]),
        statisticRangeMonthMin: returnMinMax(policeBase.statisticRangeMonthMin.value?.[0]),
        statisticRangeMonthMax: returnMinMax(policeBase.statisticRangeMonthMin.value?.[1]),
        statisticRangeSeasonMin: returnMinMax(policeBase.statisticRangeSeasonMin.value?.[0]),
        statisticRangeSeasonMax: returnMinMax(policeBase.statisticRangeSeasonMin.value?.[1]),
        areaGroup: policeBase.areaGroup.value?.map(item => item.organizationid)?.join(','),
        areaGroupText: policeBase.areaGroup.value?.map(item => item.name)?.join(','),
        areaGroupNon: policeBase.areaGroup.back,
        boAreaId: policeBase.boAreaId.value?.length > 0 ? JSON.stringify(policeBase.boAreaId.value) : '',
        boAreaIdText: policeBase.boAreaId.text?.length > 0 ? JSON.stringify(policeBase.boAreaId.text) : '',
        warningAddr: policeBase.warningAddr.value,
        warningType: returnCascader(policeBase.warningType.value),
        warningTypeNon: policeBase.warningType.back,
        warningLevel: policeBase.warningLevel.value?.join(','),
        warningLevelNon: policeBase.warningLevel.back,
        warningCode: policeBase.warningCode.value,
        warningName: policeBase.warningName.value,
        warningCodeYyj: policeBase.warningCodeYyj.value,
        warningOrgname: policeBase.warningOrgname.value,
        warningTel: policeBase.warningTel.value,
        warningInfo: policeBase.warningInfo.value,
        warningTag: policeBase.warningTag.value?.map(val => val.value)?.join(','),
        warningTagText: policeBase.warningTag.value?.map(val => val.label)?.join(','),
        warningTagNon: policeBase.warningTag.back,
        createOrgId: policeBase.createOrgId.value?.map(item => item.organizationid)?.join(','),
        createOrgIdText: policeBase.createOrgId.value?.map(item => item.name)?.join(','),
        createOrgIdNon: policeBase.createOrgId.back,
        warningStatus: policeBase.warningStatus.value?.join(','),
        warningStatusNon: policeBase.warningStatus.back,
        warningDealStatus: policeBase.warningDealStatus.value,
        // warningDealStatusNon: policeBase.warningDealStatus.back,
        // 警情信息-投入力量
        dispatchGroup: policeInvest.dispatchGroup.value?.map(item => item.organizationid)?.join(','),
        dispatchGroupText: policeInvest.dispatchGroup.value?.map(item => item.name)?.join(','),
        dispatchGroupNon: policeInvest.dispatchGroup.back,
        mainGroup: policeInvest.mainGroup.value?.map(item => item.organizationid)?.join(','),
        mainGroupText: policeInvest.mainGroup.value?.map(item => item.name)?.join(','),
        mainGroupNon: policeInvest.mainGroup.back,
        firstGroup: policeInvest.firstGroup.value?.map(item => item.organizationid)?.join(','),
        firstGroupText: policeInvest.firstGroup.value?.map(item => item.name)?.join(','),
        firstGroupNon: policeInvest.firstGroup.back,
        dispatchGroupCountMin: policeInvest.dispatchGroupCountMin.value?.[0],
        dispatchGroupCountMax: policeInvest.dispatchGroupCountMin.value?.[1],
        dispatchNumMin: policeInvest.dispatchNumMin.value?.[0],
        dispatchNumMax: policeInvest.dispatchNumMin.value?.[1],
        dispatchTruckMin: policeInvest.dispatchTruckMin.value?.[0],
        dispatchTruckMax: policeInvest.dispatchTruckMin.value?.[1],
        isHeadquarters: policeInvest.isHeadquarters.value,
        fireHeadLevel: policeInvest.fireHeadLevel.value?.join(','),
        fireHeadLevelNon: policeInvest.fireHeadLevel.back,
        fireHead: policeInvest.fireHead.value?.map(item => item.organizationid)?.join(','),
        fireHeadText: policeInvest.fireHead.value?.map(item => item.name)?.join(','),
        fireHeadNon: policeInvest.fireHead.back,
        personNumMin: policeInvest.personNumMin.value?.[0],
        personNumMax: policeInvest.personNumMin.value?.[1],
        dealMinStart: policeInvest.dealMinStart.value?.[0],
        dealMinEnd: policeInvest.dealMinStart.value?.[1],
        // areaDutyGroup: policeInvest.areaDutyGroup.value?.map(item => item.organizationid)?.join(','),
        // areaDutyGroupText: policeInvest.areaDutyGroup.value?.map(item => item.name)?.join(','),
        // areaDutyGroupNon: policeInvest.areaDutyGroup.back,
        dutyGroup: policeInvest.dutyGroup.value?.map(item => item.organizationid)?.join(','),
        dutyGroupText: policeInvest.dutyGroup.value?.map(item => item.name)?.join(','),
        dutyGroupNon: policeInvest.dutyGroup.back,
        isDuty: policeInvest.isDuty.value,
        isDutyGroupDispatch: policeInvest.isDutyGroupDispatch.value,
        isOnlyFull: policeInvest.isOnlyFull.value,
        isZf: policeInvest.isZf.value,
        isLinkDepartment: policeInvest.isLinkDepartment.value,
        isOtherDepartment: policeInvest.isOtherDepartment.value,
        // 警情信息-其他信息
        isNaturalDisaster: policeOther.isNaturalDisaster.value,
        naturalDisasterType: returnCascader(policeOther.naturalDisasterType.value),
        naturalDisasterTypeNon: policeOther.naturalDisasterType.back,
        isOtherProvince: policeOther.isOtherProvince.value,
        isOtherCity: policeOther.isOtherCity.value,
        temperatureMin: policeOther.temperatureMin.value?.[0],
        temperatureMax: policeOther.temperatureMin.value?.[1],
        weather: policeOther.weather.value?.join(','),
        weatherNon: policeOther.weather.back,
        wind: policeOther.wind.value?.join(','),
        windNon: policeOther.wind.back,
        windDirection: policeOther.windDirection.value?.join(','),
        windDirectionNon: policeOther.windDirection.back,
        trappedPersonMin: policeOther.trappedPersonMin.value?.[0],
        trappedPersonMax: policeOther.trappedPersonMin.value?.[1],
        // isPublicFireHydrant: policeOther.isPublicFireHydrant.value,
        // fireHydrantSituation: policeOther.fireHydrantSituation.value?.join(','),
        // fireHydrantSituationNon: policeOther.fireHydrantSituation.back,
        // notUseFireHydrantReason: policeOther.notUseFireHydrantReason.value?.join(','),
        // notUseFireHydrantReasonNon: policeOther.notUseFireHydrantReason.back,
        orgName: policeOther.orgName.value,
        groupType: policeOther.groupType.value?.join(','),
        groupTypeNon: policeOther.groupType.back,
        isHappenFire: policeOther.isHappenFire.value,
        warningSource: policeOther.warningSource.value?.join(','),
        warningSourceNon: policeOther.warningSource.back,
      },
      comprehensiveDispatchQueryReq: {
        // 出动填报-基本信息
        dispatchCode: dispatchBase.dispatchCode.value,
        dispatchGroupOrg: dispatchBase.dispatchGroupOrg.value?.map(item => item.organizationid)?.join(','),
        dispatchGroupOrgText: dispatchBase.dispatchGroupOrg.value?.map(item => item.name)?.join(','),
        dispatchGroupOrgNon: dispatchBase.dispatchGroupOrg.back,
        // dispatchGroup: dispatchBase.dispatchGroup.value?.map(item => item.organizationid)?.join(','),
        // dispatchGroupText: dispatchBase.dispatchGroup.value?.map(item => item.organizationid)?.join(','),
        // dispatchGroupNon: dispatchBase.dispatchGroup.back,
        deptNature: returnCascader(dispatchBase.deptNature.value),
        deptNatureNon: dispatchBase.deptNature.back,
        dispatchType: dispatchBase.dispatchType.value?.map(val => val.value)?.join(','),
        dispatchTypeText: dispatchBase.dispatchType.value?.map(val => val.label)?.join(','),
        dispatchTypeNon: dispatchBase.dispatchType.back,
        dealSituation: dispatchBase.dealSituation.value?.join(','),
        dealSituationNon: dispatchBase.dealSituation.back,
        fireSituation: dispatchBase.fireSituation.value?.join(','),
        fireSituationNon: dispatchBase.fireSituation.back,
        fireDistanceStart: dispatchBase.fireDistanceStart.value?.[0],
        fireDistanceEnd: dispatchBase.fireDistanceStart.value?.[1],
        attendanceTimeStart: dispatchBase.attendanceTimeStart.value?.[0],
        attendanceTimeEnd: dispatchBase.attendanceTimeStart.value?.[1],
        speedStart: dispatchBase.speedStart.value?.[0],
        speedEnd: dispatchBase.speedStart.value?.[1],
        returnLateReason: dispatchBase.returnLateReason.value?.join(','),
        returnLateReasonNon: dispatchBase.returnLateReason.back,
        dealMinStart: dispatchBase.dealMinStart.value?.[0],
        dealMinEnd: dispatchBase.dealMinStart.value?.[1],
        isOtherProvince: dispatchBase.isOtherProvince.value,
        isOtherCity: dispatchBase.isOtherCity.value,
        dispatchStatus: dispatchBase.dispatchStatus.value?.join(','),
        dispatchStatusNon: dispatchBase.dispatchStatus.back,
        dispatchTag: dispatchBase.dispatchTag.value?.map(val => val.value)?.join(','),
        dispatchTagText: dispatchBase.dispatchTag.value?.map(val => val.label)?.join(','),
        dispatchTagNon: dispatchBase.dispatchTag.back,
        // 出动填报-时间信息
        dispatchDateStart: returnDate(dispatchTime.dispatchDate.value, 0),
        dispatchDateEnd: returnDate(dispatchTime.dispatchDate.value, 1),
        midwayReturnDateStart: returnDate(dispatchTime.midwayReturnDate.value, 0),
        midwayReturnDateEnd: returnDate(dispatchTime.midwayReturnDate.value, 1),
        attendanceDateStart: returnDate(dispatchTime.attendanceDate.value, 0),
        attendanceDateEnd: returnDate(dispatchTime.attendanceDate.value, 1),
        carryoutDateStart: returnDate(dispatchTime.carryoutDate.value, 0),
        carryoutDateEnd: returnDate(dispatchTime.carryoutDate.value, 1),
        waterflowDateStart: returnDate(dispatchTime.waterflowDate.value, 0),
        waterflowDateEnd: returnDate(dispatchTime.waterflowDate.value, 1),
        controllingDateStart: returnDate(dispatchTime.controllingDate.value, 0),
        controllingDateEnd: returnDate(dispatchTime.controllingDate.value, 1),
        washDateStart: returnDate(dispatchTime.washDate.value, 0),
        washDateEnd: returnDate(dispatchTime.washDate.value, 1),
        endDateStart: returnDate(dispatchTime.endDate.value, 0),
        endDateEnd: returnDate(dispatchTime.endDate.value, 1),
        extinctDateStart: returnDate(dispatchTime.extinctDate.value, 0),
        extinctDateEnd: returnDate(dispatchTime.extinctDate.value, 1),
        evacuateDateStart: returnDate(dispatchTime.evacuateDate.value, 0),
        evacuateDateEnd: returnDate(dispatchTime.evacuateDate.value, 1),
        returnDateStart: returnDate(dispatchTime.returnDate.value, 0),
        returnDateEnd: returnDate(dispatchTime.returnDate.value, 1),
        // 出动填报-投入力量
        teamNature: dispatchInvest.teamNature.value?.join(','),
        teamNatureNon: dispatchInvest.teamNature.back,
        commanderNumMin: dispatchInvest.commanderNumMin.value?.[0],
        commanderNumMax: dispatchInvest.commanderNumMin.value?.[1],
        headPersonType: returnCascader(dispatchInvest.headPersonType.value),
        headPersonTypeNon: dispatchInvest.headPersonType.back,
        groupLeader: dispatchInvest.groupLeader.value?.map(item => item.boFireUserId)?.join(','),
        groupLeaderName: dispatchInvest.groupLeader.value?.map(item => item.userName)?.join(','),
        groupLeaderNon: dispatchInvest.groupLeader.back,
        fireUserIds: dispatchInvest.fireUserIds.value?.map(item => item.boFireUserId)?.join(','),
        fireUserIdsName: dispatchInvest.fireUserIds.value?.map(item => item.userName)?.join(','),
        fireUserIdsNon: dispatchInvest.fireUserIds.back,
        firemenNumMin: dispatchInvest.firemenNumMin.value?.[0],
        firemenNumMax: dispatchInvest.firemenNumMin.value?.[1],
        isDispatchTruck: dispatchInvest.isDispatchTruck.value,
        isReturnTruck: dispatchInvest.isReturnTruck.value,
        dispatchTruckInfo: dispatchInvest.dispatchTruckInfo.value?.map(val => val.boFireTruckId)?.join(','),
        dispatchTruckInfoText: dispatchInvest.dispatchTruckInfo.value?.map(val => val.truckNumber)?.join(','),
        dispatchTruckInfoNon: dispatchInvest.dispatchTruckInfo.back,
        truckType: dispatchInvest.truckType.value?.join(','),
        truckTypeNon: dispatchInvest.truckType.back,
        dispatchTruckMin: dispatchInvest.dispatchTruckMin.value?.[0],
        dispatchTruckMax: dispatchInvest.dispatchTruckMin.value?.[1],
        fireBoatNumMin: dispatchInvest.fireBoatNumMin.value?.[0],
        fireBoatNumMax: dispatchInvest.fireBoatNumMin.value?.[1],
        fireAirplaneNumMin: dispatchInvest.fireAirplaneNumMin.value?.[0],
        fireAirplaneNumMax: dispatchInvest.fireAirplaneNumMin.value?.[1],
        rescueDogNumMin: dispatchInvest.rescueDogNumMin.value?.[0],
        rescueDogNumMax: dispatchInvest.rescueDogNumMin.value?.[1],
        uavMin: dispatchInvest.uavMin.value?.[0],
        uavMax: dispatchInvest.uavMin.value?.[1],
        robotNumMin: dispatchInvest.robotNumMin.value?.[0],
        robotNumMax: dispatchInvest.robotNumMin.value?.[1],
        // 出动填报-参战伤亡
        injuryType: dispatchCasualty.injuryType.value?.map(val => val.value)?.join(','),
        injuryTypeText: dispatchCasualty.injuryType.value?.map(val => val.label)?.join(','),
        injuryTypeNon: dispatchCasualty.injuryType.back,
        deathCountMin: dispatchCasualty.deathCountMin.value?.[0],
        deathCountMax: dispatchCasualty.deathCountMin.value?.[1],
        injuryCountMin: dispatchCasualty.injuryCountMin.value?.[0],
        injuryCountMax: dispatchCasualty.injuryCountMin.value?.[1],
        name: dispatchCasualty.name.value,
        nation: dispatchCasualty.nation.value?.join(','),
        nationNon: dispatchCasualty.nation.back,
        politicalOutlook: dispatchCasualty.politicalOutlook.value?.join(','),
        politicalOutlookNon: dispatchCasualty.politicalOutlook.back,
        idNumber: dispatchCasualty.idNumber.value,
        gender: dispatchCasualty.gender.value?.map(val => val.value)?.join(','),
        genderText: dispatchCasualty.gender.value?.map(val => val.label)?.join(','),
        genderNon: dispatchCasualty.gender.back,
        ageMin: dispatchCasualty.ageMin.value?.[0],
        ageMax: dispatchCasualty.ageMin.value?.[1],
        rescueRank: returnCascader(dispatchCasualty.rescueRank.value),
        rescueRankNon: dispatchCasualty.rescueRank.back,
        titleRank: dispatchCasualty.titleRank.value,
        duty: returnCascader(dispatchCasualty.duty.value),
        dutyNon: dispatchCasualty.duty.back,
        teamEntryTimeStart: returnDate(dispatchCasualty.teamEntryTime.value, 0),
        teamEntryTimeEnd: returnDate(dispatchCasualty.teamEntryTime.value, 1),
        period: dispatchCasualty.period.value?.join(','),
        periodNon: dispatchCasualty.period.back,
        protectDevice: dispatchCasualty.protectDevice.value?.join(','),
        protectDeviceNon: dispatchCasualty.protectDevice.back,
        injuryReason: dispatchCasualty.injuryReason.value?.join(','),
        injuryReasonNon: dispatchCasualty.injuryReason.back,
        deathReason: dispatchCasualty.deathReason.value?.join(','),
        deathReasonNon: dispatchCasualty.deathReason.back,
        injuryPart: dispatchCasualty.injuryPart.value?.join(','),
        injuryPartNon: dispatchCasualty.injuryPart.back,
        deathPart: dispatchCasualty.deathPart.value?.join(','),
        deathPartNon: dispatchCasualty.deathPart.back,
        isInstantDeath: dispatchCasualty.isInstantDeath.value,
        // 出动填报-战斗信息
        rescueNumMin: dispatchBattle.rescueNumMin.value?.[0],
        rescueNumMax: dispatchBattle.rescueNumMin.value?.[1],
        surviveNumMin: dispatchBattle.surviveNumMin.value?.[0],
        surviveNumMax: dispatchBattle.surviveNumMin.value?.[1],
        deathNumMin: dispatchBattle.deathNumMin.value?.[0],
        deathNumMax: dispatchBattle.deathNumMin.value?.[1],
        evacuateNumMin: dispatchBattle.evacuateNumMin.value?.[0],
        evacuateNumMax: dispatchBattle.evacuateNumMin.value?.[1],
        transferNumMin: dispatchBattle.transferNumMin.value?.[0],
        transferNumMax: dispatchBattle.transferNumMin.value?.[1],
        emergencyNumMin: dispatchBattle.emergencyNumMin.value?.[0],
        emergencyNumMax: dispatchBattle.emergencyNumMin.value?.[1],
        protectNumMin: dispatchBattle.protectNumMin.value?.[0],
        protectNumMax: dispatchBattle.protectNumMin.value?.[1],
        // 出动填报-其他信息
        isBlocking: dispatchOther.isBlocking.value,
        blockingTimeStart: dispatchOther.blockingTimeStart.value?.[0],
        blockingTimeEnd: dispatchOther.blockingTimeStart.value?.[1],
        isWastageTruck: dispatchOther.isWastageTruck.value,
        fireProcess: dispatchOther.fireProcess.value,
      },
      comprehensiveDispatchHeadQueryReq: {
        // 出动填报-全勤指挥部
        dispatchCode: dispatchHeaderMessage.dispatchCode.value,
        FireHeadLvl: dispatchHeaderMessage.FireHeadLvl.value?.join(','),
        FireHeadLvlNon: dispatchHeaderMessage.FireHeadLvl.back,
        fireHead: dispatchHeaderMessage.fireHead.value?.map(item => item.organizationid)?.join(','),
        fireHeadText: dispatchHeaderMessage.fireHead.value?.map(item => item.name)?.join(','),
        fireHeadNon: dispatchHeaderMessage.fireHead.back,
        groupLeader: dispatchHeaderMessage.groupLeader.value?.map(item => item.boFireUserId)?.join(','),
        groupLeaderName: dispatchHeaderMessage.groupLeader.value?.map(item => item.userName)?.join(','),
        groupLeaderNon: dispatchHeaderMessage.groupLeader.back,
        commanderNumMin: dispatchHeaderMessage.commanderNumMin.value?.[0],
        commanderNumMax: dispatchHeaderMessage.commanderNumMin.value?.[1],
        headCarName: dispatchHeaderMessage.headCarName.value?.map(val => val.boFireTruckId)?.join(','),
        headCarNameText: dispatchHeaderMessage.headCarName.value?.map(val => val.truckNumber)?.join(','),
        headCarNameNon: dispatchHeaderMessage.headCarName.back,
        headCarNumMin: dispatchHeaderMessage.headCarNumMin.value?.[0],
        headCarNumMax: dispatchHeaderMessage.headCarNumMin.value?.[1],
        headTimeMin: dispatchHeaderMessage.headTimeMin.value?.[0],
        headTimeMax: dispatchHeaderMessage.headTimeMin.value?.[1],
        dispatchHeadTag: dispatchHeaderMessage.dispatchHeadTag.value?.map(val => val.value)?.join(','),
        dispatchHeadTagText: dispatchHeaderMessage.dispatchHeadTag.value?.map(val => val.label)?.join(','),
        dispatchHeadTagNon: dispatchHeaderMessage.dispatchHeadTag.back,
      },
      comprehensiveFireQueryReq: {
        // 火灾信息-基本信息
        fireDateStart: returnDate(fireBase.fireDate.value, 0),
        fireDateEnd: returnDate(fireBase.fireDate.value, 1),
        statisticRangeHoliday: fireBase.statisticRangeHoliday.value,
        statisticRangeHourMin: returnHour(fireBase.statisticRangeHourMin.value, 0),
        statisticRangeHourMax: returnHour(fireBase.statisticRangeHourMin.value, 1),
        statisticRangeDayMin: returnMinMax(fireBase.statisticRangeDayMin.value?.[0]),
        statisticRangeDayMax: returnMinMax(fireBase.statisticRangeDayMin.value?.[1]),
        statisticRangeMonthMin: returnMinMax(fireBase.statisticRangeMonthMin.value?.[0]),
        statisticRangeMonthMax: returnMinMax(fireBase.statisticRangeMonthMin.value?.[1]),
        statisticRangeSeasonMin: returnMinMax(fireBase.statisticRangeSeasonMin.value?.[0]),
        statisticRangeSeasonMax: returnMinMax(fireBase.statisticRangeSeasonMin.value?.[1]),
        fireDirection: fireBase.fireDirection.value,
        areaDutyGroupFire: fireBase.areaDutyGroupFire.value?.map(item => item.organizationid)?.join(','),
        areaDutyGroupFireText: fireBase.areaDutyGroupFire.value?.map(item => item.name)?.join(','),
        areaDutyGroupFireNon: fireBase.areaDutyGroupFire.back,
        area: returnCascader(fireBase.area.value),
        areaNon: fireBase.area.back,
        fireType: fireBase.fireType.value?.map(item => item[0]).join(','),
        firePlace: returnCascader(fireBase.firePlace.value),
        firePlaceNon: fireBase.firePlace.back,
        fireCause: returnCascader(fireBase.fireCause.value),
        fireCauseNon: fireBase.fireCause.back,
        burnedAreaMin: fireBase.burnedAreaMin.value?.[0],
        burnedAreaMax: fireBase.burnedAreaMin.value?.[1],
        fireLevel: fireBase.fireLevel.value?.join(','),
        fireLevelNon: fireBase.fireLevel.back,
        fireCode: fireBase.fireCode.value,
        severity: fireBase.severity.value,
        fireSite: returnCascader(fireBase.fireSite.value),
        fireSiteNon: fireBase.fireSite.back,
        initialFuelsType: returnCascader(fireBase.initialFuelsType.value),
        initialFuelsTypeNon: fireBase.initialFuelsType.back,
        igniteSourceType: returnCascader(fireBase.igniteSourceType.value),
        igniteSourceTypeNon: fireBase.igniteSourceType.back,
        firePattern: returnCascader(fireBase.firePattern.value),
        firePatternNon: fireBase.firePattern.back,
        liveType: fireBase.liveType.value?.join(','),
        liveTypeNon: fireBase.liveType.back,
        isPoorHouse: fireBase.isPoorHouse.value,
        isChangeUseType: fireBase.isChangeUseType.value,
        useType: fireBase.useType.value?.join(','),
        useTypeNon: fireBase.useType.back,
        isSafetyAccident: fireBase.isSafetyAccident.value,
        isResearch: fireBase.isResearch.value?.map(val => val.value)?.join(','),
        isResearchText: fireBase.isResearch.value?.map(val => val.label)?.join(','),
        isResearchNon: fireBase.isResearch.back,
        // fireTel: fireBase.fireTel.value,
        socialCreditCode: fireBase.socialCreditCode.value,
        industry: returnCascader(fireBase.industry.value),
        industryNon: fireBase.industry.back,
        industryDepartment: fireBase.industryDepartment.value?.join(','),
        industryDepartmentNon: fireBase.industryDepartment.back,
        economicType: fireBase.economicType.value?.join(','),
        economicTypeNon: fireBase.economicType.back,
        leadInspectionOrg: fireBase.leadInspectionOrg.value?.join(','),
        leadInspectionOrgNon: fireBase.leadInspectionOrg.back,
        isInsurance: fireBase.isInsurance.value,
        insuranceInfo: fireBase.insuranceInfo.value?.join(','),
        insuranceInfoNon: fireBase.insuranceInfo.back,
        isOnesided: fireBase.isOnesided.value,
        fireInspection: fireBase.fireInspection.value?.join(','),
        fireInspectionNon: fireBase.fireInspection.back,
        firePersonAgeMin: fireBase.firePersonAgeMin.value?.[0],
        firePersonAgeMax: fireBase.firePersonAgeMin.value?.[1],
        schooling: fireBase.schooling.value?.join(','),
        schoolingNon: fireBase.schooling.back,
        health: fireBase.health.value?.join(','),
        healthNon: fireBase.health.back,
        undo: fireBase.undo.value,
        fireStatus: fireBase.fireStatus.value?.join(','),
        fireStatusNon: fireBase.fireStatus.back,
        fireInfoTag: fireBase.fireInfoTag.value?.map(val => val.value)?.join(','),
        fireInfoTagText: fireBase.fireInfoTag.value?.map(val => val.label)?.join(','),
        fireInfoTagNon: fireBase.fireInfoTag.back,
        isOperating: fireBase.isOperating.value,
        plantRiskClassification: fireBase.plantRiskClassification.value?.map(val => (val.value || val.boDictId))?.join(','),
        plantRiskClassificationText: fireBase.plantRiskClassification.value?.map(val => (val.label || val.dictName))?.join(','),
        plantRiskClassificationNon: fireBase.plantRiskClassification.back,
        // 火灾信息-人员伤亡
        isInjury: fireCasualty.isInjury.value,
        injuryType: fireCasualty.injuryType.value?.map(val => val.value)?.join(','),
        injuryTypeText: fireCasualty.injuryType.value?.map(val => val.label)?.join(','),
        injuryTypeNon: fireCasualty.injuryType.back,
        bodyLocation: fireCasualty.bodyLocation.value?.join(','),
        bodyLocationNon: fireCasualty.bodyLocation.back,
        deathDate: returnCascader(fireCasualty.deathDate.value),
        deathDateNon: fireCasualty.deathDate.back,
        mainSymptoms: fireCasualty.mainSymptoms.value?.join(','),
        mainSymptomsNon: fireCasualty.mainSymptoms.back,
        injuryPart: fireCasualty.injuryPart.value?.join(','),
        injuryPartNon: fireCasualty.injuryPart.back,
        injuryBehavior: fireCasualty.injuryBehavior.value?.join(','),
        injuryBehaviorNon: fireCasualty.injuryBehavior.back,
        humanCause: fireCasualty.humanCause.value?.join(','),
        humanCauseNon: fireCasualty.humanCause.back,
        injuryCause: fireCasualty.injuryCause.value?.join(','),
        injuryCauseNon: fireCasualty.injuryCause.back,
        injurySchooling: fireCasualty.injurySchooling.value?.join(','),
        injurySchoolingNon: fireCasualty.injurySchooling.back,
        injuryHealth: fireCasualty.injuryHealth.value?.join(','),
        injuryHealthNon: fireCasualty.injuryHealth.back,
        job: fireCasualty.job.value?.join(','),
        jobNon: fireCasualty.job.back,
        injurySource: fireCasualty.injurySource.value?.join(','),
        injurySourceNon: fireCasualty.injurySource.back,
        ageMin: fireCasualty.ageMin.value?.[0],
        ageMax: fireCasualty.ageMin.value?.[1],
        gender: fireCasualty.gender.value?.map(val => val.value)?.join(','),
        genderText: fireCasualty.gender.value?.map(val => val.label)?.join(','),
        genderNon: fireCasualty.gender.back,
        idNumber: fireCasualty.idNumber.value,
        idType: fireCasualty.idType.value?.join(','),
        idTypeNon: fireCasualty.idType.back,
        nation: fireCasualty.nation.value?.join(','),
        nationNon: fireCasualty.nation.back,
        name: fireCasualty.name.value,
        qsCountMin: fireCasualty.qsCountMin.value?.[0],
        qsCountMax: fireCasualty.qsCountMin.value?.[1],
        zsCountMin: fireCasualty.zsCountMin.value?.[0],
        zsCountMax: fireCasualty.zsCountMin.value?.[1],
        injuryCountMin: fireCasualty.injuryCountMin.value?.[0],
        injuryCountMax: fireCasualty.injuryCountMin.value?.[1],
        deathCountMin: fireCasualty.deathCountMin.value?.[0],
        deathCountMax: fireCasualty.deathCountMin.value?.[1],
        // 火灾信息-经济损失
        inspectMethod: fireEconomic.inspectMethod.value?.join(','),
        inspectMethodNon: fireEconomic.inspectMethod.back,
        costSource: fireEconomic.costSource.value?.join(','),
        costSourceNon: fireEconomic.costSource.back,
        directEconomicLossMin: fireEconomic.directEconomicLossMin.value?.[0],
        directEconomicLossMax: fireEconomic.directEconomicLossMin.value?.[1],
        directDamageMin: fireEconomic.directDamageMin.value?.[0],
        directDamageMax: fireEconomic.directDamageMin.value?.[1],
        fireDisposalCostMin: fireEconomic.fireDisposalCostMin.value?.[0],
        fireDisposalCostMax: fireEconomic.fireDisposalCostMin.value?.[1],
        fireInjuryCostMin: fireEconomic.fireInjuryCostMin.value?.[0],
        fireInjuryCostMax: fireEconomic.fireInjuryCostMin.value?.[1],
        affectedHouseMin: fireEconomic.affectedHouseMin.value?.[0],
        affectedHouseMax: fireEconomic.affectedHouseMin.value?.[1],
        // 火灾信息-交通工具
        vehicleType: returnCascader(fireVehicle.vehicleType.value),
        vehicleTypeNon: fireVehicle.vehicleType.back,
        chargeState: fireVehicle.chargeState.value?.join(','),
        chargeStateNon: fireVehicle.chargeState.back,
        batteryType: fireVehicle.batteryType.value?.join(','),
        batteryTypeNon: fireVehicle.batteryType.back,
        isRepack: fireVehicle.isRepack.value,
        carNumber: fireVehicle.carNumber.value,
        vinCode: fireVehicle.vinCode.value,
        driveState: fireVehicle.driveState.value?.join(','),
        driveStateNon: fireVehicle.driveState.back,
        // 火灾信息-建筑信息
        buildTag: fireBuilding.buildTag.value?.join(','),
        buildType: fireBuilding.buildType.value?.join(','),
        buildTypeNon: fireBuilding.buildType.back,
        fireResistanceRating: fireBuilding.fireResistanceRating.value?.join(','),
        fireResistanceRatingNon: fireBuilding.fireResistanceRating.back,
        buildStructure: fireBuilding.buildStructure.value?.join(','),
        buildStructureNon: fireBuilding.buildStructure.back,
        buildFloorMin: fireBuilding.buildFloorMin.value?.[0],
        buildFloorMax: fireBuilding.buildFloorMin.value?.[1],
        fireFloorMin: fireBuilding.fireFloorMin.value?.[0],
        fireFloorMax: fireBuilding.fireFloorMin.value?.[1],
        housingLifeMin: fireBuilding.housingLifeMin.value?.[0],
        housingLifeMax: fireBuilding.housingLifeMin.value?.[1],
        buildUse: returnCascader(fireBuilding.buildUse.value),
        buildUseNon: fireBuilding.buildUse.back,
        isSpread: fireBuilding.isSpread.value,
        isLoud: fireBuilding.isLoud.value,
        isWindowOpened: fireBuilding.isWindowOpened.value,
        historyBuildLevel: fireBuilding.historyBuildLevel.value?.join(','),
        historyBuildLevelNon: fireBuilding.historyBuildLevel.back,
        // 火灾信息-消防设施
        isFirefightFacility: fireFacilities.isFirefightFacility.value,
        autoAlarm: fireFacilities.autoAlarm.value,
        autoFireFight: fireFacilities.autoFireFight.value,
        indoorHydrant: fireFacilities.indoorHydrant.value,
        smokeControl: fireFacilities.smokeControl.value,
        fireShutter: fireFacilities.fireShutter.value,
        emergencyLight: fireFacilities.emergencyLight.value?.map(val => val.value)?.join(','),
        emergencyLightText: fireFacilities.emergencyLight.value?.map(val => val.label)?.join(','),
        networking: fireFacilities.networking.value?.map(val => val.value)?.join(','),
        networkingText: fireFacilities.networking.value?.map(val => val.label)?.join(','),
        fireCompartment: fireFacilities.fireCompartment.value?.map(val => val.value)?.join(','),
        fireCompartmentText: fireFacilities.fireCompartment.value?.map(val => val.label)?.join(','),
        compartmentAreaMin: fireFacilities.compartmentAreaMin.value?.[0],
        compartmentAreaMax: fireFacilities.compartmentAreaMin.value?.[1],
        fireSeparation: fireFacilities.fireSeparation.value?.map(val => val.value)?.join(','),
        fireSeparationText: fireFacilities.fireSeparation.value?.map(val => val.label)?.join(','),
        separationMeterMin: fireFacilities.separationMeterMin.value?.[0],
        separationMeterMax: fireFacilities.separationMeterMin.value?.[1],
        escapeRoute: fireFacilities.escapeRoute.value?.map(val => val.value)?.join(','),
        escapeRouteText: fireFacilities.escapeRoute.value?.map(val => val.label)?.join(','),
        emergencyExit: fireFacilities.emergencyExit.value?.map(val => val.value)?.join(','),
        emergencyExitText: fireFacilities.emergencyExit.value?.map(val => val.label)?.join(','),
        // 火灾信息-其他信息
        firePassage: fireOther.firePassage.value,
        handleTwoCase: fireOther.handleTwoCase.value,
        penaltyNumMin: fireOther.penaltyNumMin.value?.[0],
        penaltyNumMax: fireOther.penaltyNumMin.value?.[1],
        suggestDealNumMin: fireOther.suggestDealNumMin.value?.[0],
        suggestDealNumMax: fireOther.suggestDealNumMin.value?.[1],
        firePenalty: fireOther.firePenalty.value,
      },
    }
    return params
  }

  const returnDateValue = (start, end) => {
    if (!start || !end) {
      return undefined
    }
    return [dayjs(typeof start === 'string' ? Number(start) : start), dayjs(typeof end === 'string' ? Number(end) : end)]
  }

  const returnNumValue = (min, max) => {
    return [min === '' ? '' : Number(min), max === '' ? '' : Number(max)]
  }

  const returnHourValue = (start, end) => {
    if (!start || !end) {
      return undefined
    }
    return [dayjs().hour(Number(start)), dayjs().hour(Number(end))]
  }

  const returnCascaderValue = (value) => {
    return value ? JSON.parse(value) : []
  }

  const initSearchParams = (detail) => {
    const {
      comprehensiveDispatchHeadQueryReq,
      comprehensiveDispatchQueryReq,
      comprehensiveFireQueryReq,
      comprehensiveWarningQueryReq,
    } = detail
    // 警情信息-基本信息
    form.value.policeBase.warningDate.value = returnDateValue(comprehensiveWarningQueryReq.warningDateStart, comprehensiveWarningQueryReq.warningDateEnd)
    form.value.policeBase.statisticRangeSeasonMin.value = [comprehensiveWarningQueryReq.statisticRangeSeasonMin, comprehensiveWarningQueryReq.statisticRangeSeasonMax]
    form.value.policeBase.statisticRangeMonthMin.value = [comprehensiveWarningQueryReq.statisticRangeMonthMin, comprehensiveWarningQueryReq.statisticRangeMonthMax]
    form.value.policeBase.statisticRangeDayMin.value = [comprehensiveWarningQueryReq.statisticRangeDayMin, comprehensiveWarningQueryReq.statisticRangeDayMax]
    form.value.policeBase.statisticRangeHourMin.value = returnHourValue(comprehensiveWarningQueryReq.statisticRangeHourMin, comprehensiveWarningQueryReq.statisticRangeHourMax)
    form.value.policeBase.statisticRangeHoliday.value = comprehensiveWarningQueryReq.statisticRangeHoliday
    if (form.value.policeBase.statisticRangeHoliday.value) {
      form.value.policeBase.statisticRangeHoliday.show = '1'
    }
    else if (form.value.policeBase.statisticRangeSeasonMin.value?.[0] || form.value.policeBase.statisticRangeSeasonMin.value?.[1]) {
      form.value.policeBase.statisticRangeHoliday.show = '2'
    }
    else if (form.value.policeBase.statisticRangeMonthMin.value?.[0] || form.value.policeBase.statisticRangeMonthMin.value?.[1]) {
      form.value.policeBase.statisticRangeHoliday.show = '3'
    }
    else if (form.value.policeBase.statisticRangeDayMin.value?.[0] || form.value.policeBase.statisticRangeDayMin.value?.[1]) {
      form.value.policeBase.statisticRangeHoliday.show = '4'
    }
    else if (form.value.policeBase.statisticRangeHourMin.value?.[0] || form.value.policeBase.statisticRangeHourMin.value?.[1]) {
      form.value.policeBase.statisticRangeHoliday.show = '5'
    }
    form.value.policeBase.areaGroup.value = comprehensiveWarningQueryReq.areaGroup
      ? generateByKeyValue(comprehensiveWarningQueryReq.areaGroupText, comprehensiveWarningQueryReq.areaGroup, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.policeBase.areaGroup.back = comprehensiveWarningQueryReq.areaGroup === 'true'
    form.value.policeBase.boAreaId.value = comprehensiveWarningQueryReq.boAreaId ? JSON.parse(comprehensiveWarningQueryReq.boAreaId) : []
    if (comprehensiveWarningQueryReq.boAreaId && comprehensiveWarningQueryReq.boAreaIdText) {
      form.value.policeBase.boAreaId.text = JSON.parse(comprehensiveWarningQueryReq.boAreaIdText)
    }
    form.value.policeBase.warningAddr.value = comprehensiveWarningQueryReq.warningAddr
    form.value.policeBase.warningType.value = returnCascaderValue(comprehensiveWarningQueryReq.warningType)
    form.value.policeBase.warningType.back = comprehensiveWarningQueryReq.warningTypeNon === 'true'
    form.value.policeBase.warningLevel.value = comprehensiveWarningQueryReq.warningLevel?.split(',')
    form.value.policeBase.warningLevel.back = comprehensiveWarningQueryReq.warningLevelNon === 'true'
    form.value.policeBase.warningCode.value = comprehensiveWarningQueryReq.warningCode
    form.value.policeBase.warningName.value = comprehensiveWarningQueryReq.warningName
    form.value.policeBase.warningCodeYyj.value = comprehensiveWarningQueryReq.warningCodeYyj
    form.value.policeBase.warningOrgname.value = comprehensiveWarningQueryReq.warningOrgname
    form.value.policeBase.warningTel.value = comprehensiveWarningQueryReq.warningTel
    form.value.policeBase.warningInfo.value = comprehensiveWarningQueryReq.warningInfo
    form.value.policeBase.warningTag.value = comprehensiveWarningQueryReq.warningTag
      ? generateByKeyValue(comprehensiveWarningQueryReq.warningTagText, comprehensiveWarningQueryReq.warningTag, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.policeBase.warningTag.back = comprehensiveWarningQueryReq.warningTagNon === 'true'
    form.value.policeBase.createOrgId.value = comprehensiveWarningQueryReq.createOrgId
      ? generateByKeyValue(comprehensiveWarningQueryReq.createOrgIdText, comprehensiveWarningQueryReq.createOrgId, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.policeBase.createOrgId.back = comprehensiveWarningQueryReq.createOrgIdNon === 'true'
    form.value.policeBase.warningStatus.value = comprehensiveWarningQueryReq.warningStatus?.split(',')
    form.value.policeBase.warningStatus.back = comprehensiveWarningQueryReq.warningStatusNon === 'true'
    form.value.policeBase.warningDealStatus.value = comprehensiveWarningQueryReq.warningDealStatus
    // form.value.policeBase.warningDealStatus.back = comprehensiveWarningQueryReq.warningDealStatusNon === 'true'
    // 警情信息-投入力量
    form.value.policeInvest.dispatchGroup.value = comprehensiveWarningQueryReq.dispatchGroup
      ? generateByKeyValue(comprehensiveWarningQueryReq.dispatchGroupText, comprehensiveWarningQueryReq.dispatchGroup, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.policeInvest.dispatchGroup.back = comprehensiveWarningQueryReq.dispatchGroupNon === 'true'
    form.value.policeInvest.mainGroup.value = comprehensiveWarningQueryReq.mainGroup
      ? generateByKeyValue(comprehensiveWarningQueryReq.mainGroupText, comprehensiveWarningQueryReq.mainGroup, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.policeInvest.mainGroup.back = comprehensiveWarningQueryReq.mainGroupNon === 'true'
    form.value.policeInvest.firstGroup.value = comprehensiveWarningQueryReq.firstGroup
      ? generateByKeyValue(comprehensiveWarningQueryReq.firstGroupText, comprehensiveWarningQueryReq.firstGroup, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.policeInvest.firstGroup.back = comprehensiveWarningQueryReq.firstGroupNon === 'true'
    form.value.policeInvest.dispatchGroupCountMin.value = returnNumValue(comprehensiveWarningQueryReq.dispatchGroupCountMin, comprehensiveWarningQueryReq.dispatchGroupCountMax)
    form.value.policeInvest.dispatchNumMin.value = returnNumValue(comprehensiveWarningQueryReq.dispatchNumMin, comprehensiveWarningQueryReq.dispatchNumMax)
    form.value.policeInvest.dispatchTruckMin.value = returnNumValue(comprehensiveWarningQueryReq.dispatchTruckMin, comprehensiveWarningQueryReq.dispatchTruckMax)
    form.value.policeInvest.isHeadquarters.value = comprehensiveWarningQueryReq.isHeadquarters
    form.value.policeInvest.fireHeadLevel.value = comprehensiveWarningQueryReq.fireHeadLevel?.split(',')
    form.value.policeInvest.fireHeadLevel.back = comprehensiveWarningQueryReq.fireHeadLevelNon === 'true'
    form.value.policeInvest.fireHead.value = comprehensiveWarningQueryReq.fireHead
      ? generateByKeyValue(comprehensiveWarningQueryReq.fireHeadText, comprehensiveWarningQueryReq.fireHead, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.policeInvest.fireHead.back = comprehensiveWarningQueryReq.fireHeadNon === 'true'
    form.value.policeInvest.personNumMin.value = returnNumValue(comprehensiveWarningQueryReq.personNumMin, comprehensiveWarningQueryReq.personNumMax)
    form.value.policeInvest.dealMinStart.value = returnNumValue(comprehensiveWarningQueryReq.dealMinStart, comprehensiveWarningQueryReq.dealMinEnd)
    // form.value.policeInvest.areaDutyGroup.value = comprehensiveWarningQueryReq.areaDutyGroup
    //   ? generateByKeyValue(comprehensiveWarningQueryReq.areaDutyGroupText, comprehensiveWarningQueryReq.areaDutyGroup, {
    //     key: 'name',
    //     value: 'organizationid',
    //   }, 'Number')
    //   : []
    // form.value.policeInvest.areaDutyGroup.back = comprehensiveWarningQueryReq.areaDutyGroupNon === 'true'
    form.value.policeInvest.dutyGroup.value = comprehensiveWarningQueryReq.dutyGroup
      ? generateByKeyValue(comprehensiveWarningQueryReq.dutyGroupText, comprehensiveWarningQueryReq.dutyGroup, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.policeInvest.dutyGroup.back = comprehensiveWarningQueryReq.dutyGroupNon === 'true'
    form.value.policeInvest.isDuty.value = comprehensiveWarningQueryReq.isDuty
    form.value.policeInvest.isDutyGroupDispatch.value = comprehensiveWarningQueryReq.isDutyGroupDispatch
    form.value.policeInvest.isOnlyFull.value = comprehensiveWarningQueryReq.isOnlyFull
    form.value.policeInvest.isZf.value = comprehensiveWarningQueryReq.isZf
    form.value.policeInvest.isLinkDepartment.value = comprehensiveWarningQueryReq.isLinkDepartment
    form.value.policeInvest.isOtherDepartment.value = comprehensiveWarningQueryReq.isOtherDepartment
    // 警情信息-其他信息
    form.value.policeOther.isNaturalDisaster.value = comprehensiveWarningQueryReq.isNaturalDisaster
    form.value.policeOther.naturalDisasterType.value = returnCascaderValue(comprehensiveWarningQueryReq.naturalDisasterType)
    form.value.policeOther.naturalDisasterType.back = comprehensiveWarningQueryReq.naturalDisasterTypeNon === 'true'
    form.value.policeOther.isOtherProvince.value = comprehensiveWarningQueryReq.isOtherProvince
    form.value.policeOther.isOtherCity.value = comprehensiveWarningQueryReq.isOtherCity
    form.value.policeOther.temperatureMin.value = returnNumValue(comprehensiveWarningQueryReq.temperatureMin, comprehensiveWarningQueryReq.temperatureMax)
    form.value.policeOther.weather.value = comprehensiveWarningQueryReq.weather?.split(',')
    form.value.policeOther.weather.back = comprehensiveWarningQueryReq.weatherNon === 'true'
    form.value.policeOther.wind.value = comprehensiveWarningQueryReq.wind?.split(',')
    form.value.policeOther.wind.back = comprehensiveWarningQueryReq.windNon === 'true'
    form.value.policeOther.windDirection.value = comprehensiveWarningQueryReq.windDirection?.split(',')
    form.value.policeOther.windDirection.back = comprehensiveWarningQueryReq.windDirectionNon === 'true'
    form.value.policeOther.trappedPersonMin.value = returnNumValue(comprehensiveWarningQueryReq.trappedPersonMin, comprehensiveWarningQueryReq.trappedPersonMax)
    // form.value.policeOther.isPublicFireHydrant.value = comprehensiveWarningQueryReq.isPublicFireHydrant
    // form.value.policeOther.fireHydrantSituation.value = comprehensiveWarningQueryReq.fireHydrantSituation?.split(',')
    // form.value.policeOther.fireHydrantSituation.back = comprehensiveWarningQueryReq.fireHydrantSituationNon === 'true'
    // form.value.policeOther.notUseFireHydrantReason.value = comprehensiveWarningQueryReq.notUseFireHydrantReason?.split(',')
    // form.value.policeOther.notUseFireHydrantReason.back = comprehensiveWarningQueryReq.notUseFireHydrantReason === 'true'
    form.value.policeOther.orgName.value = comprehensiveWarningQueryReq.orgName
    form.value.policeOther.groupType.value = comprehensiveWarningQueryReq.groupType?.split(',')
    form.value.policeOther.groupType.back = comprehensiveWarningQueryReq.groupTypeNon === 'true'
    form.value.policeOther.isHappenFire.value = comprehensiveWarningQueryReq.isHappenFire
    form.value.policeOther.warningSource.value = comprehensiveWarningQueryReq.warningSource?.split(',')
    form.value.policeOther.warningSource.back = comprehensiveWarningQueryReq.warningSourceNon === 'true'
    // 出动填报-基本信息
    form.value.dispatchBase.dispatchCode.value = comprehensiveDispatchQueryReq.dispatchCode
    form.value.dispatchBase.dispatchGroupOrg.value = comprehensiveDispatchQueryReq.dispatchGroupOrg
      ? generateByKeyValue(comprehensiveDispatchQueryReq.dispatchGroupOrgText, comprehensiveDispatchQueryReq.dispatchGroupOrg, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.dispatchBase.dispatchGroupOrg.back = comprehensiveDispatchQueryReq.dispatchGroupOrgNon === 'true'
    // form.value.dispatchBase.dispatchGroup.value = comprehensiveDispatchQueryReq.dispatchGroup
    //   ? generateByKeyValue(comprehensiveDispatchQueryReq.dispatchGroupText, comprehensiveDispatchQueryReq.dispatchGroup, {
    //     key: 'name',
    //     value: 'organizationid',
    //   }, 'Number')
    //   : []
    // form.value.dispatchBase.dispatchGroup.back = comprehensiveDispatchQueryReq.dispatchGroupNon === 'true'
    form.value.dispatchBase.deptNature.value = returnCascaderValue(comprehensiveDispatchQueryReq.deptNature)
    form.value.dispatchBase.deptNature.back = comprehensiveDispatchQueryReq.deptNatureNon === 'true'
    form.value.dispatchBase.dispatchType.value = comprehensiveDispatchQueryReq.dispatchType
      ? generateByKeyValue(comprehensiveDispatchQueryReq.dispatchTypeText, comprehensiveDispatchQueryReq.dispatchType, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.dispatchBase.dispatchType.back = comprehensiveDispatchQueryReq.dispatchTypeNon === 'true'
    form.value.dispatchBase.dealSituation.value = comprehensiveDispatchQueryReq.dealSituation?.split(',')
    form.value.dispatchBase.dealSituation.back = comprehensiveDispatchQueryReq.dealSituationNon === 'true'
    form.value.dispatchBase.fireSituation.value = comprehensiveDispatchQueryReq.fireSituation?.split(',')
    form.value.dispatchBase.fireSituation.back = comprehensiveDispatchQueryReq.fireSituationNon === 'true'
    form.value.dispatchBase.fireDistanceStart.value = returnNumValue(comprehensiveDispatchQueryReq.fireDistanceStart, comprehensiveDispatchQueryReq.fireDistanceEnd)
    form.value.dispatchBase.attendanceTimeStart.value = returnNumValue(comprehensiveDispatchQueryReq.attendanceTimeStart, comprehensiveDispatchQueryReq.attendanceTimeEnd)
    form.value.dispatchBase.speedStart.value = returnNumValue(comprehensiveDispatchQueryReq.speedStart, comprehensiveDispatchQueryReq.speedEnd)
    form.value.dispatchBase.returnLateReason.value = comprehensiveDispatchQueryReq.returnLateReason?.split(',')
    form.value.dispatchBase.returnLateReason.back = comprehensiveDispatchQueryReq.returnLateReasonNon === 'true'
    form.value.dispatchBase.dealMinStart.value = returnNumValue(comprehensiveDispatchQueryReq.dealMinStart, comprehensiveDispatchQueryReq.dealMinEnd)
    form.value.dispatchBase.isOtherProvince.value = comprehensiveDispatchQueryReq.isOtherProvince
    form.value.dispatchBase.isOtherCity.value = comprehensiveDispatchQueryReq.isOtherCity
    form.value.dispatchBase.dispatchStatus.value = comprehensiveDispatchQueryReq.dispatchStatus?.split(',')
    form.value.dispatchBase.dispatchStatus.back = comprehensiveDispatchQueryReq.dispatchStatusNon === 'true'
    form.value.dispatchBase.dispatchTag.value = comprehensiveDispatchQueryReq.dispatchTag
      ? generateByKeyValue(comprehensiveDispatchQueryReq.dispatchTagText, comprehensiveDispatchQueryReq.dispatchTag, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.dispatchBase.dispatchTag.back = comprehensiveDispatchQueryReq.dispatchTagNon === 'true'
    // 出动填报-时间信息
    form.value.dispatchTime.dispatchDate.value = returnDateValue(comprehensiveDispatchQueryReq.dispatchDateStart, comprehensiveDispatchQueryReq.dispatchDateEnd)
    form.value.dispatchTime.midwayReturnDate.value = returnDateValue(comprehensiveDispatchQueryReq.midwayReturnDateStart, comprehensiveDispatchQueryReq.midwayReturnDateEnd)
    form.value.dispatchTime.attendanceDate.value = returnDateValue(comprehensiveDispatchQueryReq.attendanceDateStart, comprehensiveDispatchQueryReq.attendanceDateEnd)
    form.value.dispatchTime.carryoutDate.value = returnDateValue(comprehensiveDispatchQueryReq.carryoutDateStart, comprehensiveDispatchQueryReq.carryoutDateEnd)
    form.value.dispatchTime.waterflowDate.value = returnDateValue(comprehensiveDispatchQueryReq.waterflowDateStart, comprehensiveDispatchQueryReq.waterflowDateEnd)
    form.value.dispatchTime.controllingDate.value = returnDateValue(comprehensiveDispatchQueryReq.controllingDateStart, comprehensiveDispatchQueryReq.controllingDateEnd)
    form.value.dispatchTime.washDate.value = returnDateValue(comprehensiveDispatchQueryReq.washDateStart, comprehensiveDispatchQueryReq.washDateEnd)
    form.value.dispatchTime.extinctDate.value = returnDateValue(comprehensiveDispatchQueryReq.extinctDateStart, comprehensiveDispatchQueryReq.extinctDateEnd)
    form.value.dispatchTime.endDate.value = returnDateValue(comprehensiveDispatchQueryReq.endDateStart, comprehensiveDispatchQueryReq.endDateEnd)
    form.value.dispatchTime.evacuateDate.value = returnDateValue(comprehensiveDispatchQueryReq.evacuateDateStart, comprehensiveDispatchQueryReq.evacuateDateEnd)
    form.value.dispatchTime.returnDate.value = returnDateValue(comprehensiveDispatchQueryReq.returnDateStart, comprehensiveDispatchQueryReq.returnDateEnd)
    // 出动填报-投入力量
    form.value.dispatchInvest.teamNature.value = comprehensiveDispatchQueryReq.teamNature?.split(',')
    form.value.dispatchInvest.teamNature.back = comprehensiveDispatchQueryReq.teamNatureNon === 'true'
    form.value.dispatchInvest.commanderNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.commanderNumMin, comprehensiveDispatchQueryReq.commanderNumMax)
    form.value.dispatchInvest.firemenNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.firemenNumMin, comprehensiveDispatchQueryReq.firemenNumMax)
    form.value.dispatchInvest.isDispatchTruck.value = comprehensiveDispatchQueryReq.isDispatchTruck
    form.value.dispatchInvest.isReturnTruck.value = comprehensiveDispatchQueryReq.isReturnTruck
    form.value.dispatchInvest.dispatchTruckInfo.value = comprehensiveDispatchQueryReq.dispatchTruckInfo
      ? generateByKeyValue(comprehensiveDispatchQueryReq.dispatchTruckInfoText, comprehensiveDispatchQueryReq.dispatchTruckInfo, {
        key: 'truckNumber',
        value: 'boFireTruckId',
      })
      : []
    form.value.dispatchInvest.dispatchTruckInfo.back = comprehensiveDispatchQueryReq.dispatchTruckInfoNon === 'true'
    form.value.dispatchInvest.truckType.value = comprehensiveDispatchQueryReq.truckType?.split(',')
    form.value.dispatchInvest.truckType.back = comprehensiveDispatchQueryReq.truckTypeNon === 'true'
    form.value.dispatchInvest.dispatchTruckMin.value = returnNumValue(comprehensiveDispatchQueryReq.dispatchTruckMin, comprehensiveDispatchQueryReq.dispatchTruckMax)
    form.value.dispatchInvest.fireBoatNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.fireBoatNumMin, comprehensiveDispatchQueryReq.fireBoatNumMax)
    form.value.dispatchInvest.fireAirplaneNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.fireAirplaneNumMin, comprehensiveDispatchQueryReq.fireAirplaneNumMax)
    form.value.dispatchInvest.rescueDogNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.rescueDogNumMin, comprehensiveDispatchQueryReq.rescueDogNumMax)
    form.value.dispatchInvest.uavMin.value = returnNumValue(comprehensiveDispatchQueryReq.uavMin, comprehensiveDispatchQueryReq.uavMax)
    form.value.dispatchInvest.robotNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.robotNumMin, comprehensiveDispatchQueryReq.robotNumMax)
    form.value.dispatchInvest.headPersonType.value = returnCascaderValue(comprehensiveDispatchQueryReq.headPersonType)
    form.value.dispatchInvest.headPersonType.back = comprehensiveDispatchQueryReq.headPersonTypeNon === 'true'
    form.value.dispatchInvest.groupLeader.value = comprehensiveDispatchQueryReq.groupLeader
      ? generateByKeyValue(comprehensiveDispatchQueryReq.groupLeaderName, comprehensiveDispatchQueryReq.groupLeader, {
        key: 'userName',
        value: 'boFireUserId',
      })
      : []
    form.value.dispatchInvest.groupLeader.back = comprehensiveDispatchQueryReq.groupLeaderNon === 'true'
    form.value.dispatchInvest.fireUserIds.value = comprehensiveDispatchQueryReq.fireUserIds
      ? generateByKeyValue(comprehensiveDispatchQueryReq.fireUserIdsName, comprehensiveDispatchQueryReq.fireUserIds, {
        key: 'userName',
        value: 'boFireUserId',
      })
      : []
    form.value.dispatchInvest.fireUserIds.back = comprehensiveDispatchQueryReq.fireUserIdsNon === 'true'
    // 出动填报-参战伤亡
    form.value.dispatchCasualty.injuryType.value = comprehensiveDispatchQueryReq.injuryType
      ? generateByKeyValue(comprehensiveDispatchQueryReq.injuryTypeText, comprehensiveDispatchQueryReq.injuryType, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.dispatchCasualty.injuryType.back = comprehensiveDispatchQueryReq.injuryTypeNon === 'true'
    form.value.dispatchCasualty.deathCountMin.value = returnNumValue(comprehensiveDispatchQueryReq.deathCountMin, comprehensiveDispatchQueryReq.deathCountMax)
    form.value.dispatchCasualty.injuryCountMin.value = returnNumValue(comprehensiveDispatchQueryReq.injuryCountMin, comprehensiveDispatchQueryReq.injuryCountMax)
    form.value.dispatchCasualty.name.value = comprehensiveDispatchQueryReq.name
    form.value.dispatchCasualty.nation.value = comprehensiveDispatchQueryReq.nation?.split(',')
    form.value.dispatchCasualty.nation.back = comprehensiveDispatchQueryReq.nationNon === 'true'
    form.value.dispatchCasualty.politicalOutlook.value = comprehensiveDispatchQueryReq.politicalOutlook?.split(',')
    form.value.dispatchCasualty.politicalOutlook.back = comprehensiveDispatchQueryReq.politicalOutlookNon === 'true'
    form.value.dispatchCasualty.idNumber.value = comprehensiveDispatchQueryReq.idNumber
    form.value.dispatchCasualty.gender.value = comprehensiveDispatchQueryReq.gender
      ? generateByKeyValue(comprehensiveDispatchQueryReq.genderText, comprehensiveDispatchQueryReq.gender, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.dispatchCasualty.gender.back = comprehensiveDispatchQueryReq.genderNon === 'true'
    form.value.dispatchCasualty.ageMin.value = returnNumValue(comprehensiveDispatchQueryReq.ageMin, comprehensiveDispatchQueryReq.ageMax)
    form.value.dispatchCasualty.rescueRank.value = returnCascaderValue(comprehensiveDispatchQueryReq.rescueRank)
    form.value.dispatchCasualty.rescueRank.back = comprehensiveDispatchQueryReq.rescueRankNon === 'true'
    form.value.dispatchCasualty.titleRank.value = comprehensiveDispatchQueryReq.titleRank
    form.value.dispatchCasualty.duty.value = returnCascaderValue(comprehensiveDispatchQueryReq.duty)
    form.value.dispatchCasualty.duty.back = comprehensiveDispatchQueryReq.dutyNon === 'true'
    form.value.dispatchCasualty.teamEntryTime.value = returnDateValue(comprehensiveDispatchQueryReq.teamEntryTimeStart, comprehensiveDispatchQueryReq.teamEntryTimeEnd)
    form.value.dispatchCasualty.period.value = comprehensiveDispatchQueryReq.period?.split(',')
    form.value.dispatchCasualty.period.back = comprehensiveDispatchQueryReq.periodNon === 'true'
    form.value.dispatchCasualty.protectDevice.value = comprehensiveDispatchQueryReq.protectDevice?.split(',')
    form.value.dispatchCasualty.protectDevice.back = comprehensiveDispatchQueryReq.protectDeviceNon === 'true'
    form.value.dispatchCasualty.injuryReason.value = comprehensiveDispatchQueryReq.injuryReason?.split(',')
    form.value.dispatchCasualty.injuryReason.back = comprehensiveDispatchQueryReq.injuryReasonNon === 'true'
    form.value.dispatchCasualty.deathReason.value = comprehensiveDispatchQueryReq.deathReason?.split(',')
    form.value.dispatchCasualty.deathReason.back = comprehensiveDispatchQueryReq.deathReasonNon === 'true'
    form.value.dispatchCasualty.injuryPart.value = comprehensiveDispatchQueryReq.injuryPart?.split(',')
    form.value.dispatchCasualty.injuryPart.back = comprehensiveDispatchQueryReq.injuryPartNon === 'true'
    form.value.dispatchCasualty.deathPart.value = comprehensiveDispatchQueryReq.deathPart?.split(',')
    form.value.dispatchCasualty.deathPart.back = comprehensiveDispatchQueryReq.deathPartNon === 'true'
    form.value.dispatchCasualty.isInstantDeath.value = comprehensiveDispatchQueryReq.isInstantDeath
    // 出动填报-战斗信息
    form.value.dispatchBattle.rescueNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.rescueNumMin, comprehensiveDispatchQueryReq.rescueNumMax)
    form.value.dispatchBattle.surviveNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.surviveNumMin, comprehensiveDispatchQueryReq.surviveNumMax)
    form.value.dispatchBattle.deathNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.deathNumMin, comprehensiveDispatchQueryReq.deathNumMax)
    form.value.dispatchBattle.evacuateNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.evacuateNumMin, comprehensiveDispatchQueryReq.evacuateNumMax)
    form.value.dispatchBattle.transferNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.transferNumMin, comprehensiveDispatchQueryReq.transferNumMax)
    form.value.dispatchBattle.emergencyNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.emergencyNumMin, comprehensiveDispatchQueryReq.emergencyNumMax)
    form.value.dispatchBattle.protectNumMin.value = returnNumValue(comprehensiveDispatchQueryReq.protectNumMin, comprehensiveDispatchQueryReq.protectNumMax)
    // 出动填报-其他信息
    form.value.dispatchOther.isBlocking.value = comprehensiveDispatchQueryReq.isBlocking
    form.value.dispatchOther.blockingTimeStart.value = returnNumValue(comprehensiveDispatchQueryReq.blockingTimeStart, comprehensiveDispatchQueryReq.blockingTimeEnd)
    form.value.dispatchOther.isWastageTruck.value = comprehensiveDispatchQueryReq.isWastageTruck
    form.value.dispatchOther.fireProcess.value = comprehensiveDispatchQueryReq.fireProcess
    // 出动填报-全勤指挥部
    form.value.dispatchHeaderMessage.dispatchCode.value = comprehensiveDispatchHeadQueryReq.dispatchCode
    form.value.dispatchHeaderMessage.FireHeadLvl.value = comprehensiveDispatchHeadQueryReq.FireHeadLvl?.split(',')
    form.value.dispatchHeaderMessage.FireHeadLvl.back = comprehensiveDispatchHeadQueryReq.FireHeadLvlNon === 'true'
    form.value.dispatchHeaderMessage.fireHead.value = comprehensiveDispatchHeadQueryReq.fireHead
      ? generateByKeyValue(comprehensiveDispatchHeadQueryReq.fireHeadText, comprehensiveDispatchHeadQueryReq.fireHead, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.dispatchHeaderMessage.fireHead.back = comprehensiveDispatchHeadQueryReq.fireHeadNon === 'true'
    form.value.dispatchHeaderMessage.groupLeader.value = comprehensiveDispatchHeadQueryReq.groupLeader
      ? generateByKeyValue(comprehensiveDispatchHeadQueryReq.groupLeaderName, comprehensiveDispatchHeadQueryReq.groupLeader, {
        key: 'userName',
        value: 'boFireUserId',
      })
      : []
    form.value.dispatchHeaderMessage.groupLeader.back = comprehensiveDispatchHeadQueryReq.groupLeaderNon === 'true'
    form.value.dispatchHeaderMessage.commanderNumMin.value = returnNumValue(comprehensiveDispatchHeadQueryReq.commanderNumMin, comprehensiveDispatchHeadQueryReq.commanderNumMax)
    form.value.dispatchHeaderMessage.headCarName.value = comprehensiveDispatchHeadQueryReq.headCarName
      ? generateByKeyValue(comprehensiveDispatchHeadQueryReq.headCarNameText, comprehensiveDispatchHeadQueryReq.headCarName, {
        key: 'truckNumber',
        value: 'boFireTruckId',
      })
      : []
    form.value.dispatchHeaderMessage.headCarName.back = comprehensiveDispatchHeadQueryReq.headCarNameNon === 'true'
    form.value.dispatchHeaderMessage.headCarNumMin.value = returnNumValue(comprehensiveDispatchHeadQueryReq.headCarNumMin, comprehensiveDispatchHeadQueryReq.headCarNumMax)
    form.value.dispatchHeaderMessage.headTimeMin.value = returnNumValue(comprehensiveDispatchHeadQueryReq.headTimeMin, comprehensiveDispatchHeadQueryReq.headTimeMax)
    form.value.dispatchHeaderMessage.dispatchHeadTag.value = comprehensiveDispatchHeadQueryReq.dispatchHeadTag
      ? generateByKeyValue(comprehensiveDispatchHeadQueryReq.dispatchHeadTagText, comprehensiveDispatchHeadQueryReq.dispatchHeadTag, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.dispatchHeaderMessage.dispatchHeadTag.back = comprehensiveDispatchHeadQueryReq.dispatchHeadTagNon === 'true'
    // 火灾信息-基本信息
    form.value.fireBase.fireDate.value = returnDateValue(comprehensiveFireQueryReq.fireDateStart, comprehensiveFireQueryReq.fireDateEnd)
    form.value.fireBase.statisticRangeSeasonMin.value = [comprehensiveFireQueryReq.statisticRangeSeasonMin, comprehensiveFireQueryReq.statisticRangeSeasonMax]
    form.value.fireBase.statisticRangeMonthMin.value = [comprehensiveFireQueryReq.statisticRangeMonthMin, comprehensiveFireQueryReq.statisticRangeMonthMax]
    form.value.fireBase.statisticRangeDayMin.value = [comprehensiveFireQueryReq.statisticRangeDayMin, comprehensiveFireQueryReq.statisticRangeDayMax]
    form.value.fireBase.statisticRangeHourMin.value = returnHourValue(comprehensiveFireQueryReq.statisticRangeHourMin, comprehensiveFireQueryReq.statisticRangeHourMax)
    form.value.fireBase.statisticRangeHoliday.value = comprehensiveFireQueryReq.statisticRangeHoliday
    if (form.value.fireBase.statisticRangeHoliday.value) {
      form.value.fireBase.statisticRangeHoliday.show = '1'
    }
    else if (form.value.fireBase.statisticRangeSeasonMin.value?.[0] || form.value.fireBase.statisticRangeSeasonMin.value?.[1]) {
      form.value.fireBase.statisticRangeHoliday.show = '2'
    }
    else if (form.value.fireBase.statisticRangeMonthMin.value?.[0] || form.value.fireBase.statisticRangeMonthMin.value?.[1]) {
      form.value.fireBase.statisticRangeHoliday.show = '3'
    }
    else if (form.value.fireBase.statisticRangeDayMin.value?.[0] || form.value.fireBase.statisticRangeDayMin.value?.[1]) {
      form.value.fireBase.statisticRangeHoliday.show = '4'
    }
    else if (form.value.fireBase.statisticRangeHourMin.value?.[0] || form.value.fireBase.statisticRangeHourMin.value?.[1]) {
      form.value.fireBase.statisticRangeHoliday.show = '5'
    }
    form.value.fireBase.fireDirection.value = comprehensiveFireQueryReq.fireDirection
    form.value.fireBase.areaDutyGroupFire.value = comprehensiveFireQueryReq.areaDutyGroupFire
      ? generateByKeyValue(comprehensiveFireQueryReq.areaDutyGroupFireText, comprehensiveFireQueryReq.areaDutyGroupFire, {
        key: 'name',
        value: 'organizationid',
      }, 'Number')
      : []
    form.value.fireBase.areaDutyGroupFire.back = comprehensiveFireQueryReq.areaDutyGroupFireNon === 'true'
    form.value.fireBase.area.value = returnCascaderValue(comprehensiveFireQueryReq.area)
    form.value.fireBase.area.back = comprehensiveFireQueryReq.areaNon === 'true'
    form.value.fireBase.fireType.value = comprehensiveFireQueryReq.fireType?.split(',').map(item => ([item]))
    form.value.fireBase.firePlace.value = returnCascaderValue(comprehensiveFireQueryReq.firePlace)
    form.value.fireBase.firePlace.back = comprehensiveFireQueryReq.firePlaceNon === 'true'
    form.value.fireBase.fireCause.value = returnCascaderValue(comprehensiveFireQueryReq.fireCause)
    form.value.fireBase.fireCause.back = comprehensiveFireQueryReq.fireCauseNon === 'true'
    form.value.fireBase.burnedAreaMin.value = returnNumValue(comprehensiveFireQueryReq.burnedAreaMin, comprehensiveFireQueryReq.burnedAreaMax)
    form.value.fireBase.fireLevel.value = comprehensiveFireQueryReq.fireLevel?.split(',')
    form.value.fireBase.fireLevel.back = comprehensiveFireQueryReq.fireLevelNon === 'true'
    form.value.fireBase.fireCode.value = comprehensiveFireQueryReq.fireCode
    form.value.fireBase.severity.value = comprehensiveFireQueryReq.severity
    form.value.fireBase.fireSite.value = returnCascaderValue(comprehensiveFireQueryReq.fireSite)
    form.value.fireBase.fireSite.back = comprehensiveFireQueryReq.fireSiteNon === 'true'
    form.value.fireBase.initialFuelsType.value = returnCascaderValue(comprehensiveFireQueryReq.initialFuelsType)
    form.value.fireBase.initialFuelsType.back = comprehensiveFireQueryReq.initialFuelsTypeNon === 'true'
    form.value.fireBase.igniteSourceType.value = returnCascaderValue(comprehensiveFireQueryReq.igniteSourceType)
    form.value.fireBase.igniteSourceType.back = comprehensiveFireQueryReq.igniteSourceTypeNon === 'true'
    form.value.fireBase.firePattern.value = returnCascaderValue(comprehensiveFireQueryReq.firePattern)
    form.value.fireBase.firePattern.back = comprehensiveFireQueryReq.firePatternNon === 'true'
    form.value.fireBase.liveType.value = comprehensiveFireQueryReq.liveType?.split(',')
    form.value.fireBase.liveType.back = comprehensiveFireQueryReq.liveTypeNon === 'true'
    form.value.fireBase.isPoorHouse.value = comprehensiveFireQueryReq.isPoorHouse
    form.value.fireBase.isChangeUseType.value = comprehensiveFireQueryReq.isChangeUseType
    form.value.fireBase.useType.value = comprehensiveFireQueryReq.useType?.split(',')
    form.value.fireBase.useType.back = comprehensiveFireQueryReq.useTypeNon === 'true'
    form.value.fireBase.isSafetyAccident.value = comprehensiveFireQueryReq.isSafetyAccident
    form.value.fireBase.isResearch.value = comprehensiveFireQueryReq.isResearch
      ? generateByKeyValue(comprehensiveFireQueryReq.isResearchText, comprehensiveFireQueryReq.isResearch, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireBase.isResearch.back = comprehensiveFireQueryReq.isResearchNon === 'true'
    // form.value.fireBase.fireTel.value = comprehensiveFireQueryReq.fireTel
    form.value.fireBase.socialCreditCode.value = comprehensiveFireQueryReq.socialCreditCode
    form.value.fireBase.industry.value = returnCascaderValue(comprehensiveFireQueryReq.industry)
    form.value.fireBase.industry.back = comprehensiveFireQueryReq.industryNon === 'true'
    form.value.fireBase.industryDepartment.value = comprehensiveFireQueryReq.industryDepartment?.split(',')
    form.value.fireBase.industryDepartment.back = comprehensiveFireQueryReq.industryDepartmentNon === 'true'
    form.value.fireBase.economicType.value = comprehensiveFireQueryReq.economicType?.split(',')
    form.value.fireBase.economicType.back = comprehensiveFireQueryReq.economicTypeNon === 'true'
    form.value.fireBase.leadInspectionOrg.value = comprehensiveFireQueryReq.leadInspectionOrg?.split(',')
    form.value.fireBase.leadInspectionOrg.back = comprehensiveFireQueryReq.leadInspectionOrgNon === 'true'
    form.value.fireBase.isInsurance.value = comprehensiveFireQueryReq.isInsurance
    form.value.fireBase.insuranceInfo.value = comprehensiveFireQueryReq.insuranceInfo?.split(',')
    form.value.fireBase.insuranceInfo.back = comprehensiveFireQueryReq.insuranceInfoNon === 'true'
    form.value.fireBase.isOnesided.value = comprehensiveFireQueryReq.isOnesided
    form.value.fireBase.fireInspection.value = comprehensiveFireQueryReq.fireInspection?.split(',')
    form.value.fireBase.fireInspection.back = comprehensiveFireQueryReq.fireInspectionNon === 'true'
    form.value.fireBase.firePersonAgeMin.value = returnNumValue(comprehensiveFireQueryReq.firePersonAgeMin, comprehensiveFireQueryReq.firePersonAgeMax)
    form.value.fireBase.schooling.value = comprehensiveFireQueryReq.schooling?.split(',')
    form.value.fireBase.schooling.back = comprehensiveFireQueryReq.schoolingNon === 'true'
    form.value.fireBase.health.value = comprehensiveFireQueryReq.health?.split(',')
    form.value.fireBase.health.back = comprehensiveFireQueryReq.healthNon === 'true'
    form.value.fireBase.undo.value = comprehensiveFireQueryReq.undo
    form.value.fireBase.fireStatus.value = comprehensiveFireQueryReq.fireStatus?.split(',')
    form.value.fireBase.fireStatus.back = comprehensiveFireQueryReq.fireStatusNon === 'true'
    form.value.fireBase.fireInfoTag.value = comprehensiveFireQueryReq.fireInfoTag
      ? generateByKeyValue(comprehensiveFireQueryReq.fireInfoTagText, comprehensiveFireQueryReq.fireInfoTag, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireBase.fireInfoTag.back = comprehensiveFireQueryReq.fireInfoTagNon === 'true'
    form.value.fireBase.isOperating.value = comprehensiveFireQueryReq.isOperating
    form.value.fireBase.plantRiskClassification.value = comprehensiveFireQueryReq.plantRiskClassification
      ? generateByKeyValue(comprehensiveFireQueryReq.plantRiskClassificationText, comprehensiveFireQueryReq.plantRiskClassification, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireBase.plantRiskClassification.back = comprehensiveFireQueryReq.plantRiskClassificationNon === 'true'
    // 火灾信息-人员伤亡
    form.value.fireCasualty.isInjury.value = comprehensiveFireQueryReq.isInjury
    form.value.fireCasualty.injuryType.value = comprehensiveFireQueryReq.injuryType
      ? generateByKeyValue(comprehensiveFireQueryReq.injuryTypeText, comprehensiveFireQueryReq.injuryType, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireCasualty.injuryType.back = comprehensiveFireQueryReq.injuryTypeNon === 'true'
    form.value.fireCasualty.bodyLocation.value = comprehensiveFireQueryReq.bodyLocation?.split(',')
    form.value.fireCasualty.bodyLocation.back = comprehensiveFireQueryReq.bodyLocationNon === 'true'
    form.value.fireCasualty.deathDate.value = returnCascaderValue(comprehensiveFireQueryReq.deathDate)
    form.value.fireCasualty.deathDate.back = comprehensiveFireQueryReq.deathDateNon === 'true'
    form.value.fireCasualty.mainSymptoms.value = comprehensiveFireQueryReq.mainSymptoms?.split(',')
    form.value.fireCasualty.mainSymptoms.back = comprehensiveFireQueryReq.mainSymptomsNon === 'true'
    form.value.fireCasualty.injuryPart.value = comprehensiveFireQueryReq.injuryPart?.split(',')
    form.value.fireCasualty.injuryPart.back = comprehensiveFireQueryReq.injuryPartNon === 'true'
    form.value.fireCasualty.injuryBehavior.value = comprehensiveFireQueryReq.injuryBehavior?.split(',')
    form.value.fireCasualty.injuryBehavior.back = comprehensiveFireQueryReq.injuryBehaviorNon === 'true'
    form.value.fireCasualty.humanCause.value = comprehensiveFireQueryReq.humanCause?.split(',')
    form.value.fireCasualty.humanCause.back = comprehensiveFireQueryReq.humanCauseNon === 'true'
    form.value.fireCasualty.injuryCause.value = comprehensiveFireQueryReq.injuryCause?.split(',')
    form.value.fireCasualty.injuryCause.back = comprehensiveFireQueryReq.injuryCauseNon === 'true'
    form.value.fireCasualty.injurySchooling.value = comprehensiveFireQueryReq.injurySchooling?.split(',')
    form.value.fireCasualty.injurySchooling.back = comprehensiveFireQueryReq.injurySchoolingNon === 'true'
    form.value.fireCasualty.injuryHealth.value = comprehensiveFireQueryReq.injuryHealth?.split(',')
    form.value.fireCasualty.injuryHealth.back = comprehensiveFireQueryReq.injuryHealthNon === 'true'
    form.value.fireCasualty.job.value = comprehensiveFireQueryReq.job?.split(',')
    form.value.fireCasualty.job.back = comprehensiveFireQueryReq.jobNon === 'true'
    form.value.fireCasualty.injurySource.value = comprehensiveFireQueryReq.injurySource?.split(',')
    form.value.fireCasualty.injurySource.back = comprehensiveFireQueryReq.injurySourceNon === 'true'
    form.value.fireCasualty.ageMin.value = returnNumValue(comprehensiveFireQueryReq.ageMin, comprehensiveFireQueryReq.ageMax)
    form.value.fireCasualty.gender.value = comprehensiveFireQueryReq.gender
      ? generateByKeyValue(comprehensiveFireQueryReq.genderText, comprehensiveFireQueryReq.gender, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireCasualty.gender.back = comprehensiveFireQueryReq.genderNon === 'true'
    form.value.fireCasualty.idNumber.value = comprehensiveFireQueryReq.idNumber
    form.value.fireCasualty.idType.value = comprehensiveFireQueryReq.idType?.split(',')
    form.value.fireCasualty.idType.back = comprehensiveFireQueryReq.idTypeNon === 'true'
    form.value.fireCasualty.nation.value = comprehensiveFireQueryReq.nation?.split(',')
    form.value.fireCasualty.nation.back = comprehensiveFireQueryReq.nationNon === 'true'
    form.value.fireCasualty.name.value = comprehensiveFireQueryReq.name
    form.value.fireCasualty.qsCountMin.value = returnNumValue(comprehensiveFireQueryReq.qsCountMin, comprehensiveFireQueryReq.qsCountMax)
    form.value.fireCasualty.zsCountMin.value = returnNumValue(comprehensiveFireQueryReq.zsCountMin, comprehensiveFireQueryReq.zsCountMax)
    form.value.fireCasualty.injuryCountMin.value = returnNumValue(comprehensiveFireQueryReq.injuryCountMin, comprehensiveFireQueryReq.injuryCountMax)
    form.value.fireCasualty.deathCountMin.value = returnNumValue(comprehensiveFireQueryReq.deathCountMin, comprehensiveFireQueryReq.deathCountMax)
    // 火灾信息-经济损失
    form.value.fireEconomic.inspectMethod.value = comprehensiveFireQueryReq.inspectMethod?.split(',')
    form.value.fireEconomic.inspectMethod.back = comprehensiveFireQueryReq.inspectMethodNon === 'true'
    form.value.fireEconomic.costSource.value = comprehensiveFireQueryReq.costSource?.split(',')
    form.value.fireEconomic.costSource.back = comprehensiveFireQueryReq.costSourceNon === 'true'
    form.value.fireEconomic.directEconomicLossMin.value = returnNumValue(comprehensiveFireQueryReq.directEconomicLossMin, comprehensiveFireQueryReq.directEconomicLossMax)
    form.value.fireEconomic.directDamageMin.value = returnNumValue(comprehensiveFireQueryReq.directDamageMin, comprehensiveFireQueryReq.directDamageMax)
    form.value.fireEconomic.fireDisposalCostMin.value = returnNumValue(comprehensiveFireQueryReq.fireDisposalCostMin, comprehensiveFireQueryReq.fireDisposalCostMax)
    form.value.fireEconomic.fireInjuryCostMin.value = returnNumValue(comprehensiveFireQueryReq.fireInjuryCostMin, comprehensiveFireQueryReq.fireInjuryCostMax)
    form.value.fireEconomic.affectedHouseMin.value = returnNumValue(comprehensiveFireQueryReq.affectedHouseMin, comprehensiveFireQueryReq.affectedHouseMax)
    // 火灾信息-交通工具
    form.value.fireVehicle.vehicleType.value = returnCascaderValue(comprehensiveFireQueryReq.vehicleType)
    form.value.fireVehicle.vehicleType.back = comprehensiveFireQueryReq.vehicleTypeNon === 'true'
    form.value.fireVehicle.chargeState.value = comprehensiveFireQueryReq.chargeState?.split(',')
    form.value.fireVehicle.chargeState.back = comprehensiveFireQueryReq.chargeStateNon === 'true'
    form.value.fireVehicle.batteryType.value = comprehensiveFireQueryReq.batteryType?.split(',')
    form.value.fireVehicle.batteryType.back = comprehensiveFireQueryReq.batteryTypeNon === 'true'
    form.value.fireVehicle.isRepack.value = comprehensiveFireQueryReq.isRepack
    form.value.fireVehicle.carNumber.value = comprehensiveFireQueryReq.carNumber
    form.value.fireVehicle.vinCode.value = comprehensiveFireQueryReq.vinCode
    form.value.fireVehicle.driveState.value = comprehensiveFireQueryReq.driveState?.split(',')
    form.value.fireVehicle.driveState.back = comprehensiveFireQueryReq.driveStateNon === 'true'
    // 火灾信息-建筑信息
    form.value.fireBuilding.buildTag.value = comprehensiveFireQueryReq.buildTag?.split(',')
    form.value.fireBuilding.buildType.value = comprehensiveFireQueryReq.buildType?.split(',')
    form.value.fireBuilding.buildType.back = comprehensiveFireQueryReq.buildTypeNon === 'true'
    form.value.fireBuilding.fireResistanceRating.value = comprehensiveFireQueryReq.fireResistanceRating?.split(',')
    form.value.fireBuilding.fireResistanceRating.back = comprehensiveFireQueryReq.fireResistanceRatingNon === 'true'
    form.value.fireBuilding.buildStructure.value = comprehensiveFireQueryReq.buildStructure?.split(',')
    form.value.fireBuilding.buildStructure.back = comprehensiveFireQueryReq.buildStructureNon === 'true'
    form.value.fireBuilding.buildFloorMin.value = returnNumValue(comprehensiveFireQueryReq.buildFloorMin, comprehensiveFireQueryReq.buildFloorMax)
    form.value.fireBuilding.fireFloorMin.value = returnNumValue(comprehensiveFireQueryReq.fireFloorMin, comprehensiveFireQueryReq.fireFloorMax)
    form.value.fireBuilding.housingLifeMin.value = returnNumValue(comprehensiveFireQueryReq.housingLifeMin, comprehensiveFireQueryReq.housingLifeMax)
    form.value.fireBuilding.buildUse.value = returnCascaderValue(comprehensiveFireQueryReq.buildUse)
    form.value.fireBuilding.buildUse.back = comprehensiveFireQueryReq.buildUseNon === 'true'
    form.value.fireBuilding.isSpread.value = comprehensiveFireQueryReq.isSpread
    form.value.fireBuilding.isLoud.value = comprehensiveFireQueryReq.isLoud
    form.value.fireBuilding.isWindowOpened.value = comprehensiveFireQueryReq.isWindowOpened
    form.value.fireBuilding.historyBuildLevel.value = comprehensiveFireQueryReq.historyBuildLevel?.split(',')
    form.value.fireBuilding.historyBuildLevel.back = comprehensiveFireQueryReq.historyBuildLevelNon === 'true'
    // 火灾信息-消防设施
    form.value.fireFacilities.isFirefightFacility.value = comprehensiveFireQueryReq.isFirefightFacility
    form.value.fireFacilities.autoAlarm.value = comprehensiveFireQueryReq.autoAlarm
    form.value.fireFacilities.autoFireFight.value = comprehensiveFireQueryReq.autoFireFight
    form.value.fireFacilities.indoorHydrant.value = comprehensiveFireQueryReq.indoorHydrant
    form.value.fireFacilities.smokeControl.value = comprehensiveFireQueryReq.smokeControl
    form.value.fireFacilities.fireShutter.value = comprehensiveFireQueryReq.fireShutter
    form.value.fireFacilities.emergencyLight.value = comprehensiveFireQueryReq.emergencyLight
      ? generateByKeyValue(comprehensiveFireQueryReq.emergencyLightText, comprehensiveFireQueryReq.emergencyLight, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireFacilities.networking.value = comprehensiveFireQueryReq.networking
      ? generateByKeyValue(comprehensiveFireQueryReq.networkingText, comprehensiveFireQueryReq.networking, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireFacilities.fireCompartment.value = comprehensiveFireQueryReq.fireCompartment
      ? generateByKeyValue(comprehensiveFireQueryReq.fireCompartmentText, comprehensiveFireQueryReq.fireCompartment, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireFacilities.compartmentAreaMin.value = returnNumValue(comprehensiveFireQueryReq.compartmentAreaMin, comprehensiveFireQueryReq.compartmentAreaMax)
    form.value.fireFacilities.fireSeparation.value = comprehensiveFireQueryReq.fireSeparation
      ? generateByKeyValue(comprehensiveFireQueryReq.fireSeparationText, comprehensiveFireQueryReq.fireSeparation, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireFacilities.separationMeterMin.value = returnNumValue(comprehensiveFireQueryReq.separationMeterMin, comprehensiveFireQueryReq.separationMeterMax)
    form.value.fireFacilities.escapeRoute.value = comprehensiveFireQueryReq.escapeRoute
      ? generateByKeyValue(comprehensiveFireQueryReq.escapeRouteText, comprehensiveFireQueryReq.escapeRoute, {
        key: 'label',
        value: 'value',
      })
      : []
    form.value.fireFacilities.emergencyExit.value = comprehensiveFireQueryReq.emergencyExit
      ? generateByKeyValue(comprehensiveFireQueryReq.emergencyExitText, comprehensiveFireQueryReq.emergencyExit, {
        key: 'label',
        value: 'value',
      })
      : []
    // 火灾信息-其他信息
    form.value.fireOther.firePassage.value = comprehensiveFireQueryReq.firePassage
    form.value.fireOther.handleTwoCase.value = comprehensiveFireQueryReq.handleTwoCase
    form.value.fireOther.penaltyNumMin.value = returnNumValue(comprehensiveFireQueryReq.penaltyNumMin, comprehensiveFireQueryReq.penaltyNumMax)
    form.value.fireOther.suggestDealNumMin.value = returnNumValue(comprehensiveFireQueryReq.suggestDealNumMin, comprehensiveFireQueryReq.suggestDealNumMax)
    form.value.fireOther.firePenalty.value = comprehensiveFireQueryReq.firePenalty
  }

  const initFormByType = (type) => {
    if (type === 2) {
      form.value.dispatchHeaderMessage = cloneDeep(formOrigin.dispatchHeaderMessage)
    }
    else if (type === 3) {
      form.value.dispatchBase = cloneDeep(formOrigin.dispatchBase)
      form.value.dispatchTime = cloneDeep(formOrigin.dispatchTime)
      form.value.dispatchInvest = cloneDeep(formOrigin.dispatchInvest)
      form.value.dispatchCasualty = cloneDeep(formOrigin.dispatchCasualty)
      form.value.dispatchBattle = cloneDeep(formOrigin.dispatchBattle)
      form.value.dispatchOther = cloneDeep(formOrigin.dispatchOther)
    }
  }

  const resetForm = () => {
    // debugger;
    // console.log(formOrigin,'formOrigin');
    form.value = cloneDeep(formOrigin)
  }

  return { form, getSearchParams, initSearchParams, initFormByType, resetForm }
}
