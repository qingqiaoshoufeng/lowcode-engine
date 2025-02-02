<script setup>
import { watch, computed, inject } from "vue";
import SplitLines from "@/component/split-lines/index"
import dayjs from "dayjs";
import { checkAttendanceDate, checkReturnSpeed } from "../tool.js";
import { useStore } from "vuex";
import { showDialog } from 'vant';
import { checkStartEnd } from '@/utils/tools.js'

const store = useStore();

const minInputTime = store.state.setting.minInputTime

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showDraft = inject("showDraft");

const showPreview = inject("showPreview");

const currentRow = inject("currentRow");

const options = inject("options");

const showDealSituation = inject("showDealSituation");

const showNotDealReason = inject("showNotDealReason");

const showMidwayReturn = inject("showMidwayReturn");

const showFalsePolice = inject("showFalsePolice");

const showFireFighting = inject("showFireFighting");

const showMainGroup = inject("showMainGroup");

const diyValidateMap = inject("diyValidateMap");

const { speedConfig } = store.state?.rules?.ruleConfig

// 时速在 20 ~ 120，显示平均时速异常原因
const showReturnSlow = computed(() => {
  const { attendanceDate, dispatchDate } = form.value.basicInformation;
  const { fireDistance } = form.value.basicInformation;
  if (
    attendanceDate.value &&
    dispatchDate.value &&
    attendanceDate.value?.unix() > dispatchDate.value?.unix() &&
    fireDistance.value
  ) {
    const time = dayjs(attendanceDate.value).diff(
      dayjs(dispatchDate.value),
      "second"
    );
    const speed = (fireDistance.value / time) * 60 * 60;
    return speed < speedConfig?.value?.[0] || speed > speedConfig?.value?.[1];
  }
  return false;
});

watch(() => showReturnSlow.value, () => {
  if (!showReturnSlow.value) {
    form.value.basicInformation.returnLateReason.value = undefined
  }
})

const validateDispatch = (value, rule) => {
  const { dispatchDate } = form.value.basicInformation;
  if (!value) {
    if (!dispatchDate.rules[0].required) {
      return "";
    } else {
      return "请选择出动时间";
    }
  } else if (currentRow && checkStartEnd(currentRow.warningDate, dispatchDate.value)) {
    return "出动时间不能早于接警时间";
  } else {
    return "";
  }
};

const validateMidway = (value, rule) => {
  const { dispatchDate, midwayReturnDate } = form.value.basicInformation;
  if (!value) {
    if (!midwayReturnDate.rules[0].required) {
      return "";
    } else {
      return "请选择中途返回时间";
    }
  } else if (checkStartEnd(dispatchDate.value, midwayReturnDate.value)) {
    return "中途返回时间不能早于出动时间";
  } else {
    return "";
  }
};

const validateAttendance = (value, rule) => {
  const { dispatchDate, attendanceDate } = form.value.basicInformation;
  if (!value) {
    if (!attendanceDate.rules[0].required) {
      return "";
    } else {
      return "请选择到场时间";
    }
  } else if (checkStartEnd(dispatchDate.value, attendanceDate.value)) {
    return "到场时间不能早于出动时间";
  } else {
    return "";
  }
};

const validateCarryout = (value, rule) => {
  const { carryoutDate, attendanceDate } = form.value.basicInformation;
  if (checkStartEnd(attendanceDate.value, carryoutDate.value)) {
    return "展开时间不能早于到场时间";
  } else {
    return "";
  }
};

const validateWaterflow = (value, rule) => {
  const { carryoutDate, waterflowDate, attendanceDate } =
    form.value.basicInformation;
  if (checkStartEnd(carryoutDate.value, waterflowDate.value)) {
    return "出水时间不能早于展开时间";
  } else if (checkStartEnd(attendanceDate.value, waterflowDate.value)) {
    return "出水时间不能早于到场时间";
  } else {
    return "";
  }
};

const validateExtinguish = (value, rule) => {
  const { fireSituation } = form.value.basicInformation;
  const {
    extinctDate,
    controllingDate,
    waterflowDate,
    carryoutDate,
    attendanceDate,
    evacuateDate,
    returnDate,
  } = form.value.basicInformation;
  if (!value) {
    if (!extinctDate.rules[0].required) {
      return "";
    } else {
      return "请选择扑灭时间";
    }
  } else if (fireSituation.text === "火已熄灭") {
    if (checkStartEnd(extinctDate.value, attendanceDate.value, '<=')) {
      return "到场时火已熄灭，扑灭时间应早于到场时间";
    } else if (checkStartEnd(extinctDate.value, evacuateDate.value, '<=')) {
      return "到场时火已熄灭，扑灭时间应早于撤离时间";
    } else if (checkStartEnd(extinctDate.value, returnDate.value, '<=')) {
      return "到场时火已熄灭，扑灭时间应早于归队时间";
    } else {
      return "";
    }
  } else if (checkStartEnd(controllingDate.value, extinctDate.value)) {
    return "扑灭时间不能早于控制时间";
  } else if (checkStartEnd(waterflowDate.value, extinctDate.value)) {
    return "扑灭时间不能早于出水时间";
  } else if (checkStartEnd(carryoutDate.value, extinctDate.value)) {
    return "扑灭时间不能早于展开时间";
  } else if (checkStartEnd(attendanceDate.value, extinctDate.value)) {
    return "扑灭时间不能早于到场时间";
  } else {
    return "";
  }
};

const validateEnd = (value, rule) => {
  const {
    extinctDate,
    endDate,
    controllingDate,
    waterflowDate,
    carryoutDate,
    attendanceDate,
  } = form.value.basicInformation;
  if (!value) {
    if (!endDate.rules[0].required) {
      return "";
    } else {
      return "请选择结束时间";
    }
  } else if (checkStartEnd(extinctDate.value, endDate.value)) {
    return "结束时间不能早于扑灭时间";
  } else if (checkStartEnd(controllingDate.value, endDate.value)) {
    return "结束时间不能早于控制时间";
  } else if (checkStartEnd(waterflowDate.value, endDate.value)) {
    return "结束时间不能早于出水时间";
  } else if (checkStartEnd(carryoutDate.value, endDate.value)) {
    return "结束时间不能早于展开时间";
  } else if (checkStartEnd(attendanceDate.value, endDate.value)) {
    return "结束时间不能早于到场时间";
  } else {
    return "";
  }
};

const validateEvacuate = (value, rule) => {
  const { evacuateDate, endDate, attendanceDate } = form.value.basicInformation;
  if (!value) {
    if (!evacuateDate.rules[0].required) {
      return "";
    } else {
      return "请选择撤离时间";
    }
  } else if (checkStartEnd(attendanceDate.value, evacuateDate.value)) {
    return "撤离时间不能早于到场时间";
  } else if (checkStartEnd(endDate.value, evacuateDate.value)) {
    return "撤离时间不能早于结束时间";
  } else {
    return "";
  }
};

const validateReturn = (value, rule) => {
  const { evacuateDate, returnDate, midwayReturnDate } =
    form.value.basicInformation;
  if (!value) {
    if (!returnDate.rules[0].required) {
      return '';
    } else {
      return "请选择归队时间";
    }
  } else if (checkStartEnd(midwayReturnDate.value, returnDate.value)) {
    return "归队时间不能早于中途返回时间";
  } else if (checkStartEnd(evacuateDate.value, returnDate.value)) {
    return "归队时间不能早于撤离时间";
  } else {
    return "";
  }
};

const validateDealEndDate = (value, rule) => {
  const { dealEndDate } = form.value.basicInformation;
  if (!value) {
    if (!dealEndDate.rules[0].required) {
      return "";
    } else {
      return "请选择警情处置结束时间";
    }
  } else if (currentRow && checkStartEnd(currentRow.warningDate, dealEndDate.value)) {
    return "警情处置结束时间不能早于接警时间";
  } else {
    return "";
  }
};

const dispatchDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.dispatchDate.value')
  checkAttendanceDate(form.value)
  checkReturnSpeed(form.value)
}
const midwayReturnDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.returnDate.value')
}
const attendanceDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.attendanceDate.value')
  checkAttendanceDate(form.value)
  checkReturnSpeed(form.value)
}
const carryoutDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.carryoutDate.value')
}
const waterflowDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.waterflowDate.value')
}
const extinctDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.extinctDate.value')
}
const endDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.endDate.value')
}
const evacuateDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.evacuateDate.value')
}
const returnDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.returnDate.value')
}

const dealEndDateChange = (val)=>{
  diyValidateMap.value.defaultKey.push('basicInformation.dealEndDate.value')
}

const onDealEndDate = () => {
  showDialog({ message: `警情处置结束时间指警情最终的处置时间，当需要人员留守时，警情处置结束时间不完全等于出动结束时间` });
}
</script>

<template>
  <SplitLines title="时间信息" style="border-color: #A4A4A4" />
  <van-cell-group>
    <SelectDateTime
      v-model:value="form.basicInformation.dispatchDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.dispatchDate.value"
      title="请选择出动时间"
      label="出动时间："
      placeholder="请选择出动时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateDispatch, trigger: 'onBlur' }, ...form.basicInformation.dispatchDate.rules]"
      @change="dispatchDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="出动时间："
          remark-field="dispatchDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.dispatchDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-if="showMidwayReturn"
      v-model:value="form.basicInformation.midwayReturnDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.midwayReturnDate.value"
      title="请选择中途返回时间"
      label="中途返回时间："
      label-width="108px"
      placeholder="请选择中途返回时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateMidway, trigger: 'onBlur' }, ...form.basicInformation.midwayReturnDate.rules]"
      @change="midwayReturnDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="中途返回时间："
          remark-field="midwayReturnDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.midwayReturnDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime>
    <SelectDateTime
      v-if="showDealSituation || showNotDealReason"
      v-model:value="form.basicInformation.attendanceDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.attendanceDate.value"
      title="请选择到场时间"
      label="到场时间："
      placeholder="请选择到场时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateAttendance, trigger: 'onBlur' }, ...form.basicInformation.attendanceDate.rules]"
      @change="attendanceDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="到场时间："
          remark-field="attendanceDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.attendanceDate"
          @refresh-callback="refreshField"
          :warningTip="`根据时速${speedConfig?.value?.[0]}-${speedConfig?.value?.[1]}km/h计算，到场时间不合理，请修改或备注！`"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-if="showDealSituation && !showFalsePolice"
      v-model:value="form.basicInformation.carryoutDate.value"
      :show-preview="showPreview"
      is-link
      name="basicInformation.carryoutDate.value"
      title="请选择展开时间"
      label="展开时间："
      placeholder="请选择展开时间"
      class="field-not-required"
      :minDate="minInputTime"
      :rules="[{ validator: validateCarryout, trigger: 'onBlur' }, ...form.basicInformation.carryoutDate.rules]"
      @change="carryoutDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="展开时间："
          remark-field="carryoutDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.carryoutDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-if="showDealSituation && showFireFighting"
      v-model:value="form.basicInformation.waterflowDate.value"
      :show-preview="showPreview"
      is-link
      name="basicInformation.waterflowDate.value"
      title="请选择出水时间"
      label="出水时间："
      placeholder="请选择出水时间"
      class="field-not-required"
      :minDate="minInputTime"
      :rules="[{ validator: validateWaterflow, trigger: 'onBlur' }, ...form.basicInformation.waterflowDate.rules]"
      @change="waterflowDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="出水时间："
          remark-field="waterflowDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.waterflowDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-if="showDealSituation && showMainGroup && showFireFighting"
      v-model:value="form.basicInformation.controllingDate.value"
      :show-preview="showPreview"
      is-link
      name="basicInformation.controllingDate.value"
      title="请选择控制时间"
      label="控制时间："
      placeholder="请选择控制时间"
      class="field-not-required"
      :minDate="minInputTime"
      :rules="form.basicInformation.controllingDate.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="控制时间："
          remark-field="controllingDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.controllingDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime>
    <SelectDateTime
      v-if="showDealSituation && showFireFighting && showMainGroup && !showFalsePolice"
      v-model:value="form.basicInformation.extinctDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.extinctDate.value"
      title="请选择扑灭时间"
      label="扑灭时间："
      placeholder="请选择扑灭时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateExtinguish, trigger: 'onBlur' }, ...form.basicInformation.extinctDate.rules]"
      @change="extinctDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="扑灭时间："
          remark-field="extinctDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.extinctDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime>
    <SelectDateTime
      v-if="showDealSituation && showFireFighting"
      v-model:value="form.basicInformation.washDate.value"
      :show-preview="showPreview"
      is-link
      name="basicInformation.washDate.value"
      title="请选择洗消时间"
      label="洗消时间："
      placeholder="请选择洗消时间"
      class="field-not-required"
      :minDate="minInputTime"
      :rules="form.basicInformation.washDate.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="洗消时间："
          remark-field="washDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.washDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime>
    <SelectDateTime
      v-if="showDealSituation && !showFalsePolice"
      v-model:value="form.basicInformation.endDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.endDate.value"
      title="请选择结束时间"
      label="结束时间："
      placeholder="请选择结束时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateEnd, trigger: 'onBlur' }, ...form.basicInformation.endDate.rules]"
      @change="endDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="结束时间："
          remark-field="endDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.endDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-if="showDealSituation || showNotDealReason"
      v-model:value="form.basicInformation.evacuateDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.evacuateDate.value"
      title="请选择撤离时间"
      label="撤离时间："
      placeholder="请选择撤离时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateEvacuate, trigger: 'onBlur' }, ...form.basicInformation.evacuateDate.rules]"
      @change="evacuateDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="撤离时间："
          remark-field="evacuateDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.evacuateDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-model:value="form.basicInformation.returnDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.returnDate.value"
      title="请选择归队时间"
      label="归队时间："
      placeholder="请选择归队时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateReturn, trigger: 'onBlur' }, ...form.basicInformation.returnDate.rules]"
      @change="returnDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="归队时间："
          remark-field="returnDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.returnDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <van-field
      v-if="!showMidwayReturn"
      v-model="form.basicInformation.presentSpeed.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      type="number"
      maxlength="10"
      name="basicInformation.presentSpeed.value"
      label="平均时速(公里/小时)："
      label-width="158px"
      placeholder="请输入平均时速"
      class="field-not-required"
      :rules="form.basicInformation.presentSpeed.rules"
      :disabled="!showPreview"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="平均时速(公里/小时)："
          remark-field="presentSpeed"
          field-module="basicInformation"
          :exist-data="fieldExist?.presentSpeed"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field> 
    <SelectSingle
      v-if="showReturnSlow"
      v-model:value="form.basicInformation.returnLateReason.value"
      :showPreview="showPreview"
      name="basicInformation.returnLateReason.value"
      required
      :options="options.returnLateReason"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择平均时速异常原因"
      label="平均时速异常原因："
      label-width="142px"
      placeholder="请选择平均时速异常原因"
      :rules="form.basicInformation.returnLateReason.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="平均时速异常原因："
          field-module="basicInformation"
          :exist-data="fieldExist?.returnLateReason"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectSingle> 
    <SelectDateTime
      v-if="showDealSituation && showMainGroup"
      v-model:value="form.basicInformation.dealEndDate.value"
      :show-preview="showPreview"
      is-link
      required
      name="basicInformation.dealEndDate.value"
      title="请选择警情处置结束时间"
      label="警情处置结束时间："
      label-width="148px"
      placeholder="请选择警情处置结束时间"
      :minDate="minInputTime"
      :rules="[{ validator: validateDealEndDate, trigger: 'onBlur' }, ...form.basicInformation.dealEndDate.rules]"
      right-icon="question-o"
      @click-right-icon.stop="onDealEndDate"
      @change="dealEndDateChange"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="警情处置结束时间："
          remark-field="dealEndDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.dealEndDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
  </van-cell-group>
</template>
