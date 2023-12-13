<script setup>
import { computed, inject } from "vue";
import dayjs from "dayjs";
import { checkAttendanceDate, checkReturnSpeed } from "../tool.js";
import { useStore } from "vuex";
import { showDialog } from 'vant';

const store = useStore();

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

const { speedConfig } = store.state?.rules?.ruleConfig

// 时速在 20 ~ 120，显示到场时速异常原因
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

const validateDispatch = (value, rule) => {
  const { dispatchDate } = form.value.basicInformation;
  if (!value) {
    if (!dispatchDate.rules[0].required) {
      return "";
    } else {
      return "请选择出动时间";
    }
  } else if (
    currentRow &&
    dispatchDate.value?.valueOf() < currentRow.warningDate
  ) {
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
  } else if (
    midwayReturnDate.value?.valueOf() < dispatchDate.value?.valueOf()
  ) {
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
  } else if (attendanceDate.value?.valueOf() < dispatchDate.value?.valueOf()) {
    return "到场时间不能早于出动时间";
  } else {
    return "";
  }
};

const validateCarryout = (value, rule) => {
  const { carryoutDate, attendanceDate } = form.value.basicInformation;
  if (
    carryoutDate.value &&
    carryoutDate.value?.valueOf() < attendanceDate.value?.valueOf()
  ) {
    return "展开时间不能早于到场时间";
  } else {
    return "";
  }
};

const validateWaterflow = (value, rule) => {
  const { carryoutDate, waterflowDate, attendanceDate } =
    form.value.basicInformation;
  if (
    waterflowDate.value &&
    waterflowDate.value?.valueOf() < carryoutDate.value?.valueOf()
  ) {
    return "出水时间不能早于展开时间";
  } else if (
    waterflowDate.value &&
    waterflowDate.value?.valueOf() < attendanceDate.value?.valueOf()
  ) {
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
    if (
      attendanceDate.value &&
      extinctDate.value?.valueOf() >= attendanceDate.value?.valueOf()
    ) {
      return "到场时火已熄灭，扑灭时间应早于到场时间";
    } else if (
      evacuateDate.value &&
      extinctDate.value?.valueOf() >= evacuateDate.value?.valueOf()
    ) {
      return "到场时火已熄灭，扑灭时间应早于撤离时间";
    } else if (
      returnDate.value &&
      extinctDate.value?.valueOf() >= returnDate.value?.valueOf()
    ) {
      return "到场时火已熄灭，扑灭时间应早于归队时间";
    } else {
      return "";
    }
  } else if (extinctDate.value?.valueOf() < controllingDate.value?.valueOf()) {
    return "扑灭时间不能早于控制时间";
  } else if (extinctDate.value?.valueOf() < waterflowDate.value?.valueOf()) {
    return "扑灭时间不能早于出水时间";
  } else if (extinctDate.value?.valueOf() < carryoutDate.value?.valueOf()) {
    return "扑灭时间不能早于展开时间";
  } else if (extinctDate.value?.valueOf() < attendanceDate.value?.valueOf()) {
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
  } else if (endDate.value?.valueOf() < extinctDate.value?.valueOf()) {
    return "结束时间不能早于扑灭时间";
  } else if (endDate.value?.valueOf() < controllingDate.value?.valueOf()) {
    return "结束时间不能早于控制时间";
  } else if (endDate.value?.valueOf() < waterflowDate.value?.valueOf()) {
    return "结束时间不能早于出水时间";
  } else if (endDate.value?.valueOf() < carryoutDate.value?.valueOf()) {
    return "结束时间不能早于展开时间";
  } else if (endDate.value?.valueOf() < attendanceDate.value?.valueOf()) {
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
  } else if (evacuateDate.value?.valueOf() < attendanceDate.value?.valueOf()) {
    return "撤离时间不能早于到场时间";
  } else if (evacuateDate.value?.valueOf() < endDate.value?.valueOf()) {
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
  } else if (returnDate.value?.valueOf() < midwayReturnDate.value?.valueOf()) {
    return "归队时间不能早于中途返回时间";
  } else if (returnDate.value?.valueOf() < evacuateDate.value?.valueOf()) {
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
  } else if (
    currentRow &&
    dealEndDate.value?.valueOf() < currentRow.warningDate
  ) {
    return "警情处置结束时间不能早于接警时间";
  } else {
    return "";
  }
};

const onDealEndDate = () => {
  showDialog({ message: `警情处置结束时间指警情最终的处置时间，当需要人员留守时，警情处置结束时间不完全等于出动结束时间` });
}
</script>

<template>
  <van-cell-group>
    <SelectDateTime
      v-model:value="form.basicInformation.dispatchDate.value"
      :show-preview="showPreview"
      :readonly="showPreview"
      is-link
      required
      name="dispatchDate"
      title="请选择出动时间"
      label="出动时间："
      placeholder="请选择出动时间"
      :rules="[{ validator: validateDispatch, trigger: 'onBlur' }, ...form.basicInformation.dispatchDate.rules]"
      @change="checkAttendanceDate(form), checkReturnSpeed(form)"
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
      :readonly="showPreview"
      is-link
      required
      name="midwayReturnDate"
      title="请选择中途返回时间"
      label="中途返回时间："
      label-width="108px"
      placeholder="请选择中途返回时间"
      :rules="[{ validator: validateMidway, trigger: 'onBlur' }, ...form.basicInformation.midwayReturnDate.rules]"
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
      :readonly="showPreview"
      is-link
      required
      name="attendanceDate"
      title="请选择到场时间"
      label="到场时间："
      placeholder="请选择到场时间"
      :rules="[{ validator: validateAttendance, trigger: 'onBlur' }, ...form.basicInformation.attendanceDate.rules]"
      @change="checkAttendanceDate(form), checkReturnSpeed(form)"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="到场时间："
          remark-field="attendanceDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.attendanceDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-if="showDealSituation && !showFalsePolice"
      v-model:value="form.basicInformation.carryoutDate.value"
      :show-preview="showPreview"
      :readonly="showPreview"
      is-link
      name="carryoutDate"
      title="请选择展开时间"
      label="展开时间："
      placeholder="请选择展开时间"
      :rules="[{ validator: validateCarryout, trigger: 'onBlur' }, ...form.basicInformation.carryoutDate.rules]"
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
      v-if="showDealSituation && !showFalsePolice"
      v-model:value="form.basicInformation.waterflowDate.value"
      :show-preview="showPreview"
      :readonly="showPreview"
      is-link
      name="waterflowDate"
      title="请选择出水时间"
      label="出水时间："
      placeholder="请选择出水时间"
      :rules="[{ validator: validateWaterflow, trigger: 'onBlur' }, ...form.basicInformation.waterflowDate.rules]"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="展开时间："
          remark-field="waterflowDate"
          field-module="basicInformation"
          :exist-data="fieldExist?.waterflowDate"
          @refresh-callback="refreshField"
        />
      </template>
    </SelectDateTime> 
    <SelectDateTime
      v-if="showDealSituation && !showFalsePolice && showMainGroup"
      v-model:value="form.basicInformation.controllingDate.value"
      :show-preview="showPreview"
      :readonly="showPreview"
      is-link
      name="controllingDate"
      title="请选择控制时间"
      label="控制时间："
      placeholder="请选择控制时间"
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
      v-if="showDealSituation && !showFalsePolice"
      v-model:value="form.basicInformation.washDate.value"
      :show-preview="showPreview"
      :readonly="showPreview"
      is-link
      name="washDate"
      title="请选择洗消时间"
      label="洗消时间："
      placeholder="请选择洗消时间"
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
      v-if="showDealSituation && showFireFighting && showMainGroup && !showFalsePolice"
      v-model:value="form.basicInformation.extinctDate.value"
      :show-preview="showPreview"
      :readonly="showPreview"
      is-link
      required
      name="extinctDate"
      title="请选择扑灭时间"
      label="扑灭时间："
      placeholder="请选择扑灭时间"
      :rules="[{ validator: validateExtinguish, trigger: 'onBlur' }, ...form.basicInformation.extinctDate.rules]"
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
      v-if="showDealSituation && !showFalsePolice"
      v-model:value="form.basicInformation.endDate.value"
      :show-preview="showPreview"
      :readonly="showPreview"
      is-link
      required
      name="endDate"
      title="请选择结束时间"
      label="结束时间："
      placeholder="请选择结束时间"
      :rules="[{ validator: validateEnd, trigger: 'onBlur' }, ...form.basicInformation.endDate.rules]"
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
      :readonly="showPreview"
      is-link
      required
      name="evacuateDate"
      title="请选择撤离时间"
      label="撤离时间："
      placeholder="请选择撤离时间"
      :rules="[{ validator: validateEvacuate, trigger: 'onBlur' }, ...form.basicInformation.evacuateDate.rules]"
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
      :readonly="showPreview"
      is-link
      required
      name="returnDate"
      title="请选择归队时间"
      label="归队时间："
      placeholder="请选择归队时间"
      :rules="[{ validator: validateReturn, trigger: 'onBlur' }, ...form.basicInformation.returnDate.rules]"
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
      name="presentSpeed"
      label="到场时速(公里/小时)："
      label-width="158px"
      placeholder="请输入到场时速"
      :rules="form.basicInformation.presentSpeed.rules"
      :disabled="!showPreview"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="到场时速(公里/小时)："
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
      :readonly="true"
      name="returnLateReason"
      required
      :options="options.returnLateReason"
      :field-names="{ value: 'boDictId', label: 'dictName' }"
      title="请选择到场时速异常原因"
      label="到场时速异常原因："
      label-width="142px"
      placeholder="请选择到场时速异常原因"
      :rules="form.basicInformation.returnLateReason.rules"
    >
      <template v-slot:label="">
        <FieldAnnotation
          label="到场时速异常原因："
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
      :readonly="showPreview"
      is-link
      required
      name="dealEndDate"
      title="请选择警情处置结束时间"
      label="警情处置结束时间："
      label-width="136px"
      placeholder="请选择警情处置结束时间"
      :rules="[{ validator: validateDealEndDate, trigger: 'onBlur' }, ...form.basicInformation.dealEndDate.rules]"
      right-icon="question-o"
      @click-right-icon.stop="onDealEndDate"
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
