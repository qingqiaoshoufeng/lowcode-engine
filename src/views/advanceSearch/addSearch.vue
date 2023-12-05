<script setup>
import { inject, ref } from 'vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import { cloneDeep } from 'lodash-es'
import { getSearchParams, validateForm } from './checkConfig.js'
// import Time from './components/_time.vue'
// import PeriodTime from './components/_period-time.vue'
// import Input from './components/_input.vue'
// import Select from './components/_select.vue'
// import Modal from './components/_modal.vue'
// import Cascader from './components/_cascader.vue'
// import Area from './components/_area.vue'
// import Number from './components/_number.vue'
// import Radio from './components/_radio.vue'
// import Person from './components/_person.vue'
// import Car from './components/_car.vue'

const formRef = ref(null)

const countForm = ref({
  fieldFlag: '2',
})

const form = inject('form')
const list = inject('list')
const options = inject('options')

const handleAdd = () => {
  formRef.value.validate().then(async (values) => {
    if (values) {
      form.value = getSearchParams(form.value)
      const flag = validateForm(list.value, form.value)
      if (flag) {
        list.value.push(cloneDeep(form.value))
      }
    }
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

defineExpose({
  formRef,
})
</script>

<template>
  <div class="add-search">
    <double-right-outlined class="right" />
    <div class="add-search-form">
      <a-divider type="vertical" class="title-divider">
        <span>添加条件</span>
      </a-divider>
      <a-form ref="formRef" :model="form" label-align="left" layout="vertical" autocomplete="off">
        <!-- <Input v-if="form.type === '1'" />
        <Number v-if="form.type === '2'" />
        <Time v-if="form.type === '3'" />
        <Select v-if="form.type === '4'" />
        <Area v-if="form.type === '5'" />
        <Modal v-if="form.type === '6'" />
        <Cascader v-if="form.type === '7'" />
        <PeriodTime v-if="form.type === '8'" />
        <Radio v-if="form.type === '9'" />
        <Person v-if="form.type === '10'" />
        <Car v-if="form.type === '11'" /> -->
      </a-form>
      <div v-if="form.fieldKeyOne" style="text-align: right;">
        <a-button type="primary" @click="handleAdd">
          添加
        </a-button>
      </div>
    </div>
    <double-right-outlined />
    <a-divider type="vertical" style="height: 100%;" />
    <div>
      <a-button v-for="item in options.fieldType" :key="item.boDictId" block @click="onChange(item)">
        {{ item.dictName }}
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.title-divider {
  height: 22px;
  margin-bottom: 10px;
  border-left: 4px solid @primary-color;
  font-weight: bold;
}
.add-search {
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.2);
  height: 260px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  .add-search-form {
    height: 100%;
    flex: 1;
    min-width: 0;
    padding-right: 20px;
  }
  .anticon-double-right.right {
    position: absolute;
    left: -40px;
    display: flex;
    width: 40px;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
  .ant-btn.ant-btn-block{
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
}
</style>
