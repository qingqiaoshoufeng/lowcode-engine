import { nextTick, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
// import { checkAttendanceDate, checkDispatchNum, checkFireDistance, checkIsResponseTruck, checkReturnSpeed, checkTrappedPerson } from './_tool.js'
import { fixCarInfo, getTypeText } from '@/utils/tools.js'
import { nonZeroPositiveInteger, nonnegativeNumberReg, positiveIntegerReg } from '@/utils/validate.js'

export const useFormConfig = () => {
  const formOrigin = {
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
      presentSpeed: { // 到场时速（公里/小时）
        value: '',
        rules: [{ required: false, message: '' }],
      },
      returnLateReason: { // 到场时速异常原因
        value: undefined,
        rules: [{ required: true, message: '请选择到场时速异常原因' }],
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
      deliverWater: { // 送水量（吨）
        value: '',
        rules: [
          { required: true, message: '请输入送水量' },
          { pattern: nonnegativeNumberReg, message: '请输入正确送水量' },
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
        rules: [{ required: true, message: '请选择是否有车辆出动' }],
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
        value: undefined,
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
      uav: { // 无人机（架）
        value: 0,
        rules: [
          { required: true, message: '请输入无人机数量' },
          { pattern: positiveIntegerReg, message: '请输入正确无人机数量' },
        ],
      },
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
      fieldWarning: 'commander:false;firemen:false;isResponseTruck:false;',
      groupLeader: { // 带队指挥员
        value: undefined,
        rules: [{ required: true, message: '请选择带队指挥员' }],
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
        value: '2',
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
          { pattern: positiveIntegerReg, message: '请输入正确艇数' },
        ],
      },
      fireAirplaneNum: { // 消防直升机（架）
        value: '',
        rules: [
          // { required: true, message: '请输入消防直升机数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防直升机数量' },
        ],
      },
      rescueDogNum: { // 搜救犬（只）
        value: '',
        rules: [
          // { required: true, message: '请输入搜救犬数量' },
          { pattern: positiveIntegerReg, message: '请输入正确搜救犬数量' },
        ],
      },
      uavNum: { // 无人机（架）
        value: '',
        rules: [
          // { required: true, message: '请输入无人机数量' },
          { pattern: positiveIntegerReg, message: '请输入正确无人机数量' },
        ],
      },
      // governmentCommand: { // 政府指挥
      //   title: '政府指挥',
      isCommand: { // 是否有政府指挥
        value: '2',
        rules: [{ required: true, message: '请选择是否有政府指挥' }],
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
        rules: [{ required: true, message: '请输入人员姓名' }],
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
          { pattern: positiveIntegerReg, message: '请输入正确疏散人数' },
        ],
      },
      transferNum: { // 转移（人）
        value: '',
        rules: [
          // { required: true, message: '请输入转移人数' },
          { pattern: positiveIntegerReg, message: '请输入正确转移人数' },
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
          { pattern: positiveIntegerReg, message: '请输入正确机动消防泵数量' },
        ],
      },
      hoseReel: { // 移动式水带卷盘或水带槽（个）
        value: '',
        rules: [
          // { required: true, message: '请输入移动式水带卷盘或水带槽数量' },
          { pattern: positiveIntegerReg, message: '请输入正确移动式水带卷盘或水带槽数量' },
        ],
      },
      fireGun: { // 移动式消防炮（个）
        value: '',
        rules: [
          // { required: true, message: '请输入移动式消防炮数量' },
          { pattern: positiveIntegerReg, message: '请输入正确移动式消防炮数量' },
        ],
      },
      airForm: { // 空气泡沫枪（个）
        value: '',
        rules: [
          // { required: true, message: '请输入空气泡沫枪数量' },
          { pattern: positiveIntegerReg, message: '请输入正确空气泡沫枪数量' },
        ],
      },
      formTank: { // 泡沫液桶（个）
        value: '',
        rules: [
          // { required: true, message: '请输入泡沫液桶数量' },
          { pattern: positiveIntegerReg, message: '请输入正确泡沫液桶数量' },
        ],
      },
      ladder: { // 梯子（把）
        value: '',
        rules: [
          // { required: true, message: '请输入梯子数量' },
          { pattern: positiveIntegerReg, message: '请输入正确梯子数量' },
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
          { pattern: positiveIntegerReg, message: '请输入正确消防栓扳手数量' },
        ],
      },
      waterGun: { // 水枪（个）
        value: '',
        rules: [
          // { required: true, message: '请输入水枪数量' },
          { pattern: positiveIntegerReg, message: '请输入正确水枪数量' },
        ],
      },
      waterMainfold: { // 分水器（只）
        value: '',
        rules: [
          // { required: true, message: '请输入分水器数量' },
          { pattern: positiveIntegerReg, message: '请输入正确分水器数量' },
        ],
      },
      entryTool: { // 破拆工具（个）
        value: '',
        rules: [
          // { required: true, message: '请输入破拆工具数量' },
          { pattern: positiveIntegerReg, message: '请输入正确破拆工具数量' },
        ],
      },
      fireExtinguisher: { // 灭火机（只）
        value: '',
        rules: [
          // { required: true, message: '请输入灭火机数量' },
          { pattern: positiveIntegerReg, message: '请输入正确灭火机数量' },
        ],
      },
      firePump: { // 手抬泵（个）
        value: '',
        rules: [
          // { required: true, message: '请输入手抬泵数量' },
          { pattern: positiveIntegerReg, message: '请输入正确手抬泵数量' },
        ],
      },
      fireHat: { // 消防头盔（个）
        value: '',
        rules: [
          // { required: true, message: '请输入消防头盔数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防头盔数量' },
        ],
      },
      protectiveSuit: { // 消防员灭火防护服（套）
        value: '',
        rules: [
          // { required: true, message: '请输入消防员灭火防护服数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防员灭火防护服数量' },
        ],
      },
      fireGlove: { // 消防手套（副）
        value: '',
        rules: [
          // { required: true, message: '请输入消防手套数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防手套数量' },
        ],
      },
      lapBelt: { // 消防安全腰带（根）
        value: '',
        rules: [
          // { required: true, message: '请输入消防安全腰带数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防安全腰带数量' },
        ],
      },
      protectiveBoots: { // 消防员灭火防护靴（双）
        value: '',
        rules: [
          // { required: true, message: '请输入消防员灭火防护靴数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防员灭火防护靴数量' },
        ],
      },
      fireRebreather: { // 双正式压消防空气呼吸器（个）
        value: '',
        rules: [
          // { required: true, message: '请输入双正式压消防空气呼吸器数量' },
          { pattern: positiveIntegerReg, message: '请输入正确双正式压消防空气呼吸器数量' },
        ],
      },
      fireLight: { // 佩戴式防爆照灯（个）
        value: '',
        rules: [
          // { required: true, message: '请输入佩戴式防爆照灯数量' },
          { pattern: positiveIntegerReg, message: '请输入正确佩戴式防爆照灯数量' },
        ],
      },
      fireRescuer: { // 消防员呼救器（个）
        value: '',
        rules: [
          // { required: true, message: '请输入消防员呼救器数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防员呼救器数量' },
        ],
      },
      positionLamp: { // 方位灯（个）
        value: '',
        rules: [
          // { required: true, message: '请输入方位灯数量' },
          { pattern: positiveIntegerReg, message: '请输入正确方位灯数量' },
        ],
      },
      safetyRope: { // 消防安全绳（根）
        value: '',
        rules: [
          // { required: true, message: '请输入消防安全绳数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防安全绳数量' },
        ],
      },
      fireAxe: { // 消防腰斧（个）
        value: '',
        rules: [
          // { required: true, message: '请输入消防腰斧数量' },
          { pattern: positiveIntegerReg, message: '请输入正确消防腰斧数量' },
        ],
      },
      interphone: { // 对讲机（个）
        value: '',
        rules: [
          // { required: true, message: '请输入对讲机数量' },
          { pattern: positiveIntegerReg, message: '请输入正确对讲机数量' },
        ],
      },
      transferImage: { // 图传（个）
        value: '',
        rules: [
          // { required: true, message: '请输入图传数量' },
          { pattern: positiveIntegerReg, message: '请输入正确图传数量' },
        ],
      },
      uav: { // 无人机（架）
        value: '',
        rules: [
          // { required: true, message: '请输入无人机数量' },
          { pattern: positiveIntegerReg, message: '请输入正确无人机数量' },
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
          { pattern: positiveIntegerReg, message: '请输入正确无故供水中断次数' },
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
  }

  const form = ref(cloneDeep(formOrigin))

  return { form }
}
