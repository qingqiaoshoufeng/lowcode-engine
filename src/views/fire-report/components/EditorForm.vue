<script setup>
import { computed, inject, nextTick, onMounted, provide, ref, watch } from 'vue'
import store from '@/store/index.js'
import ProCard from "@/component/ProCard/index.vue";
import { cloneDeep } from 'lodash-es'
import { useDetail, useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
import { useAsyncQueue } from '@vueuse/core'
import FireInfo from '@/views/dispatchReportForm/components/fireInfo.vue'
import BaseInfo from './base-info.vue'
import CasualtyWar from './casualty-war.vue'
import EconomicLoss from './economic-loss.vue'
import FireFacilities from './fire-facilities.vue'
import CaseHandling from './case-handling.vue'
import FireBuilding from './fire-building.vue'
import FireCourse from './fire-course.vue'
import FirePhoto from './fire-photo.vue'
import OtherAttach from './other-attach.vue'
import BriefSituation from './fireInfoTransferList_brief-situation.vue'
import { useFormConfig } from '../config/form-config.js'
import ProcessReview from '@/component/ProcessReview/index.vue'
import { exportPdf } from '@/utils/export-pdf.js'
import { useOptions } from '@/hooks/useOptions.js'
// import { useSystemDict } from '@/store/index.js'
import { useModal } from '@/hooks/useModal.js'
import { useSuccess } from '@/hooks/useSuccess.js'
// import { useRerender } from '@/hooks/useRerender.js'
import { getTypeText, scrollFormFailed, interceptUnix } from '@/utils/tools.js'
import { useIntersection } from '@/hooks/useIntersection.js';
import {
  effect, exitNonConformance, gender, injuryType, install, isNot, isResearch,
  lightNonConformance, networkAlarm, networking, notStart, regulation, routeNonConformance, severity, start, uninstall,
} from '@/utils/constants.js'
import {
  approveFireActions,
  approveProcessActions,
  deleteFormFieldAnnotation,
  getFieldAnnotationDetail,
  getFireReportDetail,
  getFireWarningDetail,
  initFireReport,
  saveFireDispatchReport,
  saveTemporaryFireDispatchReport,
} from '@/apis/index.js'
import { showToast, showLoadingToast, closeToast } from 'vant';
// import ProSteps from '@/components/pro-steps/index.vue'

const diyValidateMap = ref({
  defaultKey:[]
})



provide('diyValidateMap',diyValidateMap)

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => {},
  },
  showDraft: {
    type: Boolean,
    default: false,
  },
  relevanceDraft: {
    type: Object,
    default: () => {},
  },
  isDetail: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isApproval: {
    type: Boolean,
    default: false,
  },
  isPolice: {
    type: Boolean,
    default: false,
  },
  isAgain: { // 退回起草人之后，重新修改提审
    type: Boolean,
    default: false,
  },
  isUnDispatch: { // 未出动火灾填报
    type: Boolean,
    default: false,
  },
  processKey: {
    type: String,
    default: '',
  },
  approvalText: {
    type: String,
    default: '',
  },
  labelText: {
    type: String,
    default: '审核',
  },
  renderDom: {
    type: String,
    default: '.ant-modal-content',
  },
  showExportPdf: { // 显示导出按钮
    type: Boolean,
    default: false,
  },
  setHandleOk: {
    type: Function,
  },
  setHandleExtend: {
    type: Function,
  },
  isReview:{
    type: Boolean,
    default: false,
  }
})

const statusList = ref([])

const formRef = ref(null)

const hidevalidate = ref(false)

// provide('validateProgress',validateProgress)
const emits = defineEmits(['finishCallback'])
const isShowTemporary = inject('isShowTemporary',false)
// const bus = inject('bus')

const getSystemDictSync = store.getters['dict/getSystemDictSync']

const { options } = useOptions()

const { show } = useModal()

// const { showCurrentDom } = useRerender(props.renderDom)

const { showSuccessModal } = useSuccess()

const { form,isRequired, initFormByDetail, initFormWhenChange, initDraftRules, checkFieldWarning, generateRemarkField } = useFormConfig()

const validateProgress = async()=>{
  if(formRef.value){
    hidevalidate.value = true
    try {
      const res = await formRef.value.validate()
     
    } catch (error) {
      // console.log(error,'resres');
      error.map(item=>{

      })
    }
    const statusMap = formRef.value.getValidationStatus()
    // console.log(statusMap,'statusMap');
    statusList.value = Object.entries(statusMap).reduce((current,item)=>{
      const [type,status] = item
      if(status === 'failed'){
        const typename = type.split('.')[0]
        current = [...new Set([...current,typename])]
      }
      return current
    },[])
    // console.log(statusList.value);
    // Object.keys(form.value).forEach(item=>{
    //   form.value[item].validateProgress = statusList.includes(item) ? 0 : 100
    // })
    setTimeout(()=>{
      formRef.value.resetValidation()
      hidevalidate.value = false
      if(diyValidateMap.value.defaultKey.length){
        diyValidateMap.value.defaultKey.forEach((item)=>{
          formRef.value.validate(item)
        })
      }
    },0)
    // console.log(statusList,'result');
  }
  // formRef.value.validate()

}

watch(
  () => form.value,
  () => {
    // nextTick(()=>{
    validateProgress()
    // })
  },
  { deep: true },
)

provide('isRequired',isRequired)
const showPreview = ref(null)

const importantEdit = ref(true) // 重要信息更正

const localFireInfoId = ref(props.currentRow?.boFireInfoId || uuidv4())

const isNew = ref(props.isUnDispatch || !!props.showDraft)

const initFireDetail = ref({ })

const fireDetail = ref(null)

const loadingDetail = ref(true)

const approvalForm = ref(null)

const unDispatch = ref(props.isUnDispatch)

const fieldExist = ref({})

// const active = ref(null)
const currenState = computed(() => {
  return props.currentRow?.fireStatusValue
})

// 建构筑物的轻微火灾
const showBuildingMinor = computed(() => {
  const { severity, fireType } = form.value.basicInfo
  return severity.value === '1' && fireType?.text?.includes('建构筑物火灾') // '轻微火灾'
})

// 其他类型的轻微火灾
const showOtherMinor = computed(() => {
  const { severity, fireType } = form.value.basicInfo
  return severity.value === '1' && !fireType?.text?.includes('建构筑物火灾') // '轻微火灾'
})

const showSevereFire = computed(() => {
  const { severity } = form.value.basicInfo
  return severity.value === '2' // '非轻微火灾'
})

// 建构筑物火灾
const showBuildingFire = computed(() => {
  const { basicInfo } = form.value
  return basicInfo.fireType?.text?.includes('建构筑物火灾')
})

// 交通工具火灾
const showVehicleFire = computed(() => {
  const { basicInfo } = form.value
  return basicInfo.fireType?.text?.includes('交通工具火灾')
})

// 起火位置
const checkArray = (arr, text) => {
  let result = false
  const selects = arr?.length > 1 ? arr.join(',') : `${arr?.[0]},`
  text.forEach((item) => {
    if (selects.includes(`${item},`)) {
      result = true
    }
  })
  return result
}
const showFireSite = computed(() => {
  const { fireType, firePlace, vehicleType } = form.value.basicInfo
  if (fireType?.text?.includes('建构筑物火灾') && checkArray(firePlace?.text, ['标志性/点缀性建筑', '废弃建筑', '发电储能场所', '城市地下综合管廊', '其他建构筑物'])) {
    return false
  }
  else if (fireType?.text?.includes('露天场所火灾') && !checkArray(firePlace?.text, ['公园', '影视基地'])) {
    return false
  }
  else if (fireType?.text?.includes('室外设施设备火灾') && !checkArray(firePlace?.text, ['油气管道'])) {
    return false
  }
  else if (fireType?.text?.includes('交通工具火灾') && !checkArray(vehicleType?.text, ['乘用车', '客车', '货车', '低速电动车', '铁路交通', '城市轨道交通', '水运交通', '航空航天'])) {
    return false
  }
  else if (fireType?.text?.includes('户外植被火灾')) {
    return false
  }
  else if (fireType?.text?.includes('垃圾及废弃物火灾')) {
    return false
  }
  return true
})

watch(() => form.value.basicInfo.isResearch.value, () => {
  initDraftRules(form.value.basicInfo.isResearch.value === '2', formRef)
})

const { detail, loadDetail } = useDetail({
  getDetailFn: () => getFireWarningDetail(props.currentRow.boFireWarningId),
})

provide('fieldByState', currenState)

provide('form', form)

provide('formRef', formRef)

provide('showPreview', showPreview)

provide('options', options)

provide('isDetail', props.isDetail)

provide('isApproval', props.isApproval)

provide('isEdit', props.isEdit)

provide('currentRow', props.currentRow)

provide('showDraft', props.showDraft)

provide('unDispatch', unDispatch)

provide('relevanceDraft', props.relevanceDraft)

provide('localFireInfoId', localFireInfoId)

provide('showFireSite', showFireSite)

provide('showVehicleFire', showVehicleFire)

provide('showSevereFire', showSevereFire)

provide('showBuildingMinor', showBuildingMinor)

provide('showOtherMinor', showOtherMinor)

provide('loadingDetail', loadingDetail)

provide('importantEdit', importantEdit)

provide('fieldExist', fieldExist)

provide('dataType', 3)

provide('initFireDetail', initFireDetail)

const sections = computed(() => {
  const { fireInfo, briefSituation, basicInfo, casualtyWar, economicLoss, fireBuilding, fireFacilities, caseHandling, firePhoto, fireCourse, otherAttach, proSteps } = form.value
  const result = {}
  if (!props.showDraft && !props.isPolice && !unDispatch.value) {
    result.fireInfo = fireInfo
  }
  if (!props.showDraft) {
    result.briefSituation = briefSituation
  }
  result.basicInfo = basicInfo
  if (showSevereFire.value) { // 严重火灾
    result.casualtyWar = casualtyWar
  }
  result.economicLoss = economicLoss
  if (showBuildingFire.value) { // 建构筑物火灾
    result.fireBuilding = fireBuilding
  }
  if (showBuildingFire.value && showSevereFire.value) { // 建构筑物火灾 && 严重火灾
    result.fireFacilities = fireFacilities
  }
  if (showSevereFire.value) { // 严重火灾
    result.caseHandling = caseHandling
  }
  result.firePhoto = firePhoto
  result.fireCourse = fireCourse
  result.otherAttach = otherAttach
  if (props.isDetail || (props.isApproval && props.labelText === '审核')) {
    result.proSteps = proSteps
  }
  return result
})


const { sideBarActive } = useIntersection(sections, '.box', props.offset);

const container = () => {
  return document.querySelector('.tab-pane-content') || document.querySelector('#record-wrap') || document.querySelector('.ant-modal-body')
}

// 打开审核弹窗
const showReviewDialog = ()=>{
  show.value.approvalVisible = true
}

const refreshField = () => {
  if (localFireInfoId.value) {
    getFieldAnnotationDetail({
      dataId: props.currentRow?.boFireInfoId || localFireInfoId.value,
      dataType: 3,
    }).then((res) => {
      if (res) {
        const { data, fieldModules } = res
        fieldExist.value = data
        form.value.basicInfo.fieldAnnotation = fieldModules?.basicInfo
        form.value.casualtyWar.fieldAnnotation = fieldModules?.casualtyWar
        form.value.economicLoss.fieldAnnotation = fieldModules?.economicLoss
        form.value.fireBuilding.fieldAnnotation = fieldModules?.fireBuilding
        form.value.fireFacilities.fieldAnnotation = fieldModules?.fireFacilities
        form.value.caseHandling.fieldAnnotation = fieldModules?.caseHandling
        form.value.firePhoto.fieldAnnotation = fieldModules?.firePhoto
        form.value.fireCourse.fieldAnnotation = fieldModules?.fireCourse
        form.value.otherAttach.fieldAnnotation = fieldModules?.otherAttach
      }
    })
  }
}

const deleteField = (remarkField, remarkField2) => {
  deleteFormFieldAnnotation({
    dataId: props.currentRow?.boFireInfoId || localFireInfoId.value,
    dataType: 3,
    remarkField,
    remarkField2,
  }).then((res) => {
    refreshField()
  })
}

provide('refreshField', refreshField)

provide('deleteField', deleteField)

const initFireSite = () => {
  // 起火位置字典修改
  const { fireType, firePlace, vehicleType } = form.value.basicInfo
  options.value.fireSite = []
  if (fireType.text?.includes('建构筑物火灾') && firePlace.text?.length > 0) {
    getSystemDictSync(['HZ_QHWZ_CS'], null, (res) => {
      options.value.fireSite = res.HZ_QHWZ_CS.filter(item => item.dictName?.indexOf(firePlace.text[0]) > -1)
    })
  }
  else if (fireType.text?.includes('露天场所火灾') && firePlace.text?.length > 0) {
    getSystemDictSync(['HZ_QHWZ_LTCS'], null, (res) => {
      options.value.fireSite = res.HZ_QHWZ_LTCS.filter(item => item.dictName?.indexOf(firePlace.text[0]) > -1)
    })
  }
  else if (fireType.text?.includes('室外设施设备火灾') && firePlace.text?.length > 0) {
    getSystemDictSync(['HZ_QHWZ_SWSS'], null, (res) => {
      options.value.fireSite = res.HZ_QHWZ_SWSS.filter(item => item.dictName?.indexOf(firePlace.text[0]) > -1)
    })
  }
  else if (fireType.text?.includes('交通工具火灾')) {
    getSystemDictSync(['HZ_QHWZ_JTGJ'], null, (res) => {
      if (vehicleType.text?.includes('乘用车') || vehicleType.text?.includes('客车') || vehicleType.text?.includes('货车')) {
        options.value.fireSite = res.HZ_QHWZ_JTGJ.filter(item => ['汽车'].includes(item.dictName))
      }
      else if (vehicleType.text?.includes('低速电动车')) {
        options.value.fireSite = res.HZ_QHWZ_JTGJ.filter(item => ['电动助力车'].includes(item.dictName))
      }
      else if (vehicleType.text?.includes('铁路交通')) {
        options.value.fireSite = res.HZ_QHWZ_JTGJ.filter(item => ['火车/地铁'].includes(item.dictName))
      }
      else if (vehicleType.text?.includes('城市轨道交通')) {
        options.value.fireSite = res.HZ_QHWZ_JTGJ.filter(item => ['火车/地铁'].includes(item.dictName))
      }
      else if (vehicleType.text?.includes('水运交通')) {
        options.value.fireSite = res.HZ_QHWZ_JTGJ.filter(item => ['船舶'].includes(item.dictName))
      }
      else if (vehicleType.text?.includes('航空航天')) {
        options.value.fireSite = res.HZ_QHWZ_JTGJ.filter(item => ['航空飞行器'].includes(item.dictName))
      }
    })
  }
  else {
    getSystemDictSync(['HZ_QHWZ_CS'], null, (res) => {
      options.value.fireSite = res.HZ_QHWZ_CS
    })
  }
}

const initWatch = () => {
  closeToast()
  const { fireType, severity } = form.value.basicInfo
  // 如果警情类型是建构筑物火灾，则火灾类型不能修改
  const { currentRow } = props
  if (!form.value.basicInfo.fireType.value && currentRow) {
    form.value.basicInfo.fireType.value = currentRow.warningType?.split(',')?.pop()
    form.value.basicInfo.fireType.completeValue = currentRow.warningType?.split(',')
    form.value.basicInfo.fireType.text = currentRow.warningTypeValue?.split('/')
  }
  // 轻微火灾，起火原因不能选择‘刑事放火’
  if (options.value.fireCause) {
    options.value.fireCause = options.value.fireCause.map((item) => {
      return {
        ...item,
        children: item.children?.map((temp) => {
          if (temp.dictName === '刑事放火') {
            return {
              ...temp,
              disabled:form.value.basicInfo.severity?.value === '1'
            }
          }
          return temp
        })
      }
    })
  }
  // 起火场所字典根据火灾类型赋值
  if (fireType.value && fireType.text) {
    let key = ''
    if (fireType.text.includes('建构筑物火灾')) {
      key = 'HZ_QHCS_JGZW'
    }
    else if (fireType.text.includes('交通工具火灾')) {
      key = 'HZ_QHCS_JGZW,HZ_QHCS_LTCS,HZ_QHCS_HWZB'
    }
    else if (fireType.text.includes('室外设施设备火灾')) {
      key = 'HZ_QHCS_SWSB'
    }
    else if (fireType.text.includes('露天场所火灾')) {
      key = 'HZ_QHCS_LTCS'
    }
    else if (fireType.text.includes('户外植被火灾')) {
      key = 'HZ_QHCS_HWZB'
    }
    else if (fireType.text.includes('垃圾及废弃物火灾')) {
      key = 'HZ_QHCS_LJFQ'
    }
    getSystemDictSync(key.split(','), null, (res) => {
      options.value.firePlace = []
      key.split(',').forEach((item) => {
        options.value.firePlace.push(...res[item])
      })
      form.value.basicInfo.firePlace.text = getTypeText(form.value.basicInfo.firePlace.value, options.value.firePlace)
    })
    initFireSite()
    refreshField()
  }
  watch(() => [
    form.value.basicInfo.fireType.value,
    form.value.basicInfo.firePlace.value,
    form.value.basicInfo.vehicleType.value,
  ], () => {
    initFireSite()
  })
  watch(() => [
    form.value.basicInfo.fireType.value,
    form.value.basicInfo.firePlace.value,
    form.value.basicInfo.severity.value,
  ], () => {
    initFormWhenChange()
    initDraftRules(props.showDraft ? false : form.value.basicInfo.isResearch.value === '2', formRef)
  })
  // 只有当填报、详情、修改状态下才自动生成处置过程
  if ((isShowTemporary?.value) || props.isDetail || props.isEdit || unDispatch.value) {
    watch(() => [form.value, detail.value], () => {
      generateRemarkField(detail.value, 1)
    }, { deep: true })
  }
  // 只有当填报状态下才自动生成处置过程
  if ((isShowTemporary?.value && !props.showDraft) || (unDispatch.value && !props.isDetail)) {
    watch(() => [form.value.basicInfo, form.value.casualtyWar, form.value.economicLoss], () => {
      generateRemarkField(detail.value, 2)
    }, { deep: true })
  }
  loadingDetail.value = false
  // 火灾地址由警情地址代入
  if (!form.value.basicInfo.fireDirection.value && detail.value?.warningAddr) {
    form.value.basicInfo.fireDirection.value = detail.value.warningAddr
  }
  initDraftRules(!props.showDraft, formRef)
  setTimeout(() => {
    showPreview.value = Boolean(props.isDetail && form.value.basicInfo.severity.value)
  }, 0)
}

const initFireProcess = () => {
  generateRemarkField(detail.value, 2)
}

provide('refreshProcess', initFireProcess)

const initDetail = () => {
  const { relevanceDraft, currentRow, isEdit, isDetail } = props
  if (relevanceDraft?.boFireInfoId
    || (isEdit && currentRow?.boFireInfoId)
    || (isDetail && currentRow?.boFireInfoId)) {
    const id = relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId
    getFireReportDetail({ id, fillFlag: currentRow?.fillFlag }).then((res) => {
      if (res) {
        fireDetail.value = res
        if (!props.showDraft && currentRow?.fireStatusValue === '待更正') {
          importantEdit.value = res.importantInfoRecheck
        }
        if (res.fireInfo?.isNoDispatchFlag === '1') {
          unDispatch.value = true
        }
        initFormByDetail(res, options.value, initWatch, detail.value)
      }
    })
  }
  else if (currentRow?.isStorage === '1') {
    const id = currentRow?.boFireInfoId
    getFireReportDetail({ id, fillFlag: currentRow?.fillFlag }).then((res) => {
      if (res) {
        fireDetail.value = res
        if (!props.showDraft && currentRow?.fireStatusValue === '待更正') {
          importantEdit.value = res.importantInfoRecheck
        }

        initFormByDetail(res, options.value, initWatch, detail.value)
      }
    })
  }
  else {
    initWatch()
  }
}

const initDict = () => {
  return new Promise((resolve, reject) => {
    // 获取字典
    options.value.install = install
    options.value.start = start
    options.value.effect = effect
    options.value.regulation = regulation
    options.value.isNot = isNot
    options.value.injuryType = injuryType
    options.value.uninstall = uninstall
    options.value.notStart = notStart
    options.value.severity = severity
    options.value.lightNonConformance = lightNonConformance
    options.value.gender = gender
    options.value.exitNonConformance = exitNonConformance
    options.value.routeNonConformance = routeNonConformance
    options.value.networkAlarm = networkAlarm
    options.value.networking = networking
    options.value.isResearch = isResearch
    getSystemDictSync(['HZ_QHXT_SGXT', 'HZ_QHCS', 'HZ_INFO_JJLX', 'HZ_INFO_YY', 'HZ_QHW_TYPE', 'HZ_QHWZ_CS',
      'HZ_QHYY', 'HZ_JTGJ', 'HZ_INFO_SSBW', 'HZ_YHY', 'HZ_INFO_JZLB', 'HZ_INFO_NHDJ', 'HZ_INFO_JZJG',
      'HZ_INFO_DCFS', 'HZ_INFO_SSLY', 'HZ_INFO_XFSS_AZFW', 'HZ_INFO_STZY', 'HZ_INFO_ZY', 'HZ_INFO', 'HZ_INFO_JKZK',
      'HZ_INFO_SGBM', 'HZ_INFO_JCQK', 'Fire_TYPE', 'HZ_INFO_JZXS', 'HZ_INFO_DCLX', 'HZ_INFO_XSZT', 'HZ_INFO_BGSY',
      'HZ_INFO_SJY', 'HZ_INFO_BXLX', 'HZ_SW_MZ', 'HZ_QHJZ_JZYT', 'HZ_XZCF', 'HZ_INFO_CDZT', 'HZ_INFO_DLLX',
      'HZ_SW_LYXQ', 'HZ_SW_STWZ', 'HZ_SW_ZJLX', 'HZ_INFO_SZ', 'HZ_INFO_LY', 'HZ_INFO_JCQK', 'HZ_INFO_JCQK_JC',
      'CD_CZRY_SEX', 'JQ_TYPE', 'HZ_INFO_HZDJ', 'HZ_QHJZ_JZBQ', 'HZ_INFO_YY', 'HZ_INFO_QY', 'HZ_INFO_QY_QT', 'DEAD_TIME',
      'HZ_INFO_RWYS','CD_HYZG', 'WX_FL'], null, (res) => {
      options.value.firePattern = res.HZ_QHXT_SGXT // 事故形态
      options.value.fireType = res?.JQ_TYPE?.filter(item => item.dictName === '火灾扑救') // 火灾类型
      options.value.firePlace = res.HZ_QHCS // 起火场所类型
      options.value.industry = res.HZ_INFO // 所属行业
      options.value.economicType = res.HZ_INFO_JJLX // 经济类型
      options.value.initialFuelsType = res.HZ_QHW_TYPE // 起火物类型
      options.value.area = res.HZ_INFO_QY // 区域
      options.value.otherArea = res.HZ_INFO_QY_QT // 其他类型
      options.value.liveType = res.HZ_INFO_JZXS // 居住形式
      options.value.buildUse = res.HZ_QHJZ_JZYT // 建筑使用用途
      options.value.batteryType = res.HZ_INFO_DCLX // 电池类型
      options.value.energyType = res.HZ_INFO_DLLX // 能源动力类型
      options.value.chargeState = res.HZ_INFO_CDZT // 起火时充电状态
      options.value.driveState = res.HZ_INFO_XSZT // 行驶状态
      options.value.useType = res.HZ_INFO_BGSY // 变更后使用性质
      options.value.penalty = res.HZ_XZCF // 行政处罚
      options.value.schooling = res.HZ_INFO_SJY // 受教育程度
      options.value.nation = res.HZ_SW_MZ // 民族
      options.value.injuryBehavior = res.HZ_INFO_SZ // 受伤时行为
      options.value.injurySourceInfo = res.HZ_SW_LYXQ// 来源详情
      options.value.insuranceInfo = res.HZ_INFO_BXLX // 保险类型
      options.value.health = res.HZ_INFO_JKZK // 健康状况
      options.value.injuryCause = res.HZ_INFO_YY // 受伤/致伤原因
      options.value.injuryPart = res.HZ_INFO_SSBW // 受伤部位
      options.value.bodyLocation = res.HZ_SW_STWZ// 发现尸体位置
      options.value.idType = res.HZ_SW_ZJLX // 证件类型
      options.value.job = res.HZ_INFO_ZY // 职业
      options.value.injurySource = res.HZ_INFO_LY // 人员来源
      options.value.mainSymptoms = res.HZ_INFO_STZY // 身体主要症状
      options.value.fireSite = res.HZ_QHWZ_CS // 请选择起火位置
      options.value.fireCause = res.HZ_QHYY // 起火原因
      options.value.vehicleType = res.HZ_JTGJ // 交通工具类型
      options.value.igniteSourceType = res.HZ_YHY // 引火源类型
      options.value.buildType = res.HZ_INFO_JZLB // 建筑类别
      options.value.fireResistanceRating = res.HZ_INFO_NHDJ // 耐火等级
      options.value.buildStructure = res.HZ_INFO_JZJG // 建筑结构
      options.value.inspectMethod = res.HZ_INFO_DCFS // 调查方式
      options.value.costSource = res.HZ_INFO_SSLY // 损失来源
      options.value.installRange = res.HZ_INFO_XFSS_AZFW // 安装范围
      options.value.leadInspectionOrg = res.HZ_INFO_SGBM // 事故调查牵头部门
      options.value.plantRiskClassification = res.WX_FL // 火灾危险性分类
      options.value.fireInspection = res.HZ_INFO_JCQK // 检查监督情况
      options.value.fireInspectionScope = res.HZ_INFO_JCQK[0]?.children || [] // 监督检查范围
      options.value.fireSafetyUnits = res.HZ_INFO_JCQK[0]?.children[1]?.children || [] // 消防安全重点单位
      options.value.fireLevel = res.HZ_INFO_HZDJ // 火灾等级
      options.value.deathDate = res.DEAD_TIME // 死亡时间
      options.value.humanCause = res.HZ_INFO_RWYS // 人为因素
      options.value.industryDepartment = res.CD_HYZG
      options.value.buildTag = res.HZ_QHJZ_JZBQ?.map((item) => {
        return {
          ...item,
          label: item.dictName,
          value: item.boDictId,
        }
      }) // 建筑标签
      resolve({})
    })
  })
}

const getSubmitParams = () => {
  const { basicInfo, economicLoss, fireBuilding, fireFacilities, caseHandling, casualtyWar, fireCourse, firePhoto, otherAttach } = form.value
  const params = {
    fireInfo: {
      boFireInfoId: props.currentRow?.boFireInfoId || localFireInfoId.value,
      boFireWarningId: props.currentRow?.boFireWarningId,
      // fireCode: '',
      noDispatchArea: basicInfo.noDispatchArea?.value?.join(','),
      fireDate: interceptUnix(basicInfo.fireDate?.value),
      fireDirection: basicInfo.fireDirection?.value,
      area: basicInfo.area.value?.join(','),
      isUrbanVillages: basicInfo.isUrbanVillages?.value,
      otherArea: basicInfo.otherArea?.value,
      fireOrgname: basicInfo.fireOrgname?.value,
      // fireTel: basicInfo.fireTel?.value,
      socialCreditCode: basicInfo.socialCreditCode?.value,
      fireType: cloneDeep(basicInfo.fireType?.completeValue)?.pop(),
      fireCause: basicInfo.fireCause?.value?.join(','),
      burnedArea: basicInfo.burnedArea?.value,
      fireLevel: basicInfo.fireLevel?.value,
      firePlace: cloneDeep(basicInfo.firePlace?.value)?.pop(),
      isLaborIntensive: basicInfo.isLaborIntensive?.value,
      plantRiskClassification: basicInfo.plantRiskClassification?.value,
      otherFirePlace: basicInfo.otherFirePlace?.value,
      liveType: basicInfo.liveType?.value,
      isPoorHouse: basicInfo.isPoorHouse?.value,
      isChangeUseType: basicInfo.isChangeUseType?.value,
      useType: basicInfo.useType?.value,
      vehicleType: basicInfo.vehicleType?.value?.join(','),
      chargeState: basicInfo.chargeState?.value,
      batteryType: basicInfo.batteryType?.value,
      energyType: basicInfo.energyType?.value?.join(','),
      vinCode: basicInfo.vinCode?.value,
      carNumber: basicInfo.carNumber?.value,
      driveState: basicInfo.driveState?.value,
      firePattern: basicInfo.firePattern?.value?.join(','),
      fireSite: basicInfo.fireSite?.value?.join(','),
      initialFuelsType: basicInfo.initialFuelsType?.value?.join(','),
      initialFuels: basicInfo.initialFuels?.value,
      igniteSourceType: basicInfo.igniteSourceType?.value?.join(','),
      igniteSource: basicInfo.igniteSource?.value,
      firePersonAge: basicInfo.firePersonAge?.value,
      schooling: basicInfo.schooling?.value,
      health: basicInfo.health?.value,
      isOperating: basicInfo.isOperating?.value,
      industry: basicInfo.industry?.value?.join(','),
      industryDepartment: basicInfo.industryDepartment?.value,
      economicType: basicInfo.economicType?.value,
      leadInspectionOrg: basicInfo.leadInspectionOrg?.value,
      otherOrgRemark: basicInfo.otherOrgRemark?.value,
      isInsurance: basicInfo.isInsurance?.value,
      insuranceInfo: basicInfo.insuranceInfo?.value?.join(','),
      isResearch: basicInfo.isResearch?.value,
      isOnesided: basicInfo.isOnesided?.value,
      fireInspection: basicInfo.fireInspection?.value,
      isSafetyAccident: basicInfo.isSafetyAccident?.value,
      fileRemark: basicInfo.fileRemark?.value,
      // 经济损失
      inspectMethod: economicLoss.inspectMethod?.value,
      directEconomicLoss: economicLoss.directEconomicLoss?.value,
      directDamage: economicLoss.directDamage?.value,
      fireDisposalCost: economicLoss.fireDisposalCost?.value,
      otherExpense: economicLoss.otherExpense?.value,
      fireInjuryCost: economicLoss.fireInjuryCost?.value,
      costSource: economicLoss.costSource?.value,
      affectedHouse: economicLoss.affectedHouse?.value,
      isInjury: (casualtyWar.isInjury?.value === '1' || casualtyWar.isDead.value === '1') ? '1' : '2',
      // 案件办理
      handleTwoCase: caseHandling.handleTwoCase?.value,
      penaltyNum: caseHandling.penaltyNum?.value,
      suggestDealNum: caseHandling.suggestDealNum?.value,
      firePenalty: caseHandling.firePenalty?.value,
      firePassage: fireCourse.firePassage?.value,
      otherRemark: otherAttach.otherRemark?.value,
      fireInspectionScope: basicInfo.fireInspectionScope?.value?.join(','),
      fireSafetyUnits: basicInfo.fireSafetyUnits?.value,
      isRepack: basicInfo.isRepack?.value,
      draftName: basicInfo.draftName?.value,
      severity: basicInfo.severity?.value,
      isAllBack: firePhoto.isAllBack?.value,
      isDraft: props.showDraft,
    },
    fireInfoBuild: {
      // boFireInfoBuildId: '',
      buildTag: fireBuilding.buildTag?.value?.join(','),
      buildType: fireBuilding.buildType?.value || basicInfo.buildType?.value,
      fireResistanceRating: fireBuilding.fireResistanceRating?.value || basicInfo.fireResistanceRating?.value,
      buildStructure: fireBuilding.buildStructure?.value || basicInfo.buildStructure?.value,
      buildFloor: fireBuilding.buildFloor?.value,
      fireFloor: fireBuilding.fireFloor?.value,
      buildAllArea: fireBuilding.buildAllArea?.value,
      buildFloorArea: fireBuilding.buildFloorArea?.value,
      housingLife: fireBuilding.housingLife?.value,
      buildUse: fireBuilding.buildUse?.value?.join(','),
      isSpread: fireBuilding.isSpread?.value,
      isLoud: fireBuilding.isLoud?.value,
      isWindowOpened: fireBuilding.isWindowOpened?.value,
      // 消防设施
      isFirefightFacility: fireFacilities.isFirefightFacility?.value,
      autoAlarm: fireFacilities.autoAlarm?.value,
      autoAlarmInstall: fireFacilities.autoAlarmInstall?.value,
      autoAlarmStart: fireFacilities.autoAlarmStart?.value,
      autoAlarmEffect: fireFacilities.autoAlarmEffect?.value,
      autoAlarmNotStart: fireFacilities.autoAlarmNotStart?.value,
      autoAlarmNotInstall: fireFacilities.autoAlarmNotInstall?.value,
      autoFireFight: fireFacilities.autoFireFight?.value,
      autoFireFightInstall: fireFacilities.autoFireFightInstall?.value,
      autoFireFightStart: fireFacilities.autoFireFightStart?.value,
      autoFireFightEffect: fireFacilities.autoFireFightEffect?.value,
      autoFireFightNotStart: fireFacilities.autoFireFightNotStart?.value,
      autoFireFightNotInstall: fireFacilities.autoFireFightNotInstall?.value,
      indoorHydrant: fireFacilities.indoorHydrant?.value,
      indoorHydrantInstall: fireFacilities.indoorHydrantInstall?.value,
      indoorHydrantStart: fireFacilities.indoorHydrantStart?.value,
      indoorHydrantEffect: fireFacilities.indoorHydrantEffect?.value,
      indoorHydrantNotStart: fireFacilities.indoorHydrantNotStart?.value,
      indoorHydrantNotInstall: fireFacilities.indoorHydrantNotInstall?.value,
      smokeControl: fireFacilities.smokeControl?.value,
      smokeControlInstall: fireFacilities.smokeControlInstall?.value,
      smokeControlStart: fireFacilities.smokeControlStart?.value,
      smokeControlEffect: fireFacilities.smokeControlEffect?.value,
      smokeControlNotStart: fireFacilities.smokeControlNotStart?.value,
      smokeControlNotInstall: fireFacilities.smokeControlNotInstall?.value,
      fireShutter: fireFacilities.fireShutter?.value,
      fireShutterInstall: fireFacilities.fireShutterInstall?.value,
      fireShutterStart: fireFacilities.fireShutterStart?.value,
      fireShutterEffect: fireFacilities.fireShutterEffect?.value,
      fireShutterNotStart: fireFacilities.fireShutterNotStart?.value,
      fireShutterNotInstall: fireFacilities.fireShutterNotInstall?.value,
      emergencyLight: fireFacilities.emergencyLight?.value,
      lightNonConformance: fireFacilities.lightNonConformance?.value,
      networking: fireFacilities.networking?.value,
      networkAlarm: fireFacilities.networkAlarm?.value,
      fireCompartment: fireFacilities.fireCompartment?.value,
      compartmentArea: fireFacilities.compartmentArea?.value,
      fireSeparation: fireFacilities.fireSeparation?.value,
      separationMeter: fireFacilities.separationMeter?.value,
      escapeRoute: fireFacilities.escapeRoute?.value,
      routeNonConformance: fireFacilities.routeNonConformance?.value,
      emergencyExit: fireFacilities.emergencyExit?.value,
      exitNonConformance: fireFacilities.exitNonConformance?.value,
    },
    fireInfoInjuryList: [],
    fireInfoOrgList: [],
    fireInfoPersonList: [],
    boFireDraftInfoId: props.relevanceDraft?.boFireInfoId,
    isNew: isNew.value,
  }
  if (unDispatch.value) {
    params.isNoDispatchFlag = '1'
    params.fireInfo.isAllBack = ''
  }
  if (props.isApproval) {
    params.isAudit = '1'
  }
  if (props.currentRow?.taskId) {
    params.taskId = props.currentRow?.taskId
  }
  if (casualtyWar.isInjured.value === '1') {
    if (casualtyWar.injuryNum.value > 0) {
      params.fireInfoInjuryList.push({
        injuryType: 1,
        injuryNum: casualtyWar.injuryNum.value,
      })
    }
    const injurys = casualtyWar.injuredList.map((item) => {
      return {
        ...item,
        nativePlace: item.nativePlace?.join(','),
      }
    })
    params.fireInfoInjuryList.push(...injurys)
  }
  if (casualtyWar.isDead.value === '1') {
    const deads = casualtyWar.deadList.map((item) => {
      return {
        ...item,
        nativePlace: item.nativePlace?.join(','),
        deathDate: item.deathDate?.join(','),
      }
    })
    params.fireInfoInjuryList.push(...deads)
  }
  if (caseHandling.firePenalty.value === '1' && caseHandling.fireInfoOrgList?.length > 0) {
    const list = caseHandling.fireInfoOrgList.map((item) => {
      return {
        orgName: item.orgName,
        legalPerson: item.legalPerson,
        penalty: item.penalty,
      }
    })
    params.fireInfoOrgList.push(...list)
  }
  if (caseHandling.firePenalty.value === '1' && caseHandling.fireInfoPersonList?.length > 0) {
    const list = caseHandling.fireInfoPersonList.map((item) => {
      return {
        name: item.name,
        gender: item.gender,
        penalty: item.adminSanction,
      }
    })
    params.fireInfoPersonList.push(...list)
  }
  return params
}

const { loading, submit } = useSubmit(
  (res) => {
    if (!props.isApproval && !props.isAgain && !props.showDraft) {
      showSuccessModal({ title: '提交送审成功！', okText: '查看已填列表', pathName: 'fire-manage' })
      emits('finishCallback', res, props.showDraft)
    }
    else if (!props.isApproval && !props.isAgain && props.showDraft) {
      // message.success('保存成功')
      emits('finishCallback', res, props.showDraft)
    }
  },
  {
    submitFn: () => {
      const params = getSubmitParams()
      return saveFireDispatchReport(params)
    },
  },
)

const { loading: temporaryLoading, submit: temporarySubmit } = useSubmit(
  (res) => {
    // message.success('暂存成功')
    emits('finishCallback')
  },
  {
    submitFn: () => {
      const params = getSubmitParams()
      return saveTemporaryFireDispatchReport(params)
    },
  },
)

const { loading: approvalLoading, submit: approvalSubmit } = useSubmit(
  (res) => {
    if (!props.isApproval) {
      showToast(`${props.labelText}成功！`)
      emits('finishCallback')
    }
  },
  {
    submitFn: () => {
      const params = getSubmitParams()
      return approveFireActions({
        ...params,
        taskReq: {
          businessData: {},
          approveType: approvalForm.value.approveType,
          taskData: {
            suggest: approvalForm.value.suggest,
            variables: {},
          },
          remark: approvalForm.value.remark,
        }
      })
    },
  },
)

const { loading: againLoading, submit: againSubmit } = useSubmit(
  (res) => {
    showSuccessModal({ title: '提交送审成功！', okText: '查看已填列表', pathName: 'fire-manage' })
    emits('finishCallback')
  },
  {
    submitFn: () => {
      const params = getSubmitParams()
      return approveFireActions({
        ...params,
        taskReq: {
          businessData: {},
          approveType: 1,
          taskData: {
            suggest: '',
            variables: {},
          },
          remark: '',
        }
      })
    },
  },
)

const { loading: backLoading, submit: backSubmit } = useSubmit(
  (res) => {
    if (!props.isApproval) {
      showToast(`${props.labelText}成功！`)
      emits('finishCallback')
    }
  },
  {
    submitFn: () => {
      return approveProcessActions(props.currentRow?.taskId, {
        businessData: {},
        approveType: approvalForm.value.approveType,
        taskData: {
          suggest: approvalForm.value.suggest,
          variables: {},
        },
        remark: approvalForm.value.remark,
      })
    },
  },
)

const approvalCallback = async (form) => {
  approvalForm.value = form

  if (form.approveType === '1' && props.isEdit) { // 审核通过
   
    await approvalSubmit()
    show.value.approvalVisible = false
    emits('finishCallback')
  }
  else { // 审核不通过
    await backSubmit()
    show.value.approvalVisible = false
    emits('finishCallback')
  }
}

const setTemporary = async () => {
  formRef.value.validate('basicInfo.fireDate.value').then(async () => {
    await temporarySubmit()
    showToast('暂存成功')
  })
    .catch((error) => {
      showToast('请填写正确起火时间！')
    })
}

const commonLoading = computed(() => {
  return loading.value || againLoading.value || backLoading.value || approvalLoading.value || temporaryLoading.value
})

onMounted(() => {
  showLoadingToast()
  props.setHandleOk && props.setHandleOk((finishFn) => {
    formRef.value.validate().then(async (values) => {   
      if (props.isApproval) {
        show.value.approvalVisible = true
      }
      else if (props.isAgain) {
        await againSubmit()
        await finishFn()
      }
      else {
        if (!props.showDraft && checkFieldWarning(fieldExist.value)
        ) {
          // notification.open({ message: '填报异常提醒', description: '请对异常指标进行批注说明！', style: { backgroundColor: 'orange' } })
          showToast('请对异常指标进行批注说明！')
        }
        else {
          await submit()
          await finishFn()
        }
      }
    })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error,'error')
        showToast('信息填写不完整，请检查填写内容！')
        scrollFormFailed()
      })
  }, commonLoading)
  // 暂存
  // props.setHandleExtend && props.setHandleExtend(async (finishFn) => {
  //   await temporarySubmit()
  //   await finishFn()
  // }, temporaryLoading)
  const promiseAll = []
  promiseAll.push(initDict())
  if (props.currentRow?.boFireWarningId) {
    promiseAll.push(loadDetail())
  }
  if (props.currentRow?.boFireInfoId) {
    promiseAll.push(initFireReport({ id: props.currentRow?.boFireInfoId }))
  }
  Promise.all(promiseAll).then((res) => {
    if (res && res.length > 0) {
      if (!props.currentRow?.boFireWarningId) {
        res.unshift({})
      }
      // 根据详情信息设置
      if (detail && detail.value) {
        form.value.basicInfo.fireOrgname.value = detail.value.warningOrgname
      }
      if (res[2]) {
        isNew.value = res[2].isNew
        detail.value.extinctDate = res[2].extinctDate
        initFireDetail.value.dispatchArriveFlag = res[2]?.fireWarning?.dispatchArriveFlag
      }
      initDetail()
    }
    else {
      initDetail()
    }
  })
})

const onSideBarChange = (e, k) => {
  const targetElement = document.getElementById(k);
  if (targetElement) {
    targetElement.scrollIntoView({
      block: 'start',
      // behavior: 'smooth', // 会影响左侧点击
    });
  }
}
</script>

<template>
  <div class="editor-form" :class="{'hidevalidate':hidevalidate}">
      <div class="form-left">
        <van-sidebar 
          v-model="sideBarActive" 
          v-if="showPreview !== null"
        >
          <van-sidebar-item 
            v-for="(item, k) in sections" 
            :key="k" :title="item.title" 
            @click="onSideBarChange(item, k)" 
          >
            <template #title>
              <div class="label_title">
                {{ item.title }}
                <div class="tip-wrapper">
                  <img v-if="item.fieldWarning?.indexOf('true') > -1 && !showDraft" class="field-wraning" src="@/assets/images/wraning-tip.png" >
                  <img v-show="item.fieldAnnotation" class="field-exist" src="@/assets/images/icon-edit.png">
                  <img :style="{ visibility: (!statusList.includes(k) && !isDetail) ? 'visible' : 'hidden' }" class="field-complate" src="@/assets/images/complate-tip.png" >
                </div>
              </div>
            </template>
          </van-sidebar-item>
          <!-- :badge="!isDetail && item.validateProgress >= 100 ? '√' : '×'" -->
        </van-sidebar>
      </div>
      <div class="form-right">
         <div class="box">
            <div class="wrapper">
              <van-form ref="formRef">
                <!-- 警情信息 -->
                <FireInfo v-if="!showDraft && !isPolice && !unDispatch" @update-field="(value) => form.fireInfo.fieldAnnotation = value" />
                <!-- 简要情况 -->
                <ProCard v-if="!showDraft" title="简要情况" id="briefSituation" :showOpenClose="!showPreview">
                  <BriefSituation />
                </ProCard>
                <!-- 基本信息 -->
                <ProCard title="基本信息" id="basicInfo" :showOpenClose="!showPreview">
                  <BaseInfo />
                </ProCard>
                <!-- 人员伤亡 -->
                <ProCard v-if="showSevereFire"  title="人员伤亡（不含消防员）" id="casualtyWar" :showOpenClose="!showPreview">
                  <CasualtyWar />
                </ProCard>
                <!-- 经济损失 -->
                <ProCard title="经济损失" id="economicLoss" :showOpenClose="!showPreview">
                  <EconomicLoss />
                </ProCard>
                <!-- 起火建筑 -->
                <ProCard title="起火建筑" v-if="showBuildingFire" id="fireBuilding" :showOpenClose="!showPreview">
                  <FireBuilding  />
                </ProCard>
                <!-- 消防设施 -->
                <ProCard title="消防设施" v-if="showBuildingFire && showSevereFire" id="fireFacilities" :showOpenClose="!showPreview">
                  <FireFacilities  />
                </ProCard>
                <!-- 案件办理 -->
                <ProCard title="案件办理" v-if="showSevereFire" id="caseHandling" :showOpenClose="!showPreview">
                  <CaseHandling  />
                </ProCard>
                <!-- 火灾照片 -->
                <ProCard title="火灾照片" id="firePhoto" :showOpenClose="!showPreview">
                  <FirePhoto />
                </ProCard>
                <!-- 起火经过 -->
                <ProCard title="起火经过" id="fireCourse" :showOpenClose="!showPreview">
                  <FireCourse />
                </ProCard>
                <!-- 其他附件 -->
                <ProCard title="其他附件" id="otherAttach" :showOpenClose="!showPreview">
                  <OtherAttach />
                </ProCard>
                <!-- 操作记录 -->
                <ProCard title="操作记录" id="proSteps" v-if="isDetail || (isApproval && labelText === '审核')">
                  <ProSteps
                    :data="form?.proSteps?.fireInfoTransferList?.value"
                    :withHeader="false"
                    :showOpenClose="!showPreview"
                    :detail="fireDetail"
                  />
                </ProCard>
              </van-form>
              <div class="form-footer" v-if="!showPreview">
                <van-button class="temporary" v-if="isShowTemporary" :loading="commonLoading" round block type="primary" @click.stop="setTemporary">
                  暂存
                </van-button>
                <van-button v-if="isReview" class="temporary" :loading="commonLoading" round block type="primary" @click.stop="showReviewDialog">
                  审核
                </van-button>
              </div>
            </div>
         </div>
      </div>
  </div>

  <!-- 提交审核 -->
  <DialogInfo :title="approvalText ? approvalText : `火灾${labelText}`" v-model:visible="show.approvalVisible" v-slot="{setHandleOk}">
    <ProcessReview
      v-if="show.approvalVisible"
      process-key="fireInfoFlow"
      :current-row="currentRow"
      :set-handle-ok="setHandleOk"
      :label-text="labelText"
      @finish-callback="approvalCallback"
    />
  </DialogInfo>
</template>

<style lang="scss" scoped>
.editor-form {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #F6F8FC;
  .form-left {
    width: var(--van-sidebar-width);
  }
  .form-right {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex: 1;
    flex-direction: column;
    .box{
      height:100%;
      width:100%;
      overflow-y:scroll;
      .wrapper{
        
      }
    }
  }
}
.form-footer {
    padding: 0 33px 30px 33px;
    .temporary{
      height: 42px;
      background: #1833A9;
      border-radius: 21px;
      opacity: 0.6;
    }
}

.fire-input {
  position: relative;
  :deep(h4) {
    font-size: 16px;
    font-weight: 500;
    color: #1F2329;
    span {
      color: #0F7DE4;
      margin-right: 5px;
    }
  }
  .fire-content {
    & > div:nth-child(odd) {
      background: rgba(47, 158, 255, 0.04);
      box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.2);
      padding: 10px 20px;
      margin-bottom: 10px;
    }
    & > div:nth-child(even) {
      background: white;
      box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.2);
      padding: 10px 20px;
      margin-bottom: 10px;
    }
  }
}
.fire-form {
  :deep(.ant-col.ant-form-item-control) {
    padding: 0 10px;
    background-color: #f0f0f0;
  }
}
.label_title{
  position: relative;
  .tip-wrapper{
    position: absolute;
    right: 0;
    top: -16px;
    display: flex;
    align-items: center;
    img{
      width: 14px;
      height: 14px;
      margin-left: 5px;
    }
  }
}

</style>

