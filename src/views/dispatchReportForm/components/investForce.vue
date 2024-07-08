<script setup>
import { computed, inject } from "vue";
import { checkDispatchNum, checkDispatchTruckList, checkIsResponseTruck } from "../tool.js";
import { positiveIntegerReg } from "@/utils/validate.js";
import { cloneDeep } from 'lodash-es'
import SelectMultiple from "@/component/SelectMultiple/index";
import SelectCar from "@/component/SelectCar/index";
import SelectPerson from '@/component/SelectPerson/index.vue';
import SplitLines from "@/component/split-lines/index"

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

const showNationTeam = inject('showNationTeam')

const showMidwayReturn = inject("showMidwayReturn");

const showDealSituation = inject("showDealSituation");

const personNum = computed(() => {
  // 非国家队
  if (!showNationTeam.value && (Number(form.value.investForce?.commanderNum.value) + Number(form.value.investForce?.firemenNum.value) > 0)) {
    return Number(form.value.investForce?.commanderNum.value) + Number(form.value.investForce?.firemenNum.value)
  }
  // 国家队
  if (form.value.investForce.commander?.value || form.value.investForce.firemen?.value) {
    const ids = form.value.investForce.commander?.value?.map(item => item.boFireUserId)?.join(',') || ''
    const result = cloneDeep(form.value.investForce.commander?.value) || []
    form.value.investForce.firemen.value?.forEach((item) => {
      if (!ids.includes(item.boFireUserId)) {
        result.push(item)
      }
    })
    return result?.length
  }
  return ''
});

const onResponseTruck = (e) => {
  if (e === "2") {
    form.value.investForce.dispatchTruckList.value = undefined;
    form.value.battleConsume.wastageTruck.value = undefined;
    form.value.investForce.midwayCar.value = undefined;
    form.value.investForce.isReturnTruck.value = "2";
  }
  if (e === "1" && showMidwayReturn.value) {
    form.value.investForce.isReturnTruck.value = "1";
    form.value.investForce.isReturnTruck.disabled = true;
    form.value.investForce.midwayCar.disabled = true;
  }

  checkDispatchNum(form.value, true, showNationTeam.value);

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
  checkDispatchNum(form.value, true, showNationTeam.value);

  checkIsResponseTruck(form.value);
};

const onCommander = () => {
  form.value.investForce.groupLeader.value = undefined
}
</script>

<template>
  <SplitLines title="本队力量" />
  <van-cell-group>
    <div class="invest-message">
      共投入 {{ form.investForce?.dispatchTruckList.value?.length || 0 }} 车 {{ personNum || 0 }} 人
    </div>
    <van-field
      name="investForce.isResponseTruck.value" 
      label="是否有车辆出动："
      label-width="128px"
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
          :isWarning="form.battleResult.rescueNum.warning"
          field-module="casualtyWar"
          :exist-data="fieldExist?.isInjured"
          @refresh-callback="refreshField"
          warningTip="人车配比不合理，请修改或备注！"
        />
      </template>
    </van-field>
    <template v-if="form.investForce.isResponseTruck.value === '1'">
      <SelectCar
        v-model:value="form.investForce.dispatchTruckList.value"
        :showPreview="showPreview"
        required
        name="investForce.dispatchTruckList.value" 
        :rules="form.investForce.dispatchTruckList.rules"
        :readonly="true"
        label="消防车："
        label-width="118px"
        placeholder="请选择消防车"
        @change="onDispatchTruck"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="消防车："
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
        label-width="144px"
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
        required
        name="investForce.midwayCar.value"
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
    <van-field
      v-if="!showNationTeam"
      v-model="form.investForce.commanderNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      required
      type="digit"
      maxlength="5"
      name="investForce.commanderNum.value"
      label="指挥员（人）："
      label-width="120px"
      placeholder="请输入指挥员人数"
      :rules="form.investForce.commanderNum.rules"
      @blur="OnCarNum"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="指挥员（人）："
          remark-field="commanderNum"
          field-module="investForce"
          :exist-data="fieldExist?.commanderNum"
          @refresh-callback="refreshField"
          :isWarning="form.investForce.commanderNum.warning"
          warningTip="人车比不合理，请修改或备注！"
        />
      </template>
    </van-field>
    <van-field
      v-if="!showNationTeam"
      v-model="form.investForce.firemenNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      required
      type="digit"
      maxlength="5"
      name="investForce.firemenNum.value"
      label="战斗员（人）："
      label-width="120px"
      placeholder="请输入战斗员人数"
      :rules="form.investForce.firemenNum.rules"
      @blur="OnCarNum"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="战斗员（人）："
          remark-field="firemenNum"
          field-module="investForce"
          :exist-data="fieldExist?.firemenNum"
          @refresh-callback="refreshField"
          :isWarning="form.investForce.firemenNum.warning"
          warningTip="人车比不合理，请修改或备注！"
        />
      </template>
    </van-field>
    <SelectPerson
      v-if="showNationTeam"
      v-model:value="form.investForce.commander.value"
      :showPreview="showPreview"
      required
      :readonly="true"
      name="investForce.commander.value"
      :rules="form.investForce.commander.rules"
      :disabled="form.investForce.commander.disabled"
      label="指挥员："
      placeholder="请选择指挥员"
      title="请选择指挥员"
      @change="onCommander(), OnCarNum()"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="指挥员："
          :isWarning="form.investForce.commander.warning"
          remark-field="commander"
          field-module="investForce"
          :exist-data="fieldExist?.commander"
          @refresh-callback="refreshField"
          warningTip="人车配比不合理，请修改或备注！"
        />
      </template>
    </SelectPerson>
    <SelectMultiple
      v-if="showNationTeam"
      v-model:value="form.investForce.groupLeader.value"
      :showPreview="showPreview"
      required
      name="investForce.groupLeader.value"
      :options="form.investForce.commander.value || []"
      :field-names="{ value: 'boFireUserId', label: 'userName' }"
      :rules="form.investForce.groupLeader.rules"
      :disabled="form.investForce.groupLeader.disabled"
      :select-one="true"
      label="带队指挥人员："
      label-width="120px"
      placeholder="请选择带队指挥人员"
      title="请选择带队指挥人员"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="带队指挥人员："
          remark-field="groupLeader"
          field-module="investForce"
          :exist-data="fieldExist?.groupLeader"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectMultiple>
    <SelectPerson
      v-if="showNationTeam"
      v-model:value="form.investForce.firemen.value"
      :showPreview="showPreview"
      required
      :readonly="true"
      name="investForce.firemen.value"
      :rules="form.investForce.firemen.rules"
      :disabled="form.investForce.firemen.disabled"
      label="战斗员："
      placeholder="请选择战斗员"
      title="请选择战斗员"
      @change="OnCarNum"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="战斗员："
          :isWarning="form.investForce.firemen.warning"
          remark-field="firemen"
          field-module="investForce"
          :exist-data="fieldExist?.firemen"
          @refresh-callback="refreshField"
          warningTip="人车配比不合理，请修改或备注！"
        />
      </template>
    </SelectPerson>
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.fireBoatNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="digit"
      maxlength="20"
      name="investForce.fireBoatNum.value"
      label="消防艇(艘)："
      placeholder="请输入消防艇数量"
      class="field-not-required"
      :rules="form.investForce.fireBoatNum.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="消防艇(艘)："
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
      name="investForce.fireAirplaneNum.value"
      label="直升机(架)："
      label-width="128px"
      placeholder="请输入直升机数量"
      class="field-not-required"
      :rules="form.investForce.fireAirplaneNum.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="直升机(架)："
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
      name="investForce.rescueDogNum.value"
      label="搜救犬(只)："
      label-width="104px"
      placeholder="请输入搜救犬数量"
      class="field-not-required"
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
      name="investForce.uavNum.value"
      label="无人机(架)："
      label-width="104px"
      placeholder="请输入无人机数量"
      class="field-not-required"
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
    <van-field
      v-if="showDealSituation"
      v-model="form.investForce.robotNum.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="digit"
      maxlength="20"
      name="investForce.robotNum.value"
      label="机器人(个)："
      label-width="132px"
      placeholder="请输入机器人数量"
      class="field-not-required"
      :rules="form.investForce.robotNum.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="机器人(个)："
          remark-field="robotNum"
          field-module="investForce"
          :exist-data="fieldExist?.robotNum"
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
