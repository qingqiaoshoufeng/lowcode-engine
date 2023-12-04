<script setup>
import { ref, provide, computed } from 'vue'
import SearchBtn from './searchBtn.vue'
import SearchResult from './searchResult.vue'
import ProModal from "@/component/ProModal/index";
import Form from './form.vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import { useFormConfig } from './config.js'
import { useOptions } from '@/hooks/useOptions.js'
import { useModal } from '@/hooks/useModal.js'

const { form, getSearchParams, initSearchParams, initFormByType, resetForm } = useFormConfig()

const { show } = useModal();

const { options } = useOptions();

const searchInfo = ref({})

const queryParams = ref({})

const searchType = ref(1)

const searchDimension = ref(2)

const dataTimeSource = ref('')

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

provide('form', form)

provide('searchType', searchType)

provide('searchInfo', searchInfo)

provide('options', options)

provide('searchDimension', searchDimension)

provide('dataTimeSource', dataTimeSource)

const onSearchCallback = () => {
  const { policeBase, fireBase } = form.value
  if (!policeBase.warningDate.value?.[0] && !fireBase.fireDate.value?.[0]) {
    showToast('请先选择接警时间或起火时间！')
    return
  }
  queryParams.value = getSearchParams()
  queryParams.value.fireType = searchType.value
  queryParams.value.time = policeBase.warningDate.value || fireBase.fireDate.value
  const firstKeyMap = ['', 'comprehensiveWarningQueryReq', 'comprehensiveDispatchQueryReq', 'comprehensiveDispatchHeadQueryReq']
  const keyMap = ['', 'areaGroupStaticFlag', 'dispatchGroupOrgStaticFlag', 'fireHeadStaticFlag']
  if (searchType.value < 4) {
    queryParams.value[firstKeyMap[searchType.value]][keyMap[searchType.value]] = searchDimension.value
  }
  // 设置查询的历史数据版本
  queryParams.value.dataTimeSource = dataTimeSource.value
  // 添加全局的双口径参数
  queryParams.value.staticFlag = searchDimension.value
  show.value.resultVisible = true
}

const onSearchChange = () => {
  initFormByType(searchType.value)
  // if (keyComputed.value) {
  //   nextTick(() => {
  //     document?.querySelector('.composite-search-form')?.querySelector(`#${keyComputed.value}-title`)?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     })
  //   })
  // }
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
    <van-tabs v-model:active="searchType" @change="onSearchChange">
      <van-tab title="警情" :name="1"></van-tab>
      <van-tab title="出动" :name="2"></van-tab>
      <van-tab title="指挥部出动" :name="3"></van-tab>
      <van-tab title="火灾" :name="4"></van-tab>
    </van-tabs>
    <Form />
    <SearchBtn
      :search-scene="1"
      @searchCallback="onSearchCallback"
      @initCallback="onInitCallback"
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
