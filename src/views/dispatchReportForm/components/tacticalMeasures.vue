<script setup>
import { computed, inject } from "vue";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

// 社会救助/物资保障/送水
const showDeliverWater = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes(
    "物资保障"
  );
});

// 社会救助/排水排涝清淤
const showDrainWater = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes("排水排涝清淤");
});

// 安保勤务/特殊勤务/医疗卫生
const showKillArea = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes("医疗卫生");
});

// 安保勤务/防灾勤务
const showDisaster = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes("防灾勤务");
});
</script>

<template>
  <van-cell-group>
    <template v-if="showDeliverWater">
      <van-field
        v-model="form.basicInformation.deliverWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="basicInformation.deliverWater.value"
        maxlength="10"
        name="deliverWater"
        label="送水/物资量(吨)："
        placeholder="请输入送水/物资量"
        :rules="form.basicInformation.deliverWater.rules"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="送水/物资量(吨)："
            remark-field="deliverWater"
            field-module="basicInformation"
            :exist-data="fieldExist?.deliverWater"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
    </template>
    <template v-if="showDrainWater || showDisaster">
      <van-field
        v-model="form.basicInformation.drainWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="10"
        name="basicInformation.drainWater.value"
        label="排涝量(吨)："
        placeholder="请输入排涝量"
        :rules="form.basicInformation.drainWater.rules"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="排涝量(吨)："
            remark-field="drainWater"
            field-module="basicInformation"
            :exist-data="fieldExist?.drainWater"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
    </template>
    <template v-if="showKillArea">
      <van-field
        v-model="form.basicInformation.killArea.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="10"
        name="basicInformation.killArea.value"
        label="消杀面积(平方)："
        placeholder="请输入消杀面积"
        :rules="form.basicInformation.killArea.rules"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="消杀面积(平方)："
            remark-field="killArea"
            field-module="basicInformation"
            :exist-data="fieldExist?.killArea"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
    </template>
  </van-cell-group>
</template>
