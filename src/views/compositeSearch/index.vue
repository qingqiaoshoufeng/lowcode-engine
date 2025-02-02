<script setup>
import { ref, provide, computed,nextTick  } from 'vue'
import SearchBtn from './searchBtn.vue'
import SearchResult from './searchResult.vue'
import ProModal from "@/component/ProModal/index";
import Form from './form.vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import { useFormConfig } from './config.js'
import { useOptions } from '@/hooks/useOptions.js'
import { useModal } from '@/hooks/useModal.js'

const props = defineProps({
  simple: {
    type: Boolean,
    default: false,
  },
});

const { form, getSearchParams, initSearchParams, initFormByType, resetForm } = useFormConfig()

const { show } = useModal();

const { options } = useOptions();

const searchInfo = ref({})

const queryParams = ref({})

const searchType = ref(1)

const searchDimension = ref(1)

const dataTimeSource = ref('')

provide('form', form)

provide('searchType', searchType)

provide('searchInfo', searchInfo)

provide('options', options)

provide('searchDimension', searchDimension)

provide('dataTimeSource', dataTimeSource)

const checkParams = () => {
  const { policeBase, fireBase, dispatchHeaderMessage, dispatchBase } = form.value
  if (searchType.value === 1 && (!policeBase.warningCode.value && !policeBase.warningDate.value?.[0])) {
    showToast('请先选择接警时间或输入警情编号！')
    return true
  }
  else if (searchType.value === 2 && (!dispatchBase.dispatchCode.value && !policeBase.warningDate.value?.[0])) {
    showToast('请先选择接警时间或输入出动编号！')
    return true
  }
  else if (searchType.value === 3 && (!dispatchHeaderMessage.dispatchCode.value && !policeBase.warningDate.value?.[0])) {
    showToast('请先选择接警时间或输入出动编号！')
    return true
  }
  else if (searchType.value === 4 && (!fireBase.fireCode.value && !fireBase.fireDate.value?.[0])) {
    showToast('请先选择起火时间或输入火灾编号！')
    return true
  }
}

const onSearchCallback = () => {
  if (checkParams()) {
    return
  }
  const { policeBase, fireBase } = form.value
  queryParams.value = getSearchParams(props.simple,searchType.value)
  queryParams.value.fireType = searchType.value
  queryParams.value.time = policeBase.warningDate.value || fireBase.fireDate.value
  const firstKeyMap = ['', 'comprehensiveWarningQueryReq', 'comprehensiveDispatchQueryReq', 'comprehensiveDispatchHeadQueryReq']
  const keyMap = ['', 'areaGroupStaticFlag', 'dispatchGroupOrgStaticFlag', 'fireHeadStaticFlag']
  if (queryParams.value.comprehensiveWarningQueryReq?.areaGroup) {
    queryParams.value.comprehensiveWarningQueryReq.areaGroupStaticFlag = searchDimension.value
  }
  if (queryParams.value.comprehensiveDispatchQueryReq?.dispatchGroupOrg) {
    queryParams.value.comprehensiveDispatchQueryReq.dispatchGroupOrgStaticFlag = searchDimension.value
  }
  if (queryParams.value.comprehensiveDispatchHeadQueryReq?.fireHead) {
    queryParams.value.comprehensiveDispatchHeadQueryReq.fireHeadStaticFlag = searchDimension.value
  }
  if (searchType.value < 4) {
    queryParams.value[firstKeyMap[searchType.value]][keyMap[searchType.value]] = searchDimension.value
  }
  // 设置查询的历史数据版本
  queryParams.value.dataTimeSource = dataTimeSource.value
  // 添加全局的双口径参数
  queryParams.value.staticFlag = searchDimension.value
  show.value.resultVisible = true
}

const getQueryParams = () => {
  return {
    fireType: searchType.value,
    comprehensiveWarningQueryReq: queryParams.value?.comprehensiveWarningQueryReq,
    comprehensiveDispatchQueryReq: queryParams.value?.comprehensiveDispatchQueryReq,
    comprehensiveDispatchHeadQueryReq: queryParams.value?.comprehensiveDispatchHeadQueryReq,
    comprehensiveFireQueryReq: queryParams.value?.comprehensiveFireQueryReq,
    dataTimeSource: dataTimeSource.value,
    staticFlag: searchDimension.value,
  }
}

provide('getQueryParams', getQueryParams)

const keyComputed = computed(() => {
  switch (searchType.value) {
    case 1:
      return 'policeMessage'
    case 2:
      return 'dispatchStationMessage'
    case 3:
      return 'dispatchMessage'
    case 4:
      return 'fireMessage'
    default:
      return ''
  }
})

const onSearchChange = () => { 
  initFormByType(searchType.value)
  if (keyComputed.value) {
    nextTick(() => {
      document?.querySelector('.composite-search-form')?.querySelector(`#${keyComputed.value}`)?.scrollIntoView({
        // behavior: 'smooth',
        block: 'start',
      })
    })
  }
}

const onInitCallback = (res) => {
  initSearchParams(res)
}

defineOptions({
  name: "CompositeSearch",
});
</script>

<template>
  <div class="composite-search">
    <van-tabs v-model:active="searchType" @change="onSearchChange"  @click-tab="resetForm">
      <van-tab title="警情" :name="1"></van-tab>
      <van-tab title="出动" :name="2"></van-tab>
      <van-tab title="指挥部出动" :name="3"></van-tab>
      <van-tab title="火灾" :name="4"></van-tab>
    </van-tabs>
    <Form :simple="simple" />
    <SearchBtn
      :search-scene="1"
      @search-callback="onSearchCallback"
      @init-callback="onInitCallback"
    />

    <!-- 查询结果 -->
    <ProModal v-model:visible="show.resultVisible" :showHeader="false" :showBack="true" title="查询结果">
      <SearchResult :params="queryParams" />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.composite-search {
  height: calc(100vh - 100px);
}
</style>
