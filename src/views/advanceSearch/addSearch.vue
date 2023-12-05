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
      <van-form ref="formRef" :model="form" label-align="left" layout="vertical" autocomplete="off">
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
