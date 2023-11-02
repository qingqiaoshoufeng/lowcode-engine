<script setup>
import { inject } from "vue";
import SelectMultiple from "@/component/SelectMultiple/index";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const showPreview = inject("showPreview");

const dispatchTruckListOptions = inject("dispatchTruckListOptions");
</script>

<template>
  <ProCard title="出动装备" id="deployEquipment" :showOpenClose="!showPreview">
    <van-cell-group>
      <SelectMultiple
        v-model:value="form.deployEquipment.headTruckList.value"
        :showPreview="showPreview"
        :readonly="showPreview"
        name="headTruckList"
        :options="dispatchTruckListOptions"
        :field-names="{ value: 'boFireTruckId', label: 'truckCode' }"
        :rules="form.deployEquipment.headTruckList.rules"
        :required="true"
        label="指挥车辆信息："
        label-width="118px"
        placeholder="请选择指挥车辆信息"
        title="请选择指挥车辆信息"
      />
    </van-cell-group>
  </ProCard>
</template>
