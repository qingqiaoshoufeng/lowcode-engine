<script setup>
import { ref, provide, computed } from 'vue'
import SearchBtn from '@/views/compositeSearch/searchBtn.vue'
import SearchResult from '@/views/compositeSearch/searchResult.vue'
import ProModal from "@/component/ProModal/index";
import { showToast, showLoadingToast, closeToast } from "vant";
// import { useFormConfig } from './config.js'
import { useOptions } from '@/hooks/useOptions.js'
import { useModal } from '@/hooks/useModal.js'

const { show } = useModal();

const { options } = useOptions();

const searchInfo = ref({})

const queryParams = ref({})

const searchType = ref(1)

const searchDimension = ref(2)

const dataTimeSource = ref('')

// provide('form', form)

provide('searchType', searchType)

provide('searchInfo', searchInfo)

provide('options', options)

provide('searchDimension', searchDimension)

provide('dataTimeSource', dataTimeSource)

const onSearchCallback = () => {

}

const onSearchChange = () => {
  
}

const onInitCallback = (res) => {
  // initSearchParams(res)
}

defineOptions({
  name: "AdvanceSearch",
});
</script>

<template>
  <div class="advance-search">
    <van-tabs v-model:active="searchType" @change="onSearchChange">
      <van-tab title="警情" :name="1"></van-tab>
      <van-tab title="出动" :name="2"></van-tab>
      <van-tab title="指挥部出动" :name="3"></van-tab>
      <van-tab title="火灾" :name="4"></van-tab>
    </van-tabs>
    
    <SearchBtn
      :search-scene="2"
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
.advance-search {
  height: calc(100vh - 100px);
}
</style>
