<script setup>
import { ref, provide, onMounted, watch, computed, nextTick } from "vue";
import { useDetail, useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
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
import { useFormConfig } from "./formConfig.js";
import { useModal } from '@/hooks/useModal.js';
import { useOptions } from '@/hooks/useOptions.js';
import { useAsyncQueue } from '@vueuse/core';
import { useStore } from "vuex";

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
})

const emits = defineEmits(['finishCallback'])

const { options } = useOptions();

const { show } = useModal();

const { form, initFormWhenChange, initFormByDetail } = useFormConfig();

const store = useStore();

const isNew = ref(true);

const formRef = ref(null);

const showPreview = ref(null);

const detachment = ref('');

const dispatchTruckListOptions = ref([]);

const deptMembersOptions = ref([]);

const dispatchDetail = ref(null);

const importantEdit = ref(true) // 重要信息更正

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

const { detail, loadDetail } = useDetail({
  getDetailFn: () => getFireWarningDetail(props.currentRow.boFireWarningId),
})

provide("form", form)

provide("options", options)

provide('currentRow', props.currentRow)

provide('localFireDispatchId', localFireDispatchId)

provide('dispatchTruckListOptions', dispatchTruckListOptions)

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

provide('showDraft', props.showDraft)

provide('isEdit', props.isEdit)

const initPoliceDetail = () => {
  showLoadingToast()
  return new Promise((resolve) => {
    loadDetail().then(res => {
      resolve()
    })
  })
}

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
  return new Promise((resolve) => {
    getTruckMsg().then(res => {
      dispatchTruckListOptions.value = res.items || []
    }).finally(() => resolve())
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

const initPerson = (dispatchGroup) => {
  return new Promise((resolve) => {
    getInputPerson({ dispatchGroup }).then((res) => {
      if (res) {
        deptMembersOptions.value = res
        options.value.commander = res.filter(item => item.userType === '1')
        options.value.firemen = res.filter(item => item.userType === '2')
      }
    }).finally(() => resolve())
  })
}

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
    nextTick(() => {
      showPreview.value = Boolean(props.isDetail && form.value.basicInformation.dispatchDate.value)
    })
    resolve()
  })
}

const { result } = useAsyncQueue([initDict, initPoliceDetail, initTruckMsg, initWeather, initReport, initPerson, initDetail, initWatch])

onMounted(() => {
  console.log('init', result)
})

const handleSubmit = () => {
  formRef.value.submit()
}

const handleTemporary = () => {

}

const onSubmit = () => {};

const onFailed = (errorInfo) => {
  console.log(errorInfo)
  if (errorInfo?.errors?.length > 0) {
    showToast('信息填写不完整，请检查填写内容！')
    scrollFormFailed()
  }
};
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
      <van-form ref="formRef" @failed="onFailed" @submit="onSubmit">
        <!-- 警情信息 -->
        <FireInfo v-if="!showDraft && !isPolice" />
        <template v-if="showMainGroup">
          <ProCard title="基本信息">
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
          <ProCard title="投入力量">
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
          <ProCard title="基本信息">
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
          <ProCard title="投入力量">
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
      </van-form>

      <div class="form-footer" v-if="!showPreview">
        <van-button round block type="default" size="small" :loading="loading" @click="handleTemporary">
          暂存
        </van-button>
        <van-button round block type="primary" size="small" :loading="loading" @click="handleSubmit">
          确定
        </van-button>
      </div>
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
    height: 100%;
    overflow-y: auto;
    display: flex;
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
</style>
