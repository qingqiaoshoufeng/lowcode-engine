<script setup>
import { ref } from "vue";
import { useModal } from "@/hooks/useModal.js";
import { useOptions } from "@/hooks/useOptions.js";
import { useExcelConfig } from "./_config.js";
import { getRangeByCode } from "@/utils/_xlsxspread.min.js";
import { reportStyle, statType } from "@/utils/constants.js";
import {
  getReportTemplateList,
  getSourceOption,
  getTemplateParams,
  searchReportByDefine,
  searchReportByTemplate,
} from "@/apis/index.js";

const { show } = useModal();

const { luckyOption } = useExcelConfig();

const active = ref(0);

const handleSearch = () => {};

const handleReset = () => {};
</script>

<template>
  <div class="report-statistical-search">
    <van-tabs v-model:active="active">
      <van-tab title="固定报表"></van-tab>
      <van-tab title="自定义报表"></van-tab>
    </van-tabs>

    <div class="search-btn">
      <van-button type="primary" block> 查询 </van-button>
      <van-button type="primary" block style="margin-left: 20px">
        重置
      </van-button>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.report-statistical-search {
  .search-btn {
    display: flex;
    padding: 20px 20px;
  }
}
</style>
