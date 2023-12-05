<script setup>
import { inject, nextTick, onMounted, ref } from 'vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import { cloneDeep } from 'lodash-es'
import { checkBoxs } from './checkConfig'
import { addCollect, cancelCollect, getConfigList } from '@/apis/index.js'

const filterFormState = ref({
  configType: '1',
  configName: null,
})

const form = inject('form')

const addFormRef = inject('addFormRef')

const checked = ref(null)

const onRadio = (item) => {
  if (item?.id) {
    checked.value = item.id
    addFormRef.value.formRef.resetFields()
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

const handleAddCollect = async (id) => {
  const res = await addCollect({ id })
  showToast('收藏成功')
  handleSearchForm()
}

const handleCancelCollect = async (id) => {
  const res = await cancelCollect({ id, delFlag: 1 })
  showToast('取消收藏成功')
  handleSearchForm()
}

onMounted(() => {
  filterFormState.value.configType = cloneDeep(inject('activeKey')) || '1'
  handleSearchForm()
})
</script>

<template>
  <div class="search-params">
    <a-input-group compact>
      <a-select
        v-model:value="filterFormState.configType"
        :options="options.searchParams"
        :field-names="{ value: 'boDictId', label: 'dictName' }"
        placeholder="请选择警情等级"
        style="width: 150px"
        @change="handleSearchForm"
      />
      <a-input
        v-model:value="filterFormState.configName"
        placeholder="请输入要用的条件"
        allow-clear
        style="width: calc(100% - 200px)"
      />
      <a-button style="width: 50px;height: 34px;" type="primary" @click="handleSearchForm">
        <search-outlined />
      </a-button>
    </a-input-group>
    <div class="advance-search-list">
      <a-radio-group v-model:value="checked" button-style="solid">
        <div v-for="item in configList" :key="item.type">
          <a-divider orientation="left" orientation-margin="0px">
            <h4>
              <strong>{{ item.name }}</strong>
            </h4>
          </a-divider>
          <a-row :gutter="10">
            <a-col v-for="val in item.mySearchConfigList" :key="val.id" class="btn-item" :span="8">
              <a-radio-button :value="val.id" :title="val.configName" @click="onRadio(val)">
                {{ val.configName }}
              </a-radio-button>
              <StarFilled v-if="val.collectFlag === '1'" title="取消收藏" style="color: #FED547;" @click="handleCancelCollect(val.id)" />
              <StarOutlined v-else title="收藏" @click="handleAddCollect(val.id)" />
            </a-col>
          </a-row>
        </div>
      </a-radio-group>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search-params {
  height: calc(100vh - 238px);
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  :deep(.ant-input-group) {
    box-shadow: 0px 1px 4px 0px rgba(14, 22, 45, 0.1);
    .ant-select-selector,
    .ant-input-affix-wrapper {
      border-color: #9ac5f4;
      height: 34px;
    }
  }
  .advance-search-list {
    width: 100%;
    height: 100%;
    padding-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 20px;
    .ant-radio-group {
      width: 100%;
    }
    :deep(.ant-radio-button-wrapper) {
      border: none;
      border-radius: 4px;
      background: #f5f5f5;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      text-align: center;
      &.ant-radio-button-wrapper-checked {
        z-index: 0;
        background: @primary-color;
      }
    }
    .btn-item {
      margin-bottom: 10px;
      display: flex;
      font-size: 14px;
      align-items: center;
      .anticon-star {
        padding-left: 5px;
      }
    }
  }
}
.scrollBarStyle(advance-search-list);
</style>
