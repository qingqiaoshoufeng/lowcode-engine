<script setup>
import { inject } from "vue";
import SelectMultiple from "@/component/SelectMultiple/index";
import SelectCar from "@/component/SelectCar/index";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");
</script>

<template>
  <ProCard title="出动装备" id="deployEquipment" :showOpenClose="!showPreview">
    <van-cell-group>
      <SelectCar
        v-model:value="form.deployEquipment.headTruckList.value"
        :showPreview="showPreview"
        required
        name="deployEquipment.headTruckList.value"
        :rules="form.deployEquipment.headTruckList.rules"
        :readonly="true"
        label="指挥车辆信息："
        label-width="112px"
        placeholder="请选择指挥车辆信息"
        @change="onDispatchTruck"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="指挥车辆信息："
            remark-field="headTruckList"
            field-module="deployEquipment"
            :exist-data="fieldExist?.headTruckList"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectCar>
    </van-cell-group>
  </ProCard>
</template>
