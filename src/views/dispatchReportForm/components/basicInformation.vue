<script setup>
import { ref, inject } from "vue";
import SelectSingle from "@/component/SelectSingle/index";

const form = inject("form");

const options = inject("options");

const showPreview = inject('showPreview')

const showMainGroup = inject('showMainGroup')

const showNotDealReason = inject('showNotDealReason')

const showFireFighting = inject('showFireFighting')

const showFalsePolice = inject('showFalsePolice')

const showMidwayReturn = inject('showMidwayReturn')
</script>

<template>
  <van-cell-group>
    <SelectSingle
      v-model:value="form.basicInformation.dealSituation.value"
      :showPreview="showPreview"
      :readonly="true"
      name="dealSituation"
      required
      :options="options.dealSituation"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择处置情况"
      label="处置情况："
      placeholder="请选择处置情况"
      :rules="form.basicInformation.dealSituation.rules"
    />
    <SelectSingle
      v-if="showNotDealReason"
      v-model:value="form.basicInformation.notDealReason.value"
      :showPreview="showPreview"
      :readonly="true"
      name="notDealReason"
      required
      :options="options.notDealReason"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择未处置原因"
      label="未处置原因："
      placeholder="请选择未处置原因"
      :rules="form.basicInformation.notDealReason.rules"
    />
    <SelectSingle
      v-if="showFireFighting && !showMidwayReturn"
      v-model:value="form.basicInformation.fireSituation.value"
      :showPreview="showPreview"
      :readonly="true"
      name="fireSituation"
      required
      :options="options.fireSituation"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择到场时火灾情况"
      label="到场时火灾情况："
      label-width="136px"
      placeholder="请选择到场时火灾情况"
      :rules="form.basicInformation.fireSituation.rules"
    />
    <SelectSingle
      v-if="showMainGroup && !showFalsePolice"
      v-model:value="form.basicInformation.industryDepartment.value"
      :showPreview="showPreview"
      :readonly="true"
      name="industryDepartment"
      required
      :options="options.industryDepartment"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择行业主管部门"
      label="行业主管部门："
      label-width="120px"
      placeholder="请选择行业主管部门"
      :rules="form.basicInformation.industryDepartment.rules"
    />
  </van-cell-group>
</template>

<style lang="scss" scoped>
</style>
