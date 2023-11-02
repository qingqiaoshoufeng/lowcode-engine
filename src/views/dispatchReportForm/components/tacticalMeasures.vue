<script setup>
import { computed, inject } from "vue";

const form = inject("form");

const showPreview = inject("showPreview");

// 社会救助/物资保障/送水
const showDeliverWater = computed(() => {
  return form.value.draftInfo.warningType?.text?.includes(
    "物资保障（送水/农田灌溉、运输物资等）"
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
        type="number"
        maxlength="10"
        name="deliverWater"
        label="送水量(吨)："
        placeholder="请输入送水量"
        :rules="form.basicInformation.deliverWater.rules"
      />
    </template>
    <template v-if="showDrainWater || showDisaster">
      <van-field
        v-model="form.basicInformation.drainWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="10"
        name="drainWater"
        label="排涝量(吨)："
        placeholder="请输入排涝量"
        :rules="form.basicInformation.drainWater.rules"
      />
    </template>
    <template v-if="showKillArea">
      <van-field
        v-model="form.basicInformation.killArea.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="10"
        name="killArea"
        label="消杀面积(平方)："
        placeholder="请输入消杀面积"
        :rules="form.basicInformation.killArea.rules"
      />
    </template>
  </van-cell-group>
</template>
