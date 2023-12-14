<script setup>
import { inject, ref, watch } from "vue";
import { formatDiff } from "@/utils/tools.js";
import SelectDateTime from "@/component/SelectDateTime/index";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

const currentRow = inject("currentRow");

const diffTime = ref("");

const validateDispatch = (value, rule) => {
  const { dispatchDate } = form.value.basicInfoHead;
  if (!value) {
    if (!dispatchDate.rules[0].required) {
      return "";
    } else {
      return "请选择出动时间";
    }
  } else if (currentRow && dispatchDate.value?.valueOf() < currentRow.warningDate) {
    return "出动时间不能早于接警时间";
  } else {
    return "";
  }
};

const validateAttendance = (value, rule) => {
  const { dispatchDate, attendanceDate } = form.value.basicInfoHead;
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

const validateEvacuate = (value, rule) => {
  const { attendanceDate, evacuateDate } = form.value.basicInfoHead;
  if (!value) {
    if (!evacuateDate.rules[0].required) {
      return "";
    } else {
      return "请选择撤离时间";
    }
  } else if (evacuateDate.value?.valueOf() < attendanceDate.value?.valueOf()) {
    return "撤离时间不能早于到场时间";
  } else {
    return "";
  }
};

// 计算指挥时长
watch(() => form.value.basicInfoHead, () => {
  const { attendanceDate, evacuateDate } = form.value.basicInfoHead;
  if (attendanceDate.value && evacuateDate.value) {
    form.value.basicInfoHead.commandTime.value = evacuateDate.value?.valueOf() - attendanceDate.value?.valueOf();
    diffTime.value = formatDiff(attendanceDate.value?.valueOf(), evacuateDate.value?.valueOf());
    console.log(diffTime.value)
  }
}, { deep: true, immediate: true });

// 计算总人数
watch(() => form.value.personInfo, () => {
  const {
    headLeader,
    commandCenter,
    chiefCommander,
    deputyCommander,
    commander,
    commandAssistant,
    messageAssistant,
    messenger,
    headSupport,
    headPolitic,
    newsPropagation,
    technicianGroup,
    technician,
    commandLeader,
  } = form.value.personInfo;
  let totalNum = 0;
  headLeader.value && (totalNum += headLeader.value?.length);
  commandCenter.value && (totalNum += commandCenter.value?.length);
  chiefCommander.value && (totalNum += chiefCommander.value?.length);
  deputyCommander.value && (totalNum += deputyCommander.value?.length);
  commander.value && (totalNum += commander.value?.length);
  commandAssistant.value && (totalNum += commandAssistant.value?.length);
  messageAssistant.value && (totalNum += messageAssistant.value?.length);
  messenger.value && (totalNum += messenger.value?.length);
  headSupport.value && (totalNum += headSupport.value?.length);
  headPolitic.value && (totalNum += headPolitic.value?.length);
  newsPropagation.value && (totalNum += newsPropagation.value?.length);
  technicianGroup.value && (totalNum += technicianGroup.value?.length);
  technician && (totalNum += technician?.length);
  commandLeader && (totalNum += commandLeader?.length);
  form.value.basicInfoHead.personNum.value = totalNum > 0 ? totalNum : "";
}, { deep: true, immediate: true });

// 计算出动车辆
watch(() => form.value.deployEquipment, () => {
  const {
    headTruckList,
    boardingTruckList,
    kitchenTruckList,
    toiletTruckList,
    refrigerateTruckZqList,
    airfeedTruckList,
    oilTruckList,
    steamThawingTruckList,
    foamTransferTruckList,
    wreckTruckList,
    mobileCommunicateTruckList,
    communicateEquipTruckList,
    quietCommunicateTruckList,
  } = form.value.deployEquipment;
  let totalNum = 0;
  headTruckList.value && (totalNum += headTruckList.value?.length);
  boardingTruckList.value && (totalNum += boardingTruckList.value?.length);
  kitchenTruckList.value && (totalNum += kitchenTruckList.value?.length);
  toiletTruckList.value && (totalNum += toiletTruckList.value?.length);
  refrigerateTruckZqList.value &&
      (totalNum += refrigerateTruckZqList.value?.length);
  airfeedTruckList.value && (totalNum += airfeedTruckList.value?.length);
  oilTruckList.value && (totalNum += oilTruckList.value?.length);
  steamThawingTruckList.value &&
      (totalNum += steamThawingTruckList.value?.length);
  foamTransferTruckList.value &&
      (totalNum += foamTransferTruckList.value?.length);
  wreckTruckList.value && (totalNum += wreckTruckList.value?.length);
  mobileCommunicateTruckList.value &&
      (totalNum += mobileCommunicateTruckList.value?.length);
  communicateEquipTruckList.value &&
      (totalNum += communicateEquipTruckList.value?.length);
  quietCommunicateTruckList.value &&
      (totalNum += quietCommunicateTruckList.value?.length);
  form.value.basicInfoHead.truckNum.value = totalNum > 0 ? totalNum : "";
}, { deep: true, immediate: true });
</script>

<template>
  <ProCard title="基本信息" id="basicInfoHead" :showOpenClose="!showPreview">
    <van-cell-group>
      <van-field
        v-model="form.basicInfoHead.headquarterName.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        maxlength="100"
        required
        name="basicInfoHead.headquarterName.value"
        label="全勤指挥部名称："
        label-width="134px"
        placeholder="请输入全勤指挥部名称"
        :disabled="!showPreview"
        :rules="form.basicInfoHead.headquarterName.rules"
      >
        <template v-slot:label="">
            <FieldAnnotation
              label="全勤指挥部名称："
              remark-field="headquarterName"
              field-module="basicInfoHead"
              :exist-data="fieldExist?.headquarterName"
              @refresh-callback="refreshField"
            />
          </template>
      </van-field>  
      <SelectDateTime
        v-model:value="form.basicInfoHead.dispatchDate.value"
        :show-preview="showPreview"
        :readonly="showPreview"
        is-link
        required
        name="basicInfoHead.dispatchDate.value"
        title="请选择出动时间"
        label="出动时间："
        placeholder="请选择出动时间"
        :rules="[{ validator: validateDispatch, trigger: 'onBlur' }, ...form.basicInfoHead.dispatchDate.rules]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="出动时间："
            remark-field="dispatchDate"
            field-module="basicInfoHead"
            :exist-data="fieldExist?.dispatchDate"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectDateTime>  
      <SelectDateTime
        v-model:value="form.basicInfoHead.attendanceDate.value"
        :show-preview="showPreview"
        :readonly="showPreview"
        is-link
        required
        name="basicInfoHead.attendanceDate.value"
        title="请选择到场时间"
        label="到场时间："
        placeholder="请选择到场时间"
        :rules="[{ validator: validateAttendance, trigger: 'onBlur' }, ...form.basicInfoHead.attendanceDate.rules]"
      >
          <template v-slot:label="">
            <FieldAnnotation
              label="到场时间："
              remark-field="attendanceDate"
              field-module="basicInfoHead"
              :exist-data="fieldExist?.attendanceDate"
              @refresh-callback="refreshField"
            />
          </template>
      </SelectDateTime> 
      <SelectDateTime
        v-model:value="form.basicInfoHead.evacuateDate.value"
        :show-preview="showPreview"
        :readonly="showPreview"
        is-link
        required
        name="basicInfoHead.evacuateDate.value"
        title="请选择撤离时间"
        label="撤离时间："
        placeholder="请选择撤离时间"
        :rules="[{ validator: validateEvacuate, trigger: 'onBlur' }, ...form.basicInfoHead.evacuateDate.rules]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="撤离时间："
            remark-field="evacuateDate"
            field-module="basicInfoHead"
            :exist-data="fieldExist?.evacuateDate"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectDateTime> 
      <van-field
        v-model="form.basicInfoHead.personNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="10"
        required
        name="basicInfoHead.personNum.value"
        label="人员数量(人)："
        label-width="122px"
        placeholder="请输入人员数量"
        :disabled="!showPreview"
        :rules="form.basicInfoHead.personNum.rules"
      >
       <template v-slot:label="">
          <FieldAnnotation
            label="人员数量(人)："
            remark-field="personNum"
            field-module="basicInfoHead"
            :exist-data="fieldExist?.personNum"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.basicInfoHead.truckNum.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="10"
        required
        name="basicInfoHead.truckNum.value"
        label="出动车辆(辆)："
        label-width="122px"
        placeholder="请输入出动车辆"
        :disabled="!showPreview"
        :rules="form.basicInfoHead.truckNum.rules"
      > 
        <template v-slot:label="">
          <FieldAnnotation
            label="出动车辆(辆)："
            remark-field="truckNum"
            field-module="basicInfoHead"
            :exist-data="fieldExist?.truckNum"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="diffTime"
        v-preview-text="showPreview"
        :readonly="showPreview"
        maxlength="20"
        required
        name="basicInfoHead.commandTime"
        label="指挥时长："
        placeholder="请输入指挥时长"
        :disabled="!showPreview"
        :rules="form.basicInfoHead.commandTime.rules"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="指挥时长："
            remark-field="diffTime"
            field-module="basicInfoHead"
            :exist-data="fieldExist?.diffTime"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
    </van-cell-group>
  </ProCard>
</template>
