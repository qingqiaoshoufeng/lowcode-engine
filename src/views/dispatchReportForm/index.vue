<script setup>
import { ref, provide, onMounted, watch, computed, nextTick } from "vue";
import { useDetail, useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { showToast, showLoadingToast, closeToast } from "vant";
import FireInfo from './components/fireInfo.vue';
import BattleResult from './components/battleResult.vue';
import BasicInformation from "./components/basicInformation.vue";
import BattleConsume from "./components/battleConsume.vue";
import BriefSituation from "./components/briefSituation.vue";
import DisposalProcess from './components/disposalProcess.vue';
import CasualtyWar from './components/casualtyWar.vue';
import CommandProcess from './components/commandProcess.vue';
import DeployEquipment from './components/deployEquipment.vue';
import BasicInfoHeadquarter from './components/basicInfoHeadquarter.vue';
import GovernmentCommand from './components/governmentCommand.vue';
import InvestForce from './components/investForce.vue';
import LinkageUnit from './components/linkageUnit.vue';
import OtherAttach from './components/otherAttach.vue';
import OtherForce from './components/otherForce.vue';
import PersonInfo from './components/personInfo.vue';
import TacticalMeasures from './components/tacticalMeasures.vue';
import ScenePhoto from './components/scenePhoto.vue';
import MeteorologicalInfo from './components/meteorologicalInfo.vue';
import ProCard from "@/component/ProCard/index.vue";
import ProSteps from "@/component/ProSteps/index.vue";
import ProcessReview from "@/component/ProcessReview/index.vue";
import ProModal from "@/component/ProModal/index";
import {
  approveDispatchActions,
  approveProcessActions,
  deleteFormFieldAnnotation,
  getDispatchDetail,
  getDispatchDetailHeadquarter,
  getFieldAnnotationDetail,
  getFireWarningDetail,
  getInputPerson,
  getWeatherMsg,
  initDispatchReport,
  saveDispatchHeadquarter,
  saveDispatchReport,
  saveTemporaryDispatchReport,
} from '@/apis/index.js'
import { fixCarParams, getTypeText, scrollFormFailed } from '@/utils/tools.js'
import { gender } from '@/utils/constants.js';
import { useFormConfig } from "./formConfig.js";
import { useModal } from '@/hooks/useModal.js';
import { useOptions } from '@/hooks/useOptions.js';
import { useAsyncQueue } from '@vueuse/core';
import { useStore } from "vuex";
import { useIntersection } from '@/hooks/useIntersection.js';
const hidevalidate = ref(false)
const props = defineProps({
  showDraft: {
    type: Boolean,
    default: false,
  },
  currentRow: {
    type: Object,
    default: () => {},
  },
  relevanceDraft: {
    type: Object,
    default: () => {},
  },
  isInput: {
    type: Boolean,
    default: false,
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
  processKey: {
    type: String,
    default: '',
  },
  labelText: {
    type: String,
    default: '审核',
  },
  offset: {
    type: Number,
    default: 100,
  },
  showExportPdf: { // 显示导出按钮
    type: Boolean,
    default: false,
  },
  closeModal: {
    type: Function,
  },
  setHandleOk: {
    type: Function,
  },
  setHandleExtend: {
    type: Function,
  },
})
const diyValidateMap = ref({
  defaultKey:[]
})
const statusList = ref([])
provide('diyValidateMap',diyValidateMap)

const emits = defineEmits(['finishCallback'])

const { options } = useOptions();

const { show } = useModal();
const formRef = ref(null);


const { form, initFormWhenChange, initFormByDetail, checkFieldWarning, generateRemarkField } = useFormConfig();

const validateProgress = async()=>{
  if(formRef.value){
    hidevalidate.value = true
    try {
      const res = await formRef.value.validate()
    } catch (error) {
      // console.log(error,'resres');
    }
    const statusMap = formRef.value.getValidationStatus()
    console.log(statusMap,'statusMap');
    statusList.value = Object.entries(statusMap).reduce((current,item)=>{
      const [type,status] = item
      if(status === 'failed'){
        const typename = type.split('.')[0]
        current = [...new Set([...current,typename])]
      }
      return current
    },[])
    console.log(statusList.value,'statusList.value');
    // Object.keys(form.value).forEach(item=>{
    //   form.value[item].validateProgress = statusList.includes(item) ? 0 : 100
    // })
    formRef.value.resetValidation()
    hidevalidate.value = false
    if(diyValidateMap.value.defaultKey.length){
      diyValidateMap.value.defaultKey.forEach((item)=>{
        formRef.value.validate(item)
      })
    }
    // console.log(statusList,'result');
  }
  // formRef.value.validate()

}

provide('validateProgress',validateProgress)
watch(
  () => form.value,
  (val1,val2) => {
    nextTick(() => {
      validateProgress()
    //   Object.keys(form.value).forEach((key) => {
    //     handleUseForm(key, form.value[key])
    //   })
    })
  },
  { deep: true },
)
const store = useStore();

const isNew = ref(true);



const showPreview = ref(null);

const fieldExist = ref({})

const userInfo = ref({})

const detachment = ref('');

const deptMembersOptions = ref([]);

const dispatchDetail = ref(null);

const importantEdit = ref(true) // 重要信息更正

const approvalForm = ref(null)

const localFireDispatchId = ref(props.currentRow?.boFireDispatchId || uuidv4())

const showDealSituation = computed(() => {
  return form.value.basicInformation.dealSituation?.text === '到场实施处置'
})

const showNotDealReason = computed(() => {
  return form.value.basicInformation.dealSituation?.text === '到场未实施处置'
})

const showMidwayReturn = computed(() => {
  return form.value.basicInformation.dealSituation?.text === '中途返回'
})

// 显示主战相关字段
const showMainGroup = computed(() => {
  if (form.value.draftInfo.partakeType?.value) {
    return form.value.draftInfo.partakeType.value === '主战'
  }
  else {
    return props?.currentRow?.partakeType === '主战' || props?.currentRow?.dispatchTypeValue === '主战'
  }
})

// 显示增援相关字段
const showReinforce = computed(() => {
  if (form.value.draftInfo.partakeType?.value) {
    return form.value.draftInfo.partakeType.value === '增援'
  }
  else {
    return props?.currentRow?.partakeType === '增援' || props?.currentRow?.dispatchTypeValue === '增援'
  }
})

// 显示全勤指挥部相关字段
const showHeadquarter = computed(() => {
  if (form.value.draftInfo.partakeType?.value) {
    return form.value.draftInfo.partakeType.value === '指挥'
  }
  else {
    return props?.currentRow?.partakeType === '指挥' || props?.currentRow?.dispatchTypeValue === '指挥'
  }
})

// 火灾扑救
const showFireFighting = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes('火灾扑救')
})

// 抢险救援
const showRescueRescue = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes('抢险救援')
})

// 社会救助
const showSocialAssistance = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes('社会救助')
})

// 安保勤务
const showSecurityService = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes('安保勤务')
})

// 虚假警
const showFalsePolice = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes('虚假警')
})

// 主要战术措施
const showTactical = computed(() => {
  const { warningType } = form.value.draftInfo
  return warningType?.text?.join('/') === '社会救助/公共服务/物资保障（送水/农田灌溉、运输物资等）'
    || warningType?.text?.join('/') === '社会救助/公共服务/排水排涝清淤'
    || warningType?.text?.join('/') === '安保勤务/特殊勤务/医疗卫生'
    || warningType?.text?.join('/').indexOf('安保勤务/防灾勤务') > -1
})

// 段落信息
const sections = computed(() => {
  const type = form.value.draftInfo.partakeType.value || props.currentRow?.dispatchTypeValue
  const extra = {}
  const {
    fireInfo,
    draftInfo,
    basicInformation,
    basicInfoHead,
    personInfo,
    commandProcess,
    deployEquipment,
    investForce,
    casualtyWar,
    battleResult,
    battleConsume,
    disposalProcess,
    scenePhoto,
    otherAttach,
    proSteps,
  } = form.value
  if (!props.isPolice) {
    extra.fireInfo = fireInfo
  }
  switch (type) {
  case '主战':
    extra.basicInformation = basicInformation
    extra.investForce = investForce
    extra.casualtyWar = casualtyWar
    if (!showFalsePolice.value
          && !(showSecurityService.value && (showNotDealReason.value || showMidwayReturn.value))
          && !(showSocialAssistance.value && (showNotDealReason.value || showMidwayReturn.value))
          && !(showRescueRescue.value && (showNotDealReason.value || showMidwayReturn.value))
          && !(showFireFighting.value && (showNotDealReason.value || showMidwayReturn.value))
    ) {
      extra.battleResult = battleResult
    }
    extra.disposalProcess = disposalProcess
    if (!showMidwayReturn.value) {
      extra.scenePhoto = scenePhoto
    }
    extra.otherAttach = otherAttach
    extra.battleConsume = battleConsume
    if (props.isDetail) {
      extra.proSteps = proSteps
    }
    return extra
  case '增援':
    extra.basicInformation = basicInformation
    extra.investForce = investForce
    extra.casualtyWar = casualtyWar
    if (!showFalsePolice.value
          && !(showSecurityService.value && (showNotDealReason.value || showMidwayReturn.value))
          && !(showSocialAssistance.value && (showNotDealReason.value || showMidwayReturn.value))
          && !(showRescueRescue.value && (showNotDealReason.value || showMidwayReturn.value))
          && !(showFireFighting.value && (showNotDealReason.value || showMidwayReturn.value))
    ) {
      extra.battleResult = battleResult
    }
    extra.disposalProcess = disposalProcess
    if (!showMidwayReturn.value) {
      extra.scenePhoto = scenePhoto
    }
    extra.otherAttach = otherAttach
    extra.battleConsume = battleConsume
    if (props.isDetail) {
      extra.proSteps = proSteps
    }
    return extra
  case '指挥':
    if (props.isDetail) {
      return {
        ...extra,
        basicInfoHead,
        personInfo,
        deployEquipment,
        commandProcess,
        casualtyWar,
        battleConsume,
        proSteps,
      }
    }
    return {
      ...extra,
      basicInfoHead,
      personInfo,
      deployEquipment,
      commandProcess,
      casualtyWar,
      battleConsume,
    }
  default:
    return {
      draftInfo,
    }
  }
})

const { sideBarActive } = useIntersection(sections, '.form-right', props.offset);

const { detail, loadDetail } = useDetail({
  getDetailFn: () => getFireWarningDetail(props.currentRow.boFireWarningId),
})

provide("form", form)

provide("options", options)

provide('currentRow', props.currentRow)

provide('localFireDispatchId', localFireDispatchId)

provide('deptMembersOptions', deptMembersOptions)

provide('showDealSituation', showDealSituation)

provide('showNotDealReason', showNotDealReason)

provide('showMidwayReturn', showMidwayReturn)

provide('showMainGroup', showMainGroup)

provide('showReinforce', showReinforce)

provide('showHeadquarter', showHeadquarter)

provide('showPreview', showPreview)

provide('showFalsePolice', showFalsePolice)

provide('showFireFighting', showFireFighting)

provide('showRescueRescue', showRescueRescue)

provide('isDetail', props.isDetail)

provide('detail', detail)

provide('importantEdit', importantEdit)

provide('showDraft', props.showDraft)

provide('isEdit', props.isEdit)

provide('fieldExist', fieldExist)

provide('dataType', 2)

const initPoliceDetail = () => {
  showLoadingToast()
  return new Promise((resolve) => {
    loadDetail().finally(() => {
      resolve()
    })
  })
}

const refreshField = () => {
  if (localFireDispatchId.value) {
    getFieldAnnotationDetail({
      dataId: props.currentRow?.boFireDispatchId || localFireDispatchId.value,
      dataType: 2,
    }).then((res) => {
      if (res) {
        const { data, fieldModules } = res
        fieldExist.value = data
        form.value.basicInformation.fieldAnnotation = fieldModules?.basicInformation
        form.value.basicInfoHead.fieldAnnotation = fieldModules?.basicInfoHead
        form.value.personInfo.fieldAnnotation = fieldModules?.personInfo
        // form.value.commandMode.fieldAnnotation = fieldModules?.commandMode
        form.value.commandProcess.fieldAnnotation = fieldModules?.commandProcess
        form.value.deployEquipment.fieldAnnotation = fieldModules?.deployEquipment
        form.value.investForce.fieldAnnotation = fieldModules?.investForce
        form.value.casualtyWar.fieldAnnotation = fieldModules?.casualtyWar
        form.value.battleResult.fieldAnnotation = fieldModules?.battleResult
        form.value.battleConsume.fieldAnnotation = fieldModules?.battleConsume
        form.value.disposalProcess.fieldAnnotation = fieldModules?.disposalProcess
        form.value.scenePhoto.fieldAnnotation = fieldModules?.scenePhoto
        form.value.otherAttach.fieldAnnotation = fieldModules?.otherAttach
      }
    })
  }
}

const deleteField = (remarkField, remarkField2) => {
  deleteFormFieldAnnotation({
    dataId: props.currentRow?.boFireDispatchId || localFireDispatchId.value,
    dataType: 2,
    remarkField,
    remarkField2,
  }).then((res) => {
    refreshField()
  })
}

provide('refreshField', refreshField)

provide('deleteField', deleteField)

const initDict = () => {
  return new Promise((resolve) => {
    const res = store.getters?.["dict/filterDicts"](['COMMAND_MODE', 'JQ_TYPE', 'CD_ZZZH_LEVEL', 'CD_OTHER_ZY', 'CD_OTHER_ZZ', 'CD_DC_HZQK',
      'CD_MAIN_HZ', 'CD_MAIN_QX', 'CD_LINK_LEVEL', 'CD_LINK_DEP', 'CD_JYQK_CZ', 'CD_BACK', 'TQ_TYPE_FL', 'TQ_TYPE_FX', 'TQ_TYPE_TQ',
      'CD_JBXX_BSY', 'CD_GDSS', 'CD_JBXX_GG', 'CD_HYZG', 'CD_CZRY_SF', 'CD_CZRY_FHZB', 'CD_CZRY_SFSD', 'CD_CZRY_SSBW', 'CD_CZRY_SSYY',
      'CD_CZRY_SWYY', 'CD_CZRY_ZMBW', 'HZ_SW_MZ', 'JOB_TYPE', 'CD_RANK', 'CD_LOOK'], null, false);
    options.value.commandMethod = res.COMMAND_MODE
    options.value.warningType = res.JQ_TYPE
    options.value.level = res.CD_ZZZH_LEVEL
    options.value.groupType = res.CD_OTHER_ZY
    options.value.professionalType = res.CD_OTHER_ZZ
    options.value.fireTechnic = res.CD_MAIN_HZ
    options.value.rescueMeasures = res.CD_MAIN_QX
    options.value.orgLevel = res.CD_LINK_LEVEL
    options.value.departmentName = res.CD_LINK_DEP
    options.value.dealSituation = res.CD_JYQK_CZ
    options.value.returnLateReason = res.CD_BACK
    options.value.wind = res.TQ_TYPE_FL
    options.value.windDirection = res.TQ_TYPE_FX
    options.value.weather = res.TQ_TYPE_TQ
    options.value.fireSituation = res.CD_DC_HZQK
    options.value.notUseFireHydrantReason = res.CD_JBXX_BSY
    options.value.fixedFireEquipment = res.CD_GDSS
    options.value.fireHydrantSituation = res.CD_JBXX_GG
    options.value.industryDepartment = res.CD_HYZG
    options.value.identity = res.CD_CZRY_SF
    options.value.protectDevice = res.CD_CZRY_FHZB
    options.value.period = res.CD_CZRY_SFSD
    options.value.injuryPart = res.CD_CZRY_SSBW
    options.value.injuryReason = res.CD_CZRY_SSYY
    options.value.deadReason = res.CD_CZRY_SWYY
    options.value.injury = res.CD_CZRY_ZMBW
    options.value.politicalOutlook = res.CD_LOOK
    options.value.nation = res.HZ_SW_MZ // 民族
    options.value.position = res.JOB_TYPE
    options.value.rescueRank = res.CD_RANK
    options.value.gender = gender

    // 获取用户单位
    if (store.getters?.["userInfo/userInfo"]) {
      userInfo.value = store.getters?.["userInfo/userInfo"]
    }
    resolve()
  })
}

const initWeather = () => {
  return new Promise((resolve) => {
    if (!props.showDraft && !props.isDetail && !form.value.basicInformation.weather.value) {
      getWeatherMsg({
        boAreaId: detail.value?.warningTown || detail.value?.warningCity,
        warningDate: dayjs(detail?.value?.warningDate).format('YYYY-MM-DD HH:mm:ss'),
      }).then((res) => {
        if (res) {
          form.value.basicInformation.temperature.value = res.temperatureFloat
          form.value.basicInformation.weather.value = res.weatherDictId
          form.value.basicInformation.wind.value = res.windPowerDictId
          form.value.basicInformation.windDirection.value = res.windDirectionDictId
        }
      }).finally(() => resolve())
    } else {
      resolve()
    }
  })
}

const initDetail = () => {
  // 根据详情信息设置警情类型
  if (detail && detail.value && detail.value?.warningType) {
    form.value.draftInfo.warningType.value = detail.value?.warningType.split(',')
    form.value.draftInfo.warningType.text = getTypeText(form.value.draftInfo.warningType.value, options.value.warningType)
  }
  return new Promise((resolve) => {
    const { currentRow, isEdit, isDetail } = props
    if (currentRow?.boFireDispatchId && ['指挥'].includes(currentRow?.partakeType || currentRow?.dispatchTypeValue)) {
      const id = props.currentRow?.boFireDispatchId
      getDispatchDetailHeadquarter(id).then((res) => {
        if (res) {
          dispatchDetail.value = res
          if (!props.showDraft) {
            importantEdit.value = res.importantInfoRecheck
          }

          initFormByDetail(res, options.value, initWatch, detail.value)
        }
      }).finally(() => resolve())
    }
    else if ((isEdit && currentRow?.boFireDispatchId) || (isDetail && currentRow?.boFireDispatchId)) {
      const id = currentRow?.boFireDispatchId
      getDispatchDetail(id).then((res) => {
        if (res) {
          dispatchDetail.value = res
          if (!props.showDraft) {
            importantEdit.value = res.importantInfoRecheck
          }

          initFormByDetail(res, options.value, initWatch, detail.value)
        }
      }).finally(() => resolve())
    }
    else if (currentRow?.isStorage === '1' && ['指挥'].includes(currentRow?.partakeType || currentRow?.dispatchTypeValue)) {
      const id = currentRow?.boFireDispatchId
      getDispatchDetailHeadquarter(id).then((res) => {
        if (res) {
          if (!props.showDraft) {
            importantEdit.value = res.importantInfoRecheck
          }

          initFormByDetail(res, options.value, initWatch, detail.value)
        }
      }).finally(() => resolve())
    }
    else if (currentRow?.isStorage === '1') {
      const id = currentRow?.boFireDispatchId
      getDispatchDetail(id).then((res) => {
        if (res) {
          if (!props.showDraft) {
            importantEdit.value = res.importantInfoRecheck
          }

          initFormByDetail(res, options.value, initWatch, detail.value)
        }
      }).finally(() => resolve())
    } else {
      if (currentRow?.warningType) {
        form.value.draftInfo.warningType.value = currentRow?.warningType?.split(',')
        if (form.value.draftInfo.warningType.value) {
          form.value.draftInfo.warningType.text = getTypeText(form.value.draftInfo.warningType.value, options.value.warningType)
        }
      }
      form.value.draftInfo.partakeType.value = currentRow?.partakeType || currentRow?.dispatchTypeValue

      initWatch()
      resolve()
    }
  })
}

const initReport = () => {
  const { currentRow } = props
  return new Promise((resolve) => {
    if (currentRow?.boFireDispatchId) {
      initDispatchReport({ id: currentRow?.boFireDispatchId }).then((res) => {
        if (res) {
          isNew.value = res.isNew
          form.value.basicInfoHead.headquarterName.value = res.dispatchGroupName
          detachment.value = res.detachment
        }
      }).finally(() => resolve())
    } else {
      resolve()
    }
  })
}

const initFireProcess = () => {
  generateRemarkField({ ...detail.value, detachment: detachment.value }, userInfo.value?.USERMESSAGE?.orgName)
}

provide('refreshProcess', initFireProcess)

const initWatch = () => {
  closeToast()
  return new Promise((resolve) => {
    watch(() => [
      form.value.draftInfo.warningType,
      form.value.draftInfo.partakeType,
      form.value.basicInformation.dealSituation.value,
    ], () => {
      initFormWhenChange()
    }, { deep: true })
    // 只有当填报状态下才自动生成处置过程
    if (props.closeModal && props.isInput) {
      watch(() => [form.value.basicInformation, form.value.basicInfoHead, form.value.investForce, form.value.casualtyWar, form.value.battleResult, form.value.battleConsume], () => {
        initFireProcess()
      }, { deep: true })
    }
    nextTick(() => {
      showPreview.value = Boolean(props.isDetail && (form.value.basicInformation.dealSituation.value || form.value.draftInfo.warningType.value))
    })
    resolve()
  })
}

const { result } = useAsyncQueue([initDict, initPoliceDetail, initWeather, initReport, initDetail])

const getPersonNum = () => {
  if (form.value.investForce.commander?.value || form.value.investForce.firemen?.value) {
    const ids = form.value.investForce.commander?.value?.map(item => item.boFireUserId)?.join(',') || ''
    const result = cloneDeep(form.value.investForce.commander?.value) || []
    form.value.investForce.firemen.value?.forEach((item) => {
      if (!ids.includes(item.boFireUserId)) {
        result.push(item)
      }
    })
    return result?.length
  }
  return 0
}

const getSubmitParams = () => {
  const {
    draftInfo,
    basicInformation,
    basicInfoHead,
    commandProcess,
    commandMode,
    personInfo,
    deployEquipment,
    investForce,
    tacticalMeasures,
    casualtyWar,
    battleResult,
    battleConsume,
    disposalProcess,
  } = form.value
  let params = {}
  // 出动填报普通队站
  if (showMainGroup.value || showReinforce.value) {
    params = {
      fireDispatch: {
        // 出动填报实体
        boFireDispatchId: props.currentRow?.boFireDispatchId || localFireDispatchId.value,
        boFireWarningId: props.currentRow?.boFireWarningId,
        fireDraftDispatchID: props.relevanceDraft?.boFireDispatchId,
        dealSituation: basicInformation.dealSituation.value,
        notDealReason: basicInformation.notDealReason.value,
        dispatchDate: basicInformation.dispatchDate.value?.valueOf(),
        midwayReturnDate: basicInformation.midwayReturnDate.value?.valueOf(),
        attendanceDate: basicInformation.attendanceDate.value?.valueOf(),
        carryoutDate: basicInformation.carryoutDate.value?.valueOf(),
        waterflowDate: basicInformation.waterflowDate.value?.valueOf(),
        controllingDate: basicInformation.controllingDate.value?.valueOf(),
        washDate: basicInformation.washDate.value?.valueOf(),
        extinctDate: basicInformation.extinctDate.value?.valueOf(),
        endDate: basicInformation.endDate.value?.valueOf(),
        evacuateDate: basicInformation.evacuateDate.value?.valueOf(),
        returnDate: basicInformation.returnDate.value?.valueOf(),
        dealEndDate: basicInformation.dealEndDate.value?.valueOf(),
        returnLateReason: basicInformation.returnLateReason.value,
        draftName: draftInfo.draftName.value,
        warningType: draftInfo.warningType.value?.pop(),
        partakeType: draftInfo.partakeType.value,
        temperature: basicInformation.temperature.value,
        weather: basicInformation.weather.value,
        wind: basicInformation.wind.value,
        windDirection: basicInformation.windDirection.value,
      },
      fireDispatchItem: {
        // 出动填报明细实体
        fireSituation: basicInformation.fireSituation.value,
        industryDepartment: basicInformation.industryDepartment.value,
        fireDistance: basicInformation.fireDistance.value,
        trappedPerson: basicInformation.trappedPerson.value,
        groupLeader: investForce.groupLeader.value?.join(','),
        commander: investForce.commander.value?.map(item => item.boFireUserId)?.join(','),
        firemen: investForce.firemen.value?.map(item => item.boFireUserId)?.join(','),
        inputPersonNum: getPersonNum(),
        inputCarNum: form.investForce?.dispatchTruckList.value?.length || 0,
        isResponseTruck: investForce.isResponseTruck.value,
        isReturnTruck: investForce.isReturnTruck.value,
        fireBoatNum: investForce.fireBoatNum.value,
        fireAirplaneNum: investForce.fireAirplaneNum.value,
        rescueDogNum: investForce.rescueDogNum.value,
        uavNum: investForce.uavNum.value,
        isBlocking: basicInformation.isBlocking.value,
        blockingTime: basicInformation.blockingTime.value,
        // isPublicFireHydrant: basicInformation.isPublicFireHydrant.value,
        // fireHydrantSituation: basicInformation.fireHydrantSituation.value,
        // fixedFireEquipment: basicInformation.fixedFireEquipment.value,
        // notUseFireHydrantReason: basicInformation.notUseFireHydrantReason.value,
        isInside: basicInformation.isInside.value,
        fireTechnic: basicInformation.fireTechnic.value,
        rescueMeasures: basicInformation.rescueMeasures.value,
        deliverWater: basicInformation.deliverWater.value,
        drainWater: basicInformation.drainWater.value,
        killArea: basicInformation.killArea.value,
        rescueNum: battleResult.rescueNum.value,
        surviveNum: battleResult.surviveNum.value,
        deathNum: battleResult.deathNum.value,
        evacuateNum: battleResult.evacuateNum.value,
        transferNum: battleResult.transferNum.value,
        emergencyNum: battleResult.emergencyNum.value,
        protectNum: battleResult.protectNum.value,
        fireProcess: disposalProcess.fireProcess.value,
        boFireDispatchItemId: uuidv4(), // 编辑?
      },
      fireDispatchTruckList: [],
      fireDispatchInjuryList: [],
      fireDispatchOtherList: [],
      fireDispatchZfList: investForce.isCommand.value === '1' ? investForce.fireDispatchZfList : [], // 政府人员
      fireDispatchLinkList: investForce.haveLinkageUnit.value === '1' ? investForce.fireDispatchLinkList : [], // 联动力量
      fireDispatchLoss: {
        // 战斗损耗实体
        boFireDispatchId: props.currentRow?.boFireDispatchId,
        wastageTruck: battleConsume.wastageTruck.value ? battleConsume.wastageTruck.value?.join(',') : '',
        wastageTruckExplain: battleConsume.wastageTruckExplain.value,
        fuel: battleConsume.fuel.value,
        waterPump: battleConsume.waterPump.value,
        hoseReel: battleConsume.hoseReel.value,
        fireGun: battleConsume.fireGun.value,
        airForm: battleConsume.airForm.value,
        formTank: battleConsume.formTank.value,
        ladder: battleConsume.ladder.value,
        waterBand: battleConsume.waterBand.value,
        fireHydrantHandle: battleConsume.fireHydrantHandle.value,
        waterGun: battleConsume.waterGun.value,
        waterMainfold: battleConsume.waterMainfold.value,
        entryTool: battleConsume.entryTool.value,
        fireExtinguisher: battleConsume.fireExtinguisher.value,
        firePump: battleConsume.firePump.value,
        fireHat: battleConsume.fireHat.value,
        protectiveSuit: battleConsume.protectiveSuit.value,
        fireGlove: battleConsume.fireGlove.value,
        lapBelt: battleConsume.lapBelt.value,
        protectiveBoots: battleConsume.protectiveBoots.value,
        fireRebreather: battleConsume.fireRebreather.value,
        fireLight: battleConsume.fireLight.value,
        fireRescuer: battleConsume.fireRescuer.value,
        positionLamp: battleConsume.positionLamp.value,
        safetyRope: battleConsume.safetyRope.value,
        fireAxe: battleConsume.fireAxe.value,
        interphone: battleConsume.interphone.value,
        transferImage: battleConsume.transferImage.value,
        uav: battleConsume.uav.value,
        foamLiquid: battleConsume.foamLiquid.value,
        dryPowder: battleConsume.dryPowder.value,
        carbonDioxide: battleConsume.carbonDioxide.value,
        haloalkane: battleConsume.haloalkane.value,
        totalFlow: battleConsume.totalFlow.value,
        firefightingWater: battleConsume.firefightingWater.value,
        coolingWater: battleConsume.coolingWater.value,
        totalWater: battleConsume.totalWater.value,
        waterInterrupt: battleConsume.waterInterrupt.value,
        waterDamage: battleConsume.waterDamage.value,
        fireDispatchLossOtherList: [],
      },
      fireDispatchRetrunTruckList: [],
      isNew: isNew.value,
      isDraft: props.showDraft ? 1 : 2,
    }
    if (form.value.investForce.isResponseTruck.value === '1') {
      const list = fixCarParams(investForce.dispatchTruckList.value)
      params.fireDispatchTruckList.push(...list)
    }
    if (form.value.investForce.isReturnTruck.value === '1') {
      const list = fixCarParams(investForce.midwayCar.value)
      params.fireDispatchRetrunTruckList.push(...list)
    }
    if (investForce.haveVolunteer.value === '1') {
      const list = investForce.volunteerList.map((item) => {
        return {
          ...item,
          otherType: '1',
          orgName: item.orgName1,
        }
      })
      params.fireDispatchOtherList.push(...list)
    }
    if (investForce.haveProfessional.value === '1') {
      const list = investForce.otherList.map((item) => {
        return {
          ...item,
          otherType: '2',
        }
      })
      params.fireDispatchOtherList.push(...list)
    }
    if (casualtyWar.isInjured.value === '1') {
      const list = casualtyWar.injuredList.map((item) => {
        return {
          ...item,
          name: item.name?.userName || item.name?.label,
          boFireUserId: item.name?.boFireUserId || item.name?.value,
          injuryType: '1',
          rescueRank: item.rescueRank?.join(','),
          duty: item.duty?.join(','),
          nativePlace: item.nativePlace?.join(','),
          teamEntryTime: item.teamEntryTime ? dayjs(item.teamEntryTime) : undefined,
        }
      })
      params.fireDispatchInjuryList.push(...list)
    }
    if (casualtyWar.isDead.value === '1') {
      const list = casualtyWar.deadList.map((item) => {
        return {
          ...item,
          name: item.name?.userName || item.name?.label,
          boFireUserId: item.name?.boFireUserId || item.name?.value,
          injuryType: '2',
          rescueRank: item.rescueRank?.join(','),
          duty: item.duty?.join(','),
          nativePlace: item.nativePlace?.join(','),
          teamEntryTime: item.teamEntryTime ? dayjs(item.teamEntryTime) : undefined,
          deathDate: item.deathDate?.valueOf(),
        }
      })
      params.fireDispatchInjuryList.push(...list)
    }
    if (battleConsume.lossOtherEquipments?.length > 0) {
      const list = battleConsume.lossOtherEquipments.map((item) => {
        return {
          ...item,
          otherType: '1',
        }
      })
      params.fireDispatchLoss.fireDispatchLossOtherList.push(...list)
    }
    if (battleConsume.lossOtherPersonal?.length > 0) {
      const list = battleConsume.lossOtherPersonal.map((item) => {
        return {
          ...item,
          otherType: '2',
        }
      })
      params.fireDispatchLoss.fireDispatchLossOtherList.push(...list)
    }
    if (battleConsume.lossOtherAgent?.length > 0) {
      const list = battleConsume.lossOtherAgent.map((item) => {
        return {
          ...item,
          otherType: '3',
        }
      })
      params.fireDispatchLoss.fireDispatchLossOtherList.push(...list)
    }
  }
  else if (showHeadquarter.value) {
    params = {
      fireDispatch: {
        boFireDispatchId: props.currentRow?.boFireDispatchId || localFireDispatchId.value,
        boFireWarningId: props.currentRow?.boFireWarningId,
        fireDraftDispatchID: props.relevanceDraft?.boFireDispatchId,
        dispatchDate: basicInfoHead?.dispatchDate.value?.valueOf(),
        attendanceDate: basicInfoHead?.attendanceDate.value?.valueOf(),
        evacuateDate: basicInfoHead?.evacuateDate.value?.valueOf(),
        midwayReturnDate: basicInfoHead.midwayReturnDate.value?.valueOf(),
        returnDate: basicInfoHead.returnDate.value?.valueOf(),
        draftName: draftInfo.draftName.value,
        warningType: draftInfo.warningType.value?.pop(),
        partakeType: draftInfo.partakeType.value,
      },
      fireDispatchHead: {
        presentFlag: basicInfoHead.presentFlag.value,
        commandTime: basicInfoHead.commandTime.value,
        personNum: basicInfoHead.personNum.value,
        truckNum: basicInfoHead.truckNum.value,
        commandMethod: commandMode.commandMethod.value,
        rescueMethod: commandProcess.rescueMethod.value,
        actionPlan: commandProcess.actionPlan.value,
        commandProcess: commandProcess.commandProcess.value,
        satellitePhone: deployEquipment.satellitePhone.value,
        satellitePortableStation: deployEquipment.satellitePortableStation.value,
        singleSoldier: deployEquipment.singleSoldier.value,
        uav: deployEquipment.uav.value,
        clothControl: deployEquipment.clothControl.value,
        meshStation: deployEquipment.meshStation.value,
        microwaveGraph: deployEquipment.microwaveGraph.value,
        beidouTerminal: deployEquipment.beidouTerminal.value,
      },
      fireDispatchHeadPerson: {
        headLeader: personInfo.headLeader.value?.join(','),
        commandCenter: personInfo.commandCenter.value?.join(','),
        chiefCommander: personInfo.chiefCommander.value?.join(','),
        deputyCommander: personInfo.deputyCommander.value?.join(','),
        commander: personInfo.commander.value?.join(','),
        commandAssistant: personInfo.commandAssistant.value?.join(','),
        messageAssistant: personInfo.messageAssistant.value?.join(','),
        messenger: personInfo.messenger.value?.join(','),
        headSupport: personInfo.headSupport.value?.join(','),
        headPolitic: personInfo.headPolitic.value?.join(','),
        newsPropagation: personInfo.newsPropagation.value?.join(','),
        technicianGroup: personInfo.technicianGroup.value?.join(','),
        technician: personInfo.technician?.map(item => item.name).join(','),
        otherMember: personInfo?.otherMember.value?.join(','),
        headerPersonList: [],
      },
      fireDispatchTruck: {
        headTruckList: fixCarParams(deployEquipment.headTruckList?.value),
        boardingTruckList: fixCarParams(deployEquipment.boardingTruckList?.value),
        kitchenTruckList: fixCarParams(deployEquipment.kitchenTruckList?.value),
        toiletTruckList: fixCarParams(deployEquipment.toiletTruckList?.value),
        refrigerateTruckZqList: fixCarParams(deployEquipment?.refrigerateTruckZqList?.value),
        airfeedTruckList: fixCarParams(deployEquipment?.airfeedTruckList.value),
        oilTruckList: fixCarParams(deployEquipment?.oilTruckList.value),
        steamThawingTruckList: fixCarParams(deployEquipment?.steamThawingTruckList.value),
        foamTransferTruckList: fixCarParams(deployEquipment?.foamTransferTruckList.value),
        wreckTruckList: fixCarParams(deployEquipment?.wreckTruckList.value),
        modularTruckList: fixCarParams(deployEquipment?.modularTruckList.value),
        mobileCommunicateTruckList: fixCarParams(deployEquipment?.mobileCommunicateTruckList.value),
        communicateEquipTruckList: fixCarParams(deployEquipment?.communicateEquipTruckList.value),
        quietCommunicateTruckList: fixCarParams(deployEquipment?.quietCommunicateTruckList.value),
      },
      fireDispatchInjuryList: [], // 人员伤亡
      fireDispatchLoss: {
        // 战斗损耗实体
        boFireDispatchId: props.currentRow?.boFireDispatchId,
        wastageTruck: battleConsume.wastageTruck.value ? battleConsume.wastageTruck.value?.join(',') : '',
        wastageTruckExplain: battleConsume.wastageTruckExplain.value,
        fuel: battleConsume.fuel.value,
        waterPump: battleConsume.waterPump.value,
        hoseReel: battleConsume.hoseReel.value,
        fireGun: battleConsume.fireGun.value,
        airForm: battleConsume.airForm.value,
        formTank: battleConsume.formTank.value,
        ladder: battleConsume.ladder.value,
        waterBand: battleConsume.waterBand.value,
        fireHydrantHandle: battleConsume.fireHydrantHandle.value,
        waterGun: battleConsume.waterGun.value,
        waterMainfold: battleConsume.waterMainfold.value,
        entryTool: battleConsume.entryTool.value,
        fireExtinguisher: battleConsume.fireExtinguisher.value,
        firePump: battleConsume.firePump.value,
        fireHat: battleConsume.fireHat.value,
        protectiveSuit: battleConsume.protectiveSuit.value,
        fireGlove: battleConsume.fireGlove.value,
        lapBelt: battleConsume.lapBelt.value,
        protectiveBoots: battleConsume.protectiveBoots.value,
        fireRebreather: battleConsume.fireRebreather.value,
        fireLight: battleConsume.fireLight.value,
        fireRescuer: battleConsume.fireRescuer.value,
        positionLamp: battleConsume.positionLamp.value,
        safetyRope: battleConsume.safetyRope.value,
        fireAxe: battleConsume.fireAxe.value,
        interphone: battleConsume.interphone.value,
        transferImage: battleConsume.transferImage.value,
        uav: battleConsume.uav.value,
        foamLiquid: battleConsume.foamLiquid.value,
        dryPowder: battleConsume.dryPowder.value,
        carbonDioxide: battleConsume.carbonDioxide.value,
        haloalkane: battleConsume.haloalkane.value,
        totalFlow: battleConsume.totalFlow.value,
        firefightingWater: battleConsume.firefightingWater.value,
        coolingWater: battleConsume.coolingWater.value,
        totalWater: battleConsume.totalWater.value,
        waterInterrupt: battleConsume.waterInterrupt.value,
        waterDamage: battleConsume.waterDamage.value,
        fireDispatchLossOtherList: [],
      },
      isNew: isNew.value,
      isDraft: props.showDraft ? 1 : 2,
    }
    if (casualtyWar.isInjured.value === '1') {
      const list = casualtyWar.injuredList.map((item) => {
        return {
          ...item,
          injuryType: '1',
          nativePlace: item.nativePlace?.join(','),
          teamEntryTime: item.teamEntryTime ? dayjs(item.teamEntryTime) : undefined,
        }
      })
      params.fireDispatchInjuryList.push(...list)
    }
    if (casualtyWar.isDead.value === '1') {
      const list = casualtyWar.deadList.map((item) => {
        return {
          ...item,
          injuryType: '2',
          nativePlace: item.nativePlace?.join(','),
          deathDate: item.deathDate?.valueOf(),
          teamEntryTime: item.teamEntryTime ? dayjs(item.teamEntryTime) : undefined,
        }
      })
      params.fireDispatchInjuryList.push(...list)
    }
    if (personInfo.commandLeader?.length > 0) {
      params.fireDispatchHeadPerson.headerPersonList.push(...personInfo.commandLeader)
    }
    if (battleConsume.lossOtherEquipments?.length > 0) {
      const list = battleConsume.lossOtherEquipments.map((item) => {
        return {
          ...item,
          otherType: '1',
        }
      })
      params.fireDispatchLoss.fireDispatchLossOtherList.push(...list)
    }
    if (battleConsume.lossOtherPersonal?.length > 0) {
      const list = battleConsume.lossOtherPersonal.map((item) => {
        return {
          ...item,
          otherType: '2',
        }
      })
      params.fireDispatchLoss.fireDispatchLossOtherList.push(...list)
    }
    if (battleConsume.lossOtherAgent?.length > 0) {
      const list = battleConsume.lossOtherAgent.map((item) => {
        return {
          ...item,
          otherType: '3',
        }
      })
      params.fireDispatchLoss.fireDispatchLossOtherList.push(...list)
    }
  }
  if (props.isApproval) {
    params.isAudit = '1'
  }
  if (props.currentRow?.taskId) {
    params.taskId = props.currentRow?.taskId
  }
  return params
}

const { loading, submit } = useSubmit(
  (res) => {
    if (!props.isApproval && !props.isAgain && !props.showDraft) {
      // showSuccessModal({ title: '提交送审成功！', okText: '查看已填列表', pathName: 'dispatch-manage' })
      showToast('提交送审成功！')
      emits('finishCallback', res, props.showDraft)
    }
    else if (!props.isApproval && !props.isAgain && props.showDraft) {
      showToast('保存成功')
      emits('finishCallback', res, props.showDraft)
    }
  },
  {
    submitFn: () => {
      // 出动填报普通队站
      if (showMainGroup.value || showReinforce.value) {
        const params = getSubmitParams()
        return saveDispatchReport(params)
      }
      else if (showHeadquarter.value) {
        const params = getSubmitParams()
        return saveDispatchHeadquarter(params)
      }
      return Promise.resolve()
    },
  },
)

const { loading: approvalLoading, submit: approvalSubmit } = useSubmit(
  (res) => {
    if (!props.isApproval) {
      showToast('审核成功')
      emits('finishCallback')
    }
  },
  {
    submitFn: () => {
      let type = false
      if (showHeadquarter.value) {
        type = true
      }
      const params = getSubmitParams()
      return approveDispatchActions({
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
      }, type)
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

const { loading: temporaryLoading, submit: temporarySubmit } = useSubmit(
  (res) => {
    showToast('暂存成功')
    emits('finishCallback')
  },
  {
    submitFn: () => {
      const params = getSubmitParams()
      return saveTemporaryDispatchReport(params)
    },
  },
)

const { loading: againLoading, submit: againSubmit } = useSubmit(
  (res) => {
    // showSuccessModal({ title: '提交送审成功！', okText: '查看已填列表', pathName: 'fire-manage' })
    showToast('提交送审成功！')
    emits('finishCallback')
  },
  {
    submitFn: () => {
      let type = false
      if (showHeadquarter.value) {
        type = true
      }
      const params = getSubmitParams()
      return approveDispatchActions({
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
      }, type)
    },
  },
)

const approvalCallback = async (form) => {
  approvalForm.value = form
  if (form.approveType === '1' && props.isEdit) { // 审核通过
    loading.value = approvalLoading.value
    await approvalSubmit()
    show.value.approvalVisible = false
    emits('finishCallback')
  }
  else { // 审核不通过
    loading.value = backLoading.value
    await backSubmit()
    show.value.approvalVisible = false
    emits('finishCallback')
  }
}

const handleSubmit = () => {
  formRef.value.submit()
}

const handleTemporary = () => {
  temporarySubmit()
}

const onSubmit = async () => {
  if (props.isApproval) {
    show.value.approvalVisible = true
  }
  else if (props.isAgain) {
    loading.value = againLoading.value
    await againSubmit()
    props.closeModal()
  }
  else {
    if (!props.showDraft && checkFieldWarning(fieldExist.value)) {
      // notification.open({ message: '填报异常提醒', description: '请对异常指标进行批注说明！', style: { backgroundColor: 'orange' } })
      showToast('请对异常指标进行批注说明！')
    }
    else {
      await submit()
      props.closeModal()
    }
  }
};

onMounted(() => {
  console.log('init', result)
  props.setHandleOk && props.setHandleOk(async (finishFn) => {
    formRef.value.submit()
    formRef.value.finishFn = finishFn
  }, loading)
})

const onFailed = (errorInfo) => {
  console.log(errorInfo)
  if (errorInfo?.errors?.length > 0) {
    showToast('信息填写不完整，请检查填写内容！')
    scrollFormFailed()
  }
};

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
  <div class="dispatch-report-form">
    <div class="form-left">
      <van-sidebar v-model="sideBarActive">
        <template v-for="(item, k) in sections" :key="k">
          <van-sidebar-item @click="onSideBarChange(item, k)">
            <template #title>
              <div class="label_title"> 
                {{ item.title }}
                <div class="tip-wrapper">
                  <img :style="{ visibility: !statusList.includes(k) ? 'visible' : 'hidden' }" class="field-complate" src="@/assets/images/complate-tip.png" >
                  <img v-if="item.fieldWarning?.indexOf('true') > -1 && !showDraft" class="field-wraning" src="@/assets/images/wraning-tip.png" >
                  <img v-show="item.fieldAnnotation" class="field-exist" src="@/assets/images/icon-edit.png">
                </div>
              </div>
            </template>
          </van-sidebar-item>
        </template>
      </van-sidebar>
    </div>
    <div class="form-right" :class="{'hidevalidate':hidevalidate}">
      <van-form ref="formRef" @failed="onFailed" @submit="onSubmit" required="auto">
        <!-- 警情信息 -->
        <FireInfo v-if="!showDraft && !isPolice" />
        <template v-if="showMainGroup">
          <ProCard title="基本信息" id="basicInformation" :showOpenClose="!showPreview">
            <!-- 基本信息 -->
            <BasicInformation />
            <!-- 主要战术措施 -->
            <TacticalMeasures
              v-if="
                !showFalsePolice
                  && ((showTactical && !(showNotDealReason || showMidwayReturn))
                    || (showRescueRescue && !(showNotDealReason || showMidwayReturn))
                    || (showFireFighting && !(showNotDealReason || showMidwayReturn)))
              "
            />
            <!-- 简要情况 -->
            <BriefSituation />
            <!-- 气象信息 -->
            <MeteorologicalInfo v-if="!showDraft" />
          </ProCard>
          <ProCard title="投入力量" id="investForce" :showOpenClose="!showPreview">
            <!-- 投入力量 -->
            <InvestForce />
            <!-- 政府指挥 -->
            <GovernmentCommand
              v-if="
                !showFalsePolice
                  && !(showSecurityService && (showNotDealReason || showMidwayReturn))
                  && !(showSocialAssistance && (showNotDealReason || showMidwayReturn))
                  && !(showRescueRescue && (showNotDealReason || showMidwayReturn))
                  && !(showFireFighting && (showNotDealReason || showMidwayReturn))
              "
            />
            <!-- 联动单位 -->
            <LinkageUnit
              v-if="
                !showFalsePolice
                  && !(showSecurityService && (showNotDealReason || showMidwayReturn))
                  && !(showSocialAssistance && (showNotDealReason || showMidwayReturn))
                  && !(showRescueRescue && (showNotDealReason || showMidwayReturn))
                  && !(showFireFighting && (showNotDealReason || showMidwayReturn))
              "
            />
            <!-- 其他救援力量 -->
            <OtherForce v-if="!showFalsePolice" />
          </ProCard>
          <!-- 参战人员伤亡 -->
          <CasualtyWar />
          <!-- 战斗成果 -->
          <BattleResult
            v-if="
              !showFalsePolice
                && !(showSecurityService && (showNotDealReason || showMidwayReturn))
                && !(showSocialAssistance && (showNotDealReason || showMidwayReturn))
                && !(showRescueRescue && (showNotDealReason || showMidwayReturn))
                && !(showFireFighting && (showNotDealReason || showMidwayReturn))
            "
          />
          <!-- 处置经过 -->
          <DisposalProcess />
          <!-- 现场照片 -->
          <ScenePhoto v-if="!showMidwayReturn" />
          <!-- 其他附件 -->
          <OtherAttach />
          <!-- 战斗消耗 -->
          <BattleConsume />
        </template>
        <template v-else-if="showReinforce">
          <ProCard title="基本信息" id="basicInformation" :showOpenClose="!showPreview">
            <!-- 基本信息 -->
            <BasicInformation />
            <!-- 主要战术措施 -->
            <TacticalMeasures
              v-if="
                !showFalsePolice
                  && ((showTactical && !(showNotDealReason || showMidwayReturn))
                    || (showRescueRescue && !(showNotDealReason || showMidwayReturn))
                    || (showFireFighting && !(showNotDealReason || showMidwayReturn)))
              "
            />
            <!-- 简要情况 -->
            <BriefSituation />
          </ProCard>
          <ProCard title="投入力量" id="investForce" :showOpenClose="!showPreview">
            <!-- 投入力量 -->
            <InvestForce />
          </ProCard>
          <!-- 参战人员伤亡 -->
          <CasualtyWar />
          <!-- 战斗成果 -->
          <BattleResult
            v-if="
              !showFalsePolice
                && !(showSecurityService && (showNotDealReason || showMidwayReturn))
                && !(showSocialAssistance && (showNotDealReason || showMidwayReturn))
                && !(showRescueRescue && (showNotDealReason || showMidwayReturn))
                && !(showFireFighting && (showNotDealReason || showMidwayReturn))
            "
          />
          <!-- 处置经过 -->
          <DisposalProcess />
          <!-- 现场照片 -->
          <ScenePhoto v-if="!showMidwayReturn" />
          <!-- 其他附件 -->
          <OtherAttach />
          <!-- 战斗消耗 -->
          <BattleConsume />
        </template>
        <template v-else-if="showHeadquarter">
          <!-- 基本信息-全勤指挥部 -->
          <BasicInfoHeadquarter />
          <!-- 人员信息 -->
          <PersonInfo />
          <!-- 出动装备 -->
          <DeployEquipment />
           <!-- 指挥过程 -->
          <CommandProcess />
          <!-- 参战人员伤亡 -->
          <CasualtyWar />
          <!-- 战斗消耗 -->
          <BattleConsume />
        </template>
        <!-- 操作记录 -->
        <ProSteps v-if="isDetail" :data="form?.proSteps?.fireDispatchTransferVOList?.value" />
      </van-form>

      <div class="form-footer" v-if="!showPreview">
        <template v-if="isApproval && isEdit">
          <van-button round block type="primary" size="small" :loading="loading || temporaryLoading" @click="handleSubmit">
            审核
          </van-button>
        </template>
        <template v-else>
          <van-button round block type="default" size="small" :loading="loading || temporaryLoading" @click="handleTemporary">
            暂存
          </van-button>
          <van-button round block type="primary" size="small" :loading="loading || temporaryLoading" @click="handleSubmit">
            确定
          </van-button>
        </template>
      </div>
    </div>

    <!-- 出动审核 -->
    <ProModal v-model:visible="show.approvalVisible" :title="`出动${labelText}`">
      <template #default="{ setHandleOk }">
        <ProcessReview
          :process-key="props.processKey"
          :current-row="props.currentRow"
          :set-handle-ok="setHandleOk"
          :label-text="labelText"
          @finish-callback="approvalCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.dispatch-report-form {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #F6F8FC;
  .form-left {
    // width: 20%;
  }
  .form-right {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex: 1;
    flex-direction: column;
    .form-footer {
      display: flex;
      padding: 20px 30px;
      button:first-child {
        margin-right: 20px;
      }
    }
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
