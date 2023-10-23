<script setup>
import { ref, provide, onMounted, watch, computed } from "vue";
import { useDetail, useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { useFormConfig } from "./formConfig.js";
import basicInformation from "./components/basicInformation.vue";
import {
  approveProcessActions,
  deleteFormFieldAnnotation,
  getDispatchDetail,
  getDispatchDetailHeadquarter,
  getFieldAnnotationDetail,
  getFireWarningDetail,
  getInputPerson,
  getTruckMsg,
  getWeatherMsg,
  initDispatchReport,
  saveDispatchHeadquarter,
  saveDispatchReport,
  saveTemporaryDispatchReport,
} from '@/apis/index.js'
import { fixCarParams, getTypeText, scrollFormFailed } from '@/utils/tools.js'
import { gender } from '@/utils/constants.js';
import { useModal } from '@/hooks/useModal.js';
import { useOptions } from '@/hooks/useOptions.js';
import { useAsyncQueue } from '@vueuse/core';
import { useStore } from "vuex";

const { options } = useOptions();

const { show } = useModal();

const { form } = useFormConfig();

const store = useStore();

const isNew = ref(true);

const formRef = ref(null);

const showPreview = ref(null);

const detachment = ref('');

const dispatchTruckListOptions = ref([]);

const deptMembersOptions = ref([]);

const dispatchDetail = ref(null);

const importantEdit = ref(true) // 重要信息更正

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
// const showMainGroup = computed(() => {
//   if (form.value.draftInfo.partakeType?.value) {
//     return form.value.draftInfo.partakeType.value === '主战'
//   }
//   else {
//     return props?.currentRow?.partakeType === '主战' || props?.currentRow?.dispatchTypeValue === '主战'
//   }
// })

// 显示增援相关字段
// const showReinforce = computed(() => {
//   if (form.value.draftInfo.partakeType?.value) {
//     return form.value.draftInfo.partakeType.value === '增援'
//   }
//   else {
//     return props?.currentRow?.partakeType === '增援' || props?.currentRow?.dispatchTypeValue === '增援'
//   }
// })

// 显示全勤指挥部相关字段
// const showHeadquarter = computed(() => {
//   if (form.value.draftInfo.partakeType?.value) {
//     return form.value.draftInfo.partakeType.value === '指挥'
//   }
//   else {
//     return props?.currentRow?.partakeType === '指挥' || props?.currentRow?.dispatchTypeValue === '指挥'
//   }
// })

// 火灾扑救
// const showFireFighting = computed(() => {
//   return form.value.draftInfo.warningType?.text?.includes('火灾扑救')
// })

// 抢险救援
// const showRescueRescue = computed(() => {
//   return form.value.draftInfo.warningType?.text?.includes('抢险救援')
// })

// 社会救助
// const showSocialAssistance = computed(() => {
//   return form.value.draftInfo.warningType?.text?.includes('社会救助')
// })

// 安保勤务
// const showSecurityService = computed(() => {
//   return form.value.draftInfo.warningType?.text?.includes('安保勤务')
// })

// 虚假警
// const showFalsePolice = computed(() => {
//   return form.value.draftInfo.warningType?.text?.includes('虚假警')
// })

// 主要战术措施
const showTactical = computed(() => {
  const { warningType } = form.value.draftInfo
  return warningType?.text?.join('/') === '社会救助/公共服务/物资保障（送水/农田灌溉、运输物资等）'
    || warningType?.text?.join('/') === '社会救助/公共服务/排水排涝清淤'
    || warningType?.text?.join('/') === '安保勤务/特殊勤务/医疗卫生'
    || warningType?.text?.join('/').indexOf('安保勤务/防灾勤务') > -1
})

provide("form", form)

provide("options", options)

provide('showDealSituation', showDealSituation)

provide('showNotDealReason', showNotDealReason)

provide('showMidwayReturn', showMidwayReturn)

// provide('showMainGroup', showMainGroup)

// provide('showReinforce', showReinforce)

// provide('showHeadquarter', showHeadquarter)

provide('showPreview', showPreview)

// provide('showFalsePolice', showFalsePolice)

// provide('showFireFighting', showFireFighting)

// provide('showRescueRescue', showRescueRescue)

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
    resolve()
  })
}

const initTruckMsg = () => {
  return getTruckMsg().then(res => {
    dispatchTruckListOptions.value = res.items || []
  })
}

const initWeather = () => {
  const { showDraft, isDetail } = route.query
  return new Promise((resolve) => {
    if (!showDraft && !isDetail && !form.value.basicInformation.weather.value) {
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
      })
    } else {
      resolve()
    }
  })
}

const initDetail = () => {
  const { boFireDispatchId, isStorage, partakeType, dispatchTypeValue } = route.query
  const { isEdit, isDetail } = props
  if (boFireDispatchId && ['指挥'].includes(partakeType || dispatchTypeValue)) {
    getDispatchDetailHeadquarter(boFireDispatchId).then((res) => {
      if (res) {
        dispatchDetail.value = res
        if (!props.showDraft) {
          importantEdit.value = res.importantInfoRecheck
        }
      }
    })
  }
  else if ((isEdit && boFireDispatchId) || (isDetail && boFireDispatchId)) {
    getDispatchDetail(boFireDispatchId).then((res) => {
      if (res) {
        dispatchDetail.value = res
        if (!props.showDraft) {
          importantEdit.value = res.importantInfoRecheck
        }
      }
    })
  }
  else if (isStorage === '1' && ['指挥'].includes(partakeType || dispatchTypeValue)) {
    getDispatchDetailHeadquarter(boFireDispatchId).then((res) => {
      if (res) {
        if (!props.showDraft) {
          importantEdit.value = res.importantInfoRecheck
        }
      }
    })
  }
  else if (isStorage === '1') {
    getDispatchDetail(boFireDispatchId).then((res) => {
      if (res) {
        if (!props.showDraft) {
          importantEdit.value = res.importantInfoRecheck
        }
      }
    })
  }
}

const initReport = () => {
  const { boFireDispatchId } = route.query
  return new Promise((resolve) => {
    if (boFireDispatchId) {
      return initDispatchReport({ id: boFireDispatchId }).then((res) => {
        if (res) {
          isNew.value = res.isNew
          // form.value.basicInfoHead.headquarterName.value = res.dispatchGroupName
          detachment.value = res.detachment
        }
      })
    } else {
      resolve()
    }
  })
}

const initPerson = (dispatchGroup) => {
  return getInputPerson({ dispatchGroup }).then((res) => {
    if (res) {
      deptMembersOptions.value = res
      options.value.commander = res.filter(item => item.userType === '1')
      options.value.firemen = res.filter(item => item.userType === '2')
    }
  })
}

const { result } = useAsyncQueue([initDict, initTruckMsg, initWeather, initDetail, initReport, initPerson])

onMounted(() => {
  console.log('init', result)
})

const onSubmit = () => {};
</script>

<template>
  <div class="dispatch-report-form">
    <div class="form-left">
      <van-sidebar>
        <van-sidebar-item title="标签名称" dot />
        <van-sidebar-item title="标签名称" badge="5" />
        <van-sidebar-item title="标签名称" />
      </van-sidebar>
    </div>
    <div class="form-right">
      <van-form ref="formRef" @submit="onSubmit">
        <basicInformation />
      </van-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dispatch-report-form {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #F6F8FC;
  .form-left {
    width: 20%;
  }
  .form-right {
    width: 80%;
    display: flex;
    flex-direction: column;
  }
}
</style>
