<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import AreaCascader from '@/component/AreaCascader/index.vue'
import SelectDateTime from "@/component/SelectDateTime/index";
import SelectMultiple from "@/component/SelectMultiple/index";
import CascaderSingle from "@/component/CascaderSingle/index";

import store from '@/store/index.js'
import dayjs from 'dayjs'
// import { message, notification } from '@castle/ant-design-vue'
const getSystemDictSync = store.getters['dict/getSystemDictSync']
import { checkBurnedArea, checkFireResistanceRating } from '../config/tool.js'
import { gutter } from '@/utils/constants.js'

// import FieldAnnotation from '@/components/field-annotation/index.vue'
// import SelectCascader from '@/components/select-cascader/index.vue'
import { useUpload } from '@/hooks/useUpload.js'
import { getAttachmentFile } from '@/apis/index.js'
import { nonnegativeNumberReg, validateTelePhone } from '@/utils/validate.js'



// import { 
//   useRuleConfig,
//    useSystemDict 
// } from '@/store/index.js'

// const { ruleConfig: { severityConfig } } = useRuleConfig()
const severityConfig = store.state?.rules?.ruleConfig?.severityConfig|| []
// const systemDict = useSystemDict()

const form = inject('form')

const formRef = inject('formRef')

const isEdit = inject('isEdit')

const isDetail = inject('isDetail')

const isApproval = inject('isApproval')

const showPreview = inject('showPreview')

const showDraft = inject('showDraft')

const currentRow = inject('currentRow')

const options = inject('options')

const showFireSite = inject('showFireSite')

const showVehicleFire = inject('showVehicleFire')

const showBuildingMinor = inject('showBuildingMinor')

const showOtherMinor = inject('showOtherMinor')

const relevanceDraft = inject('relevanceDraft')

const importantEdit = inject('importantEdit')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const localFireInfoId = inject('localFireInfoId')

const unDispatch = inject('unDispatch')

const { onRemove } = useUpload()

const show = ref({})

const showOtherOrgRemark = ref(false)

const ratingOptions = ref(options.value.fireResistanceRating)

const fireTypeOptions = computed(() => {
  const types = options.value.fireType ? options.value.fireType[0].children?.slice(0, 6) : []
  return types
})

const fireTypeDisabled = computed(() => {
  let value = false;
  ['建构筑物火灾', '交通工具火灾', '露天场所火灾', '室外设施设备火灾', '户外植被火灾', '垃圾及废弃物火灾'].forEach((item) => {
    if (currentRow?.warningTypeValue?.indexOf(item) > -1) {
      value = true
    }
  })
  if (isApproval) {
    value = true
  }
  return value
})

onMounted(() => {
  if (isDetail || isEdit || (relevanceDraft && relevanceDraft.boFireInfoId) || currentRow?.boFireInfoId) {
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'safetyFile',
    }).then((res) => {
      form.value.basicInfo.attach.value = res.data.map((item) => {
        return {
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `/acws/rest/attachments/${item.attachmentId}`,
        }
      })
    })
  }
})

watch(() => form.value, () => {
  const { directDamage } = form.value.economicLoss
  const { injuredList, deadList } = form.value.casualtyWar
  if (deadList?.length >= 30 || injuredList?.length >= 100 || directDamage.value >= 100000000) { // 特别重大事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '特大火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
  else if ((deadList?.length >= 10 && deadList?.length < 30)
    || (injuredList?.length >= 50 && injuredList?.length < 100)
    || (directDamage.value >= 50000000 && directDamage.value < 100000000)) { // 重大事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '重大火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
  else if ((deadList?.length >= 3 && deadList?.length < 10)
    || (injuredList?.length >= 10 && injuredList?.length < 50)
    || (directDamage.value >= 10000000 && directDamage.value < 50000000)) { // 较大事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '较大火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
  else if (deadList?.length < 3 || injuredList?.length < 10 || directDamage.value < 100000000) { // 一般事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '一般火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
}, { deep: true, immediate: true })

const disabledDate = (current) => {
  return current && current > Date.now()
}

const validateFireDate = (rule, value, callback) => {
  const { fireDate } = form.value.basicInfo
  if (!value) {
    if (!fireDate.rules[0].required) {
      callback()
    }
    else {
      callback(new Error('请选择起火时间'))
    }
  }
  else if (currentRow?.warningDate && fireDate?.value?.valueOf() > currentRow.warningDate) {
    callback(new Error('起火时间不能晚于接警时间'))
  }
  else {
    callback()
  }
}

const onArea = () => {
  form.value.basicInfo.isUrbanVillages.value = undefined
  form.value.basicInfo.otherArea.value = undefined
}

const onSeverity = () => {
  const { basicInfo } = form.value
  // 轻微火灾，起火原因不能选择‘刑事放火’
  if (options.value.fireCause) {
    options.value.fireCause.map((item) => {
      item.children?.forEach((temp) => {
        if (temp.dictName === '刑事放火') {
          temp.disabled = basicInfo.severity?.value === '1'
        }
      })
      return item
    })
  }
}

const validateBurnedArea = (rule, value, callback) => {
  const { burnedArea, severity, fireType } = form.value.basicInfo
  if (!value && value !== 0) {
    if (!burnedArea.rules[0].required) {
      callback()
    }
    else {
      callback(new Error('请输入过火面积'))
    }
  }
  else if (!nonnegativeNumberReg.test(value)) {
    callback(new Error('请输入正确过火面积'))
  }
  else {
    callback()
  }
}

const onIsInsurance = (e) => {
  if (e === '2') {
    form.value.basicInfo.insuranceInfo.value = undefined
  }
}

const onFirePlace = () => {
  if (!options.value?.firePlace || !form.value.basicInfo.fireType?.value) {
    // message.warning('请先选择火灾类型')
  }
}

const firePlaceChange = (value, selectedOptions) => {
  if (selectedOptions) {
    form.value.basicInfo.firePlace.text = selectedOptions.map(item => item.dictName) || []
  }
  else {
    form.value.basicInfo.firePlace.text = []
  }
  form.value.basicInfo.fireSite.value = []
  form.value.basicInfo.isLaborIntensive.value = '2'
  form.value.basicInfo.plantRiskClassification.value = undefined
  form.value.basicInfo.otherFirePlace.value = ''

  checkFireResistanceRating(form.value, options.value)
}

const fireTypeChange = (value, selectedOptions) => {
  if (selectedOptions) {
    const { fireType } = options.value
    const node = fireType[0]
    form.value.basicInfo.fireType.text = [node.dictName, selectedOptions.dictName]
    form.value.basicInfo.fireType.completeValue = [node.boDictId, selectedOptions.boDictId]
  }
  else {
    form.value.basicInfo.fireType.text = []
    form.value.basicInfo.fireType.completeValue = []
  }
  form.value.basicInfo.fireSite.value = []
  // 起火场所根据火灾类型改变
  form.value.basicInfo.firePlace.value = undefined
  let key = ''
  if (selectedOptions && selectedOptions.dictName === '建构筑物火灾') {
    key = 'HZ_QHCS_JGZW'
  }
  else if (selectedOptions && selectedOptions.dictName === '交通工具火灾') {
    key = 'HZ_QHCS_JGZW,HZ_QHCS_LTCS,HZ_QHCS_HWZB'
  }
  else if (selectedOptions && selectedOptions.dictName === '室外设施设备火灾') {
    key = 'HZ_QHCS_SWSB'
  }
  else if (selectedOptions && selectedOptions.dictName === '露天场所火灾') {
    key = 'HZ_QHCS_LTCS'
  }
  else if (selectedOptions && selectedOptions.dictName === '户外植被火灾') {
    key = 'HZ_QHCS_HWZB'
  }
  else if (selectedOptions && selectedOptions.dictName === '垃圾及废弃物火灾') {
    key = 'HZ_QHCS_LJFQ'
  }
  getSystemDictSync(key.split(','), null, (res) => {
    options.value.firePlace = []
    key.split(',').forEach((item) => {
      options.value.firePlace.push(...res[item])
    })
  })
}

const vehicleTypeChange = (value, selectedOptions) => {
  if (selectedOptions) {
    form.value.basicInfo.vehicleType.text = selectedOptions.map(item => item.dictName) || []
  }
  else {
    form.value.basicInfo.vehicleType.text = []
  }
  form.value.basicInfo.fireSite.value = []
}

const initialFuelsTypeChange = (value, selectedOptions) => {
  if (selectedOptions) {
    form.value.basicInfo.initialFuelsType.text = selectedOptions.map(item => item.dictName) || []
  }
  else {
    form.value.basicInfo.initialFuelsType.text = []
  }
}

const fireCauseChange = (value, selectedOptions) => {
  if (selectedOptions) {
    form.value.basicInfo.fireCause.text = selectedOptions.map(item => item.dictName) || []
  }
  else {
    form.value.basicInfo.fireCause.text = []
  }
}

const validateFireTel = (rule, value, callback) => {
  if (!value) {
    if (!form.value.basicInfo.fireTel.rules[0].required) {
      callback()
    }
    else {
      callback(new Error('请输入失火单位/户主联系电话'))
    }
  }
  else if (!validateTelePhone(value)) {
    callback(new Error('请输入正确失火单位/户主联系电话'))
  }
  else {
    callback()
  }
}

const onLeadInspectionOrg = () => {
  const filter = options.value.leadInspectionOrg?.filter(item => item.boDictId === form.value.basicInfo.leadInspectionOrg?.value)
  if (filter && filter[0]?.dictName.includes('其他')) {
    showOtherOrgRemark.value = true
  }
  else {
    showOtherOrgRemark.value = false
    form.value.basicInfo.otherOrgRemark.value = ''
  }
}

const onBuildStructure = () => {
  const { buildStructure } = form.value.basicInfo
  const filter = options.value.buildStructure?.filter(item => item.boDictId === buildStructure.value)
  if (filter && filter[0]
    && (filter[0].dictName === '钢结构' || filter[0].dictName === '钢砼结构' || filter[0].dictName === '砖混结构')) {
    form.value.basicInfo.fireResistanceRating.value = undefined
    ratingOptions.value = options.value.fireResistanceRating.filter(item => item.dictName === '一级' || item.dictName === '二级')
  }
  else if (filter && filter[0] && (filter[0].dictName === '砖木结构')) {
    form.value.basicInfo.fireResistanceRating.value = undefined
    ratingOptions.value = options.value.fireResistanceRating.filter(item => item.dictName === '三级')
  }
  else if (filter && filter[0] && (filter[0].dictName === '木结构')) {
    form.value.basicInfo.fireResistanceRating.value = undefined
    ratingOptions.value = options.value.fireResistanceRating.filter(item => item.dictName === '三级' || item.dictName === '四级')
  }
  else {
    form.value.basicInfo.fireResistanceRating.value = undefined
    ratingOptions.value = options.value.fireResistanceRating.map(item => item)
  }
}

const onFireInspection = () => {
  const { basicInfo } = form.value
  const filter = options.value?.fireInspection?.filter(item => item.boDictId === basicInfo.fireInspection?.value)
  if (filter?.length <= 0 || filter[0].dictName !== '消防救援机构监督检查范围') {
    form.value.basicInfo.fireInspectionScope.value = undefined
    form.value.basicInfo.fireSafetyUnits.value = undefined
  }
}

const onFireInspectionScope = () => {
  const { basicInfo } = form.value
  const ids = basicInfo.fireInspectionScope?.value || ''
  const filter = options.value?.fireInspectionScope?.filter(item => ids.includes(item.boDictId)).map(item => item.dictName).join(',')
  if (filter?.length <= 0 || !filter.includes('消防安全重点单位')) {
    form.value.basicInfo.fireSafetyUnits.value = undefined
  }
}

const onIsSafetyAccident = () => {
  if (form.value.basicInfo.isSafetyAccident.value === '2') {
    form.value.basicInfo.attach.value = []
    form.value.basicInfo.fileRemark.value = undefined
  }
}

const onIsChangeUseType = () => {
  if (form.value.basicInfo.isChangeUseType.value === '2') {
    form.value.basicInfo.useType.value = undefined
  }
}

const showBatteryType = computed(() => {
  const { vehicleType } = form.value.basicInfo
  return vehicleType?.text?.indexOf('道路交通') > -1
  && (vehicleType?.text?.indexOf('纯电动') > -1 || vehicleType?.text?.indexOf('插电混动') > -1 || vehicleType?.text?.indexOf('燃料电池') > -1)
})

const showVinCode = computed(() => {
  const { vehicleType } = form.value.basicInfo
  return vehicleType?.text?.indexOf('道路交通') > -1
    && (vehicleType?.text?.indexOf('乘用车') > -1
    || vehicleType?.text?.indexOf('客车') > -1
    || vehicleType?.text?.indexOf('货车') > -1
    || vehicleType?.text?.indexOf('危险品运输车辆') > -1
    || vehicleType?.text?.indexOf('专用机动车') > -1)
})

const showLowSpeed = computed(() => {
  const { vehicleType } = form.value.basicInfo
  return vehicleType?.text?.indexOf('道路交通') > -1 && vehicleType?.text?.indexOf('低速电动车') > -1
})

const showResidence = computed(() => {
  const { basicInfo } = form.value
  return basicInfo.firePlace?.text?.indexOf('居住场所') > -1 && basicInfo.fireType?.text?.includes('建构筑物火灾')
})

const showisLaborIntensive = computed(() => {
  const { basicInfo } = form.value
  return basicInfo.firePlace?.text?.indexOf('生产加工场所') > -1
})

const showplantRiskClassification = computed(() => {
  const { basicInfo } = form.value
  return basicInfo.firePlace?.text?.indexOf('生产加工场所') > -1 || basicInfo.firePlace?.text?.indexOf('物资仓储场所') > -1
})

const showOtherFirePlace = computed(() => {
  const { firePlace } = form.value.basicInfo
  return firePlace?.text?.join(',').indexOf('其他') > -1
})

const showFireInspection = computed(() => {
  const { basicInfo } = form.value
  const filter = options.value?.fireInspection?.filter(item => item.boDictId === basicInfo.fireInspection?.value)
  return filter?.length > 0 && filter[0].dictName === '消防救援机构监督检查范围'
})

const showFireInspectionScope = computed(() => {
  const { basicInfo } = form.value
  const ids = basicInfo.fireInspectionScope?.value || ''
  const filter = options.value?.fireInspectionScope?.filter(item => ids.includes(item.boDictId)).map(item => item.dictName).join(',')
  return filter.includes('消防安全重点单位')
})

// const showOutdoorBridge = computed(() => {
//   const { fireType, firePlace } = form.value.basicInfo
//   return fireType?.text?.includes('露天场所火灾') && firePlace?.text?.indexOf('桥梁') > -1
// })
</script>

<template>
  <div id="basicInfo">
    <h4 id="basicInfo-title">
      <strong>基本信息</strong>
    </h4>
    <div :gutter="gutter">
      <!-- <div v-if="showDraft" :span="8">
        <a-form-item
          :name="['basicInfo', 'draftName', 'value']"
          label="草稿名称"
          :rules="form.basicInfo.draftName.rules"
        >
          <a-input
            id="draftName"
            v-model:value="form.basicInfo.draftName.value"
            v-preview-text="showPreview"
            :maxlength="100"
            placeholder="请输入草稿名称"
            allow-clear
            aria-autocomplete="none"
          />
        </a-form-item>
      </div> -->
    </div>
    <div class="isSearch">
      <SelectSingle
        v-model:value="form.basicInfo.isResearch.value"
        label="是否调查"
        :options="options.isResearch"
        :field-names="{label:'label',value:'value'}"
        :rules="form.basicInfo.isResearch.rules"
        :required="true"
        placeholder="请选择是否正在调查"
        title="请选择是否正在调查"
      />
    </div>
    <div class="severity">
      <SelectSingle
        v-model:value="form.basicInfo.severity.value"
        label="严重程度"
        :options="options.severity"
        :field-names="{label:'label',value:'value'}"
        :rules="form.basicInfo.severity.rules"
        :required="true"
        placeholder="请选择严重程度"
        title="请选择严重程度"
      />
    </div>
    <div class="fireType">
      <SelectSingle
        v-model:value="form.basicInfo.fireType.value"
        label="火灾类型"
        :options="fireTypeOptions"
        :rules="form.basicInfo.fireType.rules"
        :required="true"
        placeholder="请选择火灾类型"
        title="请选择火灾类型"
        v-preview-text="showPreview"
        @change="fireTypeChange"
      />
    </div>
      <div class="fireDate">
        <SelectDateTime
          v-model:value="form.basicInfo.fireDate.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          is-link
          required
          name="warningDate"
          title="请选择起火时间"
          label="起火时间："
          placeholder="请选择起火时间"
          :rules="[{ required: true, message: '请选择起火时间' }]"
        />
      </div>
      <div class="noDispatchArea">
          <AreaCascader
            name="noDispatchArea"
            v-model:value="form.basicInfo.noDispatchArea.value"
            :showPreview="showPreview"
            :readonly="showPreview"
            :show-all-area="!!showPreview"
            :required="!showPreview"
          />
      </div>
      <div class="fireDirection">
        <van-field
          label="起火地点"
          v-model="form.basicInfo.fireDirection.value"
          name="起火地点"
          placeholder="请输入起火地点"
          :rules="form.basicInfo.fireDirection.rules"
          v-preview-text="showPreview"
        />
      </div>
  
      <div class="noDispatchArea">
        <AreaCascader
          name="noDispatchArea"
          v-model:value="form.basicInfo.noDispatchArea.value"
          :showPreview="showPreview"
          :readonly="showPreview"
          :show-all-area="!!showPreview"
          :required="!showPreview"
          :rules="[{ required: true, message: '请选择行政区域' }]"
        />
      </div>
      <div class="area">
        <CascaderSingle
          v-model:value="form.basicInfo.area.value"
          v-preview-text="showPreview"
          :options="options.area"
          :required="true"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          label="区域"
          placeholder="请选择区域"
          :rules="form.basicInfo.area.rules"
        />
      </div>
      <div class="fireOrgname">
        <van-field
          label="单位/户主/个体户名称"
          v-model:value="form.basicInfo.fireOrgname.value"
          v-preview-text="showPreview"
          name="单位/户主/个体户名称"
          placeholder="单位/户主/个体户名称"
          :rules="form.basicInfo.fireOrgname.rules"
        />
      </div>
      <div class="fireTel">
        <van-field
          label="失火单位/户主联系电话"
          v-model:value="form.basicInfo.fireTel.value"
          v-preview-text="showPreview"
          name="失火单位/户主联系电话"
          placeholder="失火单位/户主联系电话"
          :rules="[{ validator: validateFireTel, trigger: 'blur' }, ...form.basicInfo.fireTel.rules]"
        />
      </div>
      <div v-if="!showOtherMinor" class="socialCreditCode">
        <van-field
          label="单位统一社会信用代码"
          v-model:value="form.basicInfo.socialCreditCode.value"
          v-preview-text="showPreview"
          name="单位统一社会信用代码"
          placeholder="单位统一社会信用代码"
          :rules="form.basicInfo.socialCreditCode.rules"
        />
      </div>
      <div class="fireCause">
        <CascaderSingle 
          v-model:value="form.basicInfo.fireCause.value"
          v-preview-text="showPreview"
          :options="options.fireCause"
          label="起火原因"
          placeholder="请选择起火原因"
          :rules="form.basicInfo.fireCause.rules"
          @change="fireCauseChange"
        />
      </div>
      <div>
        <van-field 
          :disabled="!importantEdit"
          name="过火面积（平方米）" 
          label="过火面积（平方米）"
          :rules="[{ validator: validateBurnedArea, trigger: 'blur' }, ...form.basicInfo.burnedArea.rules]"
          @blur="checkBurnedArea(form)"
        >
          <template #input>
            <van-stepper 
              v-model="form.basicInfo.burnedArea.value" 
              v-preview-text="showPreview"
            />
          </template>
        </van-field>
      </div>
      <div class="fireLevel">
        <SelectSingle
          v-model:value="form.basicInfo.fireLevel.value"
          v-preview-text="showPreview"
          label="火灾等级"
          :options="options.isResearch"
          :rules="form.basicInfo.fireLevel.rules"
          placeholder="请选择火灾等级"
          title="请选择火灾等级"
          disabled
        />
      </div>
      <div class="firePlace">
        <CascaderSingle
          id="firePlace"
          v-model:value="form.basicInfo.firePlace.value"
          v-preview-text="showPreview"
          :options="options.firePlace"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          label="起火场所"
          placeholder="请选择起火场所"
          :rules="form.basicInfo.area.rules"
          @change="firePlaceChange"
        />
      </div>
      <div v-if="showisLaborIntensive"  class="isLaborIntensive">
        <van-field name="是否属于劳动密集型" label="是否属于劳动密集型" >
          <template #input>
            <van-radio-group v-preview-text="showPreview" v-model="form.basicInfo.isLaborIntensive.value" direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div v-if="showplantRiskClassification"  class="plantRiskClassification">
        <SelectSingle
          v-model:value="form.basicInfo.plantRiskClassification.value"
          label="厂房火灾危险性分类"
          :options="options.plantRiskClassification"
          :rules="form.basicInfo.plantRiskClassification.rules"
          :required="true"
          placeholder="请选择厂房火灾危险性分类"
          title="请选择厂房火灾危险性分类"
          v-preview-text="showPreview"
        />
      </div>
      <div v-if="showOtherFirePlace" class="otherFirePlace">
        <van-field
          label="其他说明"
          v-model:value="form.basicInfo.otherFirePlace.value"
          v-preview-text="showPreview"
          name="其他说明"
          placeholder="请输入其他说明"
          :rules="form.basicInfo.otherFirePlace.rules"
        />
      </div>
      <div v-if="showOtherFirePlace" class="otherFirePlace">
        <van-field 
          label="其他说明"
          v-model:value="form.basicInfo.otherFirePlace.value"
          v-preview-text="showPreview"
          name="其他说明"
          placeholder="请输入其他说明"
          :rules="form.basicInfo.otherFirePlace.rules"
        />
      </div>
      <div v-if="showResidence" class="fireDate">
        <SelectSingle
          id="liveType"
          v-model:value="form.basicInfo.liveType.value"
          v-preview-text="showPreview"
          :options="options.liveType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择居住形式"
          label="居住形式"
          :required="true"
          :rules="form.basicInfo.liveType.rules"
          title="请选择居住形式"
          @change="fireTypeChange"

        />
      </div>
      <div v-if="showVehicleFire" class="vehicleType">
        <CascaderSingle
          label="交通工具类型"
          :rules="form.basicInfo.vehicleType.rules"
          id="vehicleType"
          v-model:value="form.basicInfo.vehicleType.value"
          :preview="showPreview"
          :options="options.vehicleType"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          :field-name="['basicInfo', 'vehicleType', 'value']"
          :form-ref="formRef"
          placeholder="请选择交通工具类型"
          @change="vehicleTypeChange"
          v-preview-text="showPreview"
          :required="true"
        />
      </div>

    <div orientation="left" orientation-margin="0px" style="border-color: #A4A4A4" dashed ></div>
    <template v-if="showVehicleFire">
      <div v-if="showBatteryType" class="chargeState" >
        <SelectSingle
          label="起火时充电状态"
          :rules="form.basicInfo.chargeState.rules"
          id="chargeState"
          v-model:value="form.basicInfo.chargeState.value"
          v-preview-text="showPreview"
          :options="options.chargeState"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择起火时充电状态"
          :required="true"
          title="请选择起火时充电状态"
          @change="fireTypeChange"
        />
      </div>
      <div v-if="showLowSpeed" class="isRepack">
        <van-field name="是否改装" label="是否改装" >
          <template #input>
            <van-radio-group 
              v-preview-text="showPreview" 
              v-model="form.basicInfo.isRepack.value" 
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div v-if="showBatteryType || showLowSpeed">
        <SelectSingle
          label="电池类型"
          :rules="form.basicInfo.batteryType.rules"
          id="batteryType"
          v-model:value="form.basicInfo.batteryType.value"
          v-preview-text="showPreview"
          :options="options.batteryType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择电池类型"
          title="请选择电池类型"
        />
      </div>
      <div v-if="showBatteryType || showLowSpeed">
        <SelectSingle
          label="电池类型"
          :rules="form.basicInfo.batteryType.rules"
          id="batteryType"
          v-model:value="form.basicInfo.batteryType.value"
          v-preview-text="showPreview"
          :options="options.batteryType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择电池类型"
          title="请选择电池类型"
      />
      </div>
        <div v-if="showVinCode">
          <van-field
            label="车辆VIN码"
            :rules="form.basicInfo.vinCode.rules"
            id="车辆VIN码"
            v-model:value="form.basicInfo.vinCode.value"
            v-preview-text="showPreview"
            allow-clear
            :maxlength="20"
            aria-autocomplete="none"
            placeholder="请输入车辆VIN码"
            name="车辆VIN码"
          />
        </div>
        <div v-if="showVinCode">
          <van-field
            label="车牌号"
            :rules="form.basicInfo.carNumber.rules"
            id="carNumber"
            v-model:value="form.basicInfo.carNumber.value"
            v-preview-text="showPreview"
            allow-clear
            :maxlength="20"
            aria-autocomplete="none"
            placeholder="请输入车牌号"
            name="车牌号"
          />
        </div>
        <div class="driveState" >
          <SelectSingle
            label="行驶状态"
            :rules="form.basicInfo.driveState.rules"
            id="driveState"
            v-model:value="form.basicInfo.driveState.value"
            v-preview-text="showPreview"
            :options="options.driveState"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择行驶状态"
            :required="true"
            title="请选择行驶状态"
          />
        </div>
    </template>
    <div v-if="showResidence" :gutter="gutter">
      <div class="isPoorHouse">
        <van-field name="是否属于扶贫安置房" label="是否属于扶贫安置房" >
          <template #input>
            <van-radio-group 
              v-preview-text="showPreview" 
              v-model="form.basicInfo.isPoorHouse.value"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div class="isChangeUseType">
        <van-field name="是否变更使用性质" label="是否变更使用性质" >
          <template #input>
            <van-radio-group 
              v-model="form.basicInfo.isChangeUseType.value"
              v-preview-text="showPreview"
              @change="onIsChangeUseType"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div v-if="form.basicInfo.isChangeUseType.value === '1'">
        <SelectSingle
          label="变更后使用性质"
          :rules="form.basicInfo.useType.rules"
          id="useType"
          v-model:value="form.basicInfo.useType.value"
          v-preview-text="showPreview"
          :options="options.useType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择变更后使用性质"
          title="请选择变更后使用性质"
        />
      </div>
    </div>
    <div :gutter="gutter">
      <div :span="8">
        <CascaderSingle
            label="事故形态"
            :rules="form.basicInfo.firePattern.rules"
            :preview="!!showPreview"
            id="firePattern"
            v-model:value="form.basicInfo.firePattern.value"
            :options="options.firePattern"
            :field-names="{ value: 'boDictId', text: 'dictName' }"
            :field-name="['basicInfo', 'firePattern', 'value']"
            placeholder="请选择事故形态"
            v-preview-text="showPreview"
        />
      </div>
      <div v-if="showFireSite" :span="8">
        <CascaderSingle
            label="起火位置"
            :rules="form.basicInfo.fireSite.rules"
            id="fireSite"
            v-model:value="form.basicInfo.fireSite.value"
            :preview="showPreview"
            :options="options.fireSite"
            :field-names="{ value: 'boDictId', text: 'dictName' }"
            :field-name="['basicInfo', 'fireSite', 'value']"
            :form-ref="formRef"
            placeholder="请选择起火位置"
            v-preview-text="showPreview"
        />
      </div>
    </div>
    <div :gutter="gutter">
      <div>
        <van-field
          label="起火物名称"
          :rules="form.basicInfo.initialFuels.rules"
          id="initialFuels"
          v-model:value="form.basicInfo.initialFuels.value"
          v-preview-text="showPreview"
          allow-clear
          :maxlength="50"
          aria-autocomplete="none"
          placeholder="请输入起火物名称"
          name="起火物名称"
        />
      </div>
      <div :span="8">
        <CascaderSingle
            label="起火物类型"
            :rules="form.basicInfo.initialFuelsType.rules"
            id="initialFuelsType"
            v-model:value="form.basicInfo.initialFuelsType.value"
            :preview="!!showPreview"
            :options="options.initialFuelsType"
            :field-names="{ value: 'boDictId', text: 'dictName' }"
            :field-name="['basicInfo', 'initialFuelsType', 'value']"
            :form-ref="formRef"
            show-description
            title="请选择起火物类型"
            placeholder="请选择起火物类型或者指标说明"
            @change="initialFuelsTypeChange"
            v-preview-text="showPreview"
        />
      </div>
    </div>
    <div :gutter="gutter">
      <div :span="8">
        <van-field
          label="引火源名称"
          :rules="form.basicInfo.igniteSource.rules"
          id="igniteSource"
          v-model:value="form.basicInfo.igniteSource.value"
          v-preview-text="showPreview"
          allow-clear
          :maxlength="50"
          aria-autocomplete="none"
          placeholder="请输入引火源名称"
          name="起火物名称"
        />
      </div>
      <div :span="8">
        <CascaderSingle
            label="引火源类型"
            :rules="form.basicInfo.igniteSourceType.rules"
            id="igniteSourceType"
            v-model:value="form.basicInfo.igniteSourceType.value"
            :preview="!!showPreview"
            :options="options.igniteSourceType"
            :field-names="{ value: 'boDictId', text: 'dictName' }"
            :field-name="['basicInfo', 'igniteSourceType', 'value']"
            :form-ref="formRef"
            show-description
            title="请选择引火源类型"
            placeholder="请选择引火源类型或者指标说明"
            @change="initialFuelsTypeChange"
            v-preview-text="showPreview"
        />
      </div>
    </div>
    <div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field
          label="引起火灾人员年龄"
          :rules="form.basicInfo.firePersonAge.rules"
          id="firePersonAge"
          v-model:value="form.basicInfo.firePersonAge.value"
          v-preview-text="showPreview"
          allow-clear
          :maxlength="3"
          aria-autocomplete="none"
          placeholder="请输入引起火灾人员年龄"
          name="起火物名称"
        />
      </div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <SelectSingle
          label="受教育程度"
          :rules="form.basicInfo.schooling.rules"
          id="schooling"
          v-model:value="form.basicInfo.schooling.value"
          v-preview-text="showPreview"
          :options="options.schooling"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择受教育程度"
          title="请选择受教育程度"
        />
      </div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <SelectSingle
          label="健康状况"
          :rules="form.basicInfo.health.rules"
          id="health"
          v-model:value="form.basicInfo.health.value"
          v-preview-text="showPreview"
          :options="options.health"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择健康状况"
          title="请选择健康状况"
        />

      </div>
    </div>
    <div :gutter="gutter">
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <CascaderSingle
          label="所属行业"
          :rules="form.basicInfo.industry.rules"
          id="industry"
          v-model:value="form.basicInfo.industry.value"
          v-preview-text="showPreview"
          :options="options.industry"
          :field-name="{ value: 'boDictId', text: 'dictName' }"
          placeholder="请选择所属行业"
          allow-clear
          :show-search="{ filter: (inputValue, path) => path.some(option => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }"
        />
      </div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <SelectSingle
          label="经济类型"
          :rules="form.basicInfo.economicType.rules"
          id="economicType"
          v-model:value="form.basicInfo.economicType.value"
          v-preview-text="showPreview"
          :options="options.economicType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择经济类型"
          title="请选择经济类型"
        />
      </div>
    </div>
    <div :gutter="gutter">
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <SelectSingle
          label="事故牵头调查部门"
          :rules="form.basicInfo.leadInspectionOrg.rules"
          id="leadInspectionOrg"
          v-model:value="form.basicInfo.leadInspectionOrg.value"
          v-preview-text="showPreview"
          :options="options.leadInspectionOrg"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择事故牵头调查部门"
          @change="onLeadInspectionOrg"
          title="请选择事故牵头调查部门"
        />
      </div>
      <div v-if="showOtherOrgRemark" :span="8">
        <van-field
          label="其他单位说明"
          :rules="form.basicInfo.otherOrgRemark.rules"
          id="otherOrgRemark"
          v-model:value="form.basicInfo.otherOrgRemark.value"
          v-preview-text="showPreview"
          :maxlength="100"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入其他单位说明"
          name="请输入其他单位说明"
        />
      </div>
    </div>
    <div :gutter="gutter">
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field 
          name="是否保险" 
          label="是否保险" 
          :rules="form.basicInfo.isInsurance.rules">
          <template #input>
            <van-radio-group 
              v-model="form.basicInfo.isInsurance.value"
              v-preview-text="showPreview"
              @change="onIsInsurance"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div v-if="form.basicInfo.isInsurance.value === '1'" :span="8">
        <SelectMultiple
          label="保险类型"
          :rules="form.basicInfo.insuranceInfo.rules"
          id="insuranceInfo"
          v-model:value="form.basicInfo.insuranceInfo.value"
          v-preview-text="showPreview"
          :options="options.insuranceInfo"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          mode="multiple"
          show-arrow
          option-filter-prop="dictName"
          max-tag-count="responsive"
          placeholder="请选择保险类型"
          :required="true"
          title="请选择警情标签"
        />
      </div>
    </div>
    <div :gutter="gutter">
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field name="是否单方面火灾" label="是否单方面火灾" :rules="form.basicInfo.isOnesided.rules">
          <template #input>
            <van-radio-group 
              id="isOnesided"
              v-model="form.basicInfo.isOnesided.value"
              v-preview-text="showPreview"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
    </div>
    <div :gutter="gutter">
      <div v-if="!showOtherMinor" :span="8">
        <SelectSingle
          label="监督检查情况"
          :rules="form.basicInfo.fireInspection.rules"
          id="fireInspection"
          v-model:value="form.basicInfo.fireInspection.value"
          v-preview-text="showPreview"
          :options="options.fireInspection"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择监督检查情况"
          @change="onFireInspection"
          title="请选择事故牵头调查部门"
        />
      </div>
      <div v-if="showFireInspection" :span="8">
        <SelectMultiple
            label="监督检查范围"
            :rules="form.basicInfo.fireInspectionScope.rules"
            id="fireInspectionScope"
            v-model:value="form.basicInfo.fireInspectionScope.value"
            v-preview-text="showPreview"
            :options="options.fireInspectionScope"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            mode="multiple"
            show-arrow
            max-tag-count="responsive"
            placeholder="请选择监督检查范围"
            @change="onFireInspectionScope"
            title="请选择监督检查范围"
        />
      </div>
      <div v-if="showFireInspection && showFireInspectionScope" :span="8">
        <SelectMultiple
          label="消防安全重点单位"
          :rules="form.basicInfo.fireSafetyUnits.rules"
          id="fireSafetyUnits"
          v-model:value="form.basicInfo.fireSafetyUnits.value"
          v-preview-text="showPreview"
          :options="options.fireSafetyUnits"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择消防安全重点单位"
          mode="multiple"
          show-arrow
          max-tag-count="responsive"
          @change="onFireInspectionScope"
          title="请选择消防安全重点单位"
        />
      </div>
    </div>
    <div :gutter="gutter">
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field 
          name="是否属于安全生产事故"   
          label="是否属于安全生产事故"
          :rules="form.basicInfo.isSafetyAccident.rules">
          <template #input>
            <van-radio-group 
              id="isSafetyAccident"
              v-model="form.basicInfo.isSafetyAccident.value"
              v-preview-text="showPreview"
              @change="onIsSafetyAccident"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
    </div>
    <div v-if="form.basicInfo.isSafetyAccident.value === '1'" :gutter="gutter">
      <div :span="24">
        <van-uploader v-model="fileList" preview-size="5rem" />
        <!-- <a-form-item
          :name="['basicInfo', 'attach', 'value']"
          label="相关附件上传"
          :rules="form.basicInfo.attach.rules"
        >
          <a-upload
            id="attach"
            v-model:file-list="form.basicInfo.attach.value"
            name="file"
            :multiple="true"
            action="/acws/rest/attachments"
            :data="{ businessId: currentRow?.boFireInfoId || localFireInfoId, attachmentType: 'safetyFile', extend2: '其他附件' }"
            :show-upload-list="isDetail ? { showRemoveIcon: false } : true"
            @remove="onRemove"
          >
            <a-button v-if="!isDetail && form.basicInfo.attach?.value?.length < 3">
              <upload-outlined />
              选择文件
            </a-button>
          </a-upload>
          <FieldAnnotation
            remark-field="attach"
            field-module="basicInfo"
            :exist-data="fieldExist?.attach"
            @refresh-callback="refreshField"
          />
        </a-form-item> -->
      </div>
    </div>
    <div v-if="form.basicInfo.isSafetyAccident.value === '1'" :gutter="gutter">
      <div :span="24">
        <van-field
          label="相关文件资料描述"
          :rules="form.basicInfo.fileRemark.rules"
          id="fileRemark"
          v-model:value="form.basicInfo.fileRemark.value"
          v-preview-text="showPreview"
          :rows="6"
          :maxlength="1000"
          show-count
          allow-clear
          placeholder="请输入相关文件资料描述"
          autosize
          type="textarea"
        />
      </div>
    </div>
  </div>
</template>
