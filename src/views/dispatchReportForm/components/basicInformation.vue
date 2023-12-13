<script setup>
import { ref, inject } from "vue";
import SelectSingle from "@/component/SelectSingle/index";
import { checkAttendanceDate, checkFireDistance, checkReturnSpeed, checkTrappedPerson } from '../tool.js'

const form = inject("form");

const options = inject("options");

const refreshField = inject('refreshField')

const fieldExist = inject('fieldExist')

const showPreview = inject('showPreview')

const showMainGroup = inject('showMainGroup')

const showNotDealReason = inject('showNotDealReason')

const showFireFighting = inject('showFireFighting')

const showFalsePolice = inject('showFalsePolice')

const showMidwayReturn = inject('showMidwayReturn')

const detail = inject('detail')

const onIsBlocking = (value) => {
  if (value === '2') {
    form.value.basicInformation.blockingTime.value = ''
  }
}

const onFireSituation = (value, option) => {
  if (option?.dictName) {
    form.value.basicInformation.fireSituation.text = option.dictName
  }
  else {
    form.value.basicInformation.fireSituation.text = ''
  }
}

const onDealSituation = (value, option) => {
  if (option?.dictName) {
    form.value.basicInformation.dealSituation.text = option.dictName
  }
  else {
    form.value.basicInformation.dealSituation.text = ''
  }
}
</script>

<template>
  <van-cell-group>
    <SelectSingle
      v-model:value="form.basicInformation.dealSituation.value"
      :showPreview="showPreview"
      name="dealSituation"
      required
      :options="options.dealSituation"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择处置情况"
      label="处置情况："
      placeholder="请选择处置情况"
      :rules="form.basicInformation.dealSituation.rules"
      @change="onDealSituation"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="处置情况："
          remark-field="dealSituation"
          field-module="basicInformation"
          :exist-data="fieldExist?.dealSituation"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectSingle>
    <van-field
      v-if="showNotDealReason"
      v-model="form.basicInformation.notDealReason.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      maxlength="100"
      required
      name="notDealReason"
      label="未处置原因："
      label-width="132px"
      placeholder="请输入未处置原因"
      :rules="form.basicInformation.notDealReason.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="未处置原因："
          remark-field="notDealReason"
          field-module="basicInformation"
          :exist-data="fieldExist?.notDealReason"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <van-field
      v-if="!showMidwayReturn"
      v-model="form.basicInformation.fireDistance.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="10"
      required
      name="fireDistance"
      label="行驶距离(公里)："
      label-width="132px"
      placeholder="请输入行驶距离"
      :rules="form.basicInformation.fireDistance.rules"
      @blur="checkFireDistance(form), checkAttendanceDate(form), checkReturnSpeed(form)"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="行驶距离(公里)："
          remark-field="fireDistance"
          field-module="basicInformation"
          :exist-data="fieldExist?.fireDistance"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <SelectSingle
      v-if="showFireFighting && !showMidwayReturn"
      v-model:value="form.basicInformation.fireSituation.value"
      :showPreview="showPreview"
      name="fireSituation"
      required
      :options="options.fireSituation"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择到场时火灾情况"
      label="到场时火灾情况："
      label-width="136px"
      placeholder="请选择到场时火灾情况"
      :rules="form.basicInformation.fireSituation.rules"
      @change="onFireSituation"
    > 
      <template v-slot:label="">
        <FieldAnnotation
          label="到场时火灾情况："
          remark-field="fireSituation"
          field-module="basicInformation"
          :exist-data="fieldExist?.fireSituation"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectSingle>
    <van-field
      v-if="showMainGroup && !showFalsePolice && !showMidwayReturn && !showNotDealReason"
      v-model="form.basicInformation.trappedPerson.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="10"
      required
      name="trappedPerson"
      label="现场被困人数(人)："
      label-width="144px"
      placeholder="请输入现场被困人数"
      :rules="form.basicInformation.trappedPerson.rules"
      @blur="checkTrappedPerson(detail, form)"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="现场被困人数(人)："
          remark-field="fireDistance"
          field-module="basicInformation"
          :exist-data="fieldExist?.fireDistance"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <!-- <SelectSingle
      v-if="showMainGroup && !showFalsePolice"
      v-model:value="form.basicInformation.industryDepartment.value"
      :showPreview="showPreview"
      name="industryDepartment"
      required
      :options="options.industryDepartment"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择行业主管部门"
      label="行业主管部门："
      label-width="120px"
      placeholder="请选择行业主管部门"
      :rules="form.basicInformation.industryDepartment.rules"
    /> -->
    <van-field
      v-if="showFireFighting"
      name="basicInformation.isBlocking.value"
      label="消防通道是否堵塞："
      label-width="142px"
      :rules="form.basicInformation.isBlocking.rules"
      required
      class="field-radio"
    >
      <template #input>
        <van-radio-group
          v-model="form.basicInformation.isBlocking.value"
          v-preview-text="showPreview"
          icon-size="16px"
          @change="onIsBlocking"
          direction="horizontal"
        >
          <van-radio name="1">是</van-radio>
          <van-radio name="2">否</van-radio>
        </van-radio-group>
      </template>
      <template v-slot:label="">
        <FieldAnnotation
          label="消防通道是否堵塞："
          remark-field="isBlocking"
          field-module="basicInformation"
          :exist-data="fieldExist?.isBlocking"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <van-field
      v-if="form.basicInformation.isBlocking.value === '1'"
      v-model="form.basicInformation.blockingTime.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="10"
      required
      name="blockingTime"
      label="疏通耗时(分钟)："
      label-width="128px"
      placeholder="请输入疏通耗时"
      :rules="form.basicInformation.blockingTime.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="疏通耗时(分钟)："
          remark-field="blockingTime"
          field-module="basicInformation"
          :exist-data="fieldExist?.blockingTime"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
  </van-cell-group>
</template>

<style lang="scss" scoped>
</style>
