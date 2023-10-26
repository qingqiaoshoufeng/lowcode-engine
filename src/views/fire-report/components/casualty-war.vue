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

const importantEdit = inject('importantEdit')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

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

const validateCard = (rule, value, callback) => {
  if (!value) {
    if (form.value.casualtyWar.idNumber?.rules[0]?.required) {
      callback(new Error('请输入身份证号码'))
    }
    else {
      callback()
    }
  }
  else if (!validIdCode(value)) {
    callback(new Error('请输入正确身份证号码'))
  }
  else {
    callback()
  }
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
  return injuryNum.value || 0
})

const bigInjured = computed(() => {
  const { injuredList } = form.value.casualtyWar
  return injuredList?.filter(item => item.injuryType === '2')?.length
})
</script>

<template>
  <div id="casualtyWar" class="fire-casualtyWar">
    <h4 id="casualtyWar-title">
      <strong>人员伤亡（不含消防员）</strong>
    </h4>
    <div :gutter="gutter">
      <div :span="8">
        <van-field name="是否有人员受伤" label="是否有人员受伤"
          :rules="form.casualtyWar.isInjured.rules" >
          <template #input>
            <van-radio-group 
              id="isInjured"
              v-model:value="form.casualtyWar.isInjured.value"
              v-preview-text="showPreview"
              :disabled="!importantEdit"
              @change="checkFireInjuryCost(form)"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
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
            label="伤亡情况"
            :rules="form.casualtyWar.minorInjury.rules"
            id="minorInjury"
            v-model:value="form.casualtyWar.minorInjury.value"
            v-preview-text="showPreview"
            :options="options.injuryType"
            allow-clear
            disabled
            :field-names="{label:'label',value:'value'}"
            :required="true"
            placeholder="请选择是伤亡情况"
            title="请选择是伤亡情况"
          />
        </div>
        <div :span="8">
          <van-field 
            name="轻伤人数" 
            label="轻伤人数"
            :rules="form.casualtyWar.injuryNum.rules">
            <template #input>
              <van-stepper
                id="injuryNum"
                v-model:value="form.casualtyWar.injuryNum.value"
                v-preview-text="showPreview"
                :maxlength="6"
                :disabled="!importantEdit"
                style="width: 100%"
                allow-clear
                aria-autocomplete="none"
                placeholder="请输入轻伤人数"
                @change="checkFireInjuryCost(form)"
                direction="horizontal"
              />
            </template>
          </van-field>
        </div>
      </div>
      <div v-for="(item, index) in form.casualtyWar.injuredList" :key="index" class="injured-item">
        <div class="injured-message">
          受伤人员{{ index + 1 }}
        </div>
        <div :gutter="gutter">
          <div :span="8">
            <SelectSingle
              label="伤亡情况"
              :rules="form.casualtyWar.minorInjury.rules"
              id="minorInjury"
              v-model:value="form.casualtyWar.minorInjury.value"
              v-preview-text="showPreview"
              :options="options.injuryType"
              allow-clear
              disabled
              :field-names="{label:'label',value:'value'}"
              :required="true"
              placeholder="请选择是伤亡情况"
              title="请选择是伤亡情况"
            />
          </div>
          <div :span="8">
            <van-field
              label="人员姓名"
              :rules="form.casualtyWar.name.rules"
              id="name"
              v-model:value="item.name"
              v-preview-text="showPreview"
              :maxlength="20"
              allow-clear
              aria-autocomplete="none"
              placeholder="请输入人员姓名"
              name="人员姓名"
            />
          </div>
          <div :span="8">
            <SelectSingle
              label="民族"
              :rules="form.casualtyWar.nation.rules"
              id="nation"
              v-model:value="item.nation"
              v-preview-text="showPreview"
              :options="options.nation"
              allow-clear
              show-search
              :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择民族"
              :required="true"
              title="请选择民族"
            />
            <van-button 
              v-if="!isDetail && importantEdit" 
              class="form-col-delete"
              title="删除该受重伤人员"
              icon="plus" type="primary" 
              @click="handleDeleteInjury(index)"
            />
          </div>
        </div>

        <div :gutter="gutter">
          <div :span="8">
            <SelectSingle
              label="证件类型"
              :rules="form.casualtyWar.idType.rules"
              id="idType"
              v-model:value="item.idType"
              v-preview-text="showPreview"
              :options="options.idType"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择证件类型"
              @change="onInjuryIdType(index)"
              :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
              title="请选择证件类型"
            />
          </div>
          <div :span="8">
            <van-field
              label="证件号码"
              :rules="!item.disabled ? [{ validator: validateCard, trigger: 'blur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }] : form.casualtyWar.idNumber.rules"
              id="idNumber"
              v-model:value="item.idNumber"
              v-preview-text="showPreview"
              style="width: 100%"
              :maxlength="50"
              allow-clear
              aria-autocomplete="none"
              placeholder="请输入证件号码"
              name="请输入证件号码"
            />
          </div>
          <div :span="8">
            <SelectSingle
              label="人员性别"
              :rules="form.casualtyWar.gender.rules"
              id="gender"
              v-model:value="item.gender"
              v-preview-text="showPreview"
              :options="options.gender"
              :placeholder="item.genderHolder"
              :disabled="!item.disabled"
              :field-names="{ value: 'value', label: 'label' }"
              title="请选择人员性别"
            />
          </div>
          <div :span="8">
            <van-field 
              name="人员年龄"
              label="人员年龄"
              :rules="form.casualtyWar.age.rules">
              <template #input>
                <van-stepper
                  id="age"
                  v-model:value="item.age"
                  v-preview-text="showPreview"
                  style="width: 100%"
                  :maxlength="3"
                  :placeholder="item.ageHolder"
                  :disabled="!item.disabled"
                  aria-autocomplete="none"
                  allow-clear
                />
              </template>
            </van-field>
          </div>
          <div :span="8">
            <SelectSingle
              label="人员来源"
              :rules="form.casualtyWar.injurySource.rules"
              id="injurySource"
              v-model:value="item.injurySource"
              v-preview-text="showPreview"
              :options="options.injurySource"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择人员来源"
            />
          </div>
          <div :span="8">
            <SelectSingle
              name="来源详情"
              label="来源详情"
              id="injurySourceInfo"
              v-model:value="item.injurySourceInfo"
              v-preview-text="showPreview"
              :options="options.injurySourceInfo"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择来源详情"
              :rules="form.casualtyWar.injurySourceInfo.rules"
            />
          </div>
          <div :span="8">
            <SelectSingle
              label="职业"
              :rules="form.casualtyWar.job.rules"
              id="job"
              v-model:value="item.job"
              v-preview-text="showPreview"
              :options="options.job"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              allow-clear
              placeholder="请选择职业"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'health']"
              label="健康状况"
              :rules="form.casualtyWar.health.rules"
              id="health"
              v-model:value="item.health"
              v-preview-text="showPreview"
              :options="options.health"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              allow-clear
              placeholder="请选择健康状况"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'schooling']"
              label="受教育程度"
              :rules="form.casualtyWar.schooling.rules"
              id="schooling"
              v-model:value="item.schooling"
              v-preview-text="showPreview"
              :options="options.schooling"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              allow-clear
              placeholder="请选择受教育程度"
            />
          </div>
          <div :span="8">
            <SelectSingle
              name="致伤原因"
              label="致伤原因"
              :rules="form.casualtyWar.injuryCause.rules"
              id="injuryCause"
              v-model:value="item.injuryCause"
              v-preview-text="showPreview"
              :options="options.injuryCause"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择致伤原因"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'humanCause']"
              label="人为因素"
              :rules="form.casualtyWar.humanCause.rules"
              id="injuryBehavior"
              v-model:value="item.injuryBehavior"
              v-preview-text="showPreview"
              :options="options.injuryBehavior"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择受伤时行为"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'injuryBehavior']"
              label="受伤时行为"
              :rules="form.casualtyWar.injuryBehavior.rules"
              id="injuryBehavior"
              v-model:value="item.injuryBehavior"
              v-preview-text="showPreview"
              :options="options.injuryBehavior"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择受伤时行为"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'mainSymptoms']"
              label="身体主要症状"
              :rules="form.casualtyWar.mainSymptoms.rules"
              v-model:value="item.injuryPart"
              v-preview-text="showPreview"
              :options="options.injuryPart"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择受伤部位"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'injuryPart']"
              label="受伤部位"
              :rules="form.casualtyWar.injuryPart.rules"
              id="mainSymptoms"
              v-model:value="item.mainSymptoms"
              v-preview-text="showPreview"
              :options="options.mainSymptoms"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择身体主要症状"
            />
          </div>
        </div>
      </div>
      <div v-if="!isDetail && importantEdit">
        <div span="24">
          <!-- <a-form-item title="新增受重伤人员"> -->
            <van-button 
              v-if="!isDetail && importantEdit" 
              class="form-col-delete"
              title="删除该受重伤人员"
              icon="plus" type="primary" 
              @click="handleDeleteInjury(index)"
            />
            <!-- <a-button type="dashed" block @click="handleAddInjury">
              <PlusOutlined />
            </a-button> -->
          <!-- </a-form-item> -->
        </div>
      </div>
    </template>
    <div :gutter="gutter">
      <div :span="8">
        <van-field 
          name="['casualtyWar', 'isDead', 'value']"
          label="是否有人员死亡"
          :rules="form.casualtyWar.isDead.rules"
        >
          <template #input>
            <van-radio-group 
              id="isDead"
              v-model:value="form.casualtyWar.isDead.value"
              v-preview-text="showPreview"
              :disabled="!importantEdit"
              @change="checkFireInjuryCost(form)"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
    </div>
    <!-- 死亡人员 -->
    <template v-if="form.casualtyWar.isDead.value === '1'">
      <div class="dead-message">
        死亡人员信息（合计死亡 {{ form.casualtyWar.deadList?.length }} 人）
      </div>
      <div v-for="(item, index) in form.casualtyWar.deadList" :key="index" class="dead-item">
        <div class="injured-message">
          死亡人员{{ index + 1 }}
        </div>
        <div :gutter="gutter">
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'deadList', index, 'injuryType']"
              label="伤亡情况"
              :rules="form.casualtyWar.injuryType.rules"
              id="injuryType"
              v-model:value="item.injuryType"
              v-preview-text="showPreview"
              :options="options.injuryType"
              allow-clear
              placeholder=""
              disabled
              :field-names="{ value: 'value', label: 'label' }"
            />
          </div>
          <div :span="8">
            <van-field
              :name="['casualtyWar', 'deadList', index, 'name']"
              label="人员姓名"
              :rules="form.casualtyWar.name.rules"
              id="nation"
              v-model:value="item.nation"
              v-preview-text="showPreview"
              :options="options.nation"
              allow-clear
              show-search
              :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择民族"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'deadList', index, 'nation']"
              label="民族"
              :rules="form.casualtyWar.nation.rules"
              id="injuryType"
              v-model:value="item.injuryType"
              v-preview-text="showPreview"
              :options="options.injuryType"
              allow-clear
              placeholder=""
              disabled
              :field-names="{ value: 'value', label: 'label' }"
            />
          </div>
        </div>

        <div :gutter="gutter">
          <div :span="8">
            <SelectSingle
              label="证件类型"
              :rules="form.casualtyWar.idType.rules"
              id="idType"
              v-model:value="item.idType"
              v-preview-text="showPreview"
              :options="options.idType"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择证件类型"
              @change="onInjuryIdType(index)"
              :filter-option="(inputValue, option) => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1"
              title="请选择证件类型"
            />
          </div>
          <div :span="8">
            <van-field
              :name="['casualtyWar', 'deadList', index, 'idNumber']"
              label="证件号码"
              :rules="!item.disabled ? [{ validator: validateCard, trigger: 'blur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }] : form.casualtyWar.idNumber.rules"
              id="idNumber"
              v-model:value="item.idNumber"
              v-preview-text="showPreview"
              style="width: 100%"
              :maxlength="50"
              allow-clear
              aria-autocomplete="none"
              placeholder="请输入证件号码"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'deadList', index, 'gender']"
              label="人员性别"
              :rules="form.casualtyWar.gender.rules"
              id="gender"
              v-model:value="item.gender"
              v-preview-text="showPreview"
              :options="options.gender"
              :placeholder="item.genderHolder"
              :disabled="!item.disabled"
              allow-clear
            />
          </div>
          <div :span="8">
            <van-field 
              name="人员年龄"
              label="人员年龄"
              :rules="form.casualtyWar.age.rules">
              <template #input>
                <van-stepper
                  id="age"
                  v-model:value="item.age"
                  v-preview-text="showPreview"
                  :placeholder="item.ageHolder"
                  style="width: 100%"
                  :maxlength="3"
                  aria-autocomplete="none"
                  :disabled="!item.disabled"
                  allow-clear
                />
              </template>
            </van-field>
          </div>
          <div :span="8">
            <SelectSingle
              label="人员来源"
              :rules="form.casualtyWar.injurySource.rules"
              id="injurySource"
              v-model:value="item.injurySource"
              v-preview-text="showPreview"
              :options="options.injurySource"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择人员来源"
            />
          </div>
          <div :span="8">
            <SelectSingle
              name="来源详情"
              label="来源详情"
              id="injurySourceInfo"
              v-model:value="item.injurySourceInfo"
              v-preview-text="showPreview"
              :options="options.injurySourceInfo"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择来源详情"
              :rules="form.casualtyWar.injurySourceInfo.rules"
            />
          </div>
          <div :span="8">
            <SelectSingle
              label="职业"
              :rules="form.casualtyWar.job.rules"
              id="job"
              v-model:value="item.job"
              v-preview-text="showPreview"
              :options="options.job"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              allow-clear
              placeholder="请选择职业"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'health']"
              label="健康状况"
              :rules="form.casualtyWar.health.rules"
              id="health"
              v-model:value="item.health"
              v-preview-text="showPreview"
              :options="options.health"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              allow-clear
              placeholder="请选择健康状况"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'schooling']"
              label="受教育程度"
              :rules="form.casualtyWar.schooling.rules"
              id="schooling"
              v-model:value="item.schooling"
              v-preview-text="showPreview"
              :options="options.schooling"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              allow-clear
              placeholder="请选择受教育程度"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'deadList', index, 'injuryCause']"
              label="致死原因"
              :rules="[{ required: form.casualtyWar.injuryCause.rules[0].required, message: '请选择致死原因' }]"
              id="injuryCause"
              v-model:value="item.injuryCause"
              v-preview-text="showPreview"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              :options="options.injuryCause"
              allow-clear
              placeholder="请选择致死原因"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'injuredList', index, 'humanCause']"
              label="人为因素"
              :rules="form.casualtyWar.humanCause.rules"
              id="injuryBehavior"
              v-model:value="item.injuryBehavior"
              v-preview-text="showPreview"
              :options="options.injuryBehavior"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择受伤时行为"
            />
          </div>
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'deadList', index, 'injuryBehavior']"
              label="受害时行为"
              :rules="[{ required: form.casualtyWar.injuryBehavior.rules[0].required, message: '请选择受害时行为' }]"
              id="injuryBehavior"
              v-model:value="item.injuryBehavior"
              v-preview-text="showPreview"
              :options="options.injuryBehavior"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择受害时行为"
            />
          </div>
        </div>

        <div :gutter="gutter">
          <div :span="8">
            <SelectSingle
              :name="['casualtyWar', 'deadList', index, 'bodyLocation']"
              label="发现尸体位置"
              :rules="form.casualtyWar.bodyLocation.rules"
              id="bodyLocation"
              v-model:value="item.bodyLocation"
              v-preview-text="showPreview"
              :options="options.bodyLocation"
              allow-clear
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择发现尸体位置"
            />
          </div>
          <div :span="8">
            <CascaderSingle
              :name="['casualtyWar', 'deadList', index, 'deathDate']"
              label="死亡时间"
              :rules="form.casualtyWar.deathDate.rules"
              id="deathDate"
              v-model:value="item.deathDate"
              v-preview-text="showPreview"
              :options="options.deathDate"
              :field-names="{ value: 'boDictId', label: 'dictName' }"
              placeholder="请选择死亡时间"
              allow-clear
              :show-search="{ filter: (inputValue, path) => path.some(option => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }"
            />
          </div>
        </div>
      </div>
      <div v-if="!isDetail && importantEdit">
        <div span="24">
          <van-button 
            @click="handleAddDead"
            title="新增死亡人员"
            icon="plus" 
            type="primary" 
          />
          <!-- <a-form-item title="新增死亡人员">
            <a-button type="dashed" block @click="handleAddDead">
              <PlusOutlined />
            </a-button>
          </a-form-item> -->
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.fire-casualtyWar {
  .injured-message {
    color: red;
    margin-bottom: 20px;
  }
  .dead-message {
    color: red;
    margin-bottom: 20px;
  }
  .injured-item {
    padding-right: 0px;
  }
  .dead-item {
    padding-right: 0px;
  }
}
</style>
