import { nextTick, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
// import { checkAttendanceDate, checkDispatchNum, checkFireDistance, checkIsResponseTruck, checkReturnSpeed, checkTrappedPerson } from './_tool.js'
import { fixCarInfo, getTypeText } from '@/utils/tools.js'
import { nonZeroPositiveInteger, nonnegativeNumberReg, positiveIntegerReg } from '@/utils/validate.js'

export const useFormConfig = () => {
  const formOrigin = {
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
