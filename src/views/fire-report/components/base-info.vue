<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import AreaCascader from '@/component/AreaCascader/index.vue'
import SelectDateTime from "@/component/SelectDateTime/index";
import SelectMultiple from "@/component/SelectMultiple/index";
import CascaderSingle from "@/component/CascaderSingle/index";
import { showDialog, showToast } from 'vant';
import store from '@/store/index.js'
import dayjs from 'dayjs'
// import { message, notification } from '@castle/ant-design-vue'
const getSystemDictSync = store.getters['dict/getSystemDictSync']
import { checkBurnedArea, checkFireResistanceRating } from '../config/tool.js'
import { gutter } from '@/utils/constants.js'

// import FieldAnnotation from '@/components/field-annotation/index.vue'
// import SelectCascader from '@/components/select-cascader/index.vue'
import { useUpload } from '@/hooks/useUpload.js'
import { getAttachmentFile,uploadFile } from '@/apis/index.js'
import { nonnegativeNumberReg, validateTelePhone } from '@/utils/validate.js'

 

// import { 
//   useRuleConfig,
//    useSystemDict 
// } from '@/store/index.js'

// const { ruleConfig: { severityConfig } } = useRuleConfig()
const severityConfig = store.state?.rules?.ruleConfig?.severityConfig|| []
// const systemDict = useSystemDict()

const form = inject('form')

const minInputTime = store.state.setting.minInputTime

const isShowTemporary = inject('isShowTemporary',false)

const formRef = inject('formRef')

const isEdit = inject('isEdit')

const isDetail = inject('isDetail')

const isApproval = inject('isApproval')

const showPreview = inject('showPreview')

const showDraft = inject('showDraft')

const isRequired = inject('isRequired')

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
const diyValidateMap = inject("diyValidateMap");

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
const onDelete = async(val,val1)=>{
  const res = await onRemove(val)
  if(res === true){
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'safetyFile',
    }).then((res) => {
      form.value.firePhoto.photos.value = res.data.map((item) => {
        return {
          isImage: true,
          deletable:!isDetail,
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `${process.env.VUE_APP_BASE_URL}/acws/rest/app/attachments/${item.attachmentId}`,
        }
      }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
    })
  }
}

const OnAfterRead = async(file) => {
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireInfoId || localFireInfoId)
  formData.append('attachmentType', 'safetyFile')
  formData.append('extend2', '其他附件')
  formData.append('file', file.file)
  await uploadFile(formData)
  getAttachmentFile({
    businessObjId: currentRow?.boFireInfoId || localFireInfoId,
    businessType: 'safetyFile',
  }).then((res) => {
    form.value.firePhoto.photos.value = res.data.map((item) => {
      return {
        isImage: true,
        deletable:!isDetail,
        ...item, 
        uid: item.attachmentId,
        name: item.attachmentName,
        status: 'done',
        url: `${process.env.VUE_APP_BASE_URL}/acws/rest/app/attachments/${item.attachmentId}`,
      }
    }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
  })
}

onMounted(() => {
  if (isDetail || isEdit || (relevanceDraft && relevanceDraft.boFireInfoId) || currentRow?.boFireInfoId) {
    getAttachmentFile({
      businessObjId: currentRow?.boFireInfoId || localFireInfoId,
      businessType: 'safetyFile',
    }).then((res) => {
      form.value.basicInfo.attach.value = res.data.map((item) => {
        return {
          ...item,
          deletable:!isDetail,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `${process.env.VUE_APP_BASE_URL}/acws/rest/app/attachments/${item.attachmentId}`,
        }
      })
    })
  }
})

watch(() => form.value, () => {
  const { directEconomicLoss } = form.value.economicLoss
  const { injuredList, deadList } = form.value.casualtyWar
  if (deadList?.length >= 30 || injuredList?.length >= 100 || directEconomicLoss.value >= 100000000) { // 特别重大事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '特大火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
  else if ((deadList?.length >= 10 && deadList?.length < 30)
    || (injuredList?.length >= 50 && injuredList?.length < 100)
    || (directEconomicLoss.value >= 50000000 && directEconomicLoss.value < 100000000)) { // 重大事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '重大火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
  else if ((deadList?.length >= 3 && deadList?.length < 10)
    || (injuredList?.length >= 10 && injuredList?.length < 50)
    || (directEconomicLoss.value >= 10000000 && directEconomicLoss.value < 50000000)) { // 较大事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '较大火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
  else if (deadList?.length < 3 || injuredList?.length < 10 || directEconomicLoss.value < 100000000) { // 一般事故
    const filter = options.value?.fireLevel?.filter(item => item.dictName === '一般火灾')
    form.value.basicInfo.fireLevel.value = filter && filter[0].boDictId
  }
}, { deep: true, immediate: true })

const disabledDate = (current) => {
  return current && current > Date.now()
}

const validateFireDate = (value) => {
  const { fireDate } = form.value.basicInfo
  if (!value) {
    if (!fireDate.rules[0].required) {
      // callback()
      return true
    }
    else {
      return '请选择起火时间'
      // callback(new Error(''))
    }
  }
  else if (currentRow?.warningDate && fireDate?.value?.valueOf() > currentRow.warningDate) {
    // callback(new Error('起火时间不能晚于接警时间'))
    return '起火时间不能晚于接警时间'
  }
  else {
    // callback()
    return true
  }
}
const fireDateChange = ()=>{
  diyValidateMap.value.defaultKey.push('basicInfo.fireDate.value')
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

const validateBurnedArea = (val) => {
  const { burnedArea, severity, fireType } = form.value.basicInfo
  if (!val && val !== 0) {
    if (!burnedArea.rules[0].required) {
      return true
    }
    else {
      return '请输入过火面积'
      // callback(new Error(''))
    }
  }
  else if (!nonnegativeNumberReg.test(val)) {
    // callback(new Error('请输入正确过火面积'))
    return '请输入正确过火面积'
  }
  else {
    return true
    // callback()
  }
}

const penaltyNumChange = ()=>{
  diyValidateMap.value.defaultKey.push('caseHandling.penaltyNum.value')
}

const onIsInsurance = (e) => {
  if (e === '2') {
    form.value.basicInfo.insuranceInfo.value = undefined
  }
}

const onFirePlace = () => {
  if (!options.value?.firePlace || !form.value.basicInfo.fireType?.value) {
    showToast('请先选择火灾类型')
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

  diyValidateMap.value.defaultKey.push('basicInfo.firePlace.value')
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

const validateFireTel = (value) => {
  if (!value) {
    if (!form.value.basicInfo.fireTel.rules[0].required) {
      return true
    }
    else {
      return '请输入失火单位/户主联系电话'
      // callback(new Error('请输入失火单位/户主联系电话'))
    }
  }
  else if (!validateTelePhone(value)) {
    return '请输入正确格式，注意：固定电话请在区号后加“-”隔开'
    // callback(new Error('请输入正确格式，注意：固定电话请在区号后加“-”隔开'))
  }
  else {
    return true
    // callback()
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

const isShowIndustryAndEconomicType = computed(()=>{
  if(form.value.basicInfo.firePlace.value === "2023020800484" && form.value.basicInfo.liveType ==="2023020801655" ){
    return false
  }else{
    return true
  }
})

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

const onIsOperating = () => {
  if (form.value.basicInfo.isOperating.value === '1') {
    form.value.basicInfo.industry.value = undefined
    form.value.basicInfo.industryDepartment.value = undefined
    form.value.basicInfo.economicType.value = undefined
  }
}

const onFireLevel = () => {
  showDialog({ message: `
    根据生产安全事故(以下简称事故)造成的人员伤亡或者直接经济损失，事故一般分为以下等级：
    (1) 特别重大事故，是指造成30人以上死亡，或者100人以上重伤(包括急性工业中毒，下同)或者1亿元以上直接经济损失的事故。
    (2) 重大事故，是指造成10人以上30人以下死亡，或者50人以上100人以下重伤，或者5000万元以上1亿元以下直接经济损失的事故。
    (3) 较大事故，是指造成3人以上10人以下死亡，或者10人以上50人以下重伤，或者1000万元以上5000万元以下直接经济损失的事故。
    (4) 一般事故，是指造成3人以下死亡，或者10人以下重伤，或者1000万元以下直接经济损失的事故。
    本条第一款所称的“以上”包括本数，所称的“以下”不包括本数
  ` });
}
</script>

<template>
    <van-cell-group class="rootform1">
    <div class="isSearch">
      <SelectSingle
        v-model:value="form.basicInfo.isResearch.value"
        name="basicInfo.isResearch.value"
        :showPreview="showPreview"
        label="是否调查："
        :options="options.isResearch"
        :field-names="{label:'label',value:'value'}"
        :rules="form.basicInfo.isResearch.rules"
        :required="true"
        placeholder="请选择是否正在调查"
        title="请选择是否正在调查" 
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="是否调查："
            remark-field="isResearch"
            field-module="basicInfo"
            :exist-data="fieldExist?.isResearch"
            @refresh-callback="refreshField"
          />
      </template>
    </SelectSingle>
    </div>
    <div class="severity">
      <SelectSingle
        name="basicInfo.severity.value"
        v-model:value="form.basicInfo.severity.value"
        :showPreview="showPreview"
        label="严重程度："
        :options="options.severity"
        :field-names="{label:'label',value:'value'}"
        :rules="form.basicInfo.severity.rules"
        :required="true"
        placeholder="请选择严重程度"
        title="请选择严重程度"
        key="severity"
        @change="onSeverity()"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="严重程度："
            remark-field="severity"
            field-module="basicInfo"
            :exist-data="fieldExist?.severity"
            @refresh-callback="refreshField"
          />
      </template>
    </SelectSingle>
    </div>
    <div class="fireType">
      <SelectSingle
        v-model:value="form.basicInfo.fireType.value"
        name="basicInfo.fireType.value"
        label="火灾类型："
        :options="fireTypeOptions"
        :rules="form.basicInfo.fireType.rules"
        :required="true"
        :disabled="fireTypeDisabled"
        placeholder="请选择火灾类型"
        title="请选择火灾类型"
        :showPreview="showPreview"
        @change="fireTypeChange"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="火灾类型："
            remark-field="fireType"
            field-module="basicInfo"
            :exist-data="fieldExist?.fireType"
            @refresh-callback="refreshField"
          />
      </template>
    </SelectSingle>
    </div>
      <div class="fireDate">
        <SelectDateTime
          v-model:value="form.basicInfo.fireDate.value"
          :showPreview="showPreview"
          is-link
          required
          name="basicInfo.fireDate.value"
          title="请选择起火时间"
          label="起火时间："
          placeholder="请选择起火时间"
          :rules="[{ validator: validateFireDate, trigger: 'onBlur' }, ...form.basicInfo.fireDate.rules]"
          @change="fireDateChange"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="起火时间："
              remark-field="fireDate"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireDate"
              @refresh-callback="refreshField"
            />
        </template>
      </SelectDateTime>
      </div>
      <div class="noDispatchArea" v-if="unDispatch">
          <AreaCascader
            name="basicInfo.noDispatchArea.value"
            label="行政区域："
            :rules="form.basicInfo.noDispatchArea.rules"
            v-model:value="form.basicInfo.noDispatchArea.value"
            :showPreview="showPreview"
            :show-all-area="!!showPreview"
            :required="!showPreview"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="行政区域："
                remark-field="noDispatchArea"
                field-module="basicInfo"
                :exist-data="fieldExist?.noDispatchArea"
                @refresh-callback="refreshField"
              />
            </template>
          </AreaCascader>
      </div>
      <div class="fireDirection">
        <van-field
          label="起火地点："
          v-model="form.basicInfo.fireDirection.value"
          name="basicInfo.fireDirection.value"
          placeholder="请输入起火地点"
          :rules="form.basicInfo.fireDirection.rules"
          :required="isRequired"
          v-preview-text="showPreview"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="起火地点："
              remark-field="fireDirection"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireDirection"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div class="area">
        <CascaderSingle
          v-model:value="form.basicInfo.area.value"
          name="basicInfo.area.value"
          :showPreview="showPreview"
          :options="options.area"
          :required="isRequired"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          label="区域："
          placeholder="请选择区域"
          :rules="form.basicInfo.area.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="区域："
              remark-field="area"
              field-module="basicInfo"
              :exist-data="fieldExist?.area"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle> 
      </div>
      <div class="fireOrgname">
        <van-field
          label="单位/户主/个体户名称："
          v-model="form.basicInfo.fireOrgname.value"
          v-preview-text="showPreview"
          name="basicInfo.fireOrgname.value"
          placeholder="单位/户主/个体户名称"
          :rules="form.basicInfo.fireOrgname.rules"
          :required="isRequired"
          label-width="105"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="单位/户主/个体户名称："
              remark-field="fireOrgname"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireOrgname"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <!-- <div class="fireTel">
        <van-field
          label="失火单位/户主联系电话："
          v-model="form.basicInfo.fireTel.value"
          v-preview-text="showPreview"
          name="basicInfo.fireTel.value"
          :required="isRequired"
          maxlength="15"
          placeholder="失火单位/户主联系电话"
          :rules="[{ validator: validateFireTel, trigger: 'onBlur' }, ...form.basicInfo.fireTel.rules]"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="失火单位/户主联系电话："
              remark-field="fireTel"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireTel"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div> -->
      <div v-if="!showOtherMinor" class="socialCreditCode">
        <van-field
          label="单位统一社会信用代码："
          v-model="form.basicInfo.socialCreditCode.value"
          v-preview-text="showPreview"
          name="basicInfo.socialCreditCode.value"
          placeholder="单位统一社会信用代码"
          label-width="105"
          :rules="form.basicInfo.socialCreditCode.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="单位统一社会信用代码："
              remark-field="socialCreditCode"
              field-module="basicInfo"
              :exist-data="fieldExist?.socialCreditCode"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div class="fireCause">
        <CascaderSingle 
          v-model:value="form.basicInfo.fireCause.value"
          name="basicInfo.fireCause.value"
          :showPreview="showPreview"
          :options="options.fireCause"
          label="起火原因："
          :required="isRequired"
          placeholder="请选择起火原因"
          :rules="form.basicInfo.fireCause.rules"
          @change="fireCauseChange"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="起火原因："
              remark-field="fireCause"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireCause"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
      <div>
        <van-field 
          name="caseHandling.penaltyNum.value"
          :disabled="!importantEdit"
          label="过火面积（平方米）："
          :rules="[{ validator: validateBurnedArea, trigger: 'onBlur' }, ...form.basicInfo.burnedArea.rules]"
          @blur="checkBurnedArea(form)"
          v-model="form.basicInfo.burnedArea.value" 
          v-preview-text="showPreview"
          id="penaltyNum"
          :required="isRequired"
          :maxlength="10"
          style="width: 100%"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入过火面积"
          type="number" 
          @change="penaltyNumChange"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="过火面积（平方米）："
              remark-field="fireCause"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireCause"
              :isWarning="form.basicInfo.burnedArea.warning"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field >
      </div>
      <div class="fireLevel">
        <SelectSingle
          v-model:value="form.basicInfo.fireLevel.value"
          name="basicInfo.fireLevel.value"
          :showPreview="showPreview"
          :is-link="false"
          label="火灾等级："
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          :options="options.fireLevel"
          :rules="form.basicInfo.fireLevel.rules"
          placeholder="请选择火灾等级"
          title="请选择火灾等级"
          disabled
          right-icon="question-o"
          class="fire-level-item"
          @click-right-icon.stop="onFireLevel"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="火灾等级："
              remark-field="fireLevel"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireLevel"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div class="firePlace">
        <CascaderSingle
          id="firePlace"
          v-model:value="form.basicInfo.firePlace.value"
          name="basicInfo.firePlace.value"
          :showPreview="showPreview"
          :options="options.firePlace"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          label="起火场所："
          :required="isRequired"
          placeholder="请选择起火场所"
          :rules="form.basicInfo.firePlace.rules"
          @change="firePlaceChange"
          @click="onFirePlace"
        >
         <template v-slot:label="">
            <FieldAnnotation
              label="起火场所："
              remark-field="firePlace"
              field-module="basicInfo"
              :exist-data="fieldExist?.firePlace"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
      <div v-if="showisLaborIntensive"  class="isLaborIntensive">
        <van-field 
          name="basicInfo.isLaborIntensive.value" 
          label="是否属于劳动密集型：" 
          :rules="form.basicInfo.isLaborIntensive.rules"
          :required="isRequired"
          class="field-radio"
        >
          <template #input>
            <van-radio-group class="field-radio" v-preview-text="showPreview" v-model="form.basicInfo.isLaborIntensive.value" direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否属于劳动密集型：" 
              remark-field="isLaborIntensive"
              field-module="basicInfo"
              :exist-data="fieldExist?.isLaborIntensive"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="showplantRiskClassification"  class="plantRiskClassification">
        <SelectSingle
          name="basicInfo.plantRiskClassification.value"
          v-model:value="form.basicInfo.plantRiskClassification.value"
          label="厂房火灾危险性分类："
          :options="options.plantRiskClassification"
          :rules="form.basicInfo.plantRiskClassification.rules"
          :required="isRequired"
          placeholder="请选择厂房火灾危险性分类"
          title="请选择厂房火灾危险性分类"
          :showPreview="showPreview"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="厂房火灾危险性分类："
              remark-field="plantRiskClassification"
              field-module="basicInfo"
              :exist-data="fieldExist?.plantRiskClassification"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="showOtherFirePlace" class="otherFirePlace">
        <van-field
          label="其他说明："
          v-model:value="form.basicInfo.otherFirePlace.value"
          v-preview-text="showPreview"
          name="basicInfo.otherFirePlace.value"
          placeholder="请输入其他说明"
          :rules="form.basicInfo.otherFirePlace.rules"
          :required="isRequired"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="其他说明："
              remark-field="otherFirePlace"
              field-module="basicInfo"
              :exist-data="fieldExist?.otherFirePlace"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="showResidence" class="fireDate">
        <SelectSingle
          id="liveType"
          name="basicInfo.liveType.value"
          v-model:value="form.basicInfo.liveType.value"
          :showPreview="showPreview"
          :options="options.liveType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择居住形式"
          label="居住形式："
          :required="isRequired"
          :rules="form.basicInfo.liveType.rules"
          title="请选择居住形式"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="居住形式："
              remark-field="liveType"
              field-module="basicInfo"
              :exist-data="fieldExist?.liveType"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="showResidence" :gutter="gutter">
        <div class="isPoorHouse">
          <van-field 
            name="basicInfo.isPoorHouse.value" 
            label="是否属于扶贫安置房："
            :rules="form.basicInfo.isPoorHouse.rules"
            :required="isRequired"
            class="field-radio"
          >
            <template #input>
              <van-radio-group 
                class="field-radio"
                v-preview-text="showPreview" 
                v-model="form.basicInfo.isPoorHouse.value"
                direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="2">否</van-radio>
              </van-radio-group>
            </template>
            <template v-slot:label="">
              <FieldAnnotation
                label="是否属于扶贫安置房："
                remark-field="isPoorHouse"
                field-module="basicInfo"
                :exist-data="fieldExist?.isPoorHouse"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div class="isChangeUseType">
          <van-field 
            name="basicInfo.isChangeUseType.value"  
            label="是否变更使用性质："
            :required="isRequired"
            :rules="form.basicInfo.isChangeUseType.rules" 
            class="field-radio"
          >
            <template #input>
              <van-radio-group 
                class="field-radio"
                v-model="form.basicInfo.isChangeUseType.value"
                v-preview-text="showPreview"
                @change="onIsChangeUseType"
                direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="2">否</van-radio>
              </van-radio-group>
            </template>
            <template v-slot:label="">
              <FieldAnnotation
                label="是否变更使用性质："
                remark-field="isChangeUseType"
                field-module="basicInfo"
                :exist-data="fieldExist?.isChangeUseType"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div v-if="form.basicInfo.isChangeUseType.value === '1'">
          <SelectSingle
            label="变更后使用性质："
            :rules="form.basicInfo.useType.rules"
            :required="isRequired"
            id="useType"
            v-model:value="form.basicInfo.useType.value"
            :showPreview="showPreview"
            :options="options.useType"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择变更后使用性质"
            title="请选择变更后使用性质"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="变更后使用性质："
                remark-field="useType"
                field-module="basicInfo"
                :exist-data="fieldExist?.useType"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>
      <div v-if="showVehicleFire" class="vehicleType">
        <CascaderSingle
          label="交通工具类型："
          :rules="form.basicInfo.vehicleType.rules"
          :required="isRequired"
          id="vehicleType"
          v-model:value="form.basicInfo.vehicleType.value"
          :showPreview="showPreview"
          :options="options.vehicleType"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          :field-name="['basicInfo', 'vehicleType', 'value']"
          placeholder="请选择交通工具类型"
          @change="vehicleTypeChange"
          v-preview-text="showPreview"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="交通工具类型："
              remark-field="vehicleType"
              field-module="basicInfo"
              :exist-data="fieldExist?.vehicleType"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>

    <div orientation="left" orientation-margin="0px" style="border-color: #A4A4A4" dashed ></div>
    <template v-if="showVehicleFire">
      <div v-if="showBatteryType" class="chargeState" >
        <SelectSingle
          label="起火时充电状态："
          name="basicInfo.chargeState.value"
          :rules="form.basicInfo.chargeState.rules"
          :required="isRequired"
          id="chargeState"
          v-model:value="form.basicInfo.chargeState.value"
          :showPreview="showPreview"
          :options="options.chargeState"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择起火时充电状态"
          title="请选择起火时充电状态"
        >
         <template v-slot:label="">
            <FieldAnnotation
              label="起火时充电状态："
              remark-field="chargeState"
              field-module="basicInfo"
              :exist-data="fieldExist?.chargeState"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="showLowSpeed" class="isRepack">
        <van-field 
          name="basicInfo.isRepack.value" 
          label="是否改装：" 
          :rules="form.basicInfo.isRepack.rules"
          :required="isRequired"
          class="field-radio"
        >
          <template #input>
            <van-radio-group 
              class="field-radio"
              v-preview-text="showPreview" 
              v-model="form.basicInfo.isRepack.value" 
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否改装：" 
              remark-field="isRepack"
              field-module="basicInfo"
              :exist-data="fieldExist?.isRepack"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="showBatteryType || showLowSpeed">
        <SelectSingle
          label="电池类型："
          :rules="form.basicInfo.batteryType.rules"
          :required="isRequired"
          id="batteryType"
          v-model:value="form.basicInfo.batteryType.value"
          :showPreview="showPreview"
          :options="options.batteryType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择电池类型"
          title="请选择电池类型"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="电池类型："
              remark-field="batteryType"
              field-module="basicInfo"
              :exist-data="fieldExist?.batteryType"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <!-- <div v-if="showBatteryType || showLowSpeed">
        <SelectSingle
          label="电池类型："
          :rules="form.basicInfo.batteryType.rules"
          id="batteryType"
          v-model:value="form.basicInfo.batteryType.value"
          :showPreview="showPreview"
          :options="options.batteryType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择电池类型"
          title="请选择电池类型"
      >
        <template v-slot:label="">
            <FieldAnnotation
              label="电池类型："
              remark-field="batteryType"
              field-module="basicInfo"
              :exist-data="fieldExist?.batteryType"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div> -->
        <div v-if="showVinCode">
          <van-field
            label="车辆VIN码："
            :rules="form.basicInfo.vinCode.rules"
            id="车辆VIN码"
            v-model="form.basicInfo.vinCode.value"
            v-preview-text="showPreview"
            allow-clear
            :maxlength="20"
            aria-autocomplete="none"
            placeholder="请输入车辆VIN码"
            name="basicInfo.vinCode.value"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="车辆VIN码："
                remark-field="vinCode"
                field-module="basicInfo"
                :exist-data="fieldExist?.vinCode"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div v-if="showVinCode">
          <van-field
            label="车牌号"
            :rules="form.basicInfo.carNumber.rules"
            :required="isRequired"
            id="carNumber"
            v-model="form.basicInfo.carNumber.value"
            v-preview-text="showPreview"
            allow-clear
            :maxlength="20"
            aria-autocomplete="none"
            placeholder="请输入车牌号"
            name="basicInfo.carNumber.rules"
          >
           <template v-slot:label="">
              <FieldAnnotation
                label="车牌号："
                remark-field="carNumber"
                field-module="basicInfo"
                :exist-data="fieldExist?.carNumber"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div class="driveState" >
          <SelectSingle
            label="行驶状态："
            :rules="form.basicInfo.driveState.rules"
            :required="isRequired"
            id="driveState"
            v-model:value="form.basicInfo.driveState.value"
            :showPreview="showPreview"
            :options="options.driveState"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择行驶状态"
            title="请选择行驶状态"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="行驶状态："
                remark-field="driveState"
                field-module="basicInfo"
                :exist-data="fieldExist?.driveState"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
    </template>
    <div :gutter="gutter">
      <div :span="8">
        <CascaderSingle
          label="事故形态："
          :rules="form.basicInfo.firePattern.rules"
          :required="isRequired"
          :showPreview="showPreview"
          id="firePattern"
          v-model:value="form.basicInfo.firePattern.value"
          :options="options.firePattern"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          :field-name="['basicInfo', 'firePattern', 'value']"
          placeholder="请选择事故形态"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="事故形态："
              remark-field="firePattern"
              field-module="basicInfo"
              :exist-data="fieldExist?.firePattern"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
      <div v-if="showFireSite" :span="8">
        <CascaderSingle
          label="起火位置："
          :rules="form.basicInfo.fireSite.rules"
          name="basicInfo.fireSite.value"
          id="fireSite"
          v-model:value="form.basicInfo.fireSite.value"
          :showPreview="showPreview"
          :options="options.fireSite"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          :field-name="['basicInfo', 'fireSite', 'value']"
          placeholder="请选择起火位置"
          :required="isRequired"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="起火位置："
              remark-field="fireSite"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireSite"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
    </div>
      <div>
        <van-field
          label="起火物名称："
          :rules="form.basicInfo.initialFuels.rules"
          id="initialFuels"
          v-model="form.basicInfo.initialFuels.value"
          v-preview-text="showPreview"
          allow-clear
          :required="isRequired"
          :maxlength="50"
          aria-autocomplete="none"
          placeholder="请输入起火物名称"
          name="basicInfo.initialFuels.value"
          label-width="105"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="起火物名称："
              remark-field="initialFuels"
              field-module="basicInfo"
              :exist-data="fieldExist?.initialFuels"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div :span="8">
        <CascaderSingle
          label="起火物类型："
          name="basicInfo.initialFuelsType.value"
          :rules="form.basicInfo.initialFuelsType.rules"
          id="initialFuelsType"
          :required="isRequired"
          v-model:value="form.basicInfo.initialFuelsType.value"
          :showPreview="showPreview"
          :options="options.initialFuelsType"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          :field-name="['basicInfo', 'initialFuelsType', 'value']"
          show-description
          title="请选择起火物类型"
          placeholder="请选择起火物类型或者指标说明"
          @change="initialFuelsTypeChange"
          label-width="105"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="起火物类型："
              remark-field="initialFuelsType"
              field-module="basicInfo"
              :exist-data="fieldExist?.initialFuelsType"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
    
      <div :span="8">
        <van-field
          label="引火源名称："
          :rules="form.basicInfo.igniteSource.rules"
          :required="isRequired"
          id="igniteSource"
          v-model="form.basicInfo.igniteSource.value"
          v-preview-text="showPreview"
          allow-clear
          :maxlength="50"
          aria-autocomplete="none"
          placeholder="请输入引火源名称"
          name="basicInfo.igniteSource.value"
          label-width="105"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="引火源名称："
              remark-field="igniteSource"
              field-module="basicInfo"
              :exist-data="fieldExist?.igniteSource"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div :span="8">
        <CascaderSingle
          label="引火源类型："
          name="basicInfo.igniteSourceType.value"
          :rules="form.basicInfo.igniteSourceType.rules"
          id="igniteSourceType"
          v-model:value="form.basicInfo.igniteSourceType.value"
          :showPreview="showPreview"
          :options="options.igniteSourceType"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          :field-name="['basicInfo', 'igniteSourceType', 'value']"
          show-description
          :required="isRequired"
          title="请选择引火源类型"
          placeholder="请选择引火源类型或者指标说明"
          @change="initialFuelsTypeChange"
          label-width="105"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="引火源类型："
              remark-field="igniteSourceType"
              field-module="basicInfo"
              :exist-data="fieldExist?.igniteSourceType"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
   
    
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field
          label="引起火灾人员年龄："
          :rules="form.basicInfo.firePersonAge.rules"
          id="firePersonAge"
          v-model="form.basicInfo.firePersonAge.value"
          v-preview-text="showPreview"
          allow-clear
          :maxlength="3"
          aria-autocomplete="none"
          placeholder="请输入引起火灾人员年龄"
          name="basicInfo.firePersonAge.value"
          type="digit"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="引起火灾人员年龄："
              remark-field="firePersonAge"
              field-module="basicInfo"
              :exist-data="fieldExist?.firePersonAge"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <SelectSingle
          label="受教育程度："
          :rules="form.basicInfo.schooling.rules"
          id="schooling"
          v-model:value="form.basicInfo.schooling.value"
          :showPreview="showPreview"
          :options="options.schooling"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择受教育程度"
          title="请选择受教育程度"
          label-width="105"
        >
        <template v-slot:label="">
          <FieldAnnotation
              label="受教育程度："
              remark-field="schooling"
              field-module="basicInfo"
              :exist-data="fieldExist?.schooling"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <SelectSingle
          label="健康状况："
          :rules="form.basicInfo.health.rules"
          id="health"
          v-model:value="form.basicInfo.health.value"
          :showPreview="showPreview"
          :options="options.health"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择健康状况"
          title="请选择健康状况"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="健康状况："
              remark-field="health"
              field-module="basicInfo"
              :exist-data="fieldExist?.health"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div :gutter="gutter">
        <div :span="8">
          <van-field
            name="basicInfo.isOperating.value"
            label="是否涉及生产经营："
            :required="isRequired"
            :rules="form.basicInfo.isOperating.rules"
            class="field-radio"
          >
            <template #input>
              <van-radio-group 
                id="isOperating"
                v-model="form.basicInfo.isOperating.value"
                v-preview-text="showPreview"
                direction="horizontal"
                @change="onIsOperating"
              >
                <van-radio name="1">是</van-radio>
                <van-radio name="2">否</van-radio>
              </van-radio-group>
            </template>
            <template v-slot:label="">
              <FieldAnnotation
                label="是否涉及生产经营："
                remark-field="isOperating"
                field-module="basicInfo"
                :exist-data="fieldExist?.isOperating"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
      </div>
      <div v-if="form.basicInfo.isOperating.value === '1'" :span="8">
        <CascaderSingle
          label="所属行业："
          :rules="form.basicInfo.industry.rules"
          id="industry"
          v-model:value="form.basicInfo.industry.value"
          :showPreview="showPreview"
          :options="options.industry"
          :field-name="{ value: 'boDictId', text: 'dictName' }"
          placeholder="请选择所属行业"
          allow-clear
          :required="isRequired"
          :show-search="{ filter: (inputValue, path) => path.some(option => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="所属行业："
              remark-field="industry"
              field-module="basicInfo"
              :exist-data="fieldExist?.industry"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
      <div v-if="form.basicInfo.isOperating.value === '1'">
        <SelectSingle
          label="行业主管部门："
          :rules="form.basicInfo.industryDepartment.rules"
          id="economicType"
          v-model:value="form.basicInfo.industryDepartment.value"
          :showPreview="showPreview"
          :options="options.industryDepartment"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择行业主管部门"
          title="请选择行业主管部门"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="行业主管部门："
              remark-field="industryDepartment"
              field-module="basicInfo"
              :exist-data="fieldExist?.industryDepartment"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="form.basicInfo.isOperating.value === '1'" :span="8">
        <SelectSingle
          label="经济类型："
          :rules="form.basicInfo.economicType.rules"
          id="economicType"
          v-model:value="form.basicInfo.economicType.value"
          :showPreview="showPreview"
          :options="options.economicType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          :required="isRequired"
          placeholder="请选择经济类型"
          title="请选择经济类型"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="经济类型："
              remark-field="economicType"
              field-module="basicInfo"
              :exist-data="fieldExist?.economicType"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <SelectSingle
          label="事故牵头调查部门："
          :rules="form.basicInfo.leadInspectionOrg.rules"
          name="basicInfo.leadInspectionOrg.value"
          :required="isRequired"
          id="leadInspectionOrg"
          v-model:value="form.basicInfo.leadInspectionOrg.value"
          :showPreview="showPreview"
          :options="options.leadInspectionOrg"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择事故牵头调查部门"
          @change="onLeadInspectionOrg"
          title="请选择事故牵头调查部门"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="事故牵头调查部门："
              remark-field="leadInspectionOrg"
              field-module="basicInfo"
              :exist-data="fieldExist?.leadInspectionOrg"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="showOtherOrgRemark" :span="8">
        <van-field
          label="其他单位说明："
          :rules="form.basicInfo.otherOrgRemark.rules"
          :required="isRequired"
          id="otherOrgRemark"
          v-model="form.basicInfo.otherOrgRemark.value"
          v-preview-text="showPreview"
          :maxlength="100"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入其他单位说明"
          name="basicInfo.otherOrgRemark.value"
        >
         <template v-slot:label="">
            <FieldAnnotation
              label="其他单位说明："
              remark-field="otherOrgRemark"
              field-module="basicInfo"
              :exist-data="fieldExist?.otherOrgRemark"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field 
          name="basicInfo.isInsurance.value" 
          label="是否保险：" 
          :rules="form.basicInfo.isInsurance.rules"
          class="field-radio"
        >
          <template #input>
            <van-radio-group 
              class="field-radio"
              v-model="form.basicInfo.isInsurance.value"
              v-preview-text="showPreview"
              @change="onIsInsurance"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否保险："
              remark-field="isInsurance"
              field-module="basicInfo"
              :exist-data="fieldExist?.isInsurance"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="form.basicInfo.isInsurance.value === '1'" :span="8">
        <SelectMultiple
          label="保险类型："
          :rules="form.basicInfo.insuranceInfo.rules"
          :required="isRequired"
          id="insuranceInfo"
          v-model:value="form.basicInfo.insuranceInfo.value"
          :showPreview="showPreview"
          :options="options.insuranceInfo"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          mode="multiple"
          show-arrow
          option-filter-prop="dictName"
          max-tag-count="responsive"
          placeholder="请选择保险类型"
          title="请选择警情标签"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="保险类型："
              remark-field="insuranceInfo"
              field-module="basicInfo"
              :exist-data="fieldExist?.insuranceInfo"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectMultiple>
      </div>
    
    
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field label-width="130" class="field-radio" name="basicInfo.isOnesided.value" label="是否单方面火灾：" :rules="form.basicInfo.isOnesided.rules">
          <template #input>
            <van-radio-group 
              class="field-radio"
              id="isOnesided"
              v-model="form.basicInfo.isOnesided.value"
              v-preview-text="showPreview"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否单方面火灾："
              remark-field="isOnesided"
              field-module="basicInfo"
              :exist-data="fieldExist?.isOnesided"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    
    
      <div v-if="!showOtherMinor" :span="8">
        <SelectSingle
          label="监督检查情况："
          name="basicInfo.fireInspection.value"
          :rules="form.basicInfo.fireInspection.rules"
          id="fireInspection"
          v-model:value="form.basicInfo.fireInspection.value"
          :showPreview="showPreview"
          :options="options.fireInspection"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择监督检查情况"
          @change="onFireInspection"
          title="请选择事故牵头调查部门"
          label-width="120"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="监督检查情况："
              remark-field="fireInspection"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireInspection"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="showFireInspection" :span="8">
        <SelectMultiple
          label="监督检查范围："
          :rules="form.basicInfo.fireInspectionScope.rules"
          :required="isRequired"
          id="fireInspectionScope"
          v-model:value="form.basicInfo.fireInspectionScope.value"
          :showPreview="showPreview"
          :options="options.fireInspectionScope"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          mode="multiple"
          show-arrow
          max-tag-count="responsive"
          placeholder="请选择监督检查范围"
          @change="onFireInspectionScope"
          title="请选择监督检查范围"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="监督检查范围："
              remark-field="fireInspectionScope"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireInspectionScope"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectMultiple>
      </div>
      <div v-if="showFireInspection && showFireInspectionScope" :span="8">
        <SelectMultiple
          label="消防安全重点单位："
          :rules="form.basicInfo.fireSafetyUnits.rules"
          :required="isRequired"
          id="fireSafetyUnits"
          v-model:value="form.basicInfo.fireSafetyUnits.value"
          :showPreview="showPreview"
          :options="options.fireSafetyUnits"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择消防安全重点单位"
          mode="multiple"
          show-arrow
          max-tag-count="responsive"
          @change="onFireInspectionScope"
          title="请选择消防安全重点单位"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防安全重点单位："
              remark-field="fireSafetyUnits"
              field-module="basicInfo"
              :exist-data="fieldExist?.fireSafetyUnits"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectMultiple>
      </div>
    
    
      <div v-if="!showBuildingMinor && !showOtherMinor" :span="8">
        <van-field 
          name="basicInfo.isSafetyAccident.value"   
          label="是否属于安全生产事故："
          class="field-radio"
          :required="isRequired"
          label-width="105"
          :rules="form.basicInfo.isSafetyAccident.rules">
          <template #input>
            <van-radio-group
              class="field-radio" 
              id="isSafetyAccident"
              v-model="form.basicInfo.isSafetyAccident.value"
              v-preview-text="showPreview"
              @change="onIsSafetyAccident"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否属于安全生产事故："
              remark-field="isSafetyAccident"
              field-module="basicInfo"
              :exist-data="fieldExist?.isSafetyAccident"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    
    <div v-if="form.basicInfo.isSafetyAccident.value === '1'" :gutter="gutter">
      <div :span="24">
        <van-cell title="相关附件上传：" :required="isRequired" class="item-cell">
          <van-uploader
            name="basicInfo.attach.value"
            :rules="form.basicInfo.attach.rules"
            id="attach"
            v-model="form.basicInfo.attach.value"
            :after-read="OnAfterRead"
            @delete="onDelete"
          />
          <template v-slot:title="">
            <FieldAnnotation
              label="相关附件上传："
              remark-field="attach"
              field-module="basicInfo"
              :exist-data="fieldExist?.attach"
              @refresh-callback="refreshField"
            />
          </template>
        </van-cell>
      </div>
    </div>
    <div v-if="form.basicInfo.isSafetyAccident.value === '1'" :gutter="gutter">
      <div :span="24">
        <van-field
          name="basicInfo.fileRemark.value"
          label="相关文件资料描述:"
          :rules="form.basicInfo.fileRemark.rules"
          id="fileRemark"
          v-model="form.basicInfo.fileRemark.value"
          v-preview-text="showPreview"
          :rows="6"
          :maxlength="1000"
          show-count
          allow-clear
          placeholder="请输入相关文件资料描述"
          autosize
          type="textarea"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="相关文件资料描述："
              remark-field="fileRemark"
              field-module="basicInfo"
              :exist-data="fieldExist?.fileRemark"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>
  </van-cell-group>

</template>
<style lang="scss" scoped>
.isSearch,.severity,.fireType,.fireDate,.noDispatchArea,.fireLevel.area{
  &::after{
    // z-index: 1;
    // position: absolute;
    // box-sizing: border-box;
    content: " " !important;
    pointer-events: none;
    right: var(--van-padding-md)!important;
    bottom: 0!important;
    left: var(--van-padding-md)!important;
    border-bottom: 0.02667rem solid var(--van-cell-border-color)!important;
    width: calc(100% - 64px)!important;
    display: block!important;
    padding: 0 20px!important;
    margin-left: 8px!important;
    // transform: scaleY(.5);
  }
}
.rootform1 > div{
  &::after{
    // z-index: 1;
    // position: absolute;
    // box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: var(--van-padding-md);
    bottom: 0;
    left: var(--van-padding-md);
    border-bottom: 0.02667rem solid var(--van-cell-border-color);
    width: calc(100% - 64px);
    display: block;
    padding: 0 20px;
    margin-left: 8px;
    // transform: scaleY(.5);
  }
}
// .rootform1 > div:has(>div){
//   &::after{
//     border: none !important;
//   }

// }

.rootform1 >div> div{
  &::after{
    // z-index: 1;
    // position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: var(--van-padding-md);
    bottom: 0;
    left: var(--van-padding-md);
    border-bottom: 0.02667rem solid var(--van-cell-border-color);
    width: calc(100% - 32px);
    display: block;
    padding: 0 20px;
    margin-left: 8px;
    // transform: scaleY(.5);
  }
}
.item-cell {
    flex-direction: column;
    :deep(.van-cell__value) {
      display: flex;

    }
    &::after{
      display: none;
    }
  }
</style>
