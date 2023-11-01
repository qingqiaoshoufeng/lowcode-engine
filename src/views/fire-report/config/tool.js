// import { notification } from '@castle/ant-design-vue'
// import { useRuleConfig } from '@/store/index.js'
import store from '@/store/index.js'
console.log(store,'store11');
export const checkArray = (arr) => {
  let result = false;
  ['工地', '居住场所', '物资仓储场所', '厂房'].forEach((item) => {
    if (arr.join(',').includes(`${item},`)) {
      result = true
    }
  })
  return result
}

// 校验耐火等级
export const checkFireResistanceRating = (form, options, prompt = true) => {
  form.fireBuilding.fireResistanceRating.warning = false
  form.fireBuilding.fireResistanceRating.warningText = ''
  form.fireBuilding.fieldWarning = form.fireBuilding.fieldWarning.replace('fireResistanceRating:true;', 'fireResistanceRating:false;')

  const { buildStructure, fireResistanceRating, buildFloor, buildType } = form.fireBuilding
  const { firePlace } = form.basicInfo
  const filter = options.buildStructure?.filter(item => item.boDictId === buildStructure.value)
  const rate = options.fireResistanceRating?.filter(item => item.boDictId === fireResistanceRating.value)
  // 建筑结构
  if (filter?.[0]?.dictName === '钢砼结构' && (rate?.[0]?.dictName === '三级' || rate?.[0]?.dictName === '四级')) {
    form.fireBuilding.fireResistanceRating.warning = true
  }
  else if (filter?.[0]?.dictName === '砖混结构' && rate?.[0]?.dictName === '四级') {
    form.fireBuilding.fireResistanceRating.warning = true
  }
  else if (filter?.[0]?.dictName === '砖木结构' && (rate?.[0]?.dictName === '一级' || rate?.[0]?.dictName === '二级')) {
    form.fireBuilding.fireResistanceRating.warning = true
  }
  else if (filter?.[0]?.dictName === '木结构' && (rate?.[0]?.dictName === '一级' || rate?.[0]?.dictName === '二级')) {
    form.fireBuilding.fireResistanceRating.warning = true
  }
  else if (filter?.[0]?.dictName === '彩钢板' && (rate?.[0]?.dictName === '一级' || rate?.[0]?.dictName === '二级')) {
    form.fireBuilding.fireResistanceRating.warning = true
  }
  else if (filter?.[0]?.dictName === '彩钢棚' && (rate?.[0]?.dictName === '一级' || rate?.[0]?.dictName === '二级')) {
    form.fireBuilding.fireResistanceRating.warning = true
  }
  if (form.fireBuilding.fireResistanceRating.warning === true) {
    form.fireBuilding.fireResistanceRating.warningText = `建筑结构为${filter?.[0]?.dictName}，耐火等级选择不合理，请修改或备注！`
    form.fireBuilding.fieldWarning = form.fireBuilding.fieldWarning.replace('fireResistanceRating:false;', 'fireResistanceRating:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: `建筑结构为${filter?.[0]?.dictName}，耐火等级选择不合理，请修改或备注！`, style: { backgroundColor: 'orange' } })
  }
  // 起火场所、建筑楼层
  const types = options.buildType?.filter(item => item.boDictId === buildType.value)
  if (firePlace?.text?.indexOf('居住场所') > -1 && buildFloor.value >= 19 && (rate?.[0]?.dictName === '二级' || rate?.[0]?.dictName === '三级' || rate?.[0]?.dictName === '四级')) {
    form.fireBuilding.fireResistanceRating.warning = true
    form.fireBuilding.fireResistanceRating.warningText = '居住场所，19<=总楼层数，耐火等级选择二、三、四级不合理，请修改或备注！'
    // prompt && notification.open({ message: '填报异常提醒', description: '居住场所，19<=总楼层数，耐火等级选择二、三、四级不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else if (firePlace?.text?.indexOf('居住场所') > -1 && (buildFloor.value < 19 && buildFloor.value >= 10) && (rate?.[0]?.dictName === '三级' || rate?.[0]?.dictName === '四级')) {
    form.fireBuilding.fireResistanceRating.warning = true
    form.fireBuilding.fireResistanceRating.warningText = '居住场所，10<=总楼层数<19，耐火等级选择三、四级不合理，请修改或备注！'
    // prompt && notification.open({ message: '填报异常提醒', description: '居住场所，10<=总楼层数<19，耐火等级选择三、四级不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else if (checkArray(firePlace?.text) && buildFloor.value >= 17 && (rate?.[0]?.dictName === '二级' || rate?.[0]?.dictName === '三级' || rate?.[0]?.dictName === '四级')) {
    form.fireBuilding.fireResistanceRating.warning = true
    form.fireBuilding.fireResistanceRating.warningText = '17<=总楼层数，耐火等级选择二、三、四级不合理，请修改或备注！'
    // prompt && notification.open({ message: '填报异常提醒', description: '17<=总楼层数，耐火等级选择二、三、四级不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else if (checkArray(firePlace?.text) && (buildFloor.value >= 9 && buildFloor.value < 17) && (rate?.[0]?.dictName === '三级' || rate?.[0]?.dictName === '四级')) {
    form.fireBuilding.fireResistanceRating.warning = true
    form.fireBuilding.fireResistanceRating.warningText = '9<=总楼层数<17，耐火等级选择二、三、四级不合理，请修改或备注！'
    // prompt && notification.open({ message: '填报异常提醒', description: '9<=总楼层数<17，耐火等级选择二、三、四级不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else if (firePlace?.text?.indexOf('厂房') > -1 && types?.[0]?.dictName === '高层' && (rate?.[0]?.dictName === '三级' || rate?.[0]?.dictName === '四级')) {
    form.fireBuilding.fireResistanceRating.warning = true
    form.fireBuilding.fireResistanceRating.warningText = '厂房火灾，建筑类别为高层时，选择三、四级不合理，请修改或备注！'
    // prompt && notification.open({ message: '填报异常提醒', description: '厂房火灾，建筑类别为高层时，选择三、四级不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else if (types?.[0]?.dictName === '地下' && (rate?.[0]?.dictName === '二级' || rate?.[0]?.dictName === '三级' || rate?.[0]?.dictName === '四级')) {
    form.fireBuilding.fireResistanceRating.warning = true
    form.fireBuilding.fireResistanceRating.warningText = '建筑类别为地下室，选择二、三、四级不合理，请修改或备注！'
    // prompt && notification.open({ message: '填报异常提醒', description: '建筑类别为地下室，选择二、三、四级不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  if (form.fireBuilding.fireResistanceRating.warning === true) {
    form.fireBuilding.fieldWarning = form.fireBuilding.fieldWarning.replace('fireResistanceRating:false;', 'fireResistanceRating:true;')
  }
}

// 校验受灾户数（户）
export const checkAffectedHouse = (form, prompt = true) => {
  const { basicInfo, economicLoss } = form
  if (economicLoss.affectedHouse.value === 0 && basicInfo.severity.value === '2' && basicInfo.firePlace?.text?.indexOf('居住场所') > -1) {
    form.economicLoss.affectedHouse.warning = true
    form.economicLoss.fieldWarning = form.economicLoss.fieldWarning.replace('affectedHouse:false;', 'affectedHouse:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: '非轻微火灾，居住场所受灾户数为0不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else {
    form.economicLoss.affectedHouse.warning = false
    form.economicLoss.fieldWarning = form.economicLoss.fieldWarning.replace('affectedHouse:true;', 'affectedHouse:false;')
  }
}

// 人身伤亡医疗支出（元)
export const checkFireInjuryCost = (form, prompt = true) => {
  const { casualtyWar, economicLoss } = form
  if (economicLoss.fireInjuryCost.value > 0
    && (casualtyWar.isInjured.value !== '1' || (casualtyWar.injuryNum.value <= 0 && casualtyWar.injuredList?.length <= 0))
    && casualtyWar.isDead.value !== '1') {
    form.economicLoss.fireInjuryCost.warning = true
    form.economicLoss.fieldWarning = form.economicLoss.fieldWarning.replace('fireInjuryCost:false;', 'fireInjuryCost:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: '无人员伤亡，人身伤亡支出费用应该为0，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else {
    form.economicLoss.fireInjuryCost.warning = false
    form.economicLoss.fieldWarning = form.economicLoss.fieldWarning.replace('fireInjuryCost:true;', 'fireInjuryCost:false;')
  }
}

// 火灾现场处置费用（元)
export const checkFireDisposalCost = (form, prompt = true) => {
  const { basicInfo, economicLoss } = form
  if (economicLoss.fireDisposalCost.value === 0 && basicInfo.severity.value === '2') {
    form.economicLoss.fireDisposalCost.warning = true
    form.economicLoss.fieldWarning = form.economicLoss.fieldWarning.replace('fireDisposalCost:false;', 'fireDisposalCost:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: '非轻微火灾，现场处置费用为0，不合理，请修改或备注！', style: { backgroundColor: 'orange' } })
  }
  else {
    form.economicLoss.fireDisposalCost.warning = false
    form.economicLoss.fieldWarning = form.economicLoss.fieldWarning.replace('fireDisposalCost:true;', 'fireDisposalCost:false;')
  }
}

// 过火面积
export const checkBurnedArea = (form, prompt = true) => {
  // const { ruleConfig: { severityConfig } } = useRuleConfig()
  const severityConfig = store.state?.rules?.ruleConfig?.severityConfig|| []
  const { burnedArea, severity, fireType } = form.basicInfo
  if ((Number(burnedArea.value) < severityConfig?.[0]?.value?.[0] || Number(burnedArea.value > severityConfig?.[0]?.value?.[1]))
  && severity.value === '1' && fireType?.text?.includes('建构筑物火灾')) {
    form.basicInfo.burnedArea.warning = true
    form.basicInfo.burnedArea.warningText = `当火灾为轻微火灾时，建构筑物火灾的过火面积合理范围为${severityConfig?.[0]?.value?.[0]}-${severityConfig?.[0]?.value?.[1]}平方米`
    form.basicInfo.fieldWarning = form.basicInfo.fieldWarning.replace('burnedArea:false;', 'burnedArea:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: form.basicInfo.burnedArea.warningText, style: { backgroundColor: 'orange' } })
  }
  else if ((Number(burnedArea.value) < severityConfig?.[1]?.value?.[0] || Number(burnedArea.value > severityConfig?.[1]?.value?.[1]))
  && severity.value === '1' && !fireType?.text?.includes('建构筑物火灾')) {
    form.basicInfo.burnedArea.warning = true
    form.basicInfo.burnedArea.warningText = `当火灾为轻微火灾时，非建构筑物火灾的过火面积合理范围为${severityConfig?.[1]?.value?.[0]}-${severityConfig?.[1]?.value?.[1]}平方米`
    form.basicInfo.fieldWarning = form.basicInfo.fieldWarning.replace('burnedArea:false;', 'burnedArea:true;')
    // prompt && notification.open({ message: '填报异常提醒', description: form.basicInfo.burnedArea.warningText, style: { backgroundColor: 'orange' } })
  }
  else {
    form.basicInfo.burnedArea.warning = false
    form.basicInfo.fieldWarning = form.basicInfo.fieldWarning.replace('burnedArea:true;', 'burnedArea:false;')
  }
}
