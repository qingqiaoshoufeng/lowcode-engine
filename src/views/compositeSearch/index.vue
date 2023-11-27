<script setup>
import { ref, provide } from 'vue'
import SearchBtn from './searchBtn.vue'
import SearchResult from './searchResult.vue'
import Form from './form.vue'
import { useFormConfig } from './config.js'
import { useOptions } from '@/hooks/useOptions.js'
import { useModal } from '@/hooks/useModal.js'

const { form, getSearchParams, initSearchParams, initFormByType, resetForm } = useFormConfig(options)

const { options } = useOptions();

const { show } = useModal();

const searchType = ref(1)

provide('form', form)

provide('searchType', searchType)

provide('options', options)

const searchCallback = () => {
  show.value.resultVisible = true
}
</script>

<template>
  <div class="composite-search">
    <van-tabs v-model:active="searchType">
      <van-tab title="警情" :name="1"></van-tab>
      <van-tab title="出动" :name="2"></van-tab>
      <van-tab title="指挥部出动" :name="3"></van-tab>
      <van-tab title="火灾" :name="4"></van-tab>
    </van-tabs>
    <Form />
    <SearchBtn @searchCallback="searchCallback" />

    <!-- 查询结果 -->
    <ProModal v-model:visible="show.resultVisible" :showHeader="false" title="查询结果">
      <SearchResult />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.composite-search {
  height: calc(100vh - 100px);
}
</style>
