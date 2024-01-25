import { nextTick, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { checkAttendanceDate, checkDispatchNum, checkFireDistance, checkIsResponseTruck, checkReturnSpeed, checkTrappedPerson } from './tool.js'
import { fixCarInfo, getTypeText, generateByKeyValue  } from '@/utils/tools.js'
import { nonZeroPositiveInteger, nonnegativeNumberReg, positiveIntegerReg } from '@/utils/validate.js'

export const useFormConfig = () => {
  const formOrigin = {
    fireInfo: {
      title: '警情信息',
      fieldAnnotation: false, // 批注
    },
    draftInfo: { // 草稿信息
      title: '草稿信息',
      draftName: { // 草稿名称
        value: '',
        rules: [{ required: true, message: '请输入草稿名称' }],
      },
      warningType: { // 警情类型
        value: '',
        text: [],
        rules: [{ required: true, message: '请选择警情类型' }],
      },
      partakeType: { // 参战形式
        value: undefined,
        rules: [{ required: true, message: '请选择参战形式' }],
      },
    },
    basicInformation: { // 基本信息
      title: '基本信息',
      fieldAnnotation: false, // 批注
      fieldWarning: 'trappedPerson:false;fireDistance:false;attendanceDate:false;',
      dealSituation: { // 处置情况
        value: '2023020800260',
        text: '到场实施处置',
        rules: [{ required: true, message: '请选择处置情况' }],
      },
      notDealReason: { // 未处置原因
        value: '',
        rules: [{ required: true, message: '请输入未处置原因' }],
      },
      fireSituation: { // 到场时火灾情况
        value: undefined,
        text: '',
        rules: [{ required: true, message: '请选择到场时火灾情况' }],
      },
      industryDepartment: { // 行业主管部门
        value: undefined,
        rules: [{ required: true, message: '请选择行业主管部门' }],
      },
      fireDistance: { // 行驶距离（公里）
        value: '',
        warningText: '',
        rules: [
          { required: true, message: '请输入行驶距离' },
          { pattern: nonnegativeNumberReg, message: '请输入正确行驶距离' },
        ],
      },
      trappedPerson: { // 现场被困人数（人）
        value: '',
        rules: [
          { required: true, message: '请输入现场被困人数' },
          { pattern: positiveIntegerReg, message: '请输入正确现场被困人数' },
        ],
      },
      isBlocking: { // 消防通道是否堵塞
        value: '2',
        rules: [{ required: true, message: '请选择消防通道是否堵塞' }],
      },
      blockingTime: { // 疏通耗时（分钟）
        value: '',
        rules: [
          { required: true, message: '请输入疏通耗时' },
          { pattern: positiveIntegerReg, message: '请输入正确疏通耗时' },
        ],
      },
      dispatchDate: { // 出动时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      midwayReturnDate: { // 中途返回时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      attendanceDate: { // 到场时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      carryoutDate: { // 展开时间
        value: '',
        rules: [
          // { required: true, message: '请选择展开时间' },
        ],
      },
      waterflowDate: { // 出水时间
        value: '',
        rules: [
          // { required: true, message: '请选择出水时间' },
        ],
      },
      controllingDate: { // 控制时间
        value: '',
        rules: [
          // { required: true, message: '请选择控制时间' },
        ],
      },
      washDate: { // 洗消时间
        value: '',
        rules: [
          // { required: true, message: '请选择洗消时间' },
        ],
      },
      extinctDate: { // 扑灭时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      endDate: { // 结束时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      evacuateDate: { // 撤离时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      returnDate: { // 归队时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      presentSpeed: { // 平均时速（公里/小时）
        value: '',
        rules: [{ required: false, message: '' }],
      },
      returnLateReason: { // 平均时速异常原因
        value: undefined,
        rules: [{ required: true, message: '请选择平均时速异常原因' }],
      },
      dealEndDate: { // 警情处置结束时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      // 气象信息
      temperature: { // 气温
        value: '',
        rules: [
          { required: true, message: '请输入气温' },
        ],
      },
      weather: { // 天气
        value: undefined,
        rules: [
          { required: true, message: '请选择天气' },
        ],
      },
      wind: { // 风力
        value: undefined,
        rules: [{ required: true, message: '请选择风力' }],
      },
      windDirection: { // 风向
        value: undefined,
        rules: [{ required: true, message: '请选择风向' }],
      },
      // 主要战术措施
      isInside: { // 是否内攻
        value: '2',
        rules: [{ required: true, message: '请选择是否内攻' }],
      },
      fireTechnic: { // 火灾技战术措施
        value: undefined,
        rules: [{ required: true, message: '请选择火灾技战术措施' }],
      },
      rescueMeasures: { // 抢险救援措施
        value: undefined,
        rules: [{ required: true, message: '请选择抢险救援措施' }],
      },
      deliverWater: { // 送水/物资量（吨）
        value: '',
        rules: [
          { required: true, message: '请输入送水/物资量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确送水/物资量' },
        ],
      },
      drainWater: { // 排涝量（吨）
        value: '',
        rules: [
          { required: true, message: '请输入排涝量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确排涝量' },
        ],
      },
      killArea: { // 消杀面积（平方）
        value: '',
        rules: [
          { required: true, message: '请输入消杀面积' },
          { pattern: nonnegativeNumberReg, message: '请输入正确消杀面积' },
        ],
      },
    },
    basicInfoHead: { // 基本信息-全勤指挥部
      title: '基本信息',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      presentFlag: { // 指挥部是否到场
        value: '1',
        rules: [{ required: true, message: '请选择指挥部是否到场' }],
      },
      headquarterName: { // 全勤指挥部名称
        value: undefined,
        // rules: [{ required: true, message: '请选择全勤指挥部' }],
      },
      dispatchDate: { // 出动时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      attendanceDate: { // 到场时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      evacuateDate: { // 撤离时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      midwayReturnDate: { // 中途返回时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      returnDate: { // 归队时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      personNum: { // 人员数量
        value: '',
        // rules: [{ required: true, message: '请输入人员数量' }],
      },
      truckNum: { // 出动车辆（辆）
        value: '',
        // rules: [{ required: true, message: '请输入出动车辆数量' }],
      },
      commandTime: { // 指挥时长（小时）
        value: '',
        // rules: [{ required: true, message: '请输入指挥时长' }],
      },
    },
    personInfo: { // 人员信息
      title: '人员信息',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      commandLeader: [], // 指挥员
      headerName: { // 指挥员姓名
        value: undefined,
        rules: [{ required: true, message: '请选择指挥员姓名' }],
      },
      position: { // 指挥角色
        value: undefined,
        rules: [{ required: true, message: '请选择指挥角色' }],
      },
      headLeader: { // 带班领导
        value: undefined,
        // rules: [{ required: true, message: '请选择带班领导' }],
      },
      commandCenter: { // 指挥中心
        value: undefined,
        // rules: [{ required: true, message: '请选择指挥中心' }],
      },
      chiefCommander: { // 总指挥
        value: undefined,
        // rules: [{ required: true, message: '请选择总指挥' }],
      },
      deputyCommander: { // 副总指挥
        value: undefined,
        // rules: [{ required: true, message: '请选择副总指挥' }],
      },
      commander: { // 指挥长
        value: undefined,
        // rules: [{ required: true, message: '请选择指挥长' }],
      },
      commandAssistant: { // 指挥助理
        value: undefined,
        // rules: [{ required: true, message: '请选择指挥助理' }],
      },
      messageAssistant: { // 通信助理
        value: undefined,
        // rules: [{ required: true, message: '请选择通信助理' }],
      },
      messenger: { // 通信员
        value: undefined,
        // rules: [{ required: true, message: '请选择通信员' }],
      },
      headSupport: { // 战勤保障
        value: undefined,
        // rules: [{ required: true, message: '请选择战勤保障' }],
      },
      headPolitic: { // 战地政工
        value: undefined,
        // rules: [{ required: true, message: '请选择战地政工' }],
      },
      newsPropagation: { // 新闻宣传
        value: undefined,
        // rules: [{ required: true, message: '请选择新闻宣传' }],
      },
      technicianGroup: { // 技术专家（队内）
        value: undefined,
        // rules: [{ required: true, message: '请选择技术专家' }],
      },
      haveProfessor: { // 是否有社会技术专家
        value: '2',
        rules: [{ required: true, message: '请选择是否有社会技术专家' }],
      },
      technician: [], // 技术专家（社会）
      otherMember: { // 其他人员
        value: undefined,
        // rules: [{ required: true, message: '请选择其他人员' }],
      },
      name: {
        rules: [{ required: true, message: '请输入技术专家' }],
      },
    },
    commandMode: { // 指挥方式
      title: '指挥方式',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      commandMethod: { // 指挥方式
        value: undefined,
        rules: [{ required: true, message: '请选择指挥方式' }],
      },
    },
    commandProcess: { // 指挥过程
      title: '指挥过程',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      rescueMethod: { // 处置对策
        value: '',
        rules: [{ required: true, message: '请输入处置对策' }],
      },
      actionPlan: { // 行动方案
        value: '',
        rules: [{ required: true, message: '请输入行动方案' }],
      },
      commandProcess: { // 过程描述
        value: '',
        rules: [{ required: true, message: '请输入过程描述' }],
      },
      attach: { // 其他附件
        value: [],
        // rules: [{ required: true, message: '请选择其他附件' }],
      },
    },
    deployEquipment: { // 出动装备
      title: '出动装备',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      headTruckList: { // 指挥车辆信息
        value: undefined,
        rules: [{ required: true, message: '请选择指挥车辆信息' }],
      },
      boardingTruckList: { // 宿营车
        value: undefined,
        // rules: [{ required: true, message: '请选择宿营车' }],
      },
      kitchenTruckList: { // 请选择炊事车
        value: undefined,
        // rules: [{ required: true, message: '请选择炊事车' }],
      },
      toiletTruckList: { // 盥洗车
        value: undefined,
        // rules: [{ required: true, message: '请选择盥洗车' }],
      },
      refrigerateTruckZqList: { // 冷藏车
        value: undefined,
        // rules: [{ required: true, message: '请选择冷藏车' }],
      },
      airfeedTruckList: { // 供气车
        value: undefined,
        // rules: [{ required: true, message: '请选择供气车' }],
      },
      oilTruckList: { // 油料车
        value: undefined,
        // rules: [{ required: true, message: '请选择油料车' }],
      },
      steamThawingTruckList: { // 蒸汽解冻车
        value: undefined,
        // rules: [{ required: true, message: '请选择蒸汽解冻车' }],
      },
      foamTransferTruckList: { // 泡沫输转车
        value: undefined,
        // rules: [{ required: true, message: '请选择泡沫输转车' }],
      },
      wreckTruckList: { // 清障车
        value: undefined,
        // rules: [{ required: true, message: '请选择清障车' }],
      },
      modularTruckList: { // 模块车
        value: undefined,
        // rules: [{ required: true, message: '请选择模块车' }],
      },
      mobileCommunicateTruckList: { // 动中通通信车
        value: undefined,
        // rules: [{ required: true, message: '请选择动中通通信车' }],
      },
      communicateEquipTruckList: { // 通信材料车
        value: undefined,
        // rules: [{ required: true, message: '请选择通信材料车' }],
      },
      quietCommunicateTruckList: { // 静中通通信车
        value: undefined,
        // rules: [{ required: true, message: '请选择静中通通信车' }],
      },
      satellitePhone: { // 卫星电话（台）
        value: 0,
        rules: [
          { required: true, message: '请输入卫星电话数量' },
          { pattern: positiveIntegerReg, message: '请输入正确卫星电话数量' },
        ],
      },
      satellitePortableStation: { // 卫星便携站（座）
        value: 0,
        rules: [
          { required: true, message: '请输入卫星便携站数量' },
          { pattern: positiveIntegerReg, message: '请输入正确卫星便携站数量' },
        ],
      },
      singleSoldier: { // 单兵（件）
        value: 0,
        rules: [
          { required: true, message: '请输入单兵数量' },
          { pattern: positiveIntegerReg, message: '请输入正确单兵数量' },
        ],
      },
      // uav: { // 无人机（架）
      //   value: 0,
      //   rules: [
      //     { required: true, message: '请输入无人机数量' },
      //     { pattern: positiveIntegerReg, message: '请输入正确无人机数量' },
      //   ],
      // },
      clothControl: { // 布控球（个）
        value: 0,
        rules: [
          { required: true, message: '请输入布控球数量' },
          { pattern: positiveIntegerReg, message: '请输入正确布控球数量' },
        ],
      },
      meshStation: { // Mesh自组网基站（座）
        value: 0,
        rules: [
          { required: true, message: '请输入Mesh自组网基站数量' },
          { pattern: positiveIntegerReg, message: '请输入正确Mesh自组网基站数量' },
        ],
      },
      microwaveGraph: { // 微播图传（个）
        value: 0,
        rules: [
          { required: true, message: '请输入微播图传数量' },
          { pattern: positiveIntegerReg, message: '请输入正确微播图传数量' },
        ],
      },
      beidouTerminal: { // 北斗有源终端（个）
        value: 0,
        rules: [
          { required: true, message: '请输入北斗有源终端数量' },
          { pattern: positiveIntegerReg, message: '请输入正确北斗有源终端数量' },
        ],
      },
    },
    investForce: { // 投入力量
      title: '投入力量',
      fieldAnnotation: false, // 批注
      fieldWarning: 'commander:false;commanderNum:false;firemen:false;firemenNum:false;isResponseTruck:false;',
      groupLeader: { // 带队指挥员
        value: undefined,
        rules: [{ required: true, message: '请选择带队指挥员' }],
      },
      commanderNum: { // 指挥员（人）
        value: '',
        rules: [
          { required: true, message: '请输入指挥员人数' },
          { pattern: positiveIntegerReg, message: '请输入正确指挥员人数' },
        ],
      },
      firemenNum: { // 消防员（人）
        value: '',
        rules: [
          { required: true, message: '请输入消防员人数' },
          { pattern: positiveIntegerReg, message: '请输入正确消防员人数' },
        ],
      },
      commander: { // 指挥员人数（人）
        value: undefined,
        rules: [
          { required: true, message: '请选择指挥员' },
        ],
      },
      firemen: { // 消防员（人）
        value: undefined,
        rules: [
          { required: true, message: '请选择消防员' },
        ],
      },
      isResponseTruck: { // 是否有车辆出动
        value: '1',
        rules: [{ required: true, message: '请选择是否有车辆出动' }],
      },
      dispatchTruckList: { // 消防车辆信息
        value: undefined,
        rules: [{ required: true, message: '请选择消防车辆信息' }],
      },
      isReturnTruck: { // 是否有车辆中途返回
        value: '2',
        disabled: false,
        rules: [{ required: true, message: '请选择是否有车辆中途返回' }],
      },
      midwayCar: { // 中途返回车辆信息
        value: undefined,
        disabled: false,
        rules: [{ required: true, message: '请选择中途返回车辆信息' }],
      },
      fireBoatNum: { // 艇（艘）
        value: '',
        rules: [
          // { required: true, message: '请输入艇数' },
          // { pattern: positiveIntegerReg, message: '请输入正确艇数' },
        ],
      },
      fireAirplaneNum: { // 消防直升机（架）
        value: '',
        rules: [
          // { required: true, message: '请输入消防直升机数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防直升机数量' },
        ],
      },
      rescueDogNum: { // 搜救犬（只）
        value: '',
        rules: [
          // { required: true, message: '请输入搜救犬数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确搜救犬数量' },
        ],
      },
      uavNum: { // 无人机（架）
        value: '',
        rules: [
          // { required: true, message: '请输入无人机数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确无人机数量' },
        ],
      },
      // governmentCommand: { // 政府指挥
      //   title: '政府指挥',
      isCommand: { // 政府到场指挥情况
        value: '2',
        rules: [{ required: true, message: '请选择政府到场指挥情况' }],
      },
      fireDispatchZfList: [], // 指挥人员
      name: { // 姓名
        value: '',
        rules: [{ required: true, message: '请输入姓名' }],
      },
      duty: { // 职务
        value: '',
        rules: [{ required: true, message: '请输入职务' }],
      },
      level: { // 所属级别
        value: undefined,
        rules: [{ required: true, message: '请选择所属级别' }],
      },
      // linkageUnit: { // 联动单位
      // title: '联动单位',
      haveLinkageUnit: { // 是否有联动单位
        value: '2',
        rules: [{ required: true, message: '请选择是否有联动单位' }],
      },
      fireDispatchLinkList: [], // 联动单位
      orgName: { // 单位名称
        value: '',
        rules: [{ required: true, message: '请输入单位名称' }],
      },
      departmentName: { // 所属行业部门
        value: undefined,
        rules: [{ required: true, message: '请选择所属行业部门' }],
      },
      orgLevel: { // 所属级别
        value: undefined,
        rules: [{ required: true, message: '请选择所属级别' }],
      },
      // otherForce: { // 其他消防救援力量
      // title: '其他消防救援力量',
      haveVolunteer: { // 是否有志愿救援队
        value: '2',
        rules: [{ required: true, message: '请选择是否有志愿队力量' }],
      },
      volunteerList: [], // 志愿救援队
      haveProfessional: { // 是否有专业救援队
        value: '2',
        rules: [{ required: true, message: '请选择有专业队力量' }],
      },
      otherList: [], // 专业队救援力量
      groupType: {
        value: undefined,
        rules: [{ required: true, message: '请选择队务类型' }],
      },
      orgName1: {
        value: '',
        rules: [{ required: true, message: '请输入志愿队名称' }],
      },
      professionalName: {
        value: '',
        rules: [{ required: true, message: '请输入专业队名称' }],
      },
      peopleNum: {
        value: '',
        rules: [
          // { required: true, message: '请输入人数' },
          { pattern: nonZeroPositiveInteger, message: '请输入正确人数' },
        ],
      },
      trunkNum: {
        value: '',
        rules: [
          // { required: true, message: '请输入车数' },
          { pattern: positiveIntegerReg, message: '请输入正确车数' },
        ],
      },
      boatNum: {
        value: '',
        rules: [
          // { required: true, message: '请输入艇数' },
          { pattern: positiveIntegerReg, message: '请输入正确艇数' },
        ],
      },
    },
    casualtyWar: { // 参战伤亡
      title: '参战伤亡',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      isInjured: { // 是否有人员伤亡
        value: '2',
        rules: [{ required: true, message: '请选择是否有人员受伤' }],
      },
      injuredList: [], // 受伤人员列表
      isDead: { // 是否有人员死亡
        value: '2',
        rules: [{ required: true, message: '请选择是否有人员死亡' }],
      },
      deadList: [], // 死亡人员列表
      name: {
        value: '',
        rules: [{ required: true, message: '请选择人员姓名' }],
      },
      identity: {
        value: undefined,
        rules: [{ required: true, message: '请选择人员身份' }],
      },
      personCode: {
        value: '',
        // rules: [{ required: true, message: '请输入消防证件号' }],
      },
      nation: { // 民族
        value: undefined,
        rules: [{ required: true, message: '请选择民族' }],
      },
      nativePlace: { // 户籍
        value: undefined,
        rules: [{ required: true, message: '请选择户籍' }],
      },
      politicalOutlook: { // 政治面貌
        value: undefined,
        rules: [{ required: true, message: '请选择政治面貌' }],
      },
      idNumber: {
        value: '',
        rules: [
          { required: true, message: '请输入身份证号码' },
        ],
      },
      deathDate: { // 死亡日期
        value: '',
        rules: [{ required: true, message: '请选择死亡日期' }],
      },
      gender: {
        value: '',
        // rules: [{ required: true, message: '请输入人员性别' }],
      },
      age: {
        value: '',
        // rules: [{ required: true, message: '请输入年龄' }],
      },
      rescueRank: {
        value: undefined,
        // rules: [{ required: true, message: '请选择消防救援衔' }],
      },
      titleRank: {
        value: '',
        // rules: [{ required: true, message: '请输入衔级' }],
      },
      bridgingRank: {
        value: '',
        // rules: [{ required: true, message: '请输入职级' }],
      },
      duty: {
        value: '',
        rules: [{ required: true, message: '请输入职务' }],
      },
      injuryPart: {
        value: undefined,
        rules: [{ required: true, message: '请选择受伤/致命伤部位' }],
      },
      teamEntryTime: { // 入队时间（进入消防系统）
        value: undefined,
        rules: [{ required: true, message: '请选择入队时间' }],
      },
      period: {
        value: undefined,
        rules: [{ required: true, message: '请选择事发阶段' }],
      },
      injuryReason: {
        value: undefined,
        rules: [{ required: true, message: '请选择受伤/死亡原因' }],
      },
      protectDevice: {
        value: undefined,
        rules: [{ required: true, message: '请选择防护装备情况' }],
      },
      isInstantDeath: {
        value: undefined,
        rules: [{ required: true, message: '请选择是否当场死亡' }],
      },
    },
    battleResult: { // 战斗成果
      title: '战斗成果',
      fieldAnnotation: false, // 批注
      fieldWarning: 'rescueNum:false;',
      rescueNum: { // 抢救（人）
        value: '',
        rules: [
          { required: true, message: '' },
          { pattern: positiveIntegerReg, message: '请输入正确抢救人数' },
        ],
      },
      surviveNum: { // 生还（人）
        value: '',
        rules: [
          { required: true, message: '' },
          { pattern: positiveIntegerReg, message: '请输入正确生还人数' },
        ],
      },
      deathNum: { // 死亡（人）（抢救-生还）
        value: '',
        rules: [
          // { required: true, message: '请输入死亡人数' },
          { pattern: positiveIntegerReg, message: '请输入正确死亡人数' },
        ],
      },
      evacuateNum: { // 疏散（人）
        value: '',
        rules: [
          // { required: true, message: '请输入疏散人数' },
          // { pattern: positiveIntegerReg, message: '请输入正确疏散人数' },
        ],
      },
      transferNum: { // 转移（人）
        value: '',
        rules: [
          // { required: true, message: '请输入转移人数' },
          // { pattern: positiveIntegerReg, message: '请输入正确转移人数' },
        ],
      },
      emergencyNum: { // 抢救财产价值（元）
        value: '',
        rules: [
          { required: true, message: '请输入抢救财产价值' },
          { pattern: nonnegativeNumberReg, message: '请输入正确抢救财产价值' },
        ],
      },
      protectNum: { // 保护财产价值（元）
        value: '',
        rules: [
          { required: true, message: '请输入保护财产价值' },
          { pattern: nonnegativeNumberReg, message: '请输入正确保护财产价值' },
        ],
      },
    },
    battleConsume: { // 战斗消耗
      title: '战斗消耗',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      wastageTruck: { // 损耗车辆信息
        value: undefined,
        // rules: [{ required: true, message: '请选择损耗车辆信息' }],
      },
      wastageTruckExplain: { // 车辆损耗说明
        value: '',
        rules: [
          // { required: true, message: '请输入车辆损耗说明' },
        ],
      },
      fuel: { // 燃油（升）
        value: '',
        rules: [
          // { required: true, message: '请输入燃油量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确燃油量' },
        ],
      },
      waterPump: { // 机动消防泵（含浮艇泵）（台）
        value: '',
        rules: [
          // { required: true, message: '请输入机动消防泵数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确机动消防泵数量' },
        ],
      },
      hoseReel: { // 移动式水带卷盘或水带槽（个）
        value: '',
        rules: [
          // { required: true, message: '请输入移动式水带卷盘或水带槽数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确移动式水带卷盘或水带槽数量' },
        ],
      },
      fireGun: { // 移动式消防炮（个）
        value: '',
        rules: [
          // { required: true, message: '请输入移动式消防炮数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确移动式消防炮数量' },
        ],
      },
      airForm: { // 空气泡沫枪（个）
        value: '',
        rules: [
          // { required: true, message: '请输入空气泡沫枪数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确空气泡沫枪数量' },
        ],
      },
      formTank: { // 泡沫液桶（个）
        value: '',
        rules: [
          // { required: true, message: '请输入泡沫液桶数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确泡沫液桶数量' },
        ],
      },
      ladder: { // 梯子（把）
        value: '',
        rules: [
          // { required: true, message: '请输入梯子数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确梯子数量' },
        ],
      },
      waterBand: { // 水带（米）
        value: '',
        rules: [
          // { required: true, message: '请输入水带长度' },
          { pattern: nonnegativeNumberReg, message: '请输入正确水带长度' },
        ],
      },
      fireHydrantHandle: { // 消防栓扳手（把）
        value: '',
        rules: [
          // { required: true, message: '请输入消防栓扳手数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防栓扳手数量' },
        ],
      },
      waterGun: { // 水枪（个）
        value: '',
        rules: [
          // { required: true, message: '请输入水枪数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确水枪数量' },
        ],
      },
      waterMainfold: { // 分水器（只）
        value: '',
        rules: [
          // { required: true, message: '请输入分水器数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确分水器数量' },
        ],
      },
      entryTool: { // 破拆工具（个）
        value: '',
        rules: [
          // { required: true, message: '请输入破拆工具数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确破拆工具数量' },
        ],
      },
      fireExtinguisher: { // 灭火机（只）
        value: '',
        rules: [
          // { required: true, message: '请输入灭火机数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确灭火机数量' },
        ],
      },
      firePump: { // 手抬泵（个）
        value: '',
        rules: [
          // { required: true, message: '请输入手抬泵数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确手抬泵数量' },
        ],
      },
      fireHat: { // 消防头盔（个）
        value: '',
        rules: [
          // { required: true, message: '请输入消防头盔数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防头盔数量' },
        ],
      },
      protectiveSuit: { // 消防员灭火防护服（套）
        value: '',
        rules: [
          // { required: true, message: '请输入消防员灭火防护服数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防员灭火防护服数量' },
        ],
      },
      fireGlove: { // 消防手套（副）
        value: '',
        rules: [
          // { required: true, message: '请输入消防手套数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防手套数量' },
        ],
      },
      lapBelt: { // 消防安全腰带（根）
        value: '',
        rules: [
          // { required: true, message: '请输入消防安全腰带数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防安全腰带数量' },
        ],
      },
      protectiveBoots: { // 消防员灭火防护靴（双）
        value: '',
        rules: [
          // { required: true, message: '请输入消防员灭火防护靴数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防员灭火防护靴数量' },
        ],
      },
      fireRebreather: { // 双正式压消防空气呼吸器（个）
        value: '',
        rules: [
          // { required: true, message: '请输入双正式压消防空气呼吸器数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确双正式压消防空气呼吸器数量' },
        ],
      },
      fireLight: { // 佩戴式防爆照灯（个）
        value: '',
        rules: [
          // { required: true, message: '请输入佩戴式防爆照灯数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确佩戴式防爆照灯数量' },
        ],
      },
      fireRescuer: { // 消防员呼救器（个）
        value: '',
        rules: [
          // { required: true, message: '请输入消防员呼救器数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防员呼救器数量' },
        ],
      },
      positionLamp: { // 方位灯（个）
        value: '',
        rules: [
          // { required: true, message: '请输入方位灯数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确方位灯数量' },
        ],
      },
      safetyRope: { // 消防安全绳（根）
        value: '',
        rules: [
          // { required: true, message: '请输入消防安全绳数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防安全绳数量' },
        ],
      },
      fireAxe: { // 消防腰斧（个）
        value: '',
        rules: [
          // { required: true, message: '请输入消防腰斧数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确消防腰斧数量' },
        ],
      },
      interphone: { // 对讲机（个）
        value: '',
        rules: [
          // { required: true, message: '请输入对讲机数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确对讲机数量' },
        ],
      },
      transferImage: { // 图传（个）
        value: '',
        rules: [
          // { required: true, message: '请输入图传数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确图传数量' },
        ],
      },
      uav: { // 无人机（架）
        value: '',
        rules: [
          // { required: true, message: '请输入无人机数量' },
          // { pattern: positiveIntegerReg, message: '请输入正确无人机数量' },
        ],
      },
      foamLiquid: { // 泡沫液（千克）
        value: '',
        rules: [
          // { required: true, message: '请输入泡沫液量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确泡沫液量' },
        ],
      },
      dryPowder: { // 干粉（千克）
        value: '',
        rules: [
          // { required: true, message: '请输入干粉量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确干粉量' },
        ],
      },
      carbonDioxide: { // 二氧化碳（千克）
        value: '',
        rules: [
          // { required: true, message: '请输入二氧化碳量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确二氧化碳量' },
        ],
      },
      haloalkane: { // 卤代烷（升）
        value: '',
        rules: [
          // { required: true, message: '请输入卤代烷量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确卤代烷量' },
        ],
      },
      totalFlow: { // 总流量（升/秒）
        value: '',
        rules: [
          // { required: true, message: '请输入总流量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确总流量' },
        ],
      },
      firefightingWater: { // 灭火用水（吨）
        value: '',
        rules: [
          // { required: true, message: '请输入灭火用水量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确灭火用水量' },
        ],
      },
      coolingWater: { // 冷却水（吨）
        value: '',
        rules: [
          // { required: true, message: '请输入冷却水量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确冷却水量' },
        ],
      },
      totalWater: { // 用水总量（吨）
        value: '',
        rules: [
          // { required: true, message: '请输入用水总量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确用水总量' },
        ],
      },
      waterInterrupt: { // 无故供水中断（次）
        value: '',
        rules: [
          // { required: true, message: '请输入无故供水中断次数' },
          // { pattern: positiveIntegerReg, message: '请输入正确无故供水中断次数' },
        ],
      },
      waterDamage: { // 水渍损失
        value: '',
        rules: [
          // { required: true, message: '请选择水渍损失' },
        ],
      },
      lossOtherEquipments: [], // 其他物品（灭火器材）
      lossOtherPersonal: [], // 其他物品（个人装备）
      lossOtherAgent: [], // 其他物品（灭火药剂）
      otherName: {
        value: '',
        rules: [{ required: true, message: '请输入其他物品名称' }],
      },
      otherAmount: {
        value: '',
        rules: [
          { required: true, message: '请输入数量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确数量' },
        ],
      },
    },
    disposalProcess: { // 处置经过
      title: '处置经过',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      fireProcess: {
        value: '', // 处置经过
        rules: [{ required: true, message: '请输入处置经过' }],
      },
    },
    scenePhoto: { // 现场照片
      title: '现场照片',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      photos: { // 现场照片
        value: [],
        rules: [{ required: true, message: '请选择现场照片' }],
      },
    },
    otherAttach: { // 其他附件
      title: '其他附件',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      attach: { // 其他附件
        value: [],
        // rules: [{ required: true, message: '请选择其他附件' }],
      },
      remark: { // 其他说明
        value: '',
        // rules: [{ required: true, message: '请输入其他说明' }],
      },
    },
    proSteps: { // 操作记录
      title: '操作记录',
      fieldAnnotation: false, // 批注
      fireDispatchTransferVOList: {
        value: [],
      },
    },
  }

  const form = ref(cloneDeep(formOrigin))

  // 根据模版生成处置经过
  const generateRemarkField = (detail, orgName) => {
    const { draftInfo, basicInformation, battleResult, casualtyWar, investForce } = form.value
    const { warningDate, warningTypeValue, warningAddr, distributeOrgName, warningOrgname } = detail
    let content = ''
    const warningTypeText = cloneDeep(warningTypeValue?.split('/') || draftInfo.warningType?.text)
    if (warningTypeText?.includes('火灾扑救') && basicInformation.dealSituation?.text === '到场实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】发生一起【警情末级类型】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赴现场处置；【出动队伍】【到场时间】到场，到场时火灾处于【到场时火灾情况】，【结束时间】处置结束，【归队时间】归队。共营救、疏散被困人员【抢救人数+疏散人数】人，抢救财产价值【抢救财产价值】元，保护财产价值【保护财产价值】元。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('火灾扑救') && basicInformation.dealSituation?.text === '到场未实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】发生一起【警情末级类型】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赴现场处置；【出动队伍】【到场时间】到场，到场时火灾处于【到场时火灾情况】，因【未处置原因】未实施处置，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('火灾扑救') && basicInformation.dealSituation?.text === '中途返回') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】发生一起【警情末级类型】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赴现场处置；【中返时间】中途返回，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('抢险救援') && basicInformation.dealSituation?.text === '到场实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】发生一起事故（【抢险救援末级指标】）。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赴现场处置；【出动队伍】【到场时间】到场，【结束时间】处置结束，【归队时间】归队。共营救、疏散被困人员【抢救人数+疏散人数】人，抢救财产价值【抢救财产价值】元，保护财产价值【保护财产价值】元。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('抢险救援') && basicInformation.dealSituation?.text === '到场未实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】发生一起事故（【抢险救援末级指标】）。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赴现场处置；【出动队伍】【到场时间】到场，因【未处置原因】未实施处置，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('抢险救援') && basicInformation.dealSituation?.text === '中途返回') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】发生一起事故（【抢险救援末级指标】）。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赴现场处置；【中返时间】中途返回，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('公共服务时') && basicInformation.dealSituation?.text === '到场实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】【需要公共服务【（公共服务末级指标）】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【出动队伍】【到场时间】到场，【结束时间】处置结束，共营救、疏散被困人员【抢救人数+疏散人数】人，抢救财产价值【抢救财产价值】元，保护财产价值【保护财产价值】元。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('公共服务时') && basicInformation.dealSituation?.text === '到场未实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】【需要公共服务【（公共服务末级指标）】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【出动队伍】【到场时间】到场，因【未处置原因】未实施处置，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('公共服务时') && basicInformation.dealSituation?.text === '中途返回') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】【需要公共服务【（公共服务末级指标）】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【中返时间】中途返回，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('社会救助') && basicInformation.dealSituation?.text === '到场实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】需要救助【（社会救助末级指标）】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【出动队伍】【到场时间】到场，【结束时间】处置结束，共营救、疏散被困人员【抢救人数+疏散人数】人，抢救财产价值【抢救财产价值】元，保护财产价值【保护财产价值】元。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('社会救助') && basicInformation.dealSituation?.text === '到场未实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】需要救助【（社会救助末级指标）】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【出动队伍】【到场时间】到场，因【未处置原因】未实施处置，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('社会救助') && basicInformation.dealSituation?.text === '中途返回') {
      content = '【接警时间年月日时分】，【警情录入单位】接到出警指令：【警情地址】需要救助【（社会救助末级指标）】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【中返时间】中途返回，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('安保勤务') && basicInformation.dealSituation?.text === '到场实施处置') {
      content = '【接警时间年月日时分】，【出动队伍所属支队】【出动队伍】出动【车辆数】车【指战员数】人赶赴【警情地址】，就【活动/任务名】开展【安保勤务末级指标类型】工作。【出动队伍】【到场时间】到场，【结束时间】任务结束，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('安保勤务') && basicInformation.dealSituation?.text === '到场未实施处置') {
      content = '【接警时间年月日时分】，【出动队伍所属支队】【出动队伍】出动【车辆数】车【指战员数】人赶赴【警情地址】，就【活动/任务名】开展【安保勤务末级指标类型】工作。【出动队伍】【到场时间】到场，因【未处置原因】未实施处置，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('安保勤务') && basicInformation.dealSituation?.text === '中途返回') {
      content = '【接警时间年月日时分】，【出动队伍所属支队】【出动队伍】出动【车辆数】车【指战员数】人赶赴【警情地址】，就【活动/任务名】开展【安保勤务末级指标类型】工作。【中返时间】中途返回，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('虚假警') && basicInformation.dealSituation?.text === '到场实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到一起虚假警【虚假警末级指标】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【出动队伍】【到场时间】到场，【结束时间】处置结束，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('虚假警') && basicInformation.dealSituation?.text === '到场未实施处置') {
      content = '【接警时间年月日时分】，【警情录入单位】接到一起虚假警【虚假警末级指标】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【出动队伍】【到场时间】到场，因【未处置原因】未实施处置，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    else if (warningTypeText?.includes('虚假警') && basicInformation.dealSituation?.text === '中途返回') {
      content = '【接警时间年月日时分】，【警情录入单位】接到一起虚假警【虚假警末级指标】。【出动时间】，【出动队伍】出动【车辆数】车【指战员数】人赶赴现场处置；【中返时间】中途返回，【归队时间】归队。造成参战人员【亡人数】死【伤人数】伤。'
    }
    // 替换各个字段
    if (warningDate) {
      content = content.replace('【接警时间年月日时分】', dayjs(warningDate).format('YYYY年MM月DD日HH时mm分'))
    }
    if (detail.detachment) {
      content = content.replace('【出动队伍所属支队】', detail.detachment)
    }
    if (distributeOrgName) {
      content = content.replace('【警情录入单位】', distributeOrgName)
    }
    if (warningTypeText?.length > 0) {
      content = content.replace('【警情末级类型】', cloneDeep(warningTypeText).pop())
    }
    if (warningAddr) {
      content = content.replace('【警情地址】', warningAddr)
    }
    if (warningOrgname) {
      content = content.replace('【活动/任务名】', warningOrgname)
    }
    if (warningTypeText?.length > 0) {
      content = content.replace('【（社会救助末级指标）】', cloneDeep(warningTypeText).pop())
      content = content.replace('【（公共服务末级指标）】', cloneDeep(warningTypeText).pop())
      content = content.replace('【虚假警末级指标】', cloneDeep(warningTypeText).pop())
      content = content.replace('【抢险救援末级指标】', cloneDeep(warningTypeText).pop())
      content = content.replace('【安保勤务末级指标类型】', cloneDeep(warningTypeText).pop())
    }
    if (basicInformation.dispatchDate.value) {
      content = content.replace('【出动时间】', dayjs(basicInformation.dispatchDate.value).format('MM月DD日HH时mm分'))
    }
    if (orgName && orgName === detail.dutyGroupName) {
      content = content.replaceAll('【出动队伍】', `${orgName}（辖区站）`)
    }
    else if (orgName && orgName !== detail.dutyGroupName) {
      content = content.replaceAll('【出动队伍】', `${orgName}（非辖区站）`)
    }
    if (investForce.dispatchTruckList.value?.length > 0) {
      content = content.replace('【车辆数】', investForce.dispatchTruckList.value?.length)
    }
    if (investForce.commander.value?.length >= 0 || investForce.firemen.value?.length >= 0) {
      const ids = investForce.commander?.value?.map(item => item.boFireUserId)?.join(',') || ''
      const result = cloneDeep(investForce.commander?.value) || []
      investForce.firemen.value?.forEach((item) => {
        if (!ids.includes(item.boFireUserId)) {
          result.push(item)
        }
      })
      content = content.replace('【指战员数】', result?.length)
    }
    if (basicInformation.attendanceDate.value) {
      content = content.replace('【到场时间】', dayjs(basicInformation.attendanceDate.value).format('MM月DD日HH时mm分'))
    }
    if (basicInformation.fireSituation.text) {
      content = content.replace('【到场时火灾情况】', basicInformation.fireSituation.text)
    }
    if (basicInformation.endDate.value) {
      content = content.replace('【结束时间】', dayjs(basicInformation.endDate.value).format('MM月DD日HH时mm分'))
    }
    if (battleResult.rescueNum.value >= 0 || battleResult.evacuateNum.value >= 0) {
      content = content.replace('【抢救人数+疏散人数】', battleResult.rescueNum.value + battleResult.evacuateNum.value)
    }
    else {
      content = content.replace('【抢救人数+疏散人数】', 0)
    }
    if (battleResult.emergencyNum.value || battleResult.emergencyNum.value === 0) {
      content = content.replace('【抢救财产价值】', battleResult.emergencyNum.value)
    }
    if (battleResult.protectNum.value || battleResult.protectNum.value === 0) {
      content = content.replace('【保护财产价值】', battleResult.protectNum.value)
    }
    if (basicInformation.notDealReason.value) {
      content = content.replace('【未处置原因】', basicInformation.notDealReason.value)
    }
    if (basicInformation.midwayReturnDate.value) {
      content = content.replace('【中返时间】', dayjs(basicInformation.midwayReturnDate.value).format('MM月DD日HH时mm分'))
    }
    if (basicInformation.returnDate.value) {
      content = content.replace('【归队时间】', dayjs(basicInformation.returnDate.value).format('MM月DD日HH时mm分'))
    }
    if (casualtyWar.deadList?.length > 0 || casualtyWar.injuredList?.length > 0) {
      content = content.replace('【亡人数】', casualtyWar.deadList?.length || 0)
      content = content.replace('【伤人数】', casualtyWar.injuredList?.length || 0)
    }
    else {
      content = content.replace('造成参战人员【亡人数】死【伤人数】伤。', '')
    }
    content = content.replaceAll(/【[^【】]*】/g, 'xx')
    form.value.disposalProcess.fireProcess.value = content
  }

  // 当警情类型、参战形式、处置情况，发生变化时重置表单，避免无用数据提交到后端
  const initFormWhenChange = (draft) => {
    form.value.fireInfo = cloneDeep(formOrigin.fireInfo)
    if (draft) {
      form.value.draftInfo.draftName.value = ''
    }
    form.value.basicInformation.dispatchDate.value = ''
    form.value.basicInformation.midwayReturnDate.value = ''
    form.value.basicInformation.attendanceDate.value = ''
    form.value.basicInformation.attendanceDate.warning = false
    form.value.basicInformation.carryoutDate.value = ''
    form.value.basicInformation.waterflowDate.value = ''
    form.value.basicInformation.controllingDate.value = ''
    form.value.basicInformation.washDate.value = ''
    form.value.basicInformation.extinctDate.value = ''
    form.value.basicInformation.endDate.value = ''
    form.value.basicInformation.evacuateDate.value = ''
    form.value.basicInformation.returnDate.value = ''
    form.value.basicInformation.dealEndDate.value = ''
    form.value.basicInformation.returnLateReason.value = undefined
    // form.value.basicInformation.dealSituation.value = '2023020800260'
    form.value.basicInformation.notDealReason.value = ''
    form.value.basicInformation.fireDistance.value = ''
    form.value.basicInformation.fireDistance.warning = false
    form.value.basicInformation.fireSituation.value = undefined
    form.value.basicInformation.trappedPerson.value = ''
    form.value.basicInformation.trappedPerson.warning = false
    form.value.basicInformation.industryDepartment.value = undefined
    form.value.basicInformation.isBlocking.value = '2'
    form.value.basicInformation.blockingTime.value = ''
    // form.value.basicInformation.isPublicFireHydrant.value = '2'
    // form.value.basicInformation.fireHydrantSituation.value = undefined
    // form.value.basicInformation.fixedFireEquipment.value = undefined
    // form.value.basicInformation.notUseFireHydrantReason.value = undefined
    form.value.basicInformation.fieldWarning = formOrigin.basicInformation.fieldWarning
    form.value.basicInfoHead = {
      ...cloneDeep(formOrigin.basicInfoHead),
      fieldAnnotation: form.value.basicInfoHead.fieldAnnotation,
      fieldWarning: formOrigin.basicInfoHead.fieldWarning,
    }
    form.value.personInfo = {
      ...cloneDeep(formOrigin.personInfo),
      fieldAnnotation: form.value.personInfo.fieldAnnotation,
      fieldWarning: formOrigin.personInfo.fieldWarning,
    }
    form.value.commandMode = {
      ...cloneDeep(formOrigin.commandMode),
      fieldAnnotation: form.value.commandMode.fieldAnnotation,
      fieldWarning: formOrigin.commandMode.fieldWarning,
    }
    form.value.commandProcess = {
      ...cloneDeep(formOrigin.commandProcess),
      fieldAnnotation: form.value.commandProcess.fieldAnnotation,
      fieldWarning: formOrigin.commandProcess.fieldWarning,
    }
    form.value.deployEquipment = {
      ...cloneDeep(formOrigin.deployEquipment),
      fieldAnnotation: form.value.deployEquipment.fieldAnnotation,
      fieldWarning: formOrigin.deployEquipment.fieldWarning,
    }
    form.value.investForce = {
      ...cloneDeep(formOrigin.investForce),
      fieldAnnotation: form.value.investForce.fieldAnnotation,
      fieldWarning: formOrigin.investForce.fieldWarning,
    }
    form.value.casualtyWar = {
      ...cloneDeep(formOrigin.casualtyWar),
      fieldAnnotation: form.value.casualtyWar.fieldAnnotation,
      fieldWarning: formOrigin.casualtyWar.fieldWarning,
    }
    form.value.battleResult = {
      ...cloneDeep(formOrigin.battleResult),
      fieldAnnotation: form.value.battleResult.fieldAnnotation,
      fieldWarning: formOrigin.battleResult.fieldWarning,
    }
    form.value.battleConsume = {
      ...cloneDeep(formOrigin.battleConsume),
      fieldAnnotation: form.value.battleConsume.fieldAnnotation,
      fieldWarning: formOrigin.battleConsume.fieldWarning,
    }
    if (draft) {
      form.value.disposalProcess = {
        ...cloneDeep(formOrigin.disposalProcess),
        fieldAnnotation: form.value.disposalProcess.fieldAnnotation,
        fieldWarning: formOrigin.disposalProcess.fieldWarning,
      }
    }
    form.value.scenePhoto = {
      ...cloneDeep(formOrigin.scenePhoto),
      fieldAnnotation: form.value.scenePhoto.fieldAnnotation,
      fieldWarning: formOrigin.scenePhoto.fieldWarning,
    }
    form.value.otherAttach = {
      ...cloneDeep(formOrigin.otherAttach),
      fieldAnnotation: form.value.otherAttach.fieldAnnotation,
      fieldWarning: formOrigin.otherAttach.fieldWarning,
    }
  }

  // 校验表单规则是否需要显示 warning 提示
  const checkFormField = (warningDetail, nationTeamFlag) => {
    if (warningDetail?.warningStatusValue === '已归档') {
      return
    }

    checkDispatchNum(form.value, false, nationTeamFlag)

    checkFireDistance(form.value, false)

    checkTrappedPerson(warningDetail, form.value, false)

    checkAttendanceDate(form.value, false)

    checkIsResponseTruck(form.value, false)

    checkReturnSpeed(form.value)
  }

  // 根据详情初始化表单，用于回显
  const initFormByDetail = (detail, options, callback, warningDetail, { nationTeamFlag }) => {
    const {
      fireDispatch,
      fireDispatchItem,
      fireDispatchTruckList,
      fireDispatchZfList,
      fireDispatchLinkList,
      fireDispatchOtherList,
      fireDispatchInjuryList,
      fireDispatchLoss,
      fireDispatchHeadPerson,
      fireDispatchHead,
      // fireDispatchTruck,
      fireDispatchTruckVO,
      fireDispatchRetrunTruckList,
      fireDispatchTransferVOList,
    } = detail
    // 草稿信息
    form.value.draftInfo.draftName.value = fireDispatch?.draftName
    if (fireDispatch?.warningType || warningDetail?.warningType) {
      form.value.draftInfo.warningType.value = fireDispatch?.warningType?.split(',') || warningDetail?.warningType?.split(',')
      if (form.value.draftInfo.warningType.value) {
        form.value.draftInfo.warningType.text = getTypeText(form.value.draftInfo.warningType.value, options.warningType)
      }
    }
    form.value.draftInfo.partakeType.value = fireDispatch?.partakeType || fireDispatch?.dispatchTypeValue
    // 简要情况
    form.value.basicInformation.dispatchDate.value = fireDispatch?.dispatchDate && dayjs(fireDispatch?.dispatchDate)
    form.value.basicInformation.midwayReturnDate.value = fireDispatch?.midwayReturnDate && dayjs(fireDispatch?.midwayReturnDate)
    form.value.basicInformation.attendanceDate.value = fireDispatch?.attendanceDate && dayjs(fireDispatch?.attendanceDate)
    form.value.basicInformation.carryoutDate.value = fireDispatch?.carryoutDate && dayjs(fireDispatch?.carryoutDate)
    form.value.basicInformation.waterflowDate.value = fireDispatch?.waterflowDate && dayjs(fireDispatch?.waterflowDate)
    form.value.basicInformation.controllingDate.value = fireDispatch?.controllingDate && dayjs(fireDispatch?.controllingDate)
    form.value.basicInformation.washDate.value = fireDispatch?.washDate && dayjs(fireDispatch?.washDate)
    form.value.basicInformation.extinctDate.value = fireDispatch?.extinctDate && dayjs(fireDispatch?.extinctDate)
    form.value.basicInformation.endDate.value = fireDispatch?.endDate && dayjs(fireDispatch?.endDate)
    form.value.basicInformation.evacuateDate.value = fireDispatch?.evacuateDate && dayjs(fireDispatch?.evacuateDate)
    form.value.basicInformation.returnDate.value = fireDispatch?.returnDate && dayjs(fireDispatch?.returnDate)
    form.value.basicInformation.dealEndDate.value = fireDispatch?.dealEndDate && dayjs(fireDispatch?.dealEndDate)
    form.value.basicInformation.returnLateReason.value = fireDispatch?.returnLateReason
    // 基本信息
    form.value.basicInformation.dealSituation.value = fireDispatch?.dealSituation
    if (fireDispatch?.dealSituation) {
      const filter = options.dealSituation.filter(item => fireDispatch?.dealSituation === item.boDictId)
      form.value.basicInformation.dealSituation.text = filter[0] ? filter[0].dictName : ''
    }
    form.value.basicInformation.notDealReason.value = fireDispatch?.notDealReason
    form.value.basicInformation.fireSituation.value = fireDispatchItem?.fireSituation
    if (fireDispatchItem?.fireSituation) {
      const filter = options.fireSituation.filter(item => fireDispatchItem?.fireSituation === item.boDictId)
      form.value.basicInformation.fireSituation.text = filter[0] ? filter[0].dictName : ''
    }
    form.value.basicInformation.industryDepartment.value = fireDispatchItem?.industryDepartment
    form.value.basicInformation.fireDistance.value = fireDispatchItem?.fireDistance
    form.value.basicInformation.trappedPerson.value = fireDispatchItem?.trappedPerson
    form.value.basicInformation.isBlocking.value = fireDispatchItem?.isBlocking
    form.value.basicInformation.blockingTime.value = fireDispatchItem?.blockingTime
    // form.value.basicInformation.isPublicFireHydrant.value = fireDispatchItem?.isPublicFireHydrant
    // form.value.basicInformation.fireHydrantSituation.value = fireDispatchItem?.fireHydrantSituation
    // form.value.basicInformation.fixedFireEquipment.value = fireDispatchItem?.fixedFireEquipment
    // form.value.basicInformation.notUseFireHydrantReason.value = fireDispatchItem?.notUseFireHydrantReason
    // 基本信息-全勤指挥部
    // form.value.basicInfoHead.headquarterName.value = fireDispatch?.headquarterName
    form.value.basicInfoHead.dispatchDate.value = fireDispatch?.dispatchDate && dayjs(fireDispatch?.dispatchDate)
    form.value.basicInfoHead.attendanceDate.value = fireDispatch?.attendanceDate && dayjs(fireDispatch?.attendanceDate)
    form.value.basicInfoHead.evacuateDate.value = fireDispatch?.evacuateDate && dayjs(fireDispatch?.evacuateDate)
    form.value.basicInfoHead.midwayReturnDate.value = fireDispatch?.midwayReturnDate && dayjs(fireDispatch?.midwayReturnDate)
    form.value.basicInfoHead.returnDate.value = fireDispatch?.returnDate && dayjs(fireDispatch?.returnDate)
    form.value.basicInfoHead.personNum.value = fireDispatchHead?.personNum
    form.value.basicInfoHead.truckNum.value = fireDispatchHead?.truckNum
    form.value.basicInfoHead.commandTime.value = fireDispatchHead?.commandTime
    form.value.basicInfoHead.presentFlag.value = fireDispatchHead?.presentFlag
    // 人员信息
    form.value.personInfo.headLeader.value = fireDispatchHeadPerson?.headLeader?.split(',')
    form.value.personInfo.commandCenter.value = fireDispatchHeadPerson?.commandCenter?.split(',')
    form.value.personInfo.chiefCommander.value = fireDispatchHeadPerson?.chiefCommander?.split(',')
    form.value.personInfo.deputyCommander.value = fireDispatchHeadPerson?.deputyCommander?.split(',')
    form.value.personInfo.commander.value = fireDispatchHeadPerson?.commander?.split(',')
    form.value.personInfo.commandAssistant.value = fireDispatchHeadPerson?.commandAssistant?.split(',')
    form.value.personInfo.messageAssistant.value = fireDispatchHeadPerson?.messageAssistant?.split(',')
    form.value.personInfo.messenger.value = fireDispatchHeadPerson?.messenger?.split(',')
    form.value.personInfo.headSupport.value = fireDispatchHeadPerson?.headSupport?.split(',')
    form.value.personInfo.headPolitic.value = fireDispatchHeadPerson?.headPolitic?.split(',')
    form.value.personInfo.newsPropagation.value = fireDispatchHeadPerson?.newsPropagation?.split(',')
    form.value.personInfo.technicianGroup.value = fireDispatchHeadPerson?.technicianGroup?.split(',')
    if (fireDispatchHeadPerson?.headerPersonList) {
      form.value.personInfo.commandLeader = fireDispatchHeadPerson.headerPersonList?.map((item) => {
        return {
          ...item,
          headerName: item.header
            ? generateByKeyValue(item.headerName, item.header, {
              key: 'userName',
              value: 'boFireUserId',
            })
            : [],
        }
      })
    }
    if (fireDispatchHeadPerson?.technician) {
      form.value.personInfo.haveProfessor.value = '1'
      const list = fireDispatchHeadPerson?.technician?.split(',')
      form.value.personInfo.technician = list.map((item) => {
        return { name: item }
      })
    }
    form.value.personInfo.otherMember.value = fireDispatchHeadPerson?.otherMember?.split(',')
    // 指挥方式
    form.value.commandMode.commandMethod.value = fireDispatchHead?.commandMethod
    // 指挥过程
    form.value.commandProcess.rescueMethod.value = fireDispatchHead?.rescueMethod
    form.value.commandProcess.actionPlan.value = fireDispatchHead?.actionPlan
    form.value.commandProcess.commandProcess.value = fireDispatchHead?.commandProcess
    // 出动装备
    form.value.deployEquipment.headTruckList.value = fixCarInfo(fireDispatchTruckVO?.headTruckList)
    form.value.deployEquipment.boardingTruckList.value = fixCarInfo(fireDispatchTruckVO?.boardingTruckList)
    form.value.deployEquipment.kitchenTruckList.value = fixCarInfo(fireDispatchTruckVO?.kitchenTruckList)
    form.value.deployEquipment.toiletTruckList.value = fixCarInfo(fireDispatchTruckVO?.toiletTruckList)
    form.value.deployEquipment.refrigerateTruckZqList.value = fixCarInfo(fireDispatchTruckVO?.refrigerateTruckZqList)
    form.value.deployEquipment.airfeedTruckList.value = fixCarInfo(fireDispatchTruckVO?.airfeedTruckList)
    form.value.deployEquipment.oilTruckList.value = fixCarInfo(fireDispatchTruckVO?.oilTruckList)
    form.value.deployEquipment.steamThawingTruckList.value = fixCarInfo(fireDispatchTruckVO?.steamThawingTruckList)
    form.value.deployEquipment.foamTransferTruckList.value = fixCarInfo(fireDispatchTruckVO?.foamTransferTruckList)
    form.value.deployEquipment.wreckTruckList.value = fixCarInfo(fireDispatchTruckVO?.wreckTruckList)
    form.value.deployEquipment.modularTruckList.value = fixCarInfo(fireDispatchTruckVO?.modularTruckList)
    form.value.deployEquipment.mobileCommunicateTruckList.value = fixCarInfo(fireDispatchTruckVO?.mobileCommunicateTruckList)
    form.value.deployEquipment.communicateEquipTruckList.value = fixCarInfo(fireDispatchTruckVO?.communicateEquipTruckList)
    form.value.deployEquipment.quietCommunicateTruckList.value = fixCarInfo(fireDispatchTruckVO?.quietCommunicateTruckList)
    form.value.deployEquipment.satellitePhone.value = fireDispatchHead?.satellitePhone || 0
    form.value.deployEquipment.satellitePortableStation.value = fireDispatchHead?.satellitePortableStation || 0
    form.value.deployEquipment.singleSoldier.value = fireDispatchHead?.singleSoldier || 0
    // form.value.deployEquipment.uav.value = fireDispatchHead?.uav || 0
    form.value.deployEquipment.clothControl.value = fireDispatchHead?.clothControl || 0
    form.value.deployEquipment.meshStation.value = fireDispatchHead?.meshStation || 0
    form.value.deployEquipment.microwaveGraph.value = fireDispatchHead?.microwaveGraph || 0
    form.value.deployEquipment.beidouTerminal.value = fireDispatchHead?.beidouTerminal || 0
    // 气象信息
    form.value.basicInformation.temperature.value = fireDispatch?.temperature
    form.value.basicInformation.weather.value = fireDispatch?.weather
    form.value.basicInformation.wind.value = fireDispatch?.wind
    form.value.basicInformation.windDirection.value = fireDispatch?.windDirection
    // 投入力量
    form.value.investForce.groupLeader.value = fireDispatchItem?.groupLeader?.split(',')
    form.value.investForce.commanderNum.value = fireDispatchItem?.commanderNum
    form.value.investForce.firemenNum.value = fireDispatchItem?.firemenNum
    if (fireDispatchItem?.commander) {
      form.value.investForce.commander.value = generateByKeyValue(fireDispatchItem?.commanderName, fireDispatchItem?.commander, {
        key: 'userName',
        value: 'boFireUserId',
      })
    }
    if (fireDispatchItem?.firemen) {
      form.value.investForce.firemen.value = generateByKeyValue(fireDispatchItem?.firemenName, fireDispatchItem?.firemen, {
        key: 'userName',
        value: 'boFireUserId',
      })
    }
    form.value.investForce.isResponseTruck.value = fireDispatchItem?.isResponseTruck
    if (fireDispatchTruckList && fireDispatchTruckList.length > 0) {
      form.value.investForce.dispatchTruckList.value = fixCarInfo(fireDispatchTruckList)
    }
    form.value.investForce.isReturnTruck.value = fireDispatchItem?.isReturnTruck || '2'
    if (fireDispatchRetrunTruckList && fireDispatchRetrunTruckList.length > 0) {
      form.value.investForce.midwayCar.list = fixCarInfo(fireDispatchRetrunTruckList)
      form.value.investForce.midwayCar.value = form.value.investForce.midwayCar.list?.map(item => item.boFireTruckId)
    }
    form.value.investForce.fireBoatNum.value = fireDispatchItem?.fireBoatNum
    form.value.investForce.fireAirplaneNum.value = fireDispatchItem?.fireAirplaneNum
    form.value.investForce.rescueDogNum.value = fireDispatchItem?.rescueDogNum
    form.value.investForce.uavNum.value = fireDispatchItem?.uavNum
    // 政府指挥
    form.value.investForce.isCommand.value = fireDispatchZfList && fireDispatchZfList.length > 0 ? '1' : '2'
    form.value.investForce.fireDispatchZfList = fireDispatchZfList?.map(item => item)
    // 联动单位
    form.value.investForce.haveLinkageUnit.value = fireDispatchLinkList && fireDispatchLinkList.length > 0 ? '1' : '2'
    form.value.investForce.fireDispatchLinkList = fireDispatchLinkList?.map(item => item)
    // 其他消防救援力量
    if (fireDispatchOtherList && fireDispatchOtherList.length > 0) {
      const volunteers = fireDispatchOtherList.filter(item => item.otherType === '1')
      const others = fireDispatchOtherList.filter(item => item.otherType === '2')
      form.value.investForce.haveVolunteer.value = volunteers && volunteers.length > 0 ? '1' : '2'
      form.value.investForce.volunteerList = volunteers.map((item) => {
        return {
          ...item,
          orgName1: item.orgName,
        }
      })
      form.value.investForce.haveProfessional.value = others && others.length > 0 ? '1' : '2'
      form.value.investForce.otherList = others
    }
    // 主要战术措施
    form.value.basicInformation.isInside.value = fireDispatchItem?.isInside
    form.value.basicInformation.fireTechnic.value = fireDispatchItem?.fireTechnic
    form.value.basicInformation.rescueMeasures.value = fireDispatchItem?.rescueMeasures
    form.value.basicInformation.deliverWater.value = fireDispatchItem?.deliverWater
    form.value.basicInformation.drainWater.value = fireDispatchItem?.drainWater
    form.value.basicInformation.killArea.value = fireDispatchItem?.killArea
    // 参战伤亡
    if (fireDispatchInjuryList && fireDispatchInjuryList.length > 0) {
      const injureds = fireDispatchInjuryList.filter(item => item.injuryType === '1')
      const deads = fireDispatchInjuryList.filter(item => item.injuryType === '2')
      form.value.casualtyWar.isInjured.value = injureds && injureds.length ? '1' : '2'
      form.value.casualtyWar.injuredList = injureds.map((item) => {
        return {
          ...item,
          nameIds: item.boFireUserId,
          name: nationTeamFlag ? { value: item.boFireUserId, label: item.name, boFireUserId: item.boFireUserId, userName: item.name } : item.name,
          teamEntryTime: item.teamEntryTime ? dayjs(item.teamEntryTime) : undefined,
          rescueRank: item.rescueRank?.split(','),
          duty: item.duty,
          nativePlace: item.nativePlace?.split(','),
        }
      })
      form.value.casualtyWar.isDead.value = deads && deads.length ? '1' : '2'
      form.value.casualtyWar.deadList = deads.map((item) => {
        return {
          ...item,
          nameIds: item.boFireUserId,
          name: nationTeamFlag ? { value: item.boFireUserId, label: item.name, boFireUserId: item.boFireUserId, userName: item.name } : item.name,
          teamEntryTime: item.teamEntryTime ? dayjs(item.teamEntryTime) : undefined,
          rescueRank: item.rescueRank?.split(','),
          duty: item.duty,
          nativePlace: item.nativePlace?.split(','),
          deathDate: item.deathDate ? dayjs(item.deathDate) : undefined,
        }
      })
    }
    // 战斗成果
    form.value.battleResult.rescueNum.value = fireDispatchItem?.rescueNum
    form.value.battleResult.surviveNum.value = fireDispatchItem?.surviveNum
    form.value.battleResult.deathNum.value = fireDispatchItem?.deathNum
    form.value.battleResult.evacuateNum.value = fireDispatchItem?.evacuateNum
    form.value.battleResult.transferNum.value = fireDispatchItem?.transferNum
    form.value.battleResult.emergencyNum.value = fireDispatchItem?.emergencyNum
    form.value.battleResult.protectNum.value = fireDispatchItem?.protectNum
    // 战斗消耗
    if (fireDispatchLoss?.wastageTruck && fireDispatchLoss?.wastageTruck !== '') {
      form.value.battleConsume.wastageTruck.value = fireDispatchLoss?.wastageTruck?.split(',')
    }
    form.value.battleConsume.wastageTruckExplain.value = fireDispatchLoss?.wastageTruckExplain
    form.value.battleConsume.fuel.value = fireDispatchLoss?.fuel
    form.value.battleConsume.waterPump.value = fireDispatchLoss?.waterPump
    form.value.battleConsume.hoseReel.value = fireDispatchLoss?.hoseReel
    form.value.battleConsume.fireGun.value = fireDispatchLoss?.fireGun
    form.value.battleConsume.airForm.value = fireDispatchLoss?.airForm
    form.value.battleConsume.formTank.value = fireDispatchLoss?.formTank
    form.value.battleConsume.ladder.value = fireDispatchLoss?.ladder
    form.value.battleConsume.waterBand.value = fireDispatchLoss?.waterBand
    form.value.battleConsume.fireHydrantHandle.value = fireDispatchLoss?.fireHydrantHandle
    form.value.battleConsume.waterGun.value = fireDispatchLoss?.waterGun
    form.value.battleConsume.waterMainfold.value = fireDispatchLoss?.waterMainfold
    form.value.battleConsume.entryTool.value = fireDispatchLoss?.entryTool
    form.value.battleConsume.fireExtinguisher.value = fireDispatchLoss?.fireExtinguisher
    form.value.battleConsume.firePump.value = fireDispatchLoss?.firePump
    form.value.battleConsume.fireHat.value = fireDispatchLoss?.fireHat
    form.value.battleConsume.protectiveSuit.value = fireDispatchLoss?.protectiveSuit
    form.value.battleConsume.fireGlove.value = fireDispatchLoss?.fireGlove
    form.value.battleConsume.lapBelt.value = fireDispatchLoss?.lapBelt
    form.value.battleConsume.protectiveBoots.value = fireDispatchLoss?.protectiveBoots
    form.value.battleConsume.fireRebreather.value = fireDispatchLoss?.fireRebreather
    form.value.battleConsume.fireLight.value = fireDispatchLoss?.fireLight
    form.value.battleConsume.fireRescuer.value = fireDispatchLoss?.fireRescuer
    form.value.battleConsume.positionLamp.value = fireDispatchLoss?.positionLamp
    form.value.battleConsume.safetyRope.value = fireDispatchLoss?.safetyRope
    form.value.battleConsume.fireAxe.value = fireDispatchLoss?.fireAxe
    form.value.battleConsume.interphone.value = fireDispatchLoss?.interphone
    form.value.battleConsume.transferImage.value = fireDispatchLoss?.transferImage
    form.value.battleConsume.uav.value = fireDispatchLoss?.uav
    form.value.battleConsume.foamLiquid.value = fireDispatchLoss?.foamLiquid
    form.value.battleConsume.dryPowder.value = fireDispatchLoss?.dryPowder
    form.value.battleConsume.carbonDioxide.value = fireDispatchLoss?.carbonDioxide
    form.value.battleConsume.haloalkane.value = fireDispatchLoss?.haloalkane
    form.value.battleConsume.totalFlow.value = fireDispatchLoss?.totalFlow
    form.value.battleConsume.firefightingWater.value = fireDispatchLoss?.firefightingWater
    form.value.battleConsume.coolingWater.value = fireDispatchLoss?.coolingWater
    form.value.battleConsume.totalWater.value = fireDispatchLoss?.totalWater
    form.value.battleConsume.waterInterrupt.value = fireDispatchLoss?.waterInterrupt
    form.value.battleConsume.waterDamage.value = fireDispatchLoss?.waterDamage
    form.value.battleConsume.fireDispatchLossOtherList = fireDispatchLoss?.fireDispatchLossOtherList
    if (fireDispatchLoss?.fireDispatchLossOtherList?.length > 0) {
      const equipments = fireDispatchLoss?.fireDispatchLossOtherList.filter(item => item.otherType === '1')
      form.value.battleConsume.lossOtherEquipments = equipments.map((item) => {
        return {
          otherName: item.otherName,
          otherAmount: item.otherAmount,
        }
      })
      const personal = fireDispatchLoss?.fireDispatchLossOtherList.filter(item => item.otherType === '2')
      form.value.battleConsume.lossOtherPersonal = personal.map((item) => {
        return {
          otherName: item.otherName,
          otherAmount: item.otherAmount,
        }
      })
      const agent = fireDispatchLoss?.fireDispatchLossOtherList.filter(item => item.otherType === '3')
      form.value.battleConsume.lossOtherAgent = agent.map((item) => {
        return {
          otherName: item.otherName,
          otherAmount: item.otherAmount,
        }
      })
    }
    // 处置经过
    form.value.disposalProcess.fireProcess.value = fireDispatchItem?.fireProcess
    // 流程流转
    form.value.proSteps.fireDispatchTransferVOList.value = fireDispatchTransferVOList
    checkFormField(warningDetail, nationTeamFlag)

    callback()
  }

  // 校验是否对异常项进行批注
  const checkFieldWarning = (fields) => {
    let warning = ''
    const keys = []
    let result = false
    Object.keys(form.value).forEach((item) => {
      if (form.value[item].fieldWarning) {
        warning += form.value[item].fieldWarning
      }
    })
    warning = warning.split(';')
    warning.forEach((temp) => {
      if (temp.includes('true')) {
        keys.push(temp.slice(0, temp.indexOf(':')))
      }
    })
    const current = Object.keys(fields).join(',')
    keys.forEach((temp) => {
      if (!current.includes(temp)) {
        result = true
      }
    })
    return result
  }

  return { form, initFormWhenChange, initFormByDetail, checkFieldWarning, generateRemarkField }
}
