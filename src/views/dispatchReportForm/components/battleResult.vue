<script setup>
import { inject } from "vue";
import { positiveIntegerReg } from "@/utils/validate.js";
import { checkEmergencyNum, checkProtectNum } from '../tool.js';
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

const showMainGroup = inject("showMainGroup");

const diyValidateMap = inject("diyValidateMap");

const onSurviveNum = () => {
  const { rescueNum, surviveNum } = form.value.battleResult;
  if (rescueNum.value >= surviveNum.value) {
    form.value.battleResult.deathNum.value = rescueNum.value - surviveNum.value;
  } else {
    form.value.battleResult.deathNum.value = 0;
  }
};

const onEmergencyNum = () => {
  checkEmergencyNum(form.value)
}

const onProtectNum = () => {
  checkProtectNum(form.value)
}

const validateRescueNum = (value, rule) => {
  const { rescueNum } = form.value.battleResult;
  const { trappedPerson } = form.value.basicInformation;
  if (Number(showMainGroup.value) && Number(rescueNum.value) > Number(trappedPerson.value)) {
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
  if (Number(rescueNum.value) < Number(surviveNum.value)) {
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

const rescueNumChange = ()=>{
  diyValidateMap.value.defaultKey.push('battleResult.rescueNum.value')
}
const surviveNumChange = ()=>{
  diyValidateMap.value.defaultKey.push('battleResult.surviveNum.value')
}

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
        name="battleResult.rescueNum.value"
        label="抢救(人)："
        placeholder="请输入抢救人数"
        :rules="[
          { validator: validateRescueNum, trigger: 'onBlur' },
          ...form.battleResult.rescueNum.rules,
        ]"
        @blur="onSurviveNum()"
        @change="rescueNumChange"
      >
        <template v-slot:label="">
          <FieldAnnotation
            :isWarning="form.battleResult.rescueNum.warning"
            label="抢救(人)："
            remark-field="rescueNum"
            field-module="battleResult"
            :exist-data="fieldExist?.rescueNum"
            @refresh-callback="refreshField"
            warningTip="抢救人数不能大于现场被困人数！"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.battleResult.surviveNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="digit"
        maxlength="10"
        required
        name="battleResult.surviveNum.value"
        label="生还(人)："
        placeholder="请输入生还人数"
        :rules="[
          { validator: validateSurvive, trigger: 'onBlur' },
          ...form.battleResult.surviveNum.rules,
        ]"
        @blur="onSurviveNum()"
        @change="surviveNumChange"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="生还(人)："
            remark-field="surviveNum"
            field-module="battleResult"
            :exist-data="fieldExist?.surviveNum"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.battleResult.deathNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        :disabled="!showPreview"
        type="number"
        maxlength="10"
        name="battleResult.deathNum.value"
        label="死亡(人)："
        placeholder="请输入死亡人数"
        class="field-not-required"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="死亡(人)："
            remark-field="deathNum"
            field-module="battleResult"
            :exist-data="fieldExist?.deathNum"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.battleResult.evacuateNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="digit"
        maxlength="10"
        name="battleResult.evacuateNum.value"
        label="疏散(人)："
        placeholder="请输入疏散人数"
        class="field-not-required"
        :rules="form.battleResult.evacuateNum.rules"
      >
       <template v-slot:label="">
          <FieldAnnotation
            label="疏散(人)："
            remark-field="evacuateNum"
            field-module="battleResult"
            :exist-data="fieldExist?.evacuateNum"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.battleResult.transferNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="digit"
        maxlength="10"
        name="battleResult.transferNum.value"
        label="转移(人)："
        placeholder="请输入转移人数"
        class="field-not-required"
        :rules="form.battleResult.transferNum.rules"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="转移(人)："
            remark-field="transferNum"
            field-module="battleResult"
            :exist-data="fieldExist?.transferNum"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.battleResult.emergencyNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="15"
        name="battleResult.emergencyNum.value"
        label="抢救财产价值(元)："
        label-width="148px"
        placeholder="请输入抢救财产价值"
        :rules="form.battleResult.emergencyNum.rules"
        @blur="onEmergencyNum()"
      >
        <template v-slot:label="">
          <FieldAnnotation
            :isWarning="form.battleResult.emergencyNum.warning"
            label="抢救财产价值(元)："
            remark-field="emergencyNum"
            field-module="battleResult"
            :exist-data="fieldExist?.emergencyNum"
            @refresh-callback="refreshField"
            warningTip="抢救财产超1千万，请备注说明！"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.battleResult.protectNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        type="number"
        maxlength="15"
        name="battleResult.protectNum.value"
        label="保护财产价值(元)："
        label-width="148px"
        placeholder="请输入保护财产价值"
        :rules="form.battleResult.protectNum.rules"
        @blur="onProtectNum()"
      >
        <template v-slot:label="">
          <FieldAnnotation
            :isWarning="form.battleResult.protectNum.warning"
            label="保护财产价值(元)："
            remark-field="protectNum"
            field-module="battleResult"
            :exist-data="fieldExist?.protectNum"
            @refresh-callback="refreshField"
            warningTip="保护财产超1千万，请备注说明！"
          />
        </template>
      </van-field>
    </van-cell-group>
  </ProCard>
</template>