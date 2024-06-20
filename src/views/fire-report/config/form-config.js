import { nextTick, ref, watch } from 'vue'
import { Form } from '@castle/ant-design-vue'
import dayjs from 'dayjs'
import { cloneDeep, pickBy, toArray } from 'lodash-es'
import { checkAffectedHouse, checkBurnedArea, checkFireDisposalCost, checkFireInjuryCost, checkFireResistanceRating } from './tool.js'
import { nonZeroPositiveInteger, nonnegativeNumberReg, positiveIntegerReg } from '@/utils/validate.js'
import { getTypeText } from '@/utils/tools.js'

const useForm = Form.useForm

export const useFormConfig = (validateProgress) => {
  const formOrigin = {
    fireInfo: {
      title: '警情信息',
      fieldAnnotation: false, // 批注
    },
    briefSituation: {
      title: '简要情况',
      fieldAnnotation: false, // 批注
      content: {
        value: '',
      },
    },
    basicInfo: {
      title: '基本信息',
      fieldAnnotation: false, // 批注
      fieldWarning: 'burnedArea:false;',
      draftName: { // 草稿名称
        value: '',
        rules: [{ required: true, message: '请输入草稿名称' }],
      },
      severity: { // 严重程度
        value: undefined,
        rules: [{ required: true, message: '请选择严重程度' }],
      },
      noDispatchArea: { // 行政区域
        value: undefined,
        rules: [{ required: true, message: '请选择行政区域' }],
      },
      fireDate: { // 起火时间
        value: '',
        rules: [{ required: true, message: '' }],
      },
      fireDirection: { // 火灾地址
        value: '',
        rules: [{ required: true, message: '请输入火灾地址' }],
      },
      area: { // 区域
        value: undefined,
        text: '',
        rules: [{ required: true, message: '请选择区域' }],
      },
      isUrbanVillages: { // 是否为城中村
        value: undefined,
        // rules: [{ required: true, message: '请选择是否为城中村' }],
      },
      otherArea: { // 其他类型
        value: undefined,
        // rules: [{ required: true, message: '请选择其他类型' }],
      },
      fireOrgname: { // 单位/户主名
        value: '',
        rules: [{ required: true, message: '请输入单位/户主名' }],
      },
      // fireTel: { // 失火单位/户主联系电话
      //   value: '',
      //   rules: [{ required: true, message: '' }],
      // },
      socialCreditCode: { // 单位统一社会信用代码
        value: '',
        // rules: [{ required: true, message: '请输入单位统一社会信用代码' }],
      },
      fireType: { // 火灾类型
        value: undefined,
        completeValue: undefined,
        rules: [{ required: true, message: '请选择火灾类型' }],
      },
      fireCause: { // 起火原因
        value: undefined,
        text: [],
        rules: [{ required: true, message: '请选择起火原因' }],
      },
      burnedArea: { // 过火面积（平方米）
        value: '',
        rules: [{ required: true, message: '' }],
      },
      fireLevel: { // 火灾等级
        value: '',
        // rules: [{ required: true, message: '请选择火灾等级' }],
      },
      firePlace: { // 起火场所
        value: undefined,
        rules: [{ required: true, message: '请输入起火场所' }],
        text: [],
      },
      isLaborIntensive: { // 是否属于劳动密集型
        value: '2',
        rules: [{ required: true, message: '请选择是否属于劳动密集型' }],
      },
      plantRiskClassification: { // 火灾危险性分类
        value: undefined,
        rules: [{ required: true, message: '请选择火灾危险性分类' }],
      },
      otherFirePlace: { // 其他说明
        value: '',
        rules: [{ required: true, message: '请输入其他说明' }],
      },
      liveType: { // 居住形式
        value: undefined,
        rules: [{ required: true, message: '请输入居住形式' }],
      },
      vehicleType: { // 交通工具类型
        value: undefined,
        rules: [{ required: true, message: '请输入交通工具类型' }],
      },
      chargeState: { // 起火时充电状态
        value: undefined,
        rules: [{ required: true, message: '请输入起火时充电状态' }],
      },
      isRepack: { // 是否改装
        value: undefined,
        rules: [{ required: true, message: '请选择是否改装' }],
      },
      batteryType: { // 电池类型
        value: undefined,
        rules: [{ required: true, message: '请输入电池类型' }],
      },
      energyType: { // 能源动力类型
        value: undefined,
        rules: [{ required: true, message: '请输入能源动力类型' }],
      },
      vinCode: { // 车辆VIN码
        value: '',
        rules: [{ required: false, message: '请输入车辆VIN码' }],
      },
      carNumber: { // 车牌号
        value: '',
        rules: [{ required: true, message: '请输入车牌号' }],
      },
      driveState: { // 行驶状态
        value: undefined,
        rules: [{ required: true, message: '请输入行驶状态' }],
      },
      isPoorHouse: { // 是否属于扶贫安置房
        value: '2',
        rules: [{ required: true, message: '请选择是否属于扶贫安置房' }],
      },
      isChangeUseType: { // 是否变更使用性质
        value: '2',
        rules: [{ required: true, message: '请选择是否变更使用性质' }],
      },
      useType: { // 变更后使用性质
        value: undefined,
        rules: [{ required: true, message: '请选择变更后使用性质' }],
      },
      // buildType: { // 建筑类别
      //   value: undefined,
      //   rules: [{ required: true, message: '请选择建筑类别' }],
      // },
      // fireResistanceRating: { // 建筑耐火等级
      //   value: undefined,
      //   rules: [{ required: true, message: '请选择建筑耐火等级' }],
      // },
      // buildStructure: { // 建筑结构
      //   value: undefined,
      //   rules: [{ required: true, message: '请选择建筑结构' }],
      // },
      firePattern: { // 事故形态
        value: ['2023020801194'],
        rules: [{ required: true, message: '请选择事故形态' }],
      },
      fireSite: { // 起火位置
        value: undefined,
        rules: [{ required: true, message: '请选择起火位置' }],
      },
      initialFuelsType: { // 起火物类型
        value: undefined,
        text: [],
        rules: [{ required: true, message: '请选择起火物类型' }],
      },
      initialFuels: { // 起火物名称
        value: '',
        rules: [{ required: true, message: '请输入起火物名称' }],
      },
      igniteSourceType: { // 引火源类型
        value: undefined,
        rules: [{ required: true, message: '请选择引火源类型' }],
      },
      igniteSource: { // 引火源名称
        value: '',
        rules: [{ required: true, message: '请输入引火源名称' }],
      },
      firePersonAge: { // 引起火灾人员年龄
        value: '',
        rules: [
          // { required: true, message: '请输入引起火灾人员年龄' },
          // { pattern: nonZeroPositiveInteger, message: '请输入正确引起火灾人员年龄' },
        ],
      },
      schooling: { // 受教育程度
        value: undefined,
        // rules: [{ required: true, message: '请选择受教育程度' }],
      },
      health: { // 健康状况
        value: undefined,
        // rules: [{ required: true, message: '请选择健康状况' }],
      },
      isOperating: { // 是否涉及生产经营
        value: '2',
        rules: [{ required: true, message: '请选择是否涉及生产经营' }],
      },
      industry: { // 所属行业
        value: undefined,
        rules: [{ required: true, message: '请选择所属行业' }],
      },
      industryDepartment: { // 行业主管部门
        value: undefined,
        rules: [{ required: true, message: '请选择行业主管部门' }],
      },
      economicType: { // 经济类型
        value: undefined,
        rules: [{ required: true, message: '请选择经济类型' }],
      },
      leadInspectionOrg: { // 事故牵头调查部门
        value: undefined,
        rules: [{ required: true, message: '请选择事故牵头调查部门' }],
      },
      otherOrgRemark: { // 其他单位说明
        value: '',
        rules: [{ required: true, message: '请输入其他单位说明' }],
      },
      isInsurance: { // 是否保险
        value: '2',
        // rules: [{ required: true, message: '请选择是否保险' }],
      },
      insuranceInfo: { // 保险类型
        value: undefined,
        rules: [{ required: true, message: '请选择保险类型' }],
      },
      isResearch: { // 是否正在调查
        value: '2',
        rules: [{ required: true, message: '请选择是否正在调查' }],
      },
      isOnesided: { // 是否单方面火灾
        value: '2',
        // rules: [{ required: true, message: '请选择是否单方面火灾' }],
      },
      fireInspection: { // 监督检查情况
        value: undefined,
        // rules: [{ required: true, message: '请选择监督检查情况' }],
      },
      fireInspectionScope: { // 监督检查范围
        value: undefined,
        rules: [{ required: true, message: '请选择监督检查范围' }],
      },
      fireSafetyUnits: { // 消防安全重点单位
        value: undefined,
        rules: [{ required: true, message: '请选择消防安全重点单位' }],
      },
      isSafetyAccident: { // 是否属于安全生产事故
        value: '2',
        rules: [{ required: true, message: '请选择是否属于安全生产事故' }],
      },
      attach: { // 其他附件
        value: [],
        rules: [{ required: true, message: '请上传其他附件' }],
      },
      fileRemark: { // 相关文件资料描述
        value: '',
        // rules: [{ required: true, message: '请输入相关文件资料描述' }],
      },
    },
    casualtyWar: { // 人员伤亡
      title: '人员伤亡',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      isInjured: {
        value: '2',
        rules: [{ required: true, message: '请选择是否有人员受伤' }],
      },
      minorInjury: { // 伤亡情况
        value: '1',
        rules: [{ required: true, message: '请选择伤亡情况' }],
      },
      injuryNum: { // 轻伤人数
        value: 0,
        rules: [
          { required: true, message: '请输入轻伤人数' },
          // { pattern: positiveIntegerReg, message: '请输入正确轻伤人数' },
        ],
      },
      injuredList: [], // 受伤人员列表
      injuryType: { // 伤亡情况
        value: undefined,
        rules: [{ required: true, message: '请选择伤亡情况' }],
      },
      name: { // 人员姓名
        value: '',
        rules: [{ required: true, message: '请输入人员姓名' }],
      },
      gender: { // 人员性别
        value: undefined,
        rules: [{ required: true, message: '请选择人员性别' }],
      },
      age: { // 人员年龄
        value: '',
        rules: [
          { required: true, message: '请输入人员年龄' },
          // { pattern: positiveIntegerReg, message: '请输入正确人员年龄' },
        ],
      },
      injuryCause: { // 致伤/致死原因
        value: undefined,
        rules: [{ required: true, message: '请选择致伤原因' }],
      },
      injuryBehavior: { // 受伤时行为
        value: undefined,
        rules: [{ required: true, message: '请选择受伤时行为' }],
      },
      injuryPart: { // 受伤部位
        value: undefined,
        rules: [{ required: true, message: '请选择受伤部位' }],
      },
      mainSymptoms: { // 身体主要症状
        value: undefined,
        rules: [{ required: true, message: '请选择身体主要症状' }],
      },
      isDead: { // 是否有人员死亡
        value: '2',
        rules: [{ required: true, message: '请选择是否有人员死亡' }],
      },
      deadList: [], // 死亡人员列表
      nation: { // 民族
        value: undefined,
        rules: [{ required: true, message: '请选择民族' }],
      },
      nativePlace: { // 籍贯
        value: undefined,
        rules: [{ required: true, message: '请选择籍贯' }],
      },
      idType: { // 证件类型
        value: undefined,
        rules: [{ required: true, message: '请选择证件类型' }],
      },
      idNumber: { // 证件号码
        value: '',
        rules: [{ required: true, message: '请输入证件号码' }],
      },
      injurySource: { // 人员来源
        value: undefined,
        rules: [{ required: true, message: '请选择人员来源' }],
      },
      injurySourceInfo: { // 来源详情
        value: '',
        rules: [{ required: true, message: '请选择来源详情' }],
      },
      job: { // 职业
        value: undefined,
        rules: [{ required: true, message: '请选择职业' }],
      },
      health: { // 健康状况
        value: undefined,
        rules: [{ required: true, message: '请选择健康状况' }],
      },
      schooling: { // 受教育程度
        value: undefined,
        rules: [{ required: true, message: '请选择受教育程度' }],
      },
      humanCause: { // 人为因素
        value: undefined,
        rules: [{ required: true, message: '请输入人为因素' }],
      },
      bodyLocation: { // 发现尸体位置
        value: undefined,
        rules: [{ required: true, message: '请选择发现尸体位置' }],
      },
      deathDate: { // 死亡时间
        value: [],
        rules: [{ required: true, message: '请选择死亡时间' }],
      },
    },
    economicLoss: {
      title: '经济损失',
      fieldAnnotation: false, // 批注
      fieldWarning: 'fireDisposalCost:false;affectedHouse:false;fireInjuryCost:false;',
      inspectMethod: { // 调查方式
        value: undefined,
        rules: [{ required: true, message: '请选择调查方式' }],
      },
      directEconomicLoss: { // 直接经济损失（元)
        value: '',
        rules: [{ required: true, message: '' }],
      },
      directDamage: { // 直接财产损失（元)
        value: '',
        rules: [{ required: true, message: '' }],
      },
      fireDisposalCost: { // 火灾现场处置费用（元)
        value: '',
        rules: [
          { required: true, message: '请输入火灾现场处置费用' },
          { pattern: nonnegativeNumberReg, message: '请输入正确火灾现场处置费用' },
        ],
      },
      fireInjuryCost: { // 人身伤亡医疗支出（元
        value: '',
        rules: [
          { required: true, message: '请输入人身伤亡医疗支出' },
          { pattern: nonnegativeNumberReg, message: '请输入正确人身伤亡医疗支出' },
        ],
      },
      otherExpense: { // 其他费用
        value: 0,
        rules: [
          { required: true, message: '请输入其他费用' },
          { pattern: nonnegativeNumberReg, message: '请输入正确其他费用' },
        ],
      },
      costSource: { // 损失来源
        value: undefined,
        rules: [
          { required: true, message: '请选择损失来源' },
        ],
      },
      affectedHouse: { // 受灾户数（户）
        value: '',
        rules: [
          { required: true, message: '请输入受灾户数' },
          // { pattern: positiveIntegerReg, message: '请输入正确受灾户数' },
        ],
      },
    },
    fireBuilding: { // 起火建筑
      title: '起火建筑',
      fieldAnnotation: false, // 批注
      fieldWarning: 'fireResistanceRating:false;',
      buildTag: { // 建筑标签
        value: [],
        rules: [{ required: true, message: '请选择建筑标签' }],
      },
      buildType: { // 建筑类别
        value: undefined,
        rules: [{ required: true, message: '请选择建筑类别' }],
      },
      fireResistanceRating: { // 耐火等级
        value: undefined,
        warningText: '',
        rules: [{ required: true, message: '请选择耐火等级' }],
      },
      buildStructure: { // 建筑结构
        value: undefined,
        rules: [{ required: true, message: '请选择建筑结构' }],
      },
      buildFloor: { // 建筑总楼层
        value: '',
        rules: [{ required: true, message: '' }],
      },
      fireFloor: { // 失火楼层
        value: '',
        rules: [{ required: true, message: '' }],
      },
      buildAllArea: { // 总建筑面积（平方米）
        value: '',
        rules: [
          { required: true, message: '请输入总建筑面积' },
          { pattern: nonnegativeNumberReg, message: '请输入正确总建筑面积' },
        ],
      },
      buildFloorArea: { // 单层建筑面积（平方米）
        value: '',
        rules: [
          { required: true, message: '请输入单层建筑面积' },
          { pattern: nonnegativeNumberReg, message: '请输入正确单层建筑面积' },
        ],
      },
      housingLife: { // 房龄（年）
        value: '',
        rules: [
          // { required: true, message: '请输入房龄' },
          // { pattern: positiveIntegerReg, message: '请输入正确房龄' },
        ],
      },
      buildUse: { // 建筑使用用途
        value: undefined,
        // rules: [{ required: true, message: '请选择建筑使用用途' }],
      },
      isSpread: { // 是否蔓延
        value: undefined,
        rules: [{ required: true, message: '请选择是否蔓延' }],
      },
      isLoud: { // 是否发生轰燃
        value: undefined,
        rules: [{ required: true, message: '请选择是否发生轰燃' }],
      },
      isWindowOpened: { // 失火建筑门窗在过程中是否开启
        value: undefined,
        rules: [{ required: true, message: '请选择失火建筑门窗在过程中是否开启' }],
      },
      historyBuildLevel: { // 文物古建筑级别
        value: undefined,
        rules: [{ required: true, message: '请选择文物古建筑级别' }],
      },
    },
    fireFacilities: { // 消防设施
      title: '消防设施',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      isFirefightFacility: {
        value: '2',
        rules: [{ required: true, message: '请选择消防设施' }],
      },
      autoAlarm: { // 自动报警系统
        value: undefined,
        rules: [{ required: true, message: '请选择自动报警系统' }],
      },
      autoAlarmInstall: { // 安装范围
        value: undefined,
        // rules: [{ required: true, message: '请选择安装范围' }],
      },
      autoAlarmStart: { // 是否启动
        value: undefined,
        // rules: [{ required: true, message: '请选择是否启动' }],
      },
      autoAlarmEffect: { // 是否有效
        value: undefined,
        // rules: [{ required: true, message: '请选择是否有效' }],
      },
      autoAlarmNotStart: { // 未启动原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未启动原因' }],
      },
      autoAlarmNotInstall: { // 未安装原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未安装原因' }],
      },
      autoFireFight: { // 自动灭火系统
        value: undefined,
        rules: [{ required: true, message: '请选择自动灭火系统' }],
      },
      autoFireFightInstall: { // 安装范围
        value: undefined,
        // rules: [{ required: true, message: '请选择安装范围' }],
      },
      autoFireFightStart: { // 是否启动
        value: undefined,
        // rules: [{ required: true, message: '请选择是否启动' }],
      },
      autoFireFightEffect: { // 是否有效
        value: undefined,
        // rules: [{ required: true, message: '请选择是否有效' }],
      },
      autoFireFightNotStart: { // 未启动原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未启动原因' }],
      },
      autoFireFightNotInstall: { // 未安装原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未安装原因' }],
      },
      indoorHydrant: { // 室内消火栓系统
        value: undefined,
        rules: [{ required: true, message: '请选择室内消火栓系统' }],
      },
      indoorHydrantInstall: { // 安装范围
        value: undefined,
        // rules: [{ required: true, message: '请选择安装范围' }],
      },
      indoorHydrantStart: { // 是否启动
        value: undefined,
        // rules: [{ required: true, message: '请选择是否启动' }],
      },
      indoorHydrantEffect: { // 是否有效
        value: undefined,
        // rules: [{ required: true, message: '请选择是否有效' }],
      },
      indoorHydrantNotStart: { // 未启动原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未启动原因' }],
      },
      indoorHydrantNotInstall: { // 未安装原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未安装原因' }],
      },
      smokeControl: { // 防排烟系统
        value: undefined,
        rules: [{ required: true, message: '请选择防排烟系统' }],
      },
      smokeControlInstall: { // 安装范围
        value: undefined,
        // rules: [{ required: true, message: '请选择安装范围' }],
      },
      smokeControlStart: { // 是否启动
        value: undefined,
        // rules: [{ required: true, message: '请选择安装范围' }],
      },
      smokeControlEffect: { // 是否有效
        value: undefined,
        // rules: [{ required: true, message: '请选择是否有效' }],
      },
      smokeControlNotStart: { // 未启动原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未启动原因' }],
      },
      smokeControlNotInstall: { // 未安装原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未安装原因' }],
      },
      fireShutter: { // 防火卷帘
        value: undefined,
        rules: [{ required: true, message: '请选择防火卷帘' }],
      },
      fireShutterInstall: { // 安装范围
        value: undefined,
        // rules: [{ required: true, message: '请选择安装范围' }],
      },
      fireShutterStart: { // 是否启动
        value: undefined,
        // rules: [{ required: true, message: '请选择安装范围' }],
      },
      fireShutterEffect: { // 是否有效
        value: undefined,
        // rules: [{ required: true, message: '请选择是否有效' }],
      },
      fireShutterNotStart: { // 未启动原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未启动原因' }],
      },
      fireShutterNotInstall: { // 未安装原因
        value: undefined,
        // rules: [{ required: true, message: '请选择未安装原因' }],
      },
      emergencyLight: { // 应急疏散照明
        value: undefined,
        rules: [{ required: true, message: '请选择应急疏散照明' }],
      },
      lightNonConformance: { // 不符合规定原因
        value: undefined,
        // rules: [{ required: true, message: '请选择不符合规定原因' }],
      },
      networking: { // 联网情况
        value: undefined,
        rules: [{ required: true, message: '请选择联网情况' }],
      },
      networkAlarm: { // 联网报警方式
        value: undefined,
        // rules: [{ required: true, message: '请选择联网报警方式' }],
      },
      fireCompartment: { // 防火分区
        value: undefined,
        rules: [{ required: true, message: '请选择防火分区' }],
      },
      compartmentArea: { // 分区面积（m2）
        value: '',
        rules: [{ pattern: nonnegativeNumberReg, message: '请输入正确分区面积' }],
      },
      fireSeparation: { // 防火间距
        value: undefined,
        rules: [{ required: true, message: '请选择防火间距' }],
      },
      separationMeter: { // 间距（m）
        value: '',
        rules: [{ pattern: nonnegativeNumberReg, message: '请输入正确间距' }],
      },
      escapeRoute: { // 疏散通道
        value: undefined,
        rules: [{ required: true, message: '请选择疏散通道' }],
      },
      routeNonConformance: { // 不符合规定原因
        value: undefined,
        // rules: [{ required: true, message: '请选择不符合规定原因' }],
      },
      emergencyExit: { // 紧急出口
        value: undefined,
        rules: [{ required: true, message: '请选择紧急出口' }],
      },
      exitNonConformance: { // 不符合规定原因
        value: undefined,
        // rules: [{ required: true, message: '请选择不符合规定原因' }],
      },
    },
    caseHandling: {
      title: '案件办理',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      handleTwoCase: { // 两案处理情况-是否立案
        value: '2',
        rules: [{ required: true, message: '请选择两案处理情况' }],
      },
      penaltyNum: { // 追究人数（人）
        value: '',
        rules: [
          // { required: true, message: '请输入追究人数' },
          // { pattern: positiveIntegerReg, message: '请输入正确追究人数' },
        ],
      },
      suggestDealNum: { // 建议处理人数（人）
        value: '',
        rules: [
          // { required: true, message: '请输入建议处理人数' },
          // { pattern: positiveIntegerReg, message: '请输入正确处理人数' },
        ],
      },
      firePenalty: { // 火灾处罚情况-是否立案
        value: '2',
        rules: [{ required: true, message: '请选择火灾处罚情况' }],
      },
      fireInfoOrgList: [], // 处罚单位列表
      orgName: { // 单位名称
        value: '',
        rules: [{ required: true, message: '请输入单位名称' }],
      },
      legalPerson: { // 法人代表
        value: '',
        // rules: [{ required: true, message: '请输入法人代表' }],
      },
      penalty: { // 行政处罚
        value: '',
        // rules: [{ required: true, message: '请选择行政处罚' }],
      },
      fireInfoPersonList: [], // 处罚个人列表
      name: { // 姓名
        value: '',
        rules: [{ required: true, message: '请输入姓名' }],
      },
      gender: { // 性别
        value: undefined,
        // rules: [{ required: true, message: '请选择性别' }],
      },
      adminSanction: { // 行政处罚
        value: '',
        // rules: [{ required: true, message: '请选择行政处罚' }],
      },
    },
    firePhoto: { // 火灾照片
      title: '火灾照片',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      isAllBack: { // 队伍是否全部中返
        value: '',
        rules: [{ required: false, message: '请选择队伍是否全部中返' }],
      },
      photos: {
        value: [],
        rules: [{ required: true, message: '请上传火灾照片' }],
      },
    },
    fireCourse: { // 起火经过
      title: '起火经过',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      firePassage: {
        value: '',
        rules: [{ required: true, message: '请输入起火经过' }],
      },
    },
    otherAttach: { // 其他附件
      title: '其他附件',
      fieldAnnotation: false, // 批注
      fieldWarning: '',
      attach: { // 其他附件
        value: [],
        // rules: [{ required: true, message: '请上传其他附件' }],
      },
      otherRemark: { // 补充说明
        value: '',
        // rules: [{ required: true, message: '请输入补充说明' }],
      },
    },
    proSteps: { // 其他附件
      title: '操作记录',
      fieldAnnotation: false, // 批注
      fireInfoTransferList: {
        value: [],
      },
    },
  }

  const form = ref(cloneDeep(formOrigin))
  const isRequired = ref(true)
  const handleUseForm = (key, data) => {
    const modelRef = ref(pickBy(data, (v, k) => {
      if (key !== 'casualtyWar') {
        return !['title', 'fieldAnnotation', 'fieldWarning', 'validateStatus', 'validateProgress', 'fireInfoTransferList'].includes(k)
      }
      else {
        return !['title', 'fieldAnnotation', 'fieldWarning', 'validateStatus', 'validateProgress', 'injuryType', 'name', 'gender', 'age',
          'injuryCause', 'injuryBehavior', 'injuryPart', 'mainSymptoms', 'nation', 'nativePlace',
          'idType', 'idNumber', 'injurySource', 'injurySourceInfo', 'job', 'health', 'schooling',
          'humanCause', 'bodyLocation', 'deathDate'].includes(k)
      }
    }))

    const rulesRef = ref((() => {
      const rules = {}
      Object.keys(modelRef.value).forEach((k) => {
        const multiple = ['area'] // 多选
        const dom = document.getElementById(k)
        if (Array.isArray(modelRef.value[k]) && modelRef.value[k].length > 0 && !multiple.includes(k)) {
          modelRef.value[k].forEach((i, index) => {
            if (i instanceof Object) {
              Object.keys(i).forEach((subKey) => {
                if (!['disabled', 'boFireInfoInjuryId', 'boFireInfoId', 'new', 'genderHolder', 'ageHolder'].includes(subKey)) {
                  data[subKey]?.rules && (rules[`${k}[${index}].${subKey}`] = data[subKey]?.rules)
                }
                else {
                  rules[`${k}[${index}].${subKey}`] = [{ required: false }]
                }
              })
            }
          })
        }
        else if (dom) {
          rules[`${k}.value`] = data[k].rules
        }
      })
      return rules
    })())

    const { validate, validateInfos } = useForm(modelRef, rulesRef)

    validate().finally(() => {
      // if (key === 'firePhoto') {
      //   debugger
      // }
      const allFormItem = toArray(validateInfos)
      const allFormItemNum = document.getElementById(key)?.querySelectorAll('.van-field__label--required')?.length
      if (!allFormItemNum || allFormItem <= 0) {
        form.value[key].validateStatus = true
        form.value[key].validateProgress = 100
      }
      else {
        const passFormItemNum = allFormItem.filter(i => i.validateStatus === 'success' && i.required).length
        form.value[key].validateStatus = allFormItemNum === passFormItemNum
        form.value[key].validateProgress = Math.round(passFormItemNum / allFormItemNum * 100)
      }
    })
  }
  // const handleUseForm1 = ()=>{
  //   const res = fromRef.value.getValidationStatus()
  //   debugger;
  //   Object.keys(res).forEach(item=>{
  //     item.startsWith('')
  //   })
  //   console.log(res);
  // }
  // 根据模版生成简要情况
  const generateRemarkField = (detail, type) => {
    const { basicInfo, casualtyWar, economicLoss } = form.value
    const { warningAddr, extinctDate } = detail
    let content = ''
    if (basicInfo.fireType?.text?.includes('交通工具火灾')) {
      content = '【起火时间年月日时分】，【火灾地址】【交通工具类型】着火，【扑灭时间】扑灭。起火原因系【起火原因】（安全生产事故），过火面积【过火面积】平方米，造成【亡人数】死【伤人数】伤，直接经济损失【直接经济损失】元。'
    }
    else {
      content = '【起火时间年月日时分】，【火灾地址】一【起火场所】【起火物】起火，【扑灭时间】扑灭。起火原因系【起火原因】（安全生产事故），过火面积【过火面积】平方米，造成【亡人数】死【伤人数】伤，直接经济损失【直接经济损失】元。'
    }
    // 替换各个字段
    if (basicInfo.fireDate.value) {
      content = content.replace('【起火时间年月日时分】', dayjs(basicInfo.fireDate.value).format('YYYY年MM月DD日HH时mm分'))
    }
    if (warningAddr) {
      content = content.replace('【警情地址】', warningAddr)
    }
    if (basicInfo.fireDirection.value) {
      content = content.replace('【火灾地址】', basicInfo.fireDirection.value)
    }
    if (basicInfo.firePlace.text?.length > 0) {
      content = content.replace('【起火场所】', cloneDeep(basicInfo.firePlace.text)?.pop())
    }
    if (basicInfo.vehicleType.text?.length >= 1) {
      content = content.replace('【交通工具类型】', cloneDeep(basicInfo.vehicleType.text)?.[1])
    }
    if (basicInfo.initialFuelsType.text?.length > 0) {
      content = content.replace('【起火物】', cloneDeep(basicInfo.initialFuelsType.text)?.pop())
    }
    if (extinctDate) {
      content = content.replace('【扑灭时间】', dayjs(extinctDate).format('MM月DD日HH时mm分'))
    }
    else {
      content = content.replace('，【扑灭时间】扑灭', '')
    }
    if (basicInfo.fireCause.text?.length > 0) {
      content = content.replace('【起火原因】', cloneDeep(basicInfo.fireCause.text)?.pop())
    }
    if (basicInfo.isSafetyAccident.value !== '1') {
      content = content.replace('（安全生产事故）', '')
    }
    if (basicInfo.burnedArea.value > 0 || basicInfo.burnedArea.value === 0) {
      content = content.replace('【过火面积】', basicInfo.burnedArea.value)
    }
    if (casualtyWar.isDead.value === '1') {
      content = content.replace('【亡人数】', casualtyWar.deadList?.length || 0)
    }
    else {
      content = content.replace('【亡人数】', 0)
    }
    if (casualtyWar.isInjured.value === '1') {
      content = content.replace('【伤人数】', (casualtyWar.injuredList?.length || 0) + (casualtyWar.injuryNum.value || 0))
    }
    else {
      content = content.replace('【伤人数】', 0)
    }
    if (casualtyWar.isDead.value !== '1' && casualtyWar.isInjured.value !== '1') {
      content = content.replace('造成【亡人数】死【伤人数】伤', '无人员伤亡')
    }
    if (economicLoss.directEconomicLoss.value || economicLoss.directEconomicLoss.value === 0) {
      content = content.replace('【直接经济损失】', economicLoss.directEconomicLoss.value)
    }
    content = content.replaceAll(/【[^【】]*】/g, 'xx')
    if (type === 1) {
      form.value.briefSituation.content.value = content
    } else if (type === 2) {
      form.value.fireCourse.firePassage.value = content
    }
  }

  // 当严重程度、火灾类型、起火场所，发生变化时重置表单，避免无用数据提交到后端
  // 当严重程度、火灾类型、起火场所，发生变化时重置表单，避免无用数据提交到后端
  // 切换火灾严重程度，不清除【经济损失】【火灾照片】【其他附件】三个模块已填写内容，同时对于【基本信息】模板，仅清除轻微与非轻微火灾模板差异的字段信息，其他已录入信息不做清除。差异信息包括社会统一信用代码、引起火灾人员年龄、健康状况、受教育程度、【是否保险】、【是否单方面火灾】、【是否属于安全生产事故】及其连带的信息。
  // 切换【起火场所类型】，不清除人员伤亡、经济损失、起火建筑、消防设施、案件办理、火灾照片、其他附件等7个模板已有内容
  // flag 0 表示是切换【火灾严重程度】，1 表示是切换【起火场所类型】
  const initFormWhenChange = (draft, flag) => {
    form.value.fireInfo = cloneDeep(formOrigin.fireInfo)
    if (draft) {
      // form.value.basicInfo.draftName.value = ''
    }
    // form.value.basicInfo.severity.value = undefined
    // form.value.basicInfo.noDispatchArea.value = undefined
    // form.value.basicInfo.fireDate.value = ''
    // form.value.basicInfo.fireDirection.value = ''
    // form.value.basicInfo.area.value = undefined
    // form.value.basicInfo.area.text = []
    // form.value.basicInfo.fireOrgname.value = ''
    // form.value.basicInfo.fireTel.value = ''
    form.value.basicInfo.socialCreditCode.value = ''
    // form.value.basicInfo.fireType.value = undefined
    // form.value.basicInfo.fireType.text = []
    // form.value.basicInfo.fireCause.value = undefined
    // form.value.basicInfo.fireCause.text = []
    // form.value.basicInfo.noCause.value = undefined
    // form.value.basicInfo.noCause.text = []
    // form.value.basicInfo.burnedArea.value = ''
    // form.value.basicInfo.fireLevel.value = ''
    // form.value.basicInfo.firePlace.value = undefined
    // form.value.basicInfo.firePlace.text = []
    form.value.basicInfo.isLaborIntensive.value = '2'
    form.value.basicInfo.plantRiskClassification.value = undefined
    form.value.basicInfo.otherFirePlace.value = ''
    form.value.basicInfo.liveType.value = undefined
    form.value.basicInfo.vehicleType.value = undefined
    form.value.basicInfo.vehicleType.text = []
    form.value.basicInfo.chargeState.value = undefined
    form.value.basicInfo.isRepack.value = undefined
    form.value.basicInfo.batteryType.value = undefined
    form.value.basicInfo.energyType.value = undefined
    form.value.basicInfo.vinCode.value = ''
    form.value.basicInfo.carNumber.value = ''
    form.value.basicInfo.driveState.value = undefined
    form.value.basicInfo.isPoorHouse.value = '2'
    form.value.basicInfo.isChangeUseType.value = '2'
    form.value.basicInfo.useType.value = undefined
    // form.value.basicInfo.buildType.value = undefined
    // form.value.basicInfo.fireResistanceRating.value = undefined
    // form.value.basicInfo.buildStructure.value = undefined
    form.value.basicInfo.firePattern.value = ['2023020801194']
    form.value.basicInfo.fireSite.value = undefined
    form.value.basicInfo.initialFuelsType.value = undefined
    form.value.basicInfo.initialFuelsType.text = []
    form.value.basicInfo.initialFuels.value = undefined
    form.value.basicInfo.igniteSourceType.value = undefined
    form.value.basicInfo.igniteSource.value = undefined
    form.value.basicInfo.firePersonAge.value = ''
    form.value.basicInfo.schooling.value = undefined
    form.value.basicInfo.health.value = undefined
    form.value.basicInfo.isOperating.value = '2'
    form.value.basicInfo.industry.value = undefined
    form.value.basicInfo.industryDepartment.value = undefined
    form.value.basicInfo.economicType.value = undefined
    form.value.basicInfo.leadInspectionOrg.value = undefined
    form.value.basicInfo.otherOrgRemark.value = ''
    form.value.basicInfo.isInsurance.value = '2'
    form.value.basicInfo.insuranceInfo.value = undefined
    // form.value.basicInfo.isResearch.value = '2'
    form.value.basicInfo.isOnesided.value = '2'
    form.value.basicInfo.fireInspection.value = undefined
    form.value.basicInfo.fireInspectionScope.value = undefined
    form.value.basicInfo.fireSafetyUnits.value = undefined
    form.value.basicInfo.isSafetyAccident.value = '2'
    form.value.basicInfo.attach.value = []
    form.value.basicInfo.fileRemark.value = ''
    // form.value.economicLoss = {
    //   ...cloneDeep(formOrigin.economicLoss),
    //   fieldAnnotation: form.value.economicLoss.fieldAnnotation,
    //   fieldWarning: form.value.economicLoss.fieldWarning,
    // }
    // form.value.fireCourse = {
    //   ...cloneDeep(formOrigin.fireCourse),
    //   fieldAnnotation: form.value.fireCourse.fieldAnnotation,
    //   fieldWarning: form.value.fireCourse.fieldWarning,
    // }

    // const { basicInfo } = form.value
    // if (basicInfo.severity.value === '2' && basicInfo.fireType?.text?.includes('建构筑物火灾')) {
    //   form.value.fireBuilding.buildTag.value = ['2023020801767']
    // }
    if (flag !== "0" && flag !== "1") {
      form.value.firePhoto = {
        ...cloneDeep(formOrigin.firePhoto),
        fieldAnnotation: form.value.firePhoto.fieldAnnotation,
        fieldWarning: form.value.firePhoto.fieldWarning,
      }
      form.value.otherAttach = {
        ...cloneDeep(formOrigin.otherAttach),
        fieldAnnotation: form.value.otherAttach.fieldAnnotation,
        fieldWarning: form.value.otherAttach.fieldWarning,
      }
    }
    if (flag !== "1") {
      form.value.casualtyWar = {
        ...cloneDeep(formOrigin.casualtyWar),
        fieldAnnotation: form.value.casualtyWar.fieldAnnotation,
        fieldWarning: form.value.casualtyWar.fieldWarning,
      }
      form.value.fireFacilities = {
        ...cloneDeep(formOrigin.fireFacilities),
        fieldAnnotation: form.value.fireFacilities.fieldAnnotation,
        fieldWarning: form.value.fireFacilities.fieldWarning,
      };
      form.value.caseHandling = {
        ...cloneDeep(formOrigin.caseHandling),
        fieldAnnotation: form.value.caseHandling.fieldAnnotation,
        fieldWarning: form.value.caseHandling.fieldWarning,
      }
    }
    form.value.fireBuilding = {
      ...cloneDeep(formOrigin.fireBuilding),
      fieldAnnotation: form.value.fireBuilding.fieldAnnotation,
      fieldWarning: form.value.fireBuilding.fieldWarning,
    }
  }

  // 校验表单规则是否需要显示 warning 提示
  const checkFormField = (warningDetail, options) => {
    if (warningDetail?.warningStatusValue === '已归档') {
      return
    }
    // checkFireDisposalCost(form.value, false)

    checkFireInjuryCost(form.value, false)

    checkAffectedHouse(form.value, false)

    checkFireResistanceRating(form.value, options, false)

    checkBurnedArea(form.value, false)
  }

  const initFormByDetail = (detail, options, callback, warningDetail) => {
    const { fireInfo, fireInfoBuild, fireInfoInjuryList, fireInfoOrgList, fireInfoPersonList, fireInfoTransferList } = detail
    // 基本信息
    form.value.basicInfo.draftName.value = fireInfo?.draftName
    form.value.basicInfo.severity.value = fireInfo?.severity
    form.value.basicInfo.noDispatchArea.value = fireInfo?.noDispatchArea?.split(',')
    form.value.basicInfo.noDispatchArea.text = fireInfo?.noDispatchAreaValue?.split('/')
    form.value.basicInfo.fireDate.value = fireInfo?.fireDate && dayjs(Number(fireInfo?.fireDate))
    form.value.basicInfo.fireDirection.value = fireInfo?.fireDirection
    form.value.basicInfo.area.value = fireInfo?.area?.split(',')
    form.value.basicInfo.isUrbanVillages.value = fireInfo?.isUrbanVillages
    form.value.basicInfo.otherArea.value = fireInfo?.otherArea
    if (fireInfo?.fireOrgname) {
      form.value.basicInfo.fireOrgname.value = fireInfo?.fireOrgname
    }
    // form.value.basicInfo.fireTel.value = fireInfo?.fireTel
    form.value.basicInfo.socialCreditCode.value = fireInfo?.socialCreditCode
    form.value.basicInfo.fireType.value = fireInfo?.fireType?.split(',')?.pop()
    form.value.basicInfo.fireType.completeValue = fireInfo?.fireType?.split(',')
    form.value.basicInfo.fireType.text = getTypeText(form.value.basicInfo.fireType.completeValue, options.fireType)
    form.value.basicInfo.fireCause.value = fireInfo?.fireCause?.split(',')
    form.value.basicInfo.fireCause.text = getTypeText(form.value.basicInfo.fireCause.value, options.fireCause)
    form.value.basicInfo.burnedArea.value = fireInfo?.burnedArea
    form.value.basicInfo.fireLevel.value = fireInfo?.fireLevel
    form.value.basicInfo.firePlace.value = fireInfo?.firePlace?.split(',')
    form.value.basicInfo.firePlace.text = getTypeText(form.value.basicInfo.firePlace.value, options.firePlace)
    form.value.basicInfo.plantRiskClassification.value = fireInfo?.plantRiskClassification
    form.value.basicInfo.isLaborIntensive.value = fireInfo?.isLaborIntensive
    form.value.basicInfo.otherFirePlace.value = fireInfo?.otherFirePlace
    form.value.basicInfo.liveType.value = fireInfo?.liveType
    form.value.basicInfo.vehicleType.value = fireInfo?.vehicleType?.split(',')
    form.value.basicInfo.vehicleType.text = getTypeText(form.value.basicInfo.vehicleType.value, options.vehicleType)
    form.value.basicInfo.chargeState.value = fireInfo?.chargeState
    form.value.basicInfo.batteryType.value = fireInfo?.batteryType
    form.value.basicInfo.energyType.value = fireInfo?.energyType?.split(',')
    form.value.basicInfo.vinCode.value = fireInfo?.vinCode
    form.value.basicInfo.carNumber.value = fireInfo?.carNumber
    form.value.basicInfo.driveState.value = fireInfo?.driveState
    form.value.basicInfo.isPoorHouse.value = fireInfo?.isPoorHouse
    form.value.basicInfo.isChangeUseType.value = fireInfo?.isChangeUseType
    form.value.basicInfo.useType.value = fireInfo?.useType
    // form.value.basicInfo.buildType.value = fireInfoBuild?.buildType
    // form.value.basicInfo.fireResistanceRating.value = fireInfoBuild?.fireResistanceRating
    // form.value.basicInfo.buildStructure.value = fireInfoBuild?.buildStructure
    form.value.basicInfo.firePattern.value = fireInfo?.firePattern?.split(',')
    form.value.basicInfo.fireSite.value = fireInfo?.fireSite?.split(',')
    form.value.basicInfo.initialFuelsType.value = fireInfo?.initialFuelsType?.split(',')
    form.value.basicInfo.initialFuelsType.text = getTypeText(form.value.basicInfo.initialFuelsType.value, options.initialFuelsType)
    form.value.basicInfo.initialFuels.value = fireInfo?.initialFuels
    form.value.basicInfo.igniteSourceType.value = fireInfo?.igniteSourceType?.split(',')
    form.value.basicInfo.igniteSource.value = fireInfo?.igniteSource
    form.value.basicInfo.firePersonAge.value = fireInfo?.firePersonAge
    form.value.basicInfo.schooling.value = fireInfo?.schooling
    form.value.basicInfo.health.value = fireInfo?.health
    form.value.basicInfo.isOperating.value = fireInfo?.isOperating
    form.value.basicInfo.industry.value = fireInfo?.industry?.split(',')
    form.value.basicInfo.industryDepartment.value = fireInfo?.industryDepartment
    form.value.basicInfo.economicType.value = fireInfo?.economicType
    form.value.basicInfo.leadInspectionOrg.value = fireInfo?.leadInspectionOrg
    form.value.basicInfo.otherOrgRemark.value = fireInfo?.otherOrgRemark
    form.value.basicInfo.isInsurance.value = fireInfo?.isInsurance
    form.value.basicInfo.insuranceInfo.value = fireInfo?.insuranceInfo?.split(',')
    form.value.basicInfo.isResearch.value = fireInfo?.isResearch
    form.value.basicInfo.isOnesided.value = fireInfo?.isOnesided
    form.value.basicInfo.fireInspection.value = fireInfo?.fireInspection
    form.value.basicInfo.isSafetyAccident.value = fireInfo?.isSafetyAccident
    form.value.basicInfo.fileRemark.value = fireInfo?.fileRemark
    form.value.basicInfo.fireInspectionScope.value = fireInfo?.fireInspectionScope?.split(',')
    form.value.basicInfo.fireSafetyUnits.value = fireInfo?.fireSafetyUnits
    form.value.basicInfo.isRepack.value = fireInfo?.isRepack
    // 人员伤亡
    if (fireInfo?.isInjury && fireInfoInjuryList?.length > 0) {
      const minors = fireInfoInjuryList.filter(item => item.injuryType === '1')
      if (minors?.length > 0) {
        form.value.casualtyWar.injuryNum.value = minors[0].injuryNum
      }
      const injurys = fireInfoInjuryList.filter(item => item.injuryType === '2')
      form.value.casualtyWar.isInjured.value = (minors?.length > 0 || injurys?.length > 0) ? '1' : '2'
      form.value.casualtyWar.injuredList = injurys?.map((item) => {
        return {
          ...item,
          nativePlace: item.nativePlace?.split(','),
          disabled: !(item.idType === '2023020801744'), // 非身份证不需要校验
        }
      })
      const deads = fireInfoInjuryList.filter(item => item.injuryType === '3')
      form.value.casualtyWar.isDead.value = deads?.length > 0 ? '1' : '2'
      form.value.casualtyWar.deadList = deads?.map((item) => {
        return {
          ...item,
          nativePlace: item.nativePlace?.split(','),
          deathDate: item.deathDate?.split(','),
          disabled: !(item.idType === '2023020801744'), // 非身份证不需要校验
        }
      })
    }
    // 经济损失
    form.value.economicLoss.inspectMethod.value = fireInfo?.inspectMethod
    form.value.economicLoss.directEconomicLoss.value = fireInfo?.directEconomicLoss
    form.value.economicLoss.directDamage.value = fireInfo?.directDamage
    form.value.economicLoss.fireDisposalCost.value = fireInfo?.fireDisposalCost
    form.value.economicLoss.fireInjuryCost.value = fireInfo?.fireInjuryCost
    form.value.economicLoss.otherExpense.value = fireInfo?.otherExpense
    form.value.economicLoss.costSource.value = fireInfo?.costSource
    form.value.economicLoss.affectedHouse.value = fireInfo?.affectedHouse
    // 起火建筑
    if (fireInfoBuild?.buildTag) {
      form.value.fireBuilding.buildTag.value = fireInfoBuild?.buildTag?.split(',')
    }
    form.value.fireBuilding.buildType.value = fireInfoBuild?.buildType
    form.value.fireBuilding.fireResistanceRating.value = fireInfoBuild?.fireResistanceRating
    form.value.fireBuilding.buildStructure.value = fireInfoBuild?.buildStructure
    form.value.fireBuilding.buildFloor.value = fireInfoBuild?.buildFloor
    form.value.fireBuilding.fireFloor.value = fireInfoBuild?.fireFloor
    form.value.fireBuilding.buildAllArea.value = fireInfoBuild?.buildAllArea
    form.value.fireBuilding.buildFloorArea.value = fireInfoBuild?.buildFloorArea
    form.value.fireBuilding.housingLife.value = fireInfoBuild?.housingLife
    form.value.fireBuilding.buildUse.value = fireInfoBuild?.buildUse?.split(',')
    form.value.fireBuilding.isSpread.value = fireInfoBuild?.isSpread
    form.value.fireBuilding.isLoud.value = fireInfoBuild?.isLoud
    form.value.fireBuilding.isWindowOpened.value = fireInfoBuild?.isWindowOpened
    form.value.fireBuilding.historyBuildLevel.value = fireInfoBuild?.historyBuildLevel
    // 消防设施
    form.value.fireFacilities.isFirefightFacility.value = fireInfoBuild?.isFirefightFacility
    form.value.fireFacilities.autoAlarm.value = fireInfoBuild?.autoAlarm
    form.value.fireFacilities.autoAlarmInstall.value = fireInfoBuild?.autoAlarmInstall
    form.value.fireFacilities.autoAlarmStart.value = fireInfoBuild?.autoAlarmStart
    form.value.fireFacilities.autoAlarmEffect.value = fireInfoBuild?.autoAlarmEffect
    form.value.fireFacilities.autoAlarmNotStart.value = fireInfoBuild?.autoAlarmNotStart
    form.value.fireFacilities.autoAlarmNotInstall.value = fireInfoBuild?.autoAlarmNotInstall
    form.value.fireFacilities.autoFireFight.value = fireInfoBuild?.autoFireFight
    form.value.fireFacilities.autoFireFightInstall.value = fireInfoBuild?.autoFireFightInstall
    form.value.fireFacilities.autoFireFightStart.value = fireInfoBuild?.autoFireFightStart
    form.value.fireFacilities.autoFireFightEffect.value = fireInfoBuild?.autoFireFightEffect
    form.value.fireFacilities.autoFireFightNotStart.value = fireInfoBuild?.autoFireFightNotStart
    form.value.fireFacilities.autoFireFightNotInstall.value = fireInfoBuild?.autoFireFightNotInstall
    form.value.fireFacilities.indoorHydrant.value = fireInfoBuild?.indoorHydrant
    form.value.fireFacilities.indoorHydrantInstall.value = fireInfoBuild?.indoorHydrantInstall
    form.value.fireFacilities.indoorHydrantStart.value = fireInfoBuild?.indoorHydrantStart
    form.value.fireFacilities.indoorHydrantEffect.value = fireInfoBuild?.indoorHydrantEffect
    form.value.fireFacilities.indoorHydrantNotStart.value = fireInfoBuild?.indoorHydrantNotStart
    form.value.fireFacilities.indoorHydrantNotInstall.value = fireInfoBuild?.indoorHydrantNotInstall
    form.value.fireFacilities.smokeControl.value = fireInfoBuild?.smokeControl
    form.value.fireFacilities.smokeControlInstall.value = fireInfoBuild?.smokeControlInstall
    form.value.fireFacilities.smokeControlStart.value = fireInfoBuild?.smokeControlStart
    form.value.fireFacilities.smokeControlEffect.value = fireInfoBuild?.smokeControlEffect
    form.value.fireFacilities.smokeControlNotStart.value = fireInfoBuild?.smokeControlNotStart
    form.value.fireFacilities.smokeControlNotInstall.value = fireInfoBuild?.smokeControlNotInstall
    form.value.fireFacilities.fireShutter.value = fireInfoBuild?.fireShutter
    form.value.fireFacilities.fireShutterInstall.value = fireInfoBuild?.fireShutterInstall
    form.value.fireFacilities.fireShutterStart.value = fireInfoBuild?.fireShutterStart
    form.value.fireFacilities.fireShutterEffect.value = fireInfoBuild?.fireShutterEffect
    form.value.fireFacilities.fireShutterNotStart.value = fireInfoBuild?.fireShutterNotStart
    form.value.fireFacilities.fireShutterNotInstall.value = fireInfoBuild?.fireShutterNotInstall
    form.value.fireFacilities.emergencyLight.value = fireInfoBuild?.emergencyLight
    form.value.fireFacilities.lightNonConformance.value = fireInfoBuild?.lightNonConformance
    form.value.fireFacilities.networking.value = fireInfoBuild?.networking
    form.value.fireFacilities.networkAlarm.value = fireInfoBuild?.networkAlarm
    form.value.fireFacilities.fireCompartment.value = fireInfoBuild?.fireCompartment
    form.value.fireFacilities.compartmentArea.value = fireInfoBuild?.compartmentArea
    form.value.fireFacilities.fireSeparation.value = fireInfoBuild?.fireSeparation
    form.value.fireFacilities.separationMeter.value = fireInfoBuild?.separationMeter
    form.value.fireFacilities.escapeRoute.value = fireInfoBuild?.escapeRoute
    form.value.fireFacilities.routeNonConformance.value = fireInfoBuild?.routeNonConformance
    form.value.fireFacilities.emergencyExit.value = fireInfoBuild?.emergencyExit
    form.value.fireFacilities.exitNonConformance.value = fireInfoBuild?.exitNonConformance
    // 案件办理
    form.value.caseHandling.handleTwoCase.value = fireInfo?.handleTwoCase
    form.value.caseHandling.penaltyNum.value = fireInfo?.penaltyNum
    form.value.caseHandling.suggestDealNum.value = fireInfo?.suggestDealNum
    form.value.caseHandling.firePenalty.value = fireInfo?.firePenalty
    if (form.value.caseHandling.firePenalty.value === '1') {
      if (fireInfoOrgList?.length > 0) {
        form.value.caseHandling.fireInfoOrgList = fireInfoOrgList
      }
      if (fireInfoPersonList?.length > 0) {
        form.value.caseHandling.fireInfoPersonList = fireInfoPersonList.map((item) => {
          return {
            ...item,
            adminSanction: item.penalty,
          }
        })
      }
    }
    // 起火照片
    form.value.firePhoto.isAllBack.value = fireInfo?.isAllBack
    // 起火经过
    form.value.fireCourse.firePassage.value = fireInfo?.firePassage
    // 其他附件
    form.value.otherAttach.otherRemark.value = fireInfo?.otherRemark
    // 其他附件
    form.value.otherAttach.otherRemark.value = fireInfo?.otherRemark
    // 流程流转
    form.value.proSteps.fireInfoTransferList.value = fireInfoTransferList

    checkFormField(warningDetail, options)

    callback && callback()
  }

  // 当选择草稿时，去掉部分数据校验
  const initDraftRules = (value, formRef) => {
    // 基本信息
    // form.value.basicInfo.draftName.rules[0].required = value
    // form.value.basicInfo.severity.rules[0].required = value
    // form.value.basicInfo.noDispatchArea.rules[0].required = value
    // form.value.basicInfo.fireDate.rules[0].required = value
    isRequired.value = value
    form.value.basicInfo.fireDirection.rules[0].required = value
    form.value.basicInfo.area.rules[0].required = value
    // form.value.basicInfo.isUrbanVillages.rules[0].required = value
    // form.value.basicInfo.otherArea.rules[0].required = value
    form.value.basicInfo.fireOrgname.rules[0].required = value
    // form.value.basicInfo.fireTel.rules[0].required = value
    // form.value.basicInfo.socialCreditCode.rules[0].required = value
    // form.value.basicInfo.fireType.rules[0].required = value
    form.value.basicInfo.fireCause.rules[0].required = value
    form.value.basicInfo.burnedArea.rules[0].required = value
    // form.value.basicInfo.fireLevel.rules[0].required = value
    form.value.basicInfo.firePlace.rules[0].required = value
    form.value.basicInfo.isLaborIntensive.rules[0].required = value
    form.value.basicInfo.plantRiskClassification.rules[0].required = value
    form.value.basicInfo.otherFirePlace.rules[0].required = value
    form.value.basicInfo.liveType.rules[0].required = value
    form.value.basicInfo.vehicleType.rules[0].required = value
    form.value.basicInfo.chargeState.rules[0].required = value
    form.value.basicInfo.isRepack.rules[0].required = value
    form.value.basicInfo.batteryType.rules[0].required = value
    form.value.basicInfo.energyType.rules[0].required = value
    // form.value.basicInfo.vinCode.rules[0].required = value
    form.value.basicInfo.carNumber.rules[0].required = value
    form.value.basicInfo.driveState.rules[0].required = value
    form.value.basicInfo.isPoorHouse.rules[0].required = value
    form.value.basicInfo.isChangeUseType.rules[0].required = value
    form.value.basicInfo.useType.rules[0].required = value
    // form.value.basicInfo.buildType.rules[0].required = value
    // form.value.basicInfo.fireResistanceRating.rules[0].required = value
    // form.value.basicInfo.buildStructure.rules[0].required = value
    form.value.basicInfo.firePattern.rules[0].required = value
    form.value.basicInfo.fireSite.rules[0].required = value
    form.value.basicInfo.initialFuelsType.rules[0].required = value
    form.value.basicInfo.initialFuels.rules[0].required = value
    form.value.basicInfo.igniteSourceType.rules[0].required = value
    form.value.basicInfo.igniteSource.rules[0].required = value
    // form.value.basicInfo.firePersonAge.rules[0].required = value
    // form.value.basicInfo.schooling.rules[0].required = value
    // form.value.basicInfo.health.rules[0].required = value
    form.value.basicInfo.isOperating.rules[0].required = value
    form.value.basicInfo.industry.rules[0].required = value
    form.value.basicInfo.industryDepartment.rules[0].required = value
    form.value.basicInfo.economicType.rules[0].required = value
    form.value.basicInfo.leadInspectionOrg.rules[0].required = value
    form.value.basicInfo.otherOrgRemark.rules[0].required = value
    // form.value.basicInfo.isInsurance.rules[0].required = value
    form.value.basicInfo.insuranceInfo.rules[0].required = value
    form.value.basicInfo.isResearch.rules[0].required = value
    // form.value.basicInfo.isOnesided.rules[0].required = value
    // form.value.basicInfo.fireInspection.rules[0].required = value
    form.value.basicInfo.fireInspectionScope.rules[0].required = value
    form.value.basicInfo.fireSafetyUnits.rules[0].required = value
    form.value.basicInfo.isSafetyAccident.rules[0].required = value
    form.value.basicInfo.attach.rules[0].required = value
    // form.value.basicInfo.fileRemark.rules[0].required = value
    // 人员伤亡
    form.value.casualtyWar.isInjured.rules[0].required = value
    form.value.casualtyWar.isDead.rules[0].required = value
    form.value.casualtyWar.nation.rules[0].required = value
    form.value.casualtyWar.idType.rules[0].required = value
    form.value.casualtyWar.idNumber.rules[0].required = value
    form.value.casualtyWar.gender.rules[0].required = value
    form.value.casualtyWar.age.rules[0].required = value
    form.value.casualtyWar.injurySource.rules[0].required = value
    form.value.casualtyWar.injurySourceInfo.rules[0].required = value
    form.value.casualtyWar.job.rules[0].required = value
    form.value.casualtyWar.health.rules[0].required = value
    form.value.casualtyWar.schooling.rules[0].required = value
    form.value.casualtyWar.injuryCause.rules[0].required = value
    form.value.casualtyWar.humanCause.rules[0].required = value
    form.value.casualtyWar.injuryBehavior.rules[0].required = value
    form.value.casualtyWar.injuryPart.rules[0].required = value
    form.value.casualtyWar.mainSymptoms.rules[0].required = value
    form.value.casualtyWar.bodyLocation.rules[0].required = value
    form.value.casualtyWar.deathDate.rules[0].required = value
    // 经济损失
    form.value.economicLoss.inspectMethod.rules[0].required = value
    form.value.economicLoss.directDamage.rules[0].required = value
    form.value.economicLoss.fireDisposalCost.rules[0].required = value
    form.value.economicLoss.otherExpense.rules[0].required = value
    form.value.economicLoss.fireInjuryCost.rules[0].required = value
    form.value.economicLoss.costSource.rules[0].required = value
    form.value.economicLoss.affectedHouse.rules[0].required = value
    // 起火建筑
    form.value.fireBuilding.buildTag.rules[0].required = value
    form.value.fireBuilding.buildType.rules[0].required = value
    form.value.fireBuilding.fireResistanceRating.rules[0].required = value
    form.value.fireBuilding.buildStructure.rules[0].required = value
    form.value.fireBuilding.buildFloor.rules[0].required = value
    form.value.fireBuilding.fireFloor.rules[0].required = value
    form.value.fireBuilding.buildAllArea.rules[0].required = value
    form.value.fireBuilding.buildFloorArea.rules[0].required = value
    // form.value.fireBuilding.housingLife.rules[0].required = value
    // form.value.fireBuilding.buildUse.rules[0].required = value
    form.value.fireBuilding.isSpread.rules[0].required = value
    form.value.fireBuilding.isLoud.rules[0].required = value
    form.value.fireBuilding.isWindowOpened.rules[0].required = value
    form.value.fireBuilding.historyBuildLevel.rules[0].required = value
    // 消防设施
    form.value.fireFacilities.isFirefightFacility.rules[0].required = value
    form.value.fireFacilities.autoAlarm.rules[0].required = value
    // form.value.fireFacilities.autoAlarmInstall.rules[0].required = value
    // form.value.fireFacilities.autoAlarmStart.rules[0].required = value
    // form.value.fireFacilities.autoAlarmEffect.rules[0].required = value
    // form.value.fireFacilities.autoAlarmNotStart.rules[0].required = value
    // form.value.fireFacilities.autoAlarmNotInstall.rules[0].required = value
    form.value.fireFacilities.autoFireFight.rules[0].required = value
    // form.value.fireFacilities.autoFireFightInstall.rules[0].required = value
    // form.value.fireFacilities.autoFireFightStart.rules[0].required = value
    // form.value.fireFacilities.autoFireFightEffect.rules[0].required = value
    // form.value.fireFacilities.autoFireFightNotStart.rules[0].required = value
    // form.value.fireFacilities.autoFireFightNotInstall.rules[0].required = value
    form.value.fireFacilities.indoorHydrant.rules[0].required = value
    // form.value.fireFacilities.indoorHydrantInstall.rules[0].required = value
    // form.value.fireFacilities.indoorHydrantStart.rules[0].required = value
    // form.value.fireFacilities.indoorHydrantEffect.rules[0].required = value
    // form.value.fireFacilities.indoorHydrantNotStart.rules[0].required = value
    // form.value.fireFacilities.indoorHydrantNotInstall.rules[0].required = value
    form.value.fireFacilities.smokeControl.rules[0].required = value
    // form.value.fireFacilities.smokeControlInstall.rules[0].required = value
    // form.value.fireFacilities.smokeControlStart.rules[0].required = value
    // form.value.fireFacilities.smokeControlEffect.rules[0].required = value
    // form.value.fireFacilities.smokeControlNotStart.rules[0].required = value
    // form.value.fireFacilities.smokeControlNotInstall.rules[0].required = value
    form.value.fireFacilities.fireShutter.rules[0].required = value
    // form.value.fireFacilities.fireShutterInstall.rules[0].required = value
    // form.value.fireFacilities.fireShutterStart.rules[0].required = value
    // form.value.fireFacilities.fireShutterEffect.rules[0].required = value
    // form.value.fireFacilities.fireShutterNotStart.rules[0].required = value
    // form.value.fireFacilities.fireShutterNotInstall.rules[0].required = value
    form.value.fireFacilities.emergencyLight.rules[0].required = value
    // form.value.fireFacilities.lightNonConformance.rules[0].required = value
    form.value.fireFacilities.networking.rules[0].required = value
    // form.value.fireFacilities.networkAlarm.rules[0].required = value
    form.value.fireFacilities.fireCompartment.rules[0].required = value
    // form.value.fireFacilities.compartmentArea.rules[0].required = value
    form.value.fireFacilities.fireSeparation.rules[0].required = value
    // form.value.fireFacilities.separationMeter.rules[0].required = value
    form.value.fireFacilities.escapeRoute.rules[0].required = value
    // form.value.fireFacilities.routeNonConformance.rules[0].required = value
    form.value.fireFacilities.emergencyExit.rules[0].required = value
    // form.value.fireFacilities.exitNonConformance.rules[0].required = value
    // 案件办理
    form.value.caseHandling.handleTwoCase.rules[0].required = value
    form.value.caseHandling.firePenalty.rules[0].required = value
    // 火灾照片
    form.value.firePhoto.photos.rules[0].required = value
    form.value.firePhoto.isAllBack.rules[0].required = value
    // 起火经过
    form.value.fireCourse.firePassage.rules[0].required = value
    // 其他附件
    // form.value.otherAttach.attach.rules[0].required = value
    // form.value.otherAttach.otherRemark.rules[0].required = value
    // formRef.value?.clearValidate()
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

  return { form, isRequired, handleUseForm, initFormWhenChange, initFormByDetail, initDraftRules, checkFieldWarning, generateRemarkField }
}
