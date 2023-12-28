<script setup>
import { inject, onMounted, ref, watch } from "vue";
import SelectMultiple from "@/component/SelectMultiple/index";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const showDealSituation = inject("showDealSituation");

const showFalsePolice = inject("showFalsePolice");

const showHeadquarter = inject("showHeadquarter");

const showMainGroup = inject("showMainGroup");

const showReinforce = inject("showReinforce");

const dispatchTruckListOptions = ref([]);

// const validateProgress = inject('validateProgress')

const filterCar = (list) => {
  if (!list || list.length <= 0) {
    return [];
  }
  const result = [];
  const ids = dispatchTruckListOptions.value
    .map((item) => item.value)
    .join(",");
  list.forEach((item) => {
    // eslint-disable-next-line unicorn/prefer-includes
    if (ids.indexOf(item.value) < 0) {
      result.push(item);
    }
  });
  return result;
};

const initOptions = (notFirst) => {
  const { deployEquipment } = form.value;
  const length = dispatchTruckListOptions.value?.length;
  dispatchTruckListOptions.value = [];
  if (deployEquipment.headTruckList.value) {
    dispatchTruckListOptions.value.push(
      ...filterCar(deployEquipment.headTruckList.value)
    );
  }
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.boardingTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.kitchenTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.toiletTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.refrigerateTruckZqList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.airfeedTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.oilTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.steamThawingTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.foamTransferTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.wreckTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.modularTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.mobileCommunicateTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.communicateEquipTruckList.value)
  );
  dispatchTruckListOptions.value.push(
    ...filterCar(deployEquipment.quietCommunicateTruckList.value)
  );
  if (length !== dispatchTruckListOptions.value?.length && notFirst) {
    form.value.battleConsume.wastageTruck.value = undefined;
  }
};

watch(
  () => form.value.deployEquipment,
  () => {
    initOptions(true);
  },
  { deep: true }
);

const handleAddPersnal = () => {
  form.value.battleConsume.lossOtherPersonal.push({
    otherName: "",
    otherAmount: "",
  });
};

const handleDeletePersnal = (index) => {
  const { lossOtherPersonal } = form.value.battleConsume;
  form.value.battleConsume.lossOtherPersonal = lossOtherPersonal.filter(
    (item, i) => i !== index
  );
};

const handleAddAgent = () => {
  form.value.battleConsume.lossOtherAgent.push({
    otherName: "",
    otherAmount: "",
  });
  // validateProgress()
};

const handleDeleteAgent = (index) => {
  const { lossOtherAgent } = form.value.battleConsume;
  form.value.battleConsume.lossOtherAgent = lossOtherAgent.filter(
    (item, i) => i !== index
  );
};

const handleAddEquipments = () => {
  form.value.battleConsume.lossOtherEquipments.push({
    otherName: "",
    otherAmount: "",
  });
  // validateProgress()
};

const handleDeleteEquipments = (index) => {
  const { lossOtherEquipments } = form.value.battleConsume;
  form.value.battleConsume.lossOtherEquipments = lossOtherEquipments.filter(
    (item, i) => i !== index
  );
};

onMounted(() => {
  initOptions(false);
});
</script>

<template>
  <ProCard title="战斗消耗" id="battleConsume" :showOpenClose="!showPreview">
    <van-cell-group>
      <!-- 车辆耗损 -->
      <SelectMultiple
        v-model:value="form.battleConsume.wastageTruck.value"
        :showPreview="showPreview"
        name="battleConsume.wastageTruck.value"
        :options="
          showHeadquarter
            ? dispatchTruckListOptions
            : form.investForce.dispatchTruckList.value
        "
        :field-names="{ value: 'boFireTruckId', label: 'truckNumber' }"
        :rules="form.battleConsume.wastageTruck.rules"
        label="指挥车辆信息："
        label-width="118px"
        placeholder="请选择指挥车辆信息"
        title="请选择指挥车辆信息"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="指挥车辆信息："
            remark-field="blockingTime"
            field-module="basicInformation"
            :exist-data="fieldExist?.blockingTime"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectMultiple>
      <van-field
        v-if="showMainGroup || showReinforce"
        v-model="form.battleConsume.wastageTruckExplain.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        maxlength="100"
        name="battleConsume.wastageTruckExplain.value"
        label="车辆损耗说明："
        label-width="120px"
        placeholder="请输入车辆损耗说明"
        :rules="form.battleConsume.wastageTruckExplain.rules"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="车辆损耗说明："
            remark-field="wastageTruckExplain"
            field-module="battleConsume"
            :exist-data="fieldExist?.wastageTruckExplain"
            @refresh-callback="refreshField"
          />
      </template>
    </van-field>
      <van-field
        v-if="showMainGroup || showReinforce"
        v-model="form.battleConsume.fuel.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="10"
        name="battleConsume.fuel.value"
        label="燃油(升)："
        placeholder="请输入燃油量"
        :rules="form.battleConsume.fuel.rules"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="燃油(升)："
            remark-field="fuel"
            field-module="battleConsume"
            :exist-data="fieldExist?.fuel"
            @refresh-callback="refreshField"
          />
      </template>
    </van-field>
      <!-- 灭火器材耗损 -->
      <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
        <van-field
          v-model="form.battleConsume.waterPump.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.waterPump.value"
          label="机动消防泵(含浮艇泵)(台)："
          label-width="130px"
          placeholder="请输入机动消防泵数量"
          :rules="form.battleConsume.waterPump.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="机动消防泵(含浮艇泵)(台)："
              remark-field="waterPump"
              field-module="battleConsume"
              :exist-data="fieldExist?.waterPump"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.hoseReel.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.hoseReel.value"
          label="移动式水带卷盘或水带槽(个)："
          label-width="130px"
          placeholder="请输入移动式水带卷盘或水带槽数量"
          :rules="form.battleConsume.hoseReel.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="移动式水带卷盘或水带槽(个)："
              remark-field="hoseReel"
              field-module="battleConsume"
              :exist-data="fieldExist?.hoseReel"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireGun.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireGun.value"
          label="移动式消防炮(个)："
          label-width="145px"
          placeholder="请输入移动式消防炮数量"
          :rules="form.battleConsume.fireGun.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="移动式消防炮(个)："
              remark-field="fireGun"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireGun"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.airForm.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.airForm.value"
          label="空气泡沫枪(个)："
          label-width="130px"
          placeholder="请输入空气泡沫枪数量"
          :rules="form.battleConsume.airForm.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="空气泡沫枪(个)："
              remark-field="airForm"
              field-module="battleConsume"
              :exist-data="fieldExist?.airForm"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.formTank.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.formTank.value"
          label="泡沫液桶(个)："
          label-width="115px"
          placeholder="请输入泡沫液桶数量"
          :rules="form.battleConsume.formTank.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="泡沫液桶(个)："
              remark-field="formTank"
              field-module="battleConsume"
              :exist-data="fieldExist?.formTank"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.ladder.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.ladder.value"
          label="梯子(把)："
          placeholder="请输入梯子数量"
          :rules="form.battleConsume.ladder.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="梯子(把)："
              remark-field="ladder"
              field-module="battleConsume"
              :exist-data="fieldExist?.ladder"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.waterBand.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          name="battleConsume.waterBand"
          label="水带(米)："
          placeholder="请输入水带长度"
          :rules="form.battleConsume.waterBand.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="水带(米)："
              remark-field="waterBand"
              field-module="battleConsume"
              :exist-data="fieldExist?.waterBand"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireHydrantHandle.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireHydrantHandle.value"
          label="消防栓扳手(把)："
          label-width="130px"
          placeholder="请输入消防栓扳手数量"
          :rules="form.battleConsume.fireHydrantHandle.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防栓扳手(把)："
              remark-field="fireHydrantHandle"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireHydrantHandle"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.waterGun.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.waterGun.value"
          label="水枪(个)："
          placeholder="请输入水枪数量"
          :rules="form.battleConsume.waterGun.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="水枪(个)："
              remark-field="waterGun"
              field-module="battleConsume"
              :exist-data="fieldExist?.waterGun"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.waterMainfold.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.waterMainfold.value"
          label="分水器(只)："
          placeholder="请输入分水器数量"
          label-width="100px"
          :rules="form.battleConsume.waterMainfold.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="分水器(只)："
              remark-field="waterMainfold"
              field-module="battleConsume"
              :exist-data="fieldExist?.waterMainfold"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        
        <van-field
          v-model="form.battleConsume.entryTool.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.entryTool.value"
          label="破拆工具(个)："
          label-width="115px"
          placeholder="请输入破拆工具数量"
          :rules="form.battleConsume.entryTool.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="破拆工具(个)："
              remark-field="entryTool"
              field-module="battleConsume"
              :exist-data="fieldExist?.entryTool"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireExtinguisher.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireExtinguisher.value"
          label="灭火机(只)："
          label-width="100px"
          placeholder="请输入灭火机数量"
          :rules="form.battleConsume.fireExtinguisher.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="灭火机(只)："
              remark-field="fireExtinguisher"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireExtinguisher"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.firePump.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.firePump.value"
          label="手抬泵(个)："
          label-width="100px"
          placeholder="请输入手抬泵量"
          :rules="form.battleConsume.firePump.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="手抬泵(个)："
              remark-field="firePump"
              field-module="battleConsume"
              :exist-data="fieldExist?.firePump"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </template>
      <div v-if="(showDealSituation && !showFalsePolice) || showHeadquarter" class="block-dynamic">
        <div v-for="(item, index) in form.battleConsume.lossOtherEquipments" :key="index" class="block-dynamic-item">
          <div class="title">物品{{  index + 1 }}<van-icon name="cross" v-if="!isDetail" @click="handleDeleteEquipments(index)" /></div>
          <van-field
            v-model="item.otherName"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="100"
            :name="`battleConsume.lossOtherEquipments.${index}.otherName`"
            label="其他物品(名称)："
            label-width="130px"
            placeholder="请输入其他物品名称"
            :rules="form.battleConsume.otherName.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="其他物品(名称)："
                remark-field="lossOtherEquipments"
                remark-field2="otherName"
                :remark-field2-id="index"
                field-module="battleConsume"
                :exist-data="fieldExist?.lossOtherEquipments?.[index]?.otherName"
                @refresh-callback="refreshField"
              />
            </template>
        </van-field>
          <van-field
            v-model="item.otherAmount"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            type="number"
            maxlength="10"
            :name="`battleConsume.lossOtherEquipments.${index}.otherAmount`"
            label="数量："
            placeholder="请输入数量"
            :rules="form.battleConsume.otherAmount.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="数量："
                remark-field="lossOtherPersonal"
                remark-field2="otherAmount"
                :remark-field2-id="index"
                field-module="battleConsume"
                :exist-data="fieldExist?.lossOtherPersonal?.[index]?.otherAmount"
                @refresh-callback="refreshField"
              />
            </template>
        </van-field>
        </div>
        <van-button type="default" icon="plus" size="small" style="margin: 0 20px;" v-if="!isDetail" @click="handleAddEquipments">
          新增物品（灭火器材）
        </van-button>
      </div>
      <!-- 个人装备耗损 -->
      <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
        <van-field
          v-model="form.battleConsume.fireHat.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireHat.value"
          label="消防头盔(个)："
          label-width="115px"
          placeholder="请输入消防头盔数量"
          :rules="form.battleConsume.fireHat.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防头盔(个)："
              remark-field="fireHat"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireHat"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.protectiveSuit.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.protectiveSuit.value"
          label="消防员灭火防护服(套)："
          label-width="168px"
          placeholder="请输入消防员灭火防护服数量"
          :rules="form.battleConsume.protectiveSuit.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防员灭火防护服(套)："
              remark-field="protectiveSuit"
              field-module="battleConsume"
              :exist-data="fieldExist?.protectiveSuit"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireGlove.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireGlove.value"
          label="消防手套(副)："
          label-width="115px"
          placeholder="请输入消防手套数量"
          :rules="form.battleConsume.fireGlove.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防手套(副)："
              remark-field="fireGlove"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireGlove"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.lapBelt.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.lapBelt.value"
          label="消防安全腰带(根)："
          label-width="138px"
          placeholder="请输入消防安全腰带数量"
          :rules="form.battleConsume.lapBelt.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防安全腰带(根)："
              remark-field="lapBelt"
              field-module="battleConsume"
              :exist-data="fieldExist?.lapBelt"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.protectiveBoots.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.protectiveBoots.value"
          label="消防员灭火防护靴(双)："
          label-width="168px"
          placeholder="请输入消防员灭火防护靴数量"
          :rules="form.battleConsume.protectiveBoots.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防员灭火防护靴(双)："
              remark-field="protectiveBoots"
              field-module="battleConsume"
              :exist-data="fieldExist?.protectiveBoots"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireRebreather.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireRebreather.value"
          label="双正式压消防空气呼吸器(副)："
          label-width="130px"
          placeholder="请输入双正式压消防空气呼吸器数量"
          :rules="form.battleConsume.fireRebreather.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="双正式压消防空气呼吸器(副)："
              remark-field="fireRebreather"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireRebreather"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireLight.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireLight.value"
          label="佩戴式防爆照灯(个)："
          label-width="156px"
          placeholder="请输入佩戴式防爆照灯数量"
          :rules="form.battleConsume.fireLight.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="佩戴式防爆照灯(个)："
              remark-field="fireLight"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireLight"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireRescuer.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireRescuer.value"
          label="消防员呼救器(个)："
          label-width="138px"
          placeholder="请输入消防员呼救器数量"
          :rules="form.battleConsume.fireRescuer.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防员呼救器(个)："
              remark-field="fireRescuer"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireRescuer"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.positionLamp.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          label-width="100"
          name="battleConsume.positionLamp.value"
          label="方位灯(个)："
          placeholder="请输入方位灯数量"
          :rules="form.battleConsume.positionLamp.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="方位灯(个)："
              remark-field="positionLamp"
              field-module="battleConsume"
              :exist-data="fieldExist?.positionLamp"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.safetyRope.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.safetyRope.value"
          label="消防安全绳(根)："
          label-width="130px"
          placeholder="请输入消防安全绳数量"
          :rules="form.battleConsume.safetyRope.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防安全绳(根)："
              remark-field="safetyRope"
              field-module="battleConsume"
              :exist-data="fieldExist?.safetyRope"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.battleConsume.fireAxe.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.fireAxe.value"
          label="消防腰斧(个)："
          label-width="120px"
          placeholder="请输入消防腰斧数量"
          :rules="form.battleConsume.fireAxe.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="消防腰斧(个)："
              remark-field="fireAxe"
              field-module="battleConsume"
              :exist-data="fieldExist?.fireAxe"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
        <van-field
          v-model="form.battleConsume.interphone.value"
          v-preview-text="showPreview"
          label-width="115px"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.interphone.value"
          label="对讲机(个)："
          placeholder="请输入对讲机数量"
          :rules="form.battleConsume.interphone.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="对讲机(个)："
              remark-field="interphone"
              field-module="battleConsume"
              :exist-data="fieldExist?.interphone"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
        <van-field
          v-model="form.battleConsume.transferImage.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.transferImage.value"
          label="图传(个)："
          placeholder="请输入图传数量"
          :rules="form.battleConsume.transferImage.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="图传(个)："
              remark-field="transferImage"
              field-module="battleConsume"
              :exist-data="fieldExist?.transferImage"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
        <van-field
          v-model="form.battleConsume.uav.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="20"
          name="battleConsume.uav.value"
          label="无人机(架)："
          label-width="115px"
          placeholder="请输入无人机数量"
          :rules="form.battleConsume.uav.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="无人机(架)："
              remark-field="uav"
              field-module="battleConsume"
              :exist-data="fieldExist?.uav"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
      </template>
      <div v-if="(showDealSituation && !showFalsePolice) || showHeadquarter" class="block-dynamic">
        <div v-for="(item, index) in form.battleConsume.lossOtherPersonal" :key="index" class="block-dynamic-item">
          <div class="title">物品{{  index + 1 }}<van-icon name="cross" v-if="!isDetail" @click="handleDeletePersnal(index)" /></div>
          <van-field
            v-model="item.otherName"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="100"
            :name="`battleConsume.lossOtherEquipments.${index}.otherName`"
            label="其他物品(名称)："
            label-width="130px"
            placeholder="请输入其他物品名称"
            :rules="form.battleConsume.otherName.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="其他物品(名称)："
                remark-field="lossOtherPersonal"
                remark-field2="otherName"
                :remark-field2-id="index"
                field-module="battleConsume"
                :exist-data="fieldExist?.lossOtherPersonal?.[index]?.otherName"
                @refresh-callback="refreshField"
              />
            </template>
        </van-field>  
          <van-field
            v-model="item.otherAmount"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            type="number"
            maxlength="10"
            :name="`battleConsume.lossOtherEquipments.${index}.otherAmount`"
            label="数量："
            placeholder="请输入数量"
            :rules="form.battleConsume.otherAmount.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="数量："
                remark-field="lossOtherPersonal"
                remark-field2="otherAmount"
                :remark-field2-id="index"
                field-module="battleConsume"
                :exist-data="fieldExist?.lossOtherPersonal?.[index]?.otherAmount"
                @refresh-callback="refreshField"
              />
            </template>
        </van-field>  
        </div>
        <van-button type="default" icon="plus" size="small" style="margin: 0 20px;" v-if="!isDetail" @click="handleAddPersnal">
          新增物品（个人装备）
        </van-button>
      </div>
      <!-- 灭火药剂耗损 -->
      <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
        <van-field
          v-model="form.battleConsume.foamLiquid.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          name="battleConsume.foamLiquid.value"
          label="泡沫液(千克)："
          label-width="115px"
          placeholder="请输入泡沫液量"
          :rules="form.battleConsume.foamLiquid.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="泡沫液(千克)："
              remark-field="foamLiquid"
              field-module="battleConsume"
              :exist-data="fieldExist?.foamLiquid"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
        <van-field
          v-model="form.battleConsume.dryPowder.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          name="battleConsume.dryPowder.value"
          label="干粉(千克)："
          label-width="115px"
          placeholder="请输入干粉量"
          :rules="form.battleConsume.dryPowder.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="干粉(千克)："
              remark-field="dryPowder"
              field-module="battleConsume"
              :exist-data="fieldExist?.dryPowder"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
        <van-field
          v-model="form.battleConsume.carbonDioxide.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          name="battleConsume.carbonDioxide.value"
          label="二氧化碳(千克)："
          label-width="130px"
          placeholder="请输入二氧化碳量"
          :rules="form.battleConsume.carbonDioxide.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="二氧化碳(千克)："
              remark-field="carbonDioxide"
              field-module="battleConsume"
              :exist-data="fieldExist?.carbonDioxide"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
        <van-field
          v-model="form.battleConsume.haloalkane.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          name="battleConsume.haloalkane.value"
          label="卤代烷(升)："
          label-width="120px"
          placeholder="请输入卤代烷量"
          :rules="form.battleConsume.haloalkane.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="卤代烷(升)："
              remark-field="haloalkane"
              field-module="battleConsume"
              :exist-data="fieldExist?.haloalkane"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
      </template>
      <div v-if="(showDealSituation && !showFalsePolice) || showHeadquarter" class="block-dynamic">
        <div v-for="(item, index) in form.battleConsume.lossOtherAgent" :key="index" class="block-dynamic-item">
          <div class="title">物品{{  index + 1 }}<van-icon name="cross" v-if="!isDetail" @click="handleDeleteAgent(index)" /></div>
          <van-field
            v-model="item.otherName"
            v-preview-text="showPreview"
            :name="`battleConsume.lossOtherAgent.${index}.otherName`"
            :readonly="showPreview"
            required
            maxlength="100"
            label="其他物品(名称)："
            label-width="130px"
            placeholder="请输入其他物品名称"
            :rules="form.battleConsume.otherName.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="其他物品(名称)："
                remark-field="lossOtherAgent"
                remark-field2="otherName"
                :remark-field2-id="index"
                field-module="battleConsume"
                :exist-data="fieldExist?.lossOtherAgent?.[index]?.otherName"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>  
          <van-field
            v-model="item.otherAmount"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            type="number"
            maxlength="10"
            :name="`battleConsume.lossOtherAgent.${index}.otherAmount`"
            label="数量："
            placeholder="请输入数量"
            :rules="form.battleConsume.otherAmount.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="数量："
                remark-field="lossOtherAgent"
                remark-field2="otherAmount"
                :remark-field2-id="index"
                field-module="battleConsume"
                :exist-data="fieldExist?.lossOtherAgent?.[index]?.otherAmount"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>  
        </div>
        <van-button type="default" icon="plus" size="small" style="margin: 0 20px;" v-if="!isDetail" @click="handleAddAgent">
          新增物品（灭火药剂）
        </van-button>
      </div>
      <!-- 消防用水量情况 -->
      <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
        <van-field
          v-model="form.battleConsume.totalFlow.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          :name="`battleConsume.totalFlow.value`"
          label="总流量(升/秒)："
          label-width="110px"
          placeholder="请输入总流量"
          :rules="form.battleConsume.totalFlow.rules"
        />
        <van-field
          v-model="form.battleConsume.firefightingWater.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          name="battleConsume.firefightingWater.value"
          label="灭火用水(吨)："
          label-width="104px"
          placeholder="请输入灭火用水量"
          :rules="form.battleConsume.firefightingWater.rules"
        />
        <van-field
          v-model="form.battleConsume.coolingWater.value"
          name="battleConsume.coolingWater.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          label="冷却水(吨)："
          label-width="104px"
          placeholder="请输入冷却水量"
          :rules="form.battleConsume.coolingWater.rules"
        >
            <template v-slot:label="">
              <FieldAnnotation
                label="冷却水(吨)："
                remark-field="coolingWater"
                field-module="battleConsume"
                :exist-data="fieldExist?.coolingWater"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>  
        <van-field
          v-model="form.battleConsume.totalWater.value"
          name="battleConsume.totalWater.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="number"
          maxlength="10"
          label="用水总量(吨)："
          label-width="115px"
          placeholder="请输入用水总量"
          :rules="form.battleConsume.totalWater.rules"
        >
            <template v-slot:label="">
              <FieldAnnotation
                label="用水总量(吨)："
                remark-field="totalWater"
                field-module="battleConsume"
                :exist-data="fieldExist?.totalWater"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>  
        <van-field
          v-model="form.battleConsume.waterInterrupt.value"
          v-preview-text="showPreview"
          :readonly="showPreview"
          type="digit"
          maxlength="10"
          name="battleConsume.waterInterrupt.value"
          label="无故供水中断(次)："
          label-width="144px"
          placeholder="请输入无故供水中断次数"
          :rules="form.battleConsume.waterInterrupt.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="无故供水中断(次)："
              remark-field="waterInterrupt"
              field-module="battleConsume"
              :exist-data="fieldExist?.waterInterrupt"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>  
        <van-field 
          name="battleConsume.waterDamage.value" 
          label="水渍损失：" 
          :rules="form.battleConsume.waterDamage.rules"
          class="field-radio"
        >
          <template #input>
            <van-radio-group
              v-model="form.battleConsume.waterDamage.value"
              v-preview-text="showPreview"
              icon-size="16px"
              direction="horizontal"
            >
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="水渍损失："
              remark-field="waterDamage"
              field-module="battleConsume"
              :exist-data="fieldExist?.waterDamage"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </template>
    </van-cell-group>
  </ProCard>
</template>

<style lang="scss" scoped>
.block-dynamic {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0 0 0;
  .block-dynamic-item {
    border: 1px solid #ebebeb;
    margin: 10px 10px;
    .title {
      display: flex;
      align-items: center;
      margin: 10px 20px 0 20px;
    }
    .title i {
      margin-left: auto;
    }
  }
}
.field-radio-label {
  :deep(.van-cell__title) {
    flex: unset;
    margin-right: 10px;
  }
}
</style>
