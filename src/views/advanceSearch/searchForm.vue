<script setup>
import { inject, nextTick, onMounted, ref } from 'vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import SelectSingle from '@/component/SelectSingle/index.vue';
import { cloneDeep } from 'lodash-es'
import { debounce } from 'throttle-debounce'
import { checkBoxs } from './checkConfig'
import { addCollect, cancelCollect, getConfigList } from '@/apis/index.js'

const filterFormState = inject('filterFormState')

const form = inject('form')

const addFormRef = inject('addFormRef')

const checked = ref(null)

const onRadio = (item) => {
  if (item?.id) {
    checked.value = item.id
    addFormRef.value.formRef.resetValidation()
    form.value = {}
    nextTick(() => {
      const obj = checkBoxs.find(val => val.fieldKeyOne === item.configEnName && (!val.fireType || val.fireType === item.configType))
      form.value = {
        ...obj,
        fireType: item.configType === '0' ? '1' : filterFormState.value.configType, // 比如接警时间是各个模块公用的，不应该跟选择的tab key有关
        fieldFlag: '1',
        valueOne: [],
        valueTwo: null,
        edit: '1',
      }
      // 出动信息（队站）--伤亡情况（受伤/死亡）
      if (obj?.fieldKeyOne === 'injuryType' && item.configType === '2') {
        form.value.dict = 'minorInjury'
      }
    })
  }
}
const options = inject('options')

const configList = ref([])

const handleSearchForm = () => {
  getConfigList(filterFormState.value).then((res) => {
    configList.value = res
    onRadio(res[0]?.mySearchConfigList[0])
  })
}

const startSearchFn = debounce(1000, handleSearchForm)

onMounted(() => {
  filterFormState.value.configType = cloneDeep(inject('activeKey')) || '1'
  handleSearchForm()
})
</script>

<template>
  <div class="search-form">
    <div class="search-form-header">
      <SelectSingle
        v-model:value="filterFormState.configType"
        :options="options.searchParams"
        :field-names="{ value: 'boDictId', label: 'dictName' }"
        placeholder="请选择查询类型"
        style="width: 100px;"
        @change="handleSearchForm"
      />
      <van-field
        v-model="filterFormState.configName"
        maxlength="50"
        name="configName"
        placeholder="请输入要用的条件"
        style="width: calc(100% - 105px)"
        @input="startSearchFn"
      />
    </div>
    <div class="search-form-list">
      <van-radio-group v-model="checked">
        <div v-for="item in configList" :key="item.type">
          <h4 style="margin-bottom: 6px;">
            <strong>{{ item.name }}</strong>
          </h4>
          <div class="search-form-wrapper">
            <div v-for="val in item.mySearchConfigList" :key="val.id" class="btn-item">
              <van-radio :value="val.id" :name="val.id" @click="onRadio(val)">
                {{ val.configName }}
              </van-radio>
            </div>
          </div>
        </div>
      </van-radio-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 6px;
  background-color: white;
  .search-form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #F5F5F5;
  }
  .search-form-list {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    .search-form-wrapper {
      display: flex;
      flex-wrap: wrap;
    }
    .btn-item {
      width: 50%;
      margin-bottom: 10px;
      display: flex;
      font-size: 14px;
      align-items: center;
      :deep(.van-radio__icon) {
        display: none;
      }
      [aria-checked="true"] {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 2px 4px;
        margin-right: 4px;
        border-radius: 2px;
        background-color: #2F6BFF;
        border: 1px solid #2F6BFF;
        :deep(.van-radio__label) {
          color: white;
          margin-left: 0px;
        }
      }
      [aria-checked="false"] {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 2px 4px;
        margin-right: 4px;
        border-radius: 2px;
        background-color: #F5F5F5;
        border: 1px solid #F5F5F5;
        :deep(.van-radio__label) {
          color: #333333;
          margin-left: 0px;
        }
      }
    }
  }
}
</style>
