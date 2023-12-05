<script setup>
import { ref, provide, computed, nextTick } from 'vue'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { checkBoxs } from './checkConfig.js'
import SearchBtn from './searchBtn.vue'
import SearchResult from '@/views/compositeSearch/searchResult.vue'
import ProModal from "@/component/ProModal/index";
import SelectSearch from './selectSearch.vue'
import Form from './form.vue'
import { showToast, showLoadingToast, closeToast } from "vant";
// import { useFormConfig } from './config.js'
import { deleteAdvanceSearch, getAdvanceSearchDetail, getAdvanceSearchList, getAdvanceSearchResult } from '@/apis/index.js'
import { useOptions } from '@/hooks/useOptions.js'
import { useModal } from '@/hooks/useModal.js'

const { show } = useModal();

const { options } = useOptions();

const searchFormRef = ref([])

const searchInfo = ref({})

const queryParams = ref({})

const searchDimension = ref(2)

const dataTimeSource = ref('')

const activeKey = ref('1')

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

provide('activeKey', activeKey)

provide('form', form)

provide('searchInfo', searchInfo)

provide('options', options)

provide('show', show)

provide('searchDimension', searchDimension)

provide('dataTimeSource', dataTimeSource)

const getSearchParams = () => {
  return searchFormRef.value[search.value - 1].getFormParams()
}

const onInitCallback = (row) => {
  getAdvanceSearchDetail(row.boSearchId).then((res) => {
    if (res?.boSearchId) {
      activeKey.value = res?.searchType
      nextTick(() => {
        const list = []
        res.searchItems.forEach((ele) => {
          ele.date = uuidv4()
          if (ele.fieldFlag === '2') {
            ele.fieldText = ele.text
            list.push(ele)
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
              list.push(data)
            }
          }
        })
        searchFormRef.value[res?.searchType - 1].list = list
      })
    }
  })
}

const onSearchCallback = () => {

}

const onSearchChange = () => {
  
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
      <Form />
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
      <SearchResult :params="queryParams" />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.advance-search {
  height: calc(100vh - 100px);
}
</style>
