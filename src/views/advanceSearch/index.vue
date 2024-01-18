<script setup>
import { ref, provide, computed, nextTick } from 'vue'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { checkBoxs, validateList } from './checkConfig.js'
import SearchBtn from './searchBtn.vue'
import SearchResult from '@/views/compositeSearch/searchResult.vue'
import ProModal from "@/component/ProModal/index";
import SelectSearch from './selectSearch.vue'
import Form from './form.vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import { deleteAdvanceSearch, getAdvanceSearchDetail, getAdvanceSearchList, getAdvanceSearchResult } from '@/apis/index.js'
import { checkInputRejectState, checkRejectState, formatYmdHm, generateByKeyValue, generateColorByState } from '@/utils/tools.js'
import { useOptions } from '@/hooks/useOptions.js'
import { useModal } from '@/hooks/useModal.js'

const { show } = useModal();

const { options } = useOptions();

const search = ref(1)

const searchInfo = ref({})

const queryParams = ref({})

const searchDimension = ref(2)

const dataTimeSource = ref('')

const activeKey = ref('1')

const list = ref([])

const formRef = ref(null)

const searchType = computed(() => {
  return Number(activeKey.value)
})

const filterFormState = ref({
  configType: '1',
  configName: null,
})

const form = ref({
  valueOne: [],
  valueTwo: null,
  fireType: null,
  fieldFlag: '1',
  fieldValueOne: null,
  fieldValueTwo: null,
  fieldKeyOne: null,
  fieldKeyTwo: null,
})

provide('list', list)

provide('search', search)

provide('activeKey', activeKey)

provide('searchType', searchType)

provide('filterFormState', filterFormState)

provide('form', form)

provide('searchInfo', searchInfo)

provide('options', options)

provide('show', show)

provide('searchDimension', searchDimension)

provide('dataTimeSource', dataTimeSource)

const onInitCallback = (row) => {
  getAdvanceSearchDetail(row.boSearchId).then((res) => {
    if (res?.boSearchId) {
      activeKey.value = res?.searchType
      nextTick(() => {
        const resList = []
        res.searchItems.forEach((ele) => {
          ele.date = uuidv4()
          if (ele.fieldFlag === '2') {
            ele.fieldText = ele.text
            resList.push(ele)
          }
          else {
            const obj = checkBoxs.find(val => val.fieldKeyOne === ele.fieldKeyOne && (!val.fireType || val.fireType === ele.fireType))
            if (obj) {
              const data = { ...ele, ...obj }
              if (obj.type === '2') {
                data.valueOne = [ele.fieldValueOne === `${minNumber.value}` ? null : ele.fieldValueOne, ele.fieldValueTwo === `${maxNumber.value}` ? null : ele.fieldValueTwo]
              }
              if (obj.type === '3' || obj.type === '8') {
                data.valueOne = [ele.fieldValueOne, ele.fieldValueTwo]
              }
              if (obj.type === '4' || obj.type === '5') {
                data.valueOne = ele.fieldValueOne?.split(',')
              }
              if (obj.type === '6') {
                data.valueOne = ele.fieldValueOne
                  ? generateByKeyValue(ele.text?.split('：')[1], ele.fieldValueOne, {
                    key: 'name',
                    value: 'organizationid',
                  }, 'Number')
                  : []
              }
              if (obj.type === '7') {
                data.valueOne = JSON.parse(ele.fieldValueOne)
              }
              if (obj.type === '8') {
                data.edit = '1'
                if (ele.fieldKeyThree === 'statisticRangeHoliday') {
                  data.valueTwo = ele.fieldValueThree
                }
                else {
                  data.valueTwo = [ele.fieldValueThree, ele.fieldValueFour]
                }
                if (ele.fieldKeyThree === 'statisticRangeSeasonMin') {
                  data.edit = '2'
                }
                if (ele.fieldKeyThree === 'statisticRangeMonthMin') {
                  data.edit = '3'
                }
                if (ele.fieldKeyThree === 'statisticRangeDayMin') {
                  data.edit = '4'
                }
                if (ele.fieldKeyThree === 'statisticRangeHourMin') {
                  data.edit = '5'
                }
              }
              data.fieldText = ele.text
              resList.push(data)
            }
          }
        })
        list.value = resList
      })
    }
  })
}

const getListParams = () => {
  const params = []
  list.value.forEach((val) => {
    const { fireType, fieldFlag, fieldType, fieldValueOne, fieldValueTwo, fieldKeyOne, fieldKeyTwo, fieldValueThree, fieldValueFour, fieldKeyThree, fieldKeyFour } = val
    params.push({ fireType, fieldFlag, fieldType, fieldValueOne, fieldValueTwo, fieldKeyOne, fieldKeyTwo, fieldValueThree, fieldValueFour, fieldKeyThree, fieldKeyFour, text: val.fieldText })
  })
  return params
}

const checkConfigType = () => {
  let flag = true
  list.value.forEach((i) => {
    if (i.fireType !== '4' && i.fieldFlag === '1') {
      flag = false
    }
  })
  return activeKey.value === '4' && flag ? '1' : '0'
}

const getFormParams = () => {
  return {
    dataTimeSource: dataTimeSource.value,
    staticFlag: searchDimension.value,
    fireType: search.value,
    seniorQueryDetailReq: getListParams(),
    noFireFlag: checkConfigType(),
  }
}

provide('getSearchParams', getFormParams)

const onSearchCallback = () => {
  const flag = validateList(list.value, activeKey.value)
  if (flag) {
    queryParams.value = {
      fireType: activeKey.value,
      seniorQueryDetailReq: getListParams(),
      noFireFlag: checkConfigType(),
    }
    nextTick(() => {
      search.value = Number(queryParams.value.fireType)
      const keyMap = ['areaGroup', 'dispatchOrg', 'fireHead']
      const valueMap = ['', 'static', 'migration']
      queryParams.value.seniorQueryDetailReq.forEach((item) => {
        keyMap.includes(item.fieldKeyOne) && (item.fieldKeyTwo = valueMap[searchDimension.value])
      })
      // 设置查询的历史数据版本
      queryParams.value.dataTimeSource = dataTimeSource.value
      // 添加全局的双口径参数
      queryParams.value.staticFlag = searchDimension.value
      show.value.resultVisible = true
    })
  }
}

const onSearchChange = () => {
  filterFormState.value.configType = activeKey.value
  filterFormState.value.configName = ''
  searchDimension.value = 2
  dataTimeSource.value = ''
  list.value = []
  formRef.value.searchFormRef.handleSearchForm()
}

defineOptions({
  name: "AdvanceSearch",
});
</script>

<template>
  <div class="advance-search">
    <van-tabs v-model:active="activeKey" @change="onSearchChange">
      <van-tab title="警情" name="1"></van-tab>
      <van-tab title="出动" name="2"></van-tab>
      <van-tab title="指挥部出动" name="3"></van-tab>
      <van-tab title="火灾" name="4"></van-tab>
    </van-tabs>

    <div class="advance-form">
      <Form ref="formRef" />
    </div>
    
    <SearchBtn
      :search-scene="2"
      @searchCallback="onSearchCallback"
      @initCallback="onInitCallback"
    />

    <!-- 已选中条件 -->
    <SelectSearch />
    <!-- 查询结果 -->
    <ProModal v-model:visible="show.resultVisible" :showHeader="false" :showBack="true" title="查询结果">
      <SearchResult :type="2" :params="queryParams" />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.advance-search {
  height: calc(100vh - 100px);
}
</style>
