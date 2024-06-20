<script setup>
import { ref, inject } from "vue";
import SelectSingle from "@/component/SelectSingle/index";
import { checkAttendanceDate, checkFireDistance, checkReturnSpeed, checkTrappedPerson } from '../tool.js'
import { useStore } from "vuex";
import { showToast, showLoadingToast, closeToast } from "vant";

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

const initDispatchDetail = inject('initDispatchDetail')

const store = useStore()

const trappedConfig = store.state.rules.ruleConfig.trappedConfig

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
  if (initDispatchDetail.value.isFirst === '1' && form.value.basicInformation.dealSituation.text === '中途返回') {
    form.value.basicInformation.dealSituation.value = undefined
    form.value.basicInformation.dealSituation.text = ''
    showToast('首到队伍不能选择中途返回')
  }
}
</script>

<template>
  <van-cell-group>
    <SelectSingle
      v-model:value="form.basicInformation.dealSituation.value"
      :showPreview="showPreview"
      name="basicInformation.dealSituation.value"
      required
      :options="options.dealSituation"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择处置情况"
      label="处置情况："
      placeholder="请选择处置情况"
      :disabled="initDispatchDetail?.dispatchArriveFlag === '2' || initDispatchDetail?.returnWarningFlag === '1'"
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
      :readonly="showPreview"
      maxlength="100"
      required
      name="basicInformation.notDealReason.value"
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
      :readonly="showPreview"
      type="number"
      maxlength="10"
      required
      name="basicInformation.fireDistance.value"
      label="行驶距离(公里)："
      label-width="132px"
      placeholder="请输入行驶距离"
      :rules="form.basicInformation.fireDistance.rules"
      @blur="checkFireDistance(form), checkAttendanceDate(form), checkReturnSpeed(form)"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="行驶距离(公里)："
          :isWarning="form.basicInformation.fireDistance.warning"
          remark-field="fireDistance"
          field-module="basicInformation"
          :exist-data="fieldExist?.fireDistance"
          @refresh-callback="refreshField"
          :warningTip="form.basicInformation.fireDistance.warningText"
        />
      </template>
    </van-field>
    <SelectSingle
      v-if="showFireFighting && !showMidwayReturn"
      v-model:value="form.basicInformation.fireSituation.value"
      :showPreview="showPreview"
      name="basicInformation.fireSituation.value"
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
      :readonly="showPreview"
      type="number"
      maxlength="10"
      required
      name="basicInformation.trappedPerson.value"
      label="现场被困人数(人)："
      label-width="144px"
      placeholder="请输入现场被困人数"
      :rules="form.basicInformation.trappedPerson.rules"
      @blur="checkTrappedPerson(detail, form)"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="现场被困人数(人)："
          :isWarning="form.basicInformation.trappedPerson.warning"
          remark-field="fireDistance"
          field-module="basicInformation"
          :exist-data="fieldExist?.trappedPerson"
          @refresh-callback="refreshField"
          :warningTip="`一级警情或轻微火灾，被困人数合理范围为${trappedConfig?.value?.[0]}-${trappedConfig?.value?.[1]}人，请修改或备注！`"
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
      name="basicInformation.blockingTime.value"
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
