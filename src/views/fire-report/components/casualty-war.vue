<script setup>
import { computed, inject, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import { checkFireInjuryCost } from '../config/tool.js'
import { gutter } from '@/utils/constants.js'
import { validIdCode } from '@/utils/validate.js'
import { getInfoByCard } from '@/utils/tools.js'
import AreaCascader from '@/component/AreaCascader/index.vue'
import SelectDateTime from "@/component/SelectDateTime/index";
import SelectMultiple from "@/component/SelectMultiple/index";
import CascaderSingle from "@/component/CascaderSingle/index";
// import AreaCascader from '@/components/area-cascader/index.vue'
// import FieldAnnotation from '@/components/field-annotation/index.vue'

const form = inject('form')

const isDetail = inject('isDetail')

const showPreview = inject('showPreview')

const options = inject('options')

const isRequired = inject('isRequired')

const importantEdit = inject('importantEdit')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const diyValidateMap = inject("diyValidateMap");

const disabledDate = (current) => {
  return current && current > Date.now()
}

const handleAddInjury = () => {
  form.value.casualtyWar.injuredList.push({
    injuryType: '2', // 伤亡情况
    name: '', // 人员姓名
    nation: undefined, // 民族
    // nativePlace: undefined, // 籍贯
    idType: undefined, // 证件类型
    idNumber: '', // 证件号码
    gender: undefined, // 人员性别
    age: '', // 年龄
    injurySource: undefined, // 人员来源
    injurySourceInfo: undefined, // 来源详情
    job: undefined, // 职业
    health: undefined, // 健康状况
    schooling: undefined, // 受教育程度
    injuryCause: undefined, // 致伤原因
    humanCause: undefined, // 人为因素
    injuryBehavior: undefined, // 受伤时行为
    injuryPart: undefined, // 受伤部位
    mainSymptoms: undefined, // 身体主要症状
  })
}

const handleAddDead = () => {
  form.value.casualtyWar.deadList.push({
    injuryType: '3',
    name: '', // 人员姓名
    nation: undefined, // 民族
    // nativePlace: undefined, // 籍贯
    idType: undefined, // 证件类型
    idNumber: '', // 证件号码
    gender: undefined, // 人员性别
    age: '', // 人员年龄
    injurySource: undefined, // 人员来源
    injurySourceInfo: undefined, // 来源详情
    job: undefined, // 职业
    health: undefined, // 健康状况
    schooling: undefined, // 受教育程度
    injuryCause: undefined, // 致死原因
    humanCause: undefined, // 人为因素
    injuryBehavior: undefined, // 受害时行为
    bodyLocation: undefined, // 发现尸体位置
    deathDate: [], // 死亡时间
  })
}

const handleDeleteInjury = (index) => {
  form.value.casualtyWar.injuredList = form.value.casualtyWar.injuredList.filter((item, i) => i !== index)
}

const handleDeleteDead = (index) => {
  form.value.casualtyWar.deadList = form.value.casualtyWar.deadList.filter((item, i) => i !== index)
}

const onInjuryIdType = (index) => {
  const current = form.value.casualtyWar.injuredList[index]
  current.idNumber = ''
  current.gender = undefined
  current.age = ''
  const filter = options.value?.idType?.filter(item => item.boDictId === current.idType)
  if (filter && filter[0].dictName === '身份证') {
    current.disabled = false
    current.genderHolder = ''
    current.ageHolder = ''
  }
  else {
    current.disabled = true
    current.genderHolder = '请选择人员性别'
    current.ageHolder = '请输入人员年龄'
  }
}

const onDeadIdType = (index) => {
  const current = form.value.casualtyWar.deadList[index]
  current.idNumber = ''
  current.gender = undefined
  current.age = ''
  const filter = options.value?.idType?.filter(item => item.boDictId === current.idType)
  if (filter && filter[0].dictName === '身份证') {
    current.disabled = false
    current.genderHolder = ''
    current.ageHolder = ''
  }
  else {
    current.disabled = true
    current.genderHolder = '请选择人员性别'
    current.ageHolder = '请输入人员年龄'
  }
}

const validateCard = (value, rule) => {
  if (!value) {
    if (form.value.casualtyWar.idNumber?.rules[0]?.required) {
      // callback(new Error('请输入身份证号码'))
      return '请输入身份证号码'
    }
    else {
      return true
      // callback()
    }
  }
  else if (!validIdCode(value)) {
    return '请输入正确身份证号码'
    // callback(new Error('请输入正确身份证号码'))
  }
  else {
    return true
    // callback()
  }
}
const idNumberChange = ()=>{
  diyValidateMap.value.defaultKey.push(`casualtyWar.injuredList.${index}.idNumber`)
}
watch(() => form.value.casualtyWar.injuredList, () => {
  const { injuredList } = form.value.casualtyWar
  injuredList.forEach((item) => {
    const filter = options.value?.idType?.filter(temp => temp.boDictId === item.idType)
    if (filter?.length > 0 && filter[0].dictName === '身份证') {
      if (item.idNumber && validIdCode(item.idNumber)) {
        const { age, sex } = getInfoByCard(item.idNumber)
        item.gender = `${sex}`
        item.age = age
      }
      else {
        item.gender = undefined
        item.age = ''
      }
    }
  })
}, { deep: true })

watch(() => form.value.casualtyWar.deadList, () => {
  const { deadList } = form.value.casualtyWar
  deadList.forEach((item) => {
    const filter = options.value?.idType?.filter(temp => temp.boDictId === item.idType)
    if (filter?.length > 0 && filter[0].dictName === '身份证') {
      if (item.idNumber && validIdCode(item.idNumber)) {
        const { age, sex } = getInfoByCard(item.idNumber)
        item.gender = `${sex}`
        item.age = age
      }
      else {
        item.gender = undefined
        item.age = ''
      }
    }
  })
}, { deep: true })

watch(() => form.value.casualtyWar.isInjured, () => {
  if (form.value.casualtyWar.isInjured.value === '1' && form.value.casualtyWar.injuredList.length <= 0) {
    handleAddInjury()
  }
  else if (form.value.casualtyWar.isInjured.value === '2') {
    form.value.casualtyWar.injuredList = []
  }
}, { deep: true })

watch(() => form.value.casualtyWar.isDead, () => {
  if (form.value.casualtyWar.isDead.value === '1' && form.value.casualtyWar.deadList.length <= 0) {
    handleAddDead()
  }
  else if (form.value.casualtyWar.isDead.value === '2') {
    form.value.casualtyWar.deadList = []
  }
}, { deep: true })

const smallInjured = computed(() => {
  const { injuryNum } = form.value.casualtyWar
  return Number(injuryNum.value) || 0
})

const bigInjured = computed(() => {
  const { injuredList } = form.value.casualtyWar
  return injuredList?.filter(item => item.injuryType === '2')?.length
})
</script>

<template>
  <van-cell-group class="rootform1 fire-casualtyWar">
    <div :gutter="gutter">
      <div :span="8">
        <van-field name="casualtyWar.isInjured.value" label="是否有人员受伤："
          :required="isRequired"
          :rules="form.casualtyWar.isInjured.rules" 
          class="field-radio"
          label-width="128px"
          :class="{ 'field-not-required': !isRequired }"
        >
          <template #input>
            <van-radio-group 
              class="field-radio"
              id="isInjured"
              v-model="form.casualtyWar.isInjured.value"
              v-preview-text="showPreview"
              :disabled="!importantEdit"
              @change="checkFireInjuryCost(form)"
              direction="horizontal">
              <van-radio name="1">有</van-radio>
              <van-radio name="2">无</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否有人员受伤："
              remark-field="isInjured"
              field-module="casualtyWar"
              :exist-data="fieldExist?.isInjured"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>
    <!-- 受伤人员 -->
    <template v-if="form.casualtyWar.isInjured.value === '1'">
      <div class="injured-message">
        受伤人员信息（合计受伤 {{ bigInjured + smallInjured }} 人，轻伤 {{ smallInjured }} 人，重伤{{ bigInjured }}人）
      </div>
      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            label="伤亡情况："
            name="casualtyWar.minorInjury.value"
            :rules="form.casualtyWar.minorInjury.rules"
            id="minorInjury"
            v-model:value="form.casualtyWar.minorInjury.value"
            :showPreview="showPreview"
            :options="options.injuryType"
            allow-clear
            disabled
            :field-names="{label:'label',value:'value'}"
            :required="true"
            placeholder="请选择是伤亡情况"
            title="请选择是伤亡情况"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="伤亡情况："
                remark-field="minorInjury"
                field-module="casualtyWar"
                :exist-data="fieldExist?.minorInjury"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <van-field 
            label="轻伤人数："
            :rules="form.casualtyWar.injuryNum.rules"
            id="injuryNum"
            v-model="form.casualtyWar.injuryNum.value"
            v-preview-text="showPreview"
            :maxlength="6"
            :disabled="!importantEdit"
            style="width: 100%"
            allow-clear
            aria-autocomplete="none"
            placeholder="请输入轻伤人数"
            @change="checkFireInjuryCost(form)"
            direction="horizontal"
            name="casualtyWar,injuryNum,value"
            type="number" 
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="轻伤人数："
                remark-field="injuryNum"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuryNum"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field >
        </div>
      </div>
      <div v-for="(item, index) in form.casualtyWar.injuredList" :key="index" class="injured-item">
        <div class="injured-message title flex-wrapper">
          受伤人员{{ index + 1 }}
          <div class="border-minus1 border-mius1" v-if="!isDetail && importantEdit" >
            <van-icon 
              class="form-col-delete"
              title="删除该受重伤人员"
              name="minus"
              type="default"
              size="12"
              color="#444"
              style="margin: 0 20px"
              @click="handleDeleteInjury(index)"
            />
          </div>
        </div>
        <div :span="8">
          <SelectSingle
            label="伤亡情况："
            :name="`casualtyWar.injuredList.${index}.injuryType`"
            :rules="form.casualtyWar.minorInjury.rules"
            id="minorInjury"
            v-model:value="item.injuryType"
            :showPreview="showPreview"
            :options="options.injuryType"
            allow-clear
            disabled
            :field-names="{label:'label',value:'value'}"
            :required="true"
            placeholder="请选择是伤亡情况"
            title="请选择是伤亡情况"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="伤亡情况："
                remark-field="injuredList"
                remark-field2="injuryType"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injuryType"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <van-field
            label="人员姓名："
            :rules="form.casualtyWar.name.rules"
            id="name"
            v-model="item.name"
            v-preview-text="showPreview"
            :maxlength="20"
            allow-clear
            :required="true"
            aria-autocomplete="none"
            placeholder="请输入人员姓名"
            :name="`casualtyWar.injuredList.${index}.name`"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员姓名："
                remark-field="injuredList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.name"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.nation`"
            label="民族："
            :rules="form.casualtyWar.nation.rules"
            :required="isRequired"
            id="nation"
            v-model:value="item.nation"
            :showPreview="showPreview"
            :options="options.nation"
            allow-clear
            show-search
            :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择民族"
            title="请选择民族"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="民族："
                remark-field="injuredList"
                remark-field2="nation"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.nation"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            label="证件类型："
            :name="`casualtyWar.injuredList.${index}.idType`"
            :rules="form.casualtyWar.idType.rules"
            id="idType"
            v-model:value="item.idType"
            :showPreview="showPreview"
            :options="options.idType"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择证件类型"
            @change="onInjuryIdType(index)"
            :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
            title="请选择证件类型"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="证件类型："
                remark-field="injuredList"
                remark-field2="idType"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.idType"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <van-field
            label="证件号码："
            :rules="!item.disabled ? [{ validator: validateCard, trigger: 'onBlur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }] : form.casualtyWar.idNumber.rules"
            :required="isRequired"
            id="idNumber"
            v-model="item.idNumber"
            v-preview-text="showPreview"
            style="width: 100%"
            :maxlength="50"
            allow-clear
            aria-autocomplete="none"
            placeholder="请输入证件号码"
            :name="`casualtyWar.injuredList.${index}.idNumber`"
            @change="idNumberChange(index)"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="证件号码："
                remark-field="injuredList"
                remark-field2="idNumber"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.idNumber"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div :span="8">
          <SelectSingle
            label="人员性别："
            :name="`casualtyWar.injuredList.${index}.gender`"
            :rules="form.casualtyWar.gender.rules"
            id="gender"
            v-model:value="item.gender"
            :showPreview="showPreview"
            :options="options.gender"
            :placeholder="item.genderHolder"
            :disabled="!item.disabled"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择人员性别"
          >
           <template v-slot:label="">
              <FieldAnnotation
                label="人员性别："
                remark-field="injuredList"
                remark-field2="gender"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.gender"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <van-field 
            label="人员年龄："
            :rules="form.casualtyWar.age.rules"
            :required="isRequired"
            id="age"
            :name="`casualtyWar.injuredList.${index}.age`"
            v-model="item.age"
            v-preview-text="showPreview"
            style="width: 100%"
            :maxlength="3"
            :placeholder="item.ageHolder"
            :disabled="!item.disabled"
            aria-autocomplete="none"
            allow-clear
            type="number"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员年龄："
                remark-field="injuredList"
                remark-field2="injurySource"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injurySource"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field >
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.injurySource`"
            label="人员来源："
            :rules="form.casualtyWar.injurySource.rules"
            :required="isRequired"
            id="injurySource"
            v-model:value="item.injurySource"
            :showPreview="showPreview"
            :options="options.injurySource"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择人员来源"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员来源："
                remark-field="injuredList"
                remark-field2="injurySource"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injurySource"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.injurySourceInfo`"
            label="来源详情："
            id="injurySourceInfo"
            v-model:value="item.injurySourceInfo"
            :showPreview="showPreview"
            :options="options.injurySourceInfo"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择来源详情"
            :required="isRequired"
            :rules="form.casualtyWar.injurySourceInfo.rules"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="来源详情："
                remark-field="injuredList"
                remark-field2="injurySourceInfo"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injurySourceInfo"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.job`"
            label="职业："
            :rules="form.casualtyWar.job.rules"
            :required="isRequired"
            id="job"
            v-model:value="item.job"
            :showPreview="showPreview"
            :options="options.job"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择职业"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="职业："
                remark-field="injuredList"
                remark-field2="job"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.job"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.health`"
            label="健康状况"
            :rules="form.casualtyWar.health.rules"
            :required="isRequired"
            id="health"
            v-model:value="item.health"
            :showPreview="showPreview"
            :options="options.health"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择健康状况"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="健康状况："
                remark-field="injuredList"
                remark-field2="health"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.health"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.schooling`"
            label="受教育程度："
            label-width="112px"
            :rules="form.casualtyWar.schooling.rules"
            id="schooling"
            v-model:value="item.schooling"
            :showPreview="showPreview"
            :options="options.schooling"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择受教育程度"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="受教育程度："
                remark-field="injuredList"
                remark-field2="schooling"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.schooling"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.injuryCause`"
            label="致伤原因："
            :rules="form.casualtyWar.injuryCause.rules"
            id="injuryCause"
            v-model:value="item.injuryCause"
            :showPreview="showPreview"
            :options="options.injuryCause"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择致伤原因"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="致伤原因："
                remark-field="injuredList"
                remark-field2="injuryCause"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injuryCause"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.humanCause`"
            label="人为因素："
            :rules="form.casualtyWar.humanCause.rules"
            id="injuryBehavior"
            v-model:value="item.humanCause"
            :showPreview="showPreview"
            :options="options.humanCause"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择人为因素："
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人为因素："
                remark-field="injuredList"
                remark-field2="humanCause"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.humanCause"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            label="受伤时行为："
            label-width="112px"
            :name="`casualtyWar.injuredList.${index}.injuryBehavior`"
            :rules="form.casualtyWar.injuryBehavior.rules"
            id="injuryBehavior"
            v-model:value="item.injuryBehavior"
            :showPreview="showPreview"
            :options="options.injuryBehavior"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择受伤时行为"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="受伤时行为："
                remark-field="injuredList"
                remark-field2="injuryBehavior"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injuryBehavior"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.mainSymptoms`"
            label="身体主要症状："
            label-width="124px"
            :rules="form.casualtyWar.mainSymptoms.rules"
            v-model:value="item.mainSymptoms"
            :showPreview="showPreview"
            :options="options.mainSymptoms"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择身体主要症状"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="身体主要症状："
                remark-field="injuredList"
                remark-field2="mainSymptoms"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.mainSymptoms"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.injuredList.${index}.injuryPart`"
            label="受伤部位："
            :rules="form.casualtyWar.injuryPart.rules"
            id="mainSymptoms"
            v-model:value="item.injuryPart"
            v-preview-text="showPreview"
            :options="options.injuryPart"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择受伤部位"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="受伤部位："
                remark-field="injuredList"
                remark-field2="mainSymptoms"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.mainSymptoms"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>
      <van-button 
        v-if="!isDetail && importantEdit" 
        class="form-col-delete add"
        title="新增受重伤人员"
        icon="plus"  
        size="small"
        type="default" 
        @click="handleAddInjury(index)"
        style="margin: 0 20px"
      >
        新增受重伤人员
      </van-button>
    </template>
      <div :span="8">
        <van-field 
          name="casualtyWar.isInjured.value"
          label="是否有人员死亡："
          :rules="form.casualtyWar.isDead.rules"
          :required="isRequired"
          class="field-radio"
          label-width="128px"
          :class="{ 'field-not-required': !isRequired }"
        >
          <template #input>
            <van-radio-group 
              class="field-radio"
              id="isDead"
              v-model="form.casualtyWar.isDead.value"
              v-preview-text="showPreview"
              :disabled="!importantEdit"
              @change="checkFireInjuryCost(form)"
              direction="horizontal">
              <van-radio name="1">有</van-radio>
              <van-radio name="2">无</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否有人员死亡："
              remark-field="isDead"
              field-module="casualtyWar"
              :exist-data="fieldExist?.isDead"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    <!-- 死亡人员 -->
    <template v-if="form.casualtyWar.isDead.value === '1'">
      <div class="dead-message">
        死亡人员信息（合计死亡 {{ form.casualtyWar.deadList?.length }} 人）
      </div>
      <div v-for="(item, index) in form.casualtyWar.deadList" :key="index" class="dead-item">
        <div class="injured-message title flex-wrapper">
          死亡人员{{ index + 1 }}
          <div class="border-minus1" v-if="!isDetail && importantEdit" >
            <van-icon 
              class="form-col-delete"
              title="删除该死亡人员"
              name="minus"
              type="default"
              size="12"
              color="black"
              style="margin: 0 20px"
              @click="handleDeleteDead(index)"
            />
          </div>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.injuryType`"
            label="伤亡情况："
            :rules="form.casualtyWar.injuryType.rules"
            id="injuryType"
            v-model:value="item.injuryType"
            :showPreview="showPreview"
            :options="options.injuryType"
            allow-clear
            placeholder="请输入伤亡情况"
            disabled
            :field-names="{ value: 'value', label: 'label' }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="伤亡情况："
                remark-field="deadList"
                remark-field2="injuryType"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.injuryType"
                @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
        </div>
        <div :span="8">
          <van-field
            :name="`casualtyWar.deadList.${index}.name`"
            label="人员姓名："
            :rules="form.casualtyWar.name.rules"
            id="nation"
            v-model="item.name"
            v-preview-text="showPreview"
            allow-clear
            show-search
            :required="true"
            :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请输入人员姓名"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员姓名："
                remark-field="deadList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.name"
                @refresh-callback="refreshField"
              />
          </template>
        </van-field>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.nation`"
            label="民族："
            :rules="form.casualtyWar.nation.rules"
            :required="isRequired"
            id="injuryType"
            v-model:value="item.nation"
            :showPreview="showPreview"
            :options="options.nation"
            allow-clear
            placeholder="请选择民族"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="民族："
                remark-field="deadList"
                remark-field2="nation"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.nation"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.idType`"
            label="证件类型："
            :rules="form.casualtyWar.idType.rules"
            :required="isRequired"
            id="idType"
            v-model:value="item.idType"
            :showPreview="showPreview"
            :options="options.idType"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择证件类型"
            @change="onDeadIdType(index)"
            :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
            title="请选择证件类型"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="证件类型："
                remark-field="deadList"
                remark-field2="idType"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.idType"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="9">
          <van-field
            :name="`casualtyWar.deadList.${index}.idNumber`"
            label="证件号码："
            :rules="!item.disabled ? [{ validator: validateCard, trigger: 'onBlur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }] : form.casualtyWar.idNumber.rules"
            id="idNumber"
            :required="isRequired"
            v-model="item.idNumber"
            v-preview-text="showPreview"
            style="width: 100%"
            :maxlength="50"
            allow-clear
            aria-autocomplete="none"
            placeholder="请输入证件号码"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="证件号码："
                remark-field="deadList"
                remark-field2="idNumber"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.idNumber"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.gender`"
            label="人员性别"
            :rules="form.casualtyWar.gender.rules"
            id="gender"
            v-model:value="item.gender"
            :showPreview="showPreview"
            :options="options.gender"
            :placeholder="item.genderHolder"
            :field-names="{ value: 'value', label: 'label' }"
            :disabled="!item.disabled"
            allow-clear
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员性别："
                remark-field="deadList"
                remark-field2="gender"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.gender"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <van-field 
            label="人员年龄："
            :rules="form.casualtyWar.age.rules"
            :required="isRequired"
            id="age"
            v-model="item.age"
            v-preview-text="showPreview"
            :placeholder="item.ageHolder"
            style="width: 100%"
            :maxlength="3"
            aria-autocomplete="none"
            :disabled="!item.disabled"
            allow-clear
            :name="`casualtyWar.deadList.${index}.ageHolder`"
            type="number"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员年龄："
                remark-field="deadList"
                remark-field2="age"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.age"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field >
        </div>
        <div :span="8">
          <SelectSingle
            label="人员来源："
            :name="`casualtyWar.deadList.${index}.injurySource`"
            :rules="form.casualtyWar.injurySource.rules"
            :required="isRequired"
            id="injurySource"
            v-model:value="item.injurySource"
            :showPreview="showPreview"
            :options="options.injurySource"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择人员来源"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员来源："
                remark-field="deadList"
                remark-field2="injurySource"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.injurySource"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.injurySourceInfo`"
            label="来源详情："
            id="injurySourceInfo"
            v-model:value="item.injurySourceInfo"
            :showPreview="showPreview"
            :options="options.injurySourceInfo"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择来源详情"
            :required="isRequired"
            :rules="form.casualtyWar.injurySourceInfo.rules"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="来源详情："
                remark-field="deadList"
                remark-field2="injurySourceInfo"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.injurySourceInfo"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            label="职业："
            :name="`casualtyWar.deadList.${index}.job`"
            :rules="form.casualtyWar.job.rules"
            :required="isRequired"
            id="job"
            v-model:value="item.job"
            :showPreview="showPreview"
            :options="options.job"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择职业"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="职业："
                remark-field="deadList"
                remark-field2="job"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.job"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.health`"
            label="健康状况："
            :rules="form.casualtyWar.health.rules"
            :required="isRequired"
            id="health"
            v-model:value="item.health"
            :showPreview="showPreview"
            :options="options.health"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择健康状况"
            :class="{ 'field-not-required': !isRequired }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="健康状况："
                remark-field="deadList"
                remark-field2="health"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.health"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.schooling`"
            label="受教育程度："
            label-width="112px"
            :rules="form.casualtyWar.schooling.rules"
            id="schooling"
            v-model:value="item.schooling"
            :showPreview="showPreview"
            :options="options.schooling"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择受教育程度"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="受教育程度："
                remark-field="deadList"
                remark-field2="schooling"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.schooling"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.injuryCause`"
            label="致死原因："
            :rules="[{ required: form.casualtyWar.injuryCause.rules[0].required, message: '请选择致死原因' }]"
            id="injuryCause"
            v-model:value="item.injuryCause"
            :showPreview="showPreview"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            :options="options.injuryCause"
            allow-clear
            placeholder="请选择致死原因"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="致死原因："
                remark-field="deadList"
                remark-field2="injuryCause"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.injuryCause"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.humanCause`"
            label="人为因素："
            :rules="form.casualtyWar.humanCause.rules"
            id="injuryBehavior"
            v-model:value="item.humanCause"
            :showPreview="showPreview"
            :options="options.humanCause"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择受伤时行为"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人为因素："
                remark-field="deadList"
                remark-field2="humanCause"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.humanCause"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`casualtyWar.deadList.${index}.injuryBehavior`"
            label="受害时行为："
            label-width="112px"
            :rules="[{ required: form.casualtyWar.injuryBehavior.rules[0].required, message: '请选择受害时行为' }]"
            id="injuryBehavior"
            v-model:value="item.injuryBehavior"
            :showPreview="showPreview"
            :options="options.injuryBehavior"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择受害时行为"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="受害时行为："
                remark-field="deadList"
                remark-field2="injuryBehavior"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.injuryBehavior"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
           :name="`casualtyWar.deadList.${index}.bodyLocation`"
            label="发现尸体位置："
            label-width="124px"
            :rules="form.casualtyWar.bodyLocation.rules"
            id="bodyLocation"
            v-model:value="item.bodyLocation"
            :showPreview="showPreview"
            :options="options.bodyLocation"
            allow-clear
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            placeholder="请选择发现尸体位置"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="发现尸体位置："
                remark-field="deadList"
                remark-field2="bodyLocation"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.bodyLocation"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <CascaderSingle
            :name="`casualtyWar.deadList.${index}.deathDate`"
            label="死亡时间："
            :rules="form.casualtyWar.deathDate.rules"
            :required="isRequired"
            id="deathDate"
            v-model:value="item.deathDate"
            :showPreview="showPreview"
            :options="options.deathDate"
            :field-names="{ value: 'boDictId', text: 'dictName' }"
            placeholder="请选择死亡时间"
            allow-clear
            :class="{ 'field-not-required': !isRequired }"
            :show-search="{ filter: (inputValue, path) => path.some(option => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="死亡时间："
                remark-field="deadList"
                remark-field2="deathDate"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.deathDate"
                @refresh-callback="refreshField"
              />
            </template>
          </CascaderSingle>
        </div>
      </div>
      <van-button 
        v-if="!isDetail && importantEdit"
        class="add"
        @click="handleAddDead"
        title="新增死亡人员"
        icon="plus" 
        type="default" 
        size="small"
        style="margin: 0 20px"
      >
        新增死亡人员
      </van-button >
    </template>
</van-cell-group>
</template>

<style lang="scss" scoped>
.fire-casualtyWar {
  .injured-message {
    color: red;
    margin-bottom: 20px;
    margin: 5px 15px;
    &::after{
      display: none !important;
    }
  }
  .dead-message {
    color: red;
    margin-bottom: 20px;
  }
  .injured-item {
    padding-right: 0px;
    border: 1px solid #ebebeb;
    margin: 10px 10px;
    .title {
      // display: flex;
      align-items: center;
      margin: 10px 20px 10px 20px;

    }
    .title i {
      margin-left: auto;
    }
  }
  .dead-item {
    // padding-right: 0px;
    border: 1px solid #ebebeb;
    margin: 10px 10px;
    .title {
      display: flex;
      align-items: center;
      margin: 10px 20px 0 20px;
    }
    .title i {
      margin-left: auto;
    }
  }
  .add{
    width: calc(100% - 40px);
    &::after{
      display: none;
    }
  }
  .flex-wrapper{
    display: flex;
    justify-content: space-between;
  }
  .border-minus1 {
    border-radius: 50% !important;
    border: 2px solid #444 !important;
    width: 16px !important;
    height: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
}

</style>
