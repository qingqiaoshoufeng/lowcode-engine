import dayjs from 'dayjs'
// import { notification } from '@castle/ant-design-vue'
import store from '@/store/index.js'
import { showToast } from "vant";
const ruleConfig = store.state?.rules?.ruleConfig
// import { useRuleConfig } from '@/store/index.js'
import { cloneDeep } from 'lodash-es'

// 校验到场时间
export const checkAttendanceDate = (form, prompt = true) => {
  // const { speedConfig } = store.getters['rules/getAllRules']

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
  const { battleResult, basicInformation } = form
  if (battleResult.rescueNum.value > 0 && basicInformation.trappedPerson.value > 0 && battleResult.rescueNum.value > basicInformation.trappedPerson.value) {
    form.battleResult.rescueNum.warning = true
    form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('rescueNum:false;', 'rescueNum:true;')
    prompt && notification.open({ message: '填报异常提醒', description: '抢救人数不能大于现场被困人数！', style: { backgroundColor: 'orange' } })
    prompt && showToast('抢救人数不能大于现场被困人数！')
  }
  else {
    form.battleResult.rescueNum.warning = false
    form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('rescueNum:true;', 'rescueNum:false;')
  }
}

// 校验车辆出动
export const checkIsResponseTruck = (form, prompt = true) => {
  // const { commander, firemen, isResponseTruck } = form.investForce
  // if (((commander.value?.length > 0 && firemen.value?.length === 0) || (commander.value?.length === 0 && firemen.value?.length > 0) || (commander.value?.length > 0 && firemen.value?.length > 0))
  //   && isResponseTruck.value === '2') {
  //   form.investForce.isResponseTruck.warning = true
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('isResponseTruck:false;', 'isResponseTruck:true;')
  //   // prompt && notification.open({ message: '填报异常提醒', description: '人车配比不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  //   prompt && showToast('人车配比不合理，请修改或备注！')
  // }
  // else {
  //   form.investForce.isResponseTruck.warning = false
  //   form.investForce.fieldWarning = form.investForce.fieldWarning.replace('isResponseTruck:true;', 'isResponseTruck:false;')
  // }
}

// 校验现场被困人数（人）
export const checkTrappedPerson = (detail, form, prompt = true) => {
  const { trappedConfig } = store.getters['rules/getAllRules']
  const { basicInformation } = form
  if (detail?.warningLevelValue === '一级' && (basicInformation.trappedPerson.value > trappedConfig?.value?.[1] || basicInformation.trappedPerson.value < trappedConfig?.value?.[0])) {
    form.basicInformation.trappedPerson.warning = true
    form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('trappedPerson:false;', 'trappedPerson:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: `一级警情或轻微火灾，被困人数合理范围为${trappedConfig?.value?.[0]}-${trappedConfig?.value?.[1]}人，请修改或备注！`, style: { backgroundColor: 'orange' } })
    prompt && showToast(`一级警情或轻微火灾，被困人数合理范围为${trappedConfig?.value?.[0]}-${trappedConfig?.value?.[1]}人，请修改或备注！`)
  }
  else {
    form.basicInformation.trappedPerson.warning = false
    form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('trappedPerson:true;', 'trappedPerson:false;')
  }
}

// 校验现场距离
export const checkFireDistance = (form, prompt = true) => {
  const { distanceConfig } = store.getters['rules/getAllRules']

  form.basicInformation.fireDistance.warning = false
  form.basicInformation.fireDistance.warningText = ''
  form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:true;', 'fireDistance:false;')
  const { fireDistance } = form.basicInformation
  if (form.basicInformation.dealSituation?.text !== '中途返回') {
    if (Number(fireDistance.value) <= distanceConfig?.[0]?.value && form.investForce.dispatchTruckList?.value?.length > 0) {
      form.basicInformation.fireDistance.warning = true
      form.basicInformation.fireDistance.warningText = `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`
      form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:false;', 'fireDistance:true;')
      // prompt && notification.open({ message: '填报异常提醒', description: `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
      prompt && showToast(`有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`)
    }
    if (Number(fireDistance.value) > distanceConfig?.[1]?.value) {
      form.basicInformation.fireDistance.warning = true
      form.basicInformation.fireDistance.warningText = `行驶距离超过${distanceConfig?.[1]?.value}公里不合理，请修改或备注！`
      form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:false;', 'fireDistance:true;')
      // prompt && notification.open({ message: '填报异常提醒', description: `行驶距离超过${distanceConfig?.[1]?.value}公里不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
      prompt && showToast(`行驶距离超过${distanceConfig?.[1]?.value}公里不合理，请修改或备注！`)
    }
  }
}

// 校验车辆
// export const checkDispatchTruckList = (form, prompt = true) => {
//   const { distanceConfig } = store.getters['rules/getAllRules']

//   const { fireDistance } = form.basicInformation
//   if (Number(fireDistance.value) <= distanceConfig?.[0]?.value && form.investForce.dispatchTruckList.value?.length > 0) {
//     form.basicInformation.fireDistance.warning = true
//     form.basicInformation.fireDistance.warningText = `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`
//     form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:false;', 'fireDistance:true;')
//     // prompt && notification.open({ message: '填报异常提醒', description: `有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
//     prompt && showToast(`有车辆出动，行驶距离小于${distanceConfig?.[0]?.value}不合理，请修改或备注！`)
//   }
//   else {
//     form.basicInformation.fireDistance.warning = false
//     form.basicInformation.fireDistance.warningText = ''
//     form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:true;', 'fireDistance:false;')
//   }
// }
export const checkDispatchTruckList = (form, prompt = true) => {
  const distanceConfig= ruleConfig.distanceConfig
  const { fireDistance } = form.basicInformation
  if (form.basicInformation.dealSituation?.text !== '中途返回') {
    if (Number(fireDistance.value) <= distanceConfig?.[0]?.value && form.investForce.dispatchTruckList.value?.length > 0) {
      form.basicInformation.fireDistance.warning = true
      form.basicInformation.fireDistance.warningText = `有车辆出动，行驶距离小于等于${distanceConfig?.[0]?.value}不合理，请修改或备注！`
      form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:false;', 'fireDistance:true;')
      prompt && showToast(`有车辆出动，行驶距离小于等于${distanceConfig?.[0]?.value}不合理，请修改或备注！`)
    }
    else {
      form.basicInformation.fireDistance.warning = false
      form.basicInformation.fireDistance.warningText = ''
      form.basicInformation.fieldWarning = form.basicInformation.fieldWarning.replace('fireDistance:true;', 'fireDistance:false;')
    }
  }
}

function getPersonNum(form, nationTeamFlag) {
  if (!nationTeamFlag && Number(form.investForce?.commanderNum.value) + Number(form.investForce?.firemenNum.value) > 0) {
    return Number(form.investForce?.commanderNum.value) + Number(form.investForce?.firemenNum.value)
  }
  if (form.investForce.commander?.value || form.investForce.firemen?.value) {
    const ids = form.investForce.commander?.value?.map(item => item.boFireUserId)?.join(',') || ''
    const result = cloneDeep(form.investForce.commander?.value) || []
    form.investForce.firemen.value?.forEach((item) => {
      if (!ids.includes(item.boFireUserId)) {
        result.push(item)
      }
    })
    return result?.length
  }
  return 0
}

// 校验出动人数
export const checkDispatchNum = (form, prompt = true, nationTeamFlag) => {
  const { carRateConfig } = store.getters['rules/getAllRules']

  const { commanderNum, firemenNum, commander, firemen, dispatchTruckList } = form.investForce
  if (dispatchTruckList.value?.length > 0 && (commanderNum.value + firemenNum.value > 0) && !nationTeamFlag
    && dispatchTruckList.value?.length * carRateConfig?.value?.[0] > getPersonNum(form, nationTeamFlag)) {
    form.investForce.commanderNum.warning = true
    form.investForce.firemenNum.warning = true
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commanderNum:false;', 'commanderNum:true;')
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemenNum:false;', 'firemenNum:true;')
    prompt && showToast(`人车比低于${carRateConfig?.value?.[0]}:1，不合理，请修改或备注！`)
  }
  else if (dispatchTruckList.value?.length > 0 && (commanderNum.value + firemenNum.value > 0) && !nationTeamFlag
    && dispatchTruckList.value?.length * carRateConfig?.value?.[1] < getPersonNum(form, nationTeamFlag)) {
    form.investForce.commanderNum.warning = true
    form.investForce.firemenNum.warning = true
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commanderNum:false;', 'commanderNum:true;')
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemenNum:false;', 'firemenNum:true;')
    prompt && showToast(`人车比高于${carRateConfig?.value?.[1]}：1，不合理，请修改或备注！`)
  }
  else if (dispatchTruckList.value?.length > 0 && commander.value && firemen.value && nationTeamFlag
    && dispatchTruckList.value?.length * carRateConfig?.value?.[0] > getPersonNum(form, nationTeamFlag)) {
    form.investForce.commander.warning = true
    form.investForce.firemen.warning = true
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commander:false;', 'commander:true;')
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemen:false;', 'firemen:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: `人车比低于${carRateConfig?.value?.[0]}:1，不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
    prompt && showToast(`人车比低于${carRateConfig?.value?.[0]}:1，不合理，请修改或备注！`)
  }
  else if (dispatchTruckList.value?.length > 0 && commander.value && firemen.value && nationTeamFlag
    && dispatchTruckList.value?.length * carRateConfig?.value?.[1] < getPersonNum(form, nationTeamFlag)) {
    form.investForce.commander.warning = true
    form.investForce.firemen.warning = true
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commander:false;', 'commander:true;')
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemen:false;', 'firemen:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: `人车比高于${carRateConfig?.value?.[1]}：1，不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
    prompt && showToast(`人车比高于${carRateConfig?.value?.[1]}：1，不合理，请修改或备注！`)
  }
  else {
    form.investForce.commanderNum.warning = false
    form.investForce.firemenNum.warning = false
    form.investForce.commander.warning = false
    form.investForce.firemen.warning = false
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commanderNum:true;', 'commanderNum:false;')
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemenNum:true;', 'firemenNum:false;')
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('commander:true;', 'commander:false;')
    form.investForce.fieldWarning = form.investForce.fieldWarning.replace('firemen:true;', 'firemen:false;')
  }
}

// 时速在 20 ~ 120，显示平均时速异常原因
export const checkReturnSpeed = (form) => {
  const { attendanceDate, dispatchDate, fireDistance } = form.basicInformation
  if (attendanceDate.value && dispatchDate.value && (attendanceDate.value?.unix() > dispatchDate.value?.unix()) && fireDistance.value) {
    const time = dayjs(attendanceDate.value).diff(dayjs(dispatchDate.value), 'second')
    const speed = fireDistance.value / time * 60 * 60
    form.basicInformation.presentSpeed.value = Number(speed.toFixed(2))
  } else {
    form.basicInformation.presentSpeed.value = ''
  }
}

// 校验抢救财产价值
export const checkEmergencyNum = (form, prompt = true) => {
  form.battleResult.emergencyNum.warning = false
  form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('emergencyNum:true;', 'emergencyNum:false;')
  const { emergencyNum } = form.battleResult
  if (Number(emergencyNum.value) > 10000000) {
    form.battleResult.emergencyNum.warning = true
    form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('emergencyNum:false;', 'emergencyNum:true;')
    prompt && showToast('抢救财产超1千万，请备注说明！')
  }
}

// 校验保护财产价值
export const checkProtectNum = (form, prompt = true) => {
  form.battleResult.protectNum.warning = false
  form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('protectNum:true;', 'protectNum:false;')
  const { protectNum } = form.battleResult
  if (Number(protectNum.value) > 10000000) {
    form.battleResult.protectNum.warning = true
    form.battleResult.fieldWarning = form.battleResult.fieldWarning.replace('protectNum:false;', 'protectNum:true;')
    prompt && showToast('保护财产超1千万，请备注说明！')
  }
}
