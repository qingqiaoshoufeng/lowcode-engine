<script setup>
import { computed, inject } from "vue";
import { checkDispatchNum, checkDispatchTruckList, checkIsResponseTruck } from "../tool.js";
import { positiveIntegerReg } from "@/utils/validate.js";
import SelectMultiple from "@/component/SelectMultiple/index";
import SelectCar from "@/component/SelectCar/index";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

const options = inject("options");

const showDraft = inject("showDraft");

const showMidwayReturn = inject("showMidwayReturn");

const showDealSituation = inject("showDealSituation");

const deptMembersOptions = inject("deptMembersOptions");

const personNum = computed(() => {
  if (form.value.investForce.commander?.value || form.value.investForce.firemen?.value) {
    return (
      form.value.investForce.commander?.value?.length +
      form.value.investForce.firemen?.value?.length
    );
  }
  return "";
});

const onResponseTruck = (e) => {
  if (e === "2") {
    form.value.investForce.dispatchTruckList.value = undefined;
    form.value.investForce.midwayCar.value = undefined;
    form.value.investForce.isReturnTruck.value = "2";
  }
  if (e === "1" && showMidwayReturn.value) {
    form.value.investForce.isReturnTruck.value = "1";
    form.value.investForce.isReturnTruck.disabled = true;
    form.value.investForce.midwayCar.disabled = true;
  }

  checkDispatchNum(form.value);

  checkIsResponseTruck(form.value);

  checkDispatchTruckList(form.value);
};

const onReturnTruck = (e) => {
  if (e === "2") {
    form.value.investForce.midwayCar.value = undefined;
  }
};

const onDispatchTruck = (value, items) => {
  checkDispatchTruckList(form.value);

  if (form.value.investForce.isResponseTruck.value === "1" && showMidwayReturn.value) {
    form.value.investForce.isReturnTruck.value = '1'
    form.value.investForce.midwayCar.value = form.value.investForce.dispatchTruckList.value?.map((item) => {
      return {
        ...item,
        key: item.boFireTruckId,
        value: item.boFireTruckId,
        label: item.truckNumber,
      }
    });
  } else {
    form.value.investForce.midwayCar.value = undefined;
    form.value.investForce.isReturnTruck.value = '2'
  }

  OnCarNum()
};

const onMidwayCarTruck = (value, items) => {
  form.value.investForce.midwayCar.list = items
}

const OnCarNum = () => {
  checkDispatchNum(form.value);

  checkIsResponseTruck(form.value);
};
</script>

<template>
  <van-cell-group>
    <div class="invest-message">
      共投入 {{ form.investForce?.dispatchTruckList.value?.length || 0 }} 车 {{ personNum || 0 }} 人
    </div>
    <van-field
      name="investForce.isResponseTruck.value" 
      label="是否有车辆出动："
      label-width="122px"
      required
      :rules="form.investForce.isResponseTruck.rules"
      class="field-radio"
    >
      <template #input>
        <van-radio-group
          v-model="form.investForce.isResponseTruck.value"
          v-preview-text="showPreview"
          icon-size="16px"
          direction="horizontal"
          @change="onResponseTruck"
        >
          <van-radio name="1">是</van-radio>
          <van-radio name="2">否</van-radio>
        </van-radio-group>
      </template>
      <template v-slot:label="">
        <FieldAnnotation
          label="是否有车辆出动："
          remark-field="isInjured"
          field-module="casualtyWar"
          :exist-data="fieldExist?.isInjured"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <template v-if="form.investForce.isResponseTruck.value === '1'">
      <SelectCar
        v-model:value="form.investForce.dispatchTruckList.value"
        :showPreview="showPreview"
        required
        name="dispatchTruckList"
        :rules="form.investForce.dispatchTruckList.rules"
        :readonly="true"
        label="消防车辆信息："
        label-width="112px"
        placeholder="请选择消防车辆信息"
        @change="onDispatchTruck"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="消防车辆信息："
            remark-field="dispatchTruckList"
            field-module="investForce"
            :exist-data="fieldExist?.dispatchTruckList"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectCar>
    </template>
    <template v-if="form.investForce.isResponseTruck.value === '1' && !showMidwayReturn">
      <van-field
        name="investForce.isReturnTruck.value"
        label="是否有车辆中途返回："
        required
        :rules="form.investForce.isReturnTruck.rules"
        class="field-radio"
      >
        <template #input>
          <van-radio-group
            v-model="form.investForce.isReturnTruck.value"
            v-preview-text="showPreview"
            :disabled="form.investForce.isReturnTruck.disabled"
            icon-size="16px"
            direction="horizontal"
            @change="onReturnTruck"
          >
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
        <template v-slot:label="">
          <FieldAnnotation
            label="是否有车辆中途返回："
            remark-field="isReturnTruck"
            field-module="investForce"
            :exist-data="fieldExist?.isReturnTruck"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
    </template>
    <template v-if="form.investForce.isReturnTruck.value === '1' && !showMidwayReturn">
      <SelectMultiple
        v-model:value="form.investForce.midwayCar.value"
        :showPreview="showPreview"
        :readonly="showPreview"
        required
        name="midwayCar"
        :options="form.investForce.dispatchTruckList.value"
        :field-names="{ value: 'boFireTruckId', label: 'truckNumber' }"
        :rules="form.investForce.midwayCar.rules"
        :disabled="form.investForce.midwayCar.disabled"
        label="中途返回车辆信息："
        label-width="152px"
        placeholder="请选择中途返回车辆信息"
        title="请选择中途返回车辆信息"
        @change="onMidwayCarTruck"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="中途返回车辆信息："
            remark-field="midwayCar"
            field-module="investForce"
            :exist-data="fieldExist?.midwayCar"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectMultiple>
    </template>
    <SelectMultiple
      v-model:value="form.investForce.groupLeader.value"
      :showPreview="showPreview"
      :readonly="showPreview"
      required
      name="groupLeader"
      :options="deptMembersOptions"
      :field-names="{ value: 'userId', label: 'userNameJob' }"
      :rules="form.investForce.groupLeader.rules"
      :disabled="form.investForce.groupLeader.disabled"
      label="带队指挥员："
      label-width="102px"
      placeholder="请选择带队指挥员"
      title="请选择带队指挥员"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="带队指挥员："
          remark-field="groupLeader"
          field-module="investForce"
          :exist-data="fieldExist?.groupLeader"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectMultiple>
    <SelectMultiple
      v-model:value="form.investForce.commander.value"
      :showPreview="showPreview"
      :readonly="showPreview"
      required
      name="commander"
      :options="options.commander"
      :field-names="{ value: 'userId', label: 'userNameJob' }"
      :rules="form.investForce.commander.rules"
      :disabled="form.investForce.commander.disabled"
      label="指挥员："
      placeholder="请选择指挥员"
      title="请选择指挥员"
      @blur="OnCarNum"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="指挥员："
          remark-field="commander"
          field-module="investForce"
          :exist-data="fieldExist?.commander"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectMultiple>
    <SelectMultiple
      v-model:value="form.investForce.firemen.value"
      :showPreview="showPreview"
      :readonly="showPreview"
      required
      name="firemen"
      :options="options.firemen"
      :field-names="{ value: 'userId', label: 'userNameJob' }"
      :rules="form.investForce.firemen.rules"
      :disabled="form.investForce.firemen.disabled"
      label="消防员："
      placeholder="请选择消防员"
      title="请选择消防员"
      @blur="OnCarNum"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="消防员："
          remark-field="firemen"
          field-module="investForce"
          :exist-data="fieldExist?.firemen"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectMultiple>
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.fireBoatNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="digit"
      maxlength="20"
      name="fireBoatNum"
      label="艇(艘)："
      placeholder="请输入艇数量"
      :rules="form.investForce.fireBoatNum.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="艇(艘)："
          remark-field="fireBoatNum"
          field-module="investForce"
          :exist-data="fieldExist?.fireBoatNum"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.fireAirplaneNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="digit"
      maxlength="20"
      name="fireAirplaneNum"
      label="消防直升机(架)："
      label-width="120px"
      placeholder="请输入消防直升机数量"
      :rules="form.investForce.fireAirplaneNum.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="消防直升机(架)："
          remark-field="fireAirplaneNum"
          field-module="investForce"
          :exist-data="fieldExist?.fireAirplaneNum"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.rescueDogNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="digit"
      maxlength="20"
      name="rescueDogNum"
      label="搜救犬(只)："
      label-width="104px"
      placeholder="请输入搜救犬数量"
      :rules="form.investForce.rescueDogNum.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="搜救犬(只)："
          remark-field="rescueDogNum"
          field-module="investForce"
          :exist-data="fieldExist?.rescueDogNum"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.uavNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="digit"
      maxlength="20"
      name="uavNum"
      label="无人机(架)："
      label-width="104px"
      placeholder="请输入无人机数量"
      :rules="form.investForce.uavNum.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="无人机(架)："
          remark-field="uavNum"
          field-module="investForce"
          :exist-data="fieldExist?.uavNum"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
  </van-cell-group>
</template>

<style lang="scss" scoped>
.invest-message {
  color: red;
  padding: 12px 0 0 20px;
}
.field-radio-label {
  :deep(.van-cell__title) {
    flex: unset;
    margin-right: 10px;
  }
}
</style>
