import dayjs from 'dayjs'
// import { notification } from '@castle/ant-design-vue'
// import { useRuleConfig } from '@/store/index.js'

// 校验到场时间
export const checkAttendanceDate = (form, prompt = true) => {
  // const { ruleConfig: { speedConfig } } = useRuleConfig()

  // form.basicInformation.attendanceDate.warning = false
  // form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('attendanceDate:true;', 'attendanceDate:false;')
  // const { attendanceDate, dispatchDate, fireDistance } = form.basicInformation
  // if (attendanceDate.value && dispatchDate.value && (attendanceDate.value?.unix() > dispatchDate.value?.unix()) && fireDistance.value) {
  //   const time = dayjs(attendanceDate.value).diff(dayjs(dispatchDate.value), 'second')
  //   const speed = fireDistance.value / time * 60 * 60
  //   if (speed < speedConfig?.value?.[0] || speed > speedConfig?.value?.[1]) {
  //     form.basicInformation.attendanceDate.warning = true
  //     form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('attendanceDate:false;', 'attendanceDate:true;')
  //     prompt && notification.open({ message: '填报异常提醒', description: `根据时速${speedConfig?.value?.[0]}-${speedConfig?.value?.[1]}km/h计算，到场时间不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
  //   }
  // }
}

// 校验抢救人数
export const checkRescueNum = (form, prompt = true) => {
  // const { battleResult, basicInformation } = form
  // if (battleResult.rescueNum.value > 0 && basicInformation.trappedPerson.value > 0 && battleResult.rescueNum.value > basicInformation.trappedPerson.value) {
  //   form.battleResult.rescueNum.warning = true
  //   form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('rescueNum:false;', 'rescueNum:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: '抢救人数不能大于现场被困人数！', style: { backgroundColor: 'orange' } })
  // }
  // else {
  //   form.battleResult.rescueNum.warning = false
  //   form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('rescueNum:true;', 'rescueNum:false;')
  // }
}

// 校验车辆出动
export const checkIsResponseTruck = (form, prompt = true) => {
  // const { commander, firemen, isResponseTruck } = form.investForce
  // if (((commander.value?.length > 0 && firemen.value?.length === 0) || (commander.value?.length === 0 && firemen.value?.length > 0) || (commander.value?.length > 0 && firemen.value?.length > 0))
  //   && isResponseTruck.value === '2') {
  //   form.investForce.isResponseTruck.warning = true
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('isResponseTruck:false;', 'isResponseTruck:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: '人车配比不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  // }
  // else {
  //   form.investForce.isResponseTruck.warning = false
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('isResponseTruck:true;', 'isResponseTruck:false;')
  // }
}

// 校验现场被困人数（人）
export const checkTrappedPerson = (detail, form, prompt = true) => {
  // const { ruleConfig: { trappedConfig } } = useRuleConfig()
  // const { basicInformation } = form
  // if (detail?.warningLevelValue === '一级' && (basicInformation.trappedPerson.value > trappedConfig?.value?.[1] || basicInformation.trappedPerson.value < trappedConfig?.value?.[0])) {
  //   form.basicInformation.trappedPerson.warning = true
  //   form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('trappedPerson:false;', 'trappedPerson:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: `一级警情或轻微火灾，被困人数合理范围为${trappedConfig?.value?.[0]}-${trappedConfig?.value?.[1]}人，请修改或备注！`, style: { backgroundColor: 'orange' } })
  // }
  // else {
  //   form.basicInformation.trappedPerson.warning = false
  //   form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('trappedPerson:true;', 'trappedPerson:false;')
  // }
}

// 校验现场距离
export const checkFireDistance = (form, prompt = true) => {
  // const { ruleConfig: { distanceConfig } } = useRuleConfig()

  // form.basicInformation.fireDistance.warning = false
  // form.basicInformation.fireDistance.warningText = ''
  // form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:true;', 'fireDistance:false;')
  // const { fireDistance } = form.basicInformation
  // if (Number(fireDistance.value) < distanceConfig?.[0]?.value && form.investForce.dispatchTruckList?.value?.length > 0) {
  //   form.basicInformation.fireDistance.warning = true
  //   form.basicInformation.fireDistance.warningText = `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`
  //   form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:false;', 'fireDistance:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
  // }
  // if (Number(fireDistance.value) > distanceConfig?.[1]?.value) {
  //   form.basicInformation.fireDistance.warning = true
  //   form.basicInformation.fireDistance.warningText = `行驶距离超过${distanceConfig?.[1]?.value}公里不合理，请修改或备注！`
  //   form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:false;', 'fireDistance:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: `行驶距离超过${distanceConfig?.[1]?.value}公里不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
  // }
}

// 校验车辆
export const checkDispatchTruckList = (form, prompt = true) => {
  // const { ruleConfig: { distanceConfig } } = useRuleConfig()

  // const { fireDistance } = form.basicInformation
  // if (Number(fireDistance.value) <= distanceConfig?.[0]?.value && form.investForce.dispatchTruckList.value?.length > 0) {
  //   form.basicInformation.fireDistance.warning = true
  //   form.basicInformation.fireDistance.warningText = `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`
  //   form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:false;', 'fireDistance:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
  // }
  // else {
  //   form.basicInformation.fireDistance.warning = false
  //   form.basicInformation.fireDistance.warningText = ''
  //   form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:true;', 'fireDistance:false;')
  // }
}

// 校验出动人数
export const checkDispatchNum = (form, prompt = true) => {
  // const { ruleConfig: { carRateConfig } } = useRuleConfig()

  // const { commander, firemen, dispatchTruckList } = form.investForce
  // if (dispatchTruckList.value?.length > 0 && commander.value && firemen.value
  //   && dispatchTruckList.value?.length * carRateConfig?.value?.[0] > commander.value?.length + firemen.value?.length) {
  //   form.investForce.commander.warning = true
  //   form.investForce.firemen.warning = true
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commander:false;', 'commander:true;')
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemen:false;', 'firemen:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: `人车比低于${carRateConfig?.value?.[0]}:1，不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
  // }
  // else if (dispatchTruckList.value?.length > 0 && commander.value && firemen.value
  //   && dispatchTruckList.value?.length * carRateConfig?.value?.[1] < commander.value?.length + firemen.value?.length) {
  //   form.investForce.commander.warning = true
  //   form.investForce.firemen.warning = true
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commander:false;', 'commander:true;')
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemen:false;', 'firemen:true;')
  //   prompt && notification.open({ message: '填报异常提醒', description: `人车比高于${carRateConfig?.value?.[1]}：1，不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
  // }
  // else {
  //   form.investForce.commander.warning = false
  //   form.investForce.firemen.warning = false
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commander:true;', 'commander:false;')
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemen:true;', 'firemen:false;')
  // }
}

// 时速在 20 ~ 120，显示到场时速异常原因
export const checkReturnSpeed = (form) => {
  // const { attendanceDate, dispatchDate, fireDistance } = form.basicInformation
  // if (attendanceDate.value && dispatchDate.value && (attendanceDate.value?.unix() > dispatchDate.value?.unix()) && fireDistance.value) {
  //   const time = dayjs(attendanceDate.value).diff(dayjs(dispatchDate.value), 'second')
  //   const speed = fireDistance.value / time * 60 * 60
  //   form.basicInformation.presentSpeed.value = Number(speed.toFixed(2))
  // }
}
