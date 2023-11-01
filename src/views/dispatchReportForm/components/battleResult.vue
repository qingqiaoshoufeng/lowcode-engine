<script setup>
import { inject } from "vue";
import { positiveIntegerReg } from "@/utils/validate.js";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const showPreview = inject("showPreview");

const showMainGroup = inject("showMainGroup");

const onSurviveNum = () => {
  const { rescueNum, surviveNum } = form.value.battleResult;
  if (rescueNum.value >= surviveNum.value) {
    form.value.battleResult.deathNum.value = rescueNum.value - surviveNum.value;
  } else {
    form.value.battleResult.deathNum.value = 0;
  }
};

const validateRescueNum = (value, rule) => {
  const { rescueNum } = form.value.battleResult;
  const { trappedPerson } = form.value.basicInformation;
  if (showMainGroup.value && rescueNum.value > trappedPerson.value) {
    return "抢救人数不能大于现场被困人数！";
  } else if (!value && value !== 0) {
    if (!rescueNum.rules[0].required) {
      return "";
    } else {
      return "请输入抢救人数";
    }
  } else {
    return "";
  }
};

const validateSurvive = (value, rule) => {
  const { rescueNum, surviveNum } = form.value.battleResult;
  if (rescueNum.value < surviveNum.value) {
    return "生还人数不能大于抢救人数！";
  } else if (!value && value !== 0) {
    if (!surviveNum.rules[0].required) {
      return "";
    } else {
      return "请输入生还人数";
    }
  } else {
    return "";
  }
};
</script>

<template>
  <ProCard title="战斗成果" id="battleResult" :showOpenClose="!showPreview">
    <van-cell-group>
      <van-field
        v-model="form.battleResult.rescueNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="digit"
        maxlength="10"
        required
        name="rescueNum"
        label="抢救(人)："
        placeholder="请输入抢救人数"
        :rules="[
          { validator: validateRescueNum, trigger: 'onBlur' },
          ...form.battleResult.rescueNum.rules,
        ]"
        @blur="onSurviveNum()"
      />
      <van-field
        v-model="form.battleResult.surviveNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="digit"
        maxlength="10"
        required
        name="surviveNum"
        label="生还(人)："
        placeholder="请输入生还人数"
        :rules="[
          { validator: validateSurvive, trigger: 'onBlur' },
          ...form.battleResult.surviveNum.rules,
        ]"
        @blur="onSurviveNum()"
      />
      <van-field
        v-model="form.battleResult.deathNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        :disabled="!showPreview"
        type="number"
        maxlength="10"
        name="deathNum"
        label="死亡(人)："
        placeholder="请输入死亡人数"
      />
      <van-field
        v-model="form.battleResult.evacuateNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="digit"
        maxlength="10"
        name="evacuateNum"
        label="疏散(人)："
        placeholder="请输入疏散人数"
        :rules="form.battleResult.evacuateNum.rules"
      />
      <van-field
        v-model="form.battleResult.transferNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="digit"
        maxlength="10"
        name="transferNum"
        label="转移(人)："
        placeholder="请输入转移人数"
        :rules="form.battleResult.transferNum.rules"
      />
      <van-field
        v-model="form.battleResult.emergencyNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="20"
        name="emergencyNum"
        label="抢救财产价值(元)："
        label-width="148px"
        placeholder="请输入抢救财产价值"
        :rules="form.battleResult.emergencyNum.rules"
      />
      <van-field
        v-model="form.battleResult.protectNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="20"
        name="protectNum"
        label="保护财产价值(元)："
        label-width="148px"
        placeholder="请输入保护财产价值"
        :rules="form.battleResult.protectNum.rules"
      />
    </van-cell-group>
  </ProCard>
</template>