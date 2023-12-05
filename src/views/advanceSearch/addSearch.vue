<script setup>
import { inject, ref } from 'vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import { cloneDeep } from 'lodash-es'
import { getSearchParams, validateForm } from './checkConfig.js'
import { useDictName } from './checkConfig'
import SelectMultiple from '@/component/SelectMultiple/index.vue';
import SelectSingle from '@/component/SelectSingle/index.vue';
// import Time from './components/_time.vue'
// import PeriodTime from './components/_period-time.vue'
// import Modal from './components/_modal.vue'
// import Cascader from './components/_cascader.vue'
// import Area from './components/_area.vue'
// import Number from './components/_number.vue'
import SelectCar from '@/component/SelectCar/index.vue';
import SelectPerson from '@/component/SelectPerson/index.vue';

const formRef = ref(null)

const countForm = ref({
  fieldFlag: '2',
})

const form = inject('form')

const list = inject('list')

const options = inject('options')

const handleAdd = () => {
  formRef.value.validate().then(async () => {
    form.value = getSearchParams(form.value)
    const flag = validateForm(list.value, form.value)
    if (flag) {
      list.value.push(cloneDeep(form.value))
    }
    showToast('添加成功！')
  })
    .catch(() => {
      showToast('信息填写不完整，请检查填写内容！')
    })
}

const onChange = (item) => {
  countForm.value.date = new Date().getTime()
  countForm.value.fieldType = item.boDictId
  countForm.value.fieldText = item.dictName
  const flag = validateForm(list.value, countForm.value)
  if (flag) {
    list.value.push(cloneDeep(countForm.value))
  }
}

const onRadioChange = (e) => {
  const text = useDictName(e, options.value[form.value.dict])
  form.value.fieldText = `${form.value.label}：${text}`
}

const onMultipleChange = (value, option) => {
  form.value.fieldValueOne = form.value.valueOne.join(',')
  const arr = option.map(val => (form.value?.field?.label ? val[form.value.field.label] : val.dictName))
  form.value.fieldText = `${form.value.label}：${arr.join(',')}`
}

const onSingleChange = (value, option) => {
  form.value.fieldValueOne = option.boDictId
  form.value.fieldText = `${form.value.label}：${form.value?.field?.label ? option[form.value.field.label] : option.dictName}`
}

const onCarChange = (value) => {
  form.value.fieldValueOne = value?.map(item => item.boFireTruckId)?.join(',')
  form.value.fieldText = `${form.value.label}：${value?.map(item => item.truckCode)?.join(',')}`
}

const onPersonChange = (value) => {
  form.value.fieldValueOne = value?.map(item => item.boFireUserId)?.join(',')
  form.value.fieldText = `${form.value.label}：${value?.map(item => item.userName)?.join(',')}`
}

defineExpose({
  formRef,
})
</script>

<template>
  <div class="add-search">
    <div class="add-search-form">
      <div class="add-search-header">
        <h4>添加条件</h4>
        <div v-if="form.fieldKeyOne" class="add-search-add">
          <div @click="handleAdd">
            <van-icon name="plus" />
            添加
          </div>
        </div>
      </div>
      <van-form ref="formRef" :model="form" class="add-search-field">
        <template v-if="form.type === '1'">
          <van-field
            v-model="form.fieldValueOne"
            :label="`${form.label}：`"
            :label-width="`${form?.labelWidth}`"
            :maxlength="`${form.maxlength}`"
            :placeholder="`请输入${form?.label}`"
            :rules="[{ required: true, message: `请输入${form.label}` }]"
          />
        </template>
        <template v-if="form.type === '4' && form.mode === 'single'">
          <SelectSingle
            v-model:value="form.valueOne"
            :readonly="true"
            :required="false"
            :options="options[form.dict]"
            :field-names="form.field ? form.field : { value: 'value', label: 'label' }"
            :label="`${form.label}：`"
            :label-width="`${form?.labelWidth}`"
            :placeholder="`请选择${form.label}`"
            :title="`请选择${form.label}`"
            :rules="[{ required: true, message: `请输入${form.label}` }]"
            @change="onSingleChange"
          />
        </template>
        <template v-if="form.type === '4' && form.mode !== 'single'">
          <SelectMultiple
            v-model:value="form.valueOne"
            :readonly="true"
            :options="options[form.dict]"
            :field-names="form.field ? form.field : { value: 'value', label: 'label' }"
            :label="`${form.label}：`"
            :label-width="`${form?.labelWidth}`"
            :placeholder="`请选择${form.label}`"
            :title="`请选择${form.label}`"
            :rules="[{ required: true, message: `请输入${form.label}` }]"
            @change="onMultipleChange"
          />
        </template>
        <template v-if="form.type === '9'">
          <van-field
            :label="`${form.label}：`"
            :label-width="`${form?.labelWidth}`"
            :placeholder="`请选择${form.label}`"
            class="field-radio item-is-radio"
            :rules="[{ required: true, message: `请输入${form.label}` }]"
          >
            <template #input>
              <van-radio-group
                v-model="form.fieldValueOne"
                icon-size="14px"
                direction="horizontal"
                @change="onRadioChange"
              >
                <van-radio v-for="item in options[form.dict]" :key="item.boDictId" :name="item.boDictId">
                  {{ item.dictName }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </template>
        <template v-if="form.type === '10'">
          <SelectPerson
            v-model:value="form.valueOne"
            :readonly="true"
            :label="`${form.label}：`"
            :label-width="`${form?.labelWidth}`"
            :placeholder="`请选择${form.label}`"
            @change="onPersonChange"
          />
        </template>
        <template v-if="form.type === '11'">
          <SelectCar
            v-model:value="form.valueOne"
            :readonly="true"
            :label="`${form.label}：`"
            :label-width="`${form?.labelWidth}`"
            :placeholder="`请选择${form.label}`"
            @change="onCarChange"
          />
        </template>
        <!-- <Number v-if="form.type === '2'" />
        <Time v-if="form.type === '3'" />
        <Area v-if="form.type === '5'" />
        <Modal v-if="form.type === '6'" />
        <Cascader v-if="form.type === '7'" />
        <PeriodTime v-if="form.type === '8'" /> -->
      </van-form>
    </div>
    <div class="add-search-operate">
      <h4>添加运算符</h4>
      <div class="operate">
        <van-button
          v-for="item in options.fieldType"
          :key="item.boDictId"
          block
          size="small"
          @click="onChange(item)"
        >
          {{ item.dictName }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-search {
  display: flex;
  flex-direction: column;
  .add-search-header {
    display: flex;
    .add-search-add {
      color: #0072FF;
      margin-left: auto;
    }
  }
  .add-search-form {
    background-color: white;
    padding: 10px;
    margin-top: 10px;
    .add-search-field {
      :deep(.van-cell) {
        padding: 10px 0px;
      }
      :deep(.van-field__label--required::before) {
        content: '';
      }
    }
  }
  .add-search-operate {
    background-color: white;
    padding: 10px;
    margin-top: 10px;
    .operate {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      button {
        width: 30%;
        margin-top: 6px;
      }
    }
  }
}
</style>
