<script setup>
import { computed, inject } from "vue";
import { checkDispatchNum, checkDispatchTruckList, checkIsResponseTruck } from "../tool.js";
import { positiveIntegerReg } from "@/utils/validate.js";
import SelectMultiple from "@/component/SelectMultiple/index";

const form = inject("form");

const showPreview = inject("showPreview");

const options = inject("options");

const showDraft = inject("showDraft");

const showMidwayReturn = inject("showMidwayReturn");

const showMainGroup = inject("showMainGroup");

const showDealSituation = inject("showDealSituation");

const dispatchTruckListOptions = inject("dispatchTruckListOptions");

const deptMembersOptions = inject("deptMembersOptions");

const personNum = computed(() => {
  if (
    form.value.investForce.commander?.value ||
    form.value.investForce.firemen?.value
  ) {
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

const onDispatchTruck = () => {
  checkDispatchTruckList(form.value);

  if (
    form.value.investForce.isResponseTruck.value === "1" &&
    showMidwayReturn.value
  ) {
    form.value.investForce.midwayCar.value =
      form.value.investForce.dispatchTruckList.value;
  } else {
    form.value.investForce.midwayCar.value = undefined;
  }
};

const OnCarNum = () => {
  checkDispatchNum(form.value);

  checkIsResponseTruck(form.value);
};

const validateCommander = (rule, value, callback) => {
  const { investForce } = form.value;
  if (!value && value !== 0) {
    if (!investForce.commander.rules[0].required) {
      callback();
    } else {
      callback(new Error("请输入指挥员人数"));
    }
  } else if (!positiveIntegerReg.test(value)) {
    callback(new Error("请输入正确指挥员人数"));
  } else {
    callback();
  }
};
</script>

<template>
  <van-cell-group>
    <div class="invest-message">
      共投入 {{ form.investForce?.dispatchTruckList.value?.length || 0 }} 车 {{ personNum || 0 }} 人
    </div>
    <van-cell title="是否有车辆出动：" required class="field-radio-label">
      <template #default>
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
    </van-cell>
    <template v-if="form.investForce.isResponseTruck.value === '1'">
      <SelectMultiple
        v-model:value="form.investForce.dispatchTruckList.value"
        :showPreview="showPreview"
        :readonly="showPreview"
        required
        name="dispatchTruckList"
        :options="dispatchTruckListOptions"
        :field-names="{ value: 'boFireTruckId', label: 'truckNumber' }"
        :rules="form.investForce.dispatchTruckList.rules"
        label="消防车辆信息："
        label-width="118px"
        placeholder="请选择消防车辆信息"
        title="请选择消防车辆信息"
        @change="onDispatchTruck(), OnCarNum()"
      />
      <van-cell title="是否有车辆中途返回：" class="field-radio-label">
        <template #default>
          <van-radio-group
            v-model="form.investForce.isReturnTruck.value"
            v-preview-text="showPreview"
            icon-size="16px"
            direction="horizontal"
            @change="onReturnTruck"
          >
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </template>
    <template
      v-if="
        form.investForce.isResponseTruck.value === '1' &&
        form.investForce.isReturnTruck.value === '1'
      "
    >
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
      />
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
      label-width="122px"
      placeholder="请选择带队指挥员"
      title="请选择带队指挥员"
    />
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
    />
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
    />
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.fireBoatNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="20"
      name="fireBoatNum"
      label="艇(艘)："
      placeholder="请输入艇数量"
      :rules="form.investForce.fireBoatNum.rules"
    />
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.fireAirplaneNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="20"
      name="fireAirplaneNum"
      label="消防直升机(架)："
      label-width="120px"
      placeholder="请输入消防直升机数量"
      :rules="form.investForce.fireAirplaneNum.rules"
    />
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.rescueDogNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="20"
      name="rescueDogNum"
      label="搜救犬(只)："
      label-width="104px"
      placeholder="请输入搜救犬数量"
      :rules="form.investForce.rescueDogNum.rules"
    />
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.uavNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="20"
      name="uavNum"
      label="无人机(架)："
      label-width="104px"
      placeholder="请输入无人机数量"
      :rules="form.investForce.uavNum.rules"
    />
  </van-cell-group>
</template>

<style lang="scss" scoped>
.invest-message {
  color: red;
  padding: 12px 0 0 20px;
}
</style>
