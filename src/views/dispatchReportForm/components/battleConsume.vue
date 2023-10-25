<script setup>
import { inject, onMounted, ref, watch } from "vue";
import SelectMultiple from "@/component/SelectMultiple/index";

const form = inject("form");

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const showDealSituation = inject("showDealSituation");

const showFalsePolice = inject("showFalsePolice");

const showHeadquarter = inject("showHeadquarter");

const showMainGroup = inject("showMainGroup");

const showReinforce = inject("showReinforce");

const dispatchTruckListOptions = ref([]);

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
  <van-cell-group>
    <!-- 车辆耗损 -->
    <template>
      <SelectMultiple
        v-model:value="form.battleConsume.wastageTruck.value"
        :showPreview="showPreview"
        :readonly="showPreview"
        name="wastageTruck"
        :options="
          showHeadquarter
            ? dispatchTruckListOptions
            : form.investForce.dispatchTruckList.value
        "
        :field-names="{ value: 'value', label: 'label' }"
        :rules="form.battleConsume.wastageTruck.rules"
        label="指挥车辆信息："
        label-width="118px"
        placeholder="请选择指挥车辆信息"
        title="请选择指挥车辆信息"
      />
      <van-field
        v-if="showMainGroup || showReinforce"
        v-model="form.battleConsume.wastageTruckExplain.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        maxlength="100"
        name="wastageTruckExplain"
        label="车辆损耗说明："
        placeholder="请输入车辆损耗说明"
        :rules="form.battleConsume.wastageTruckExplain.rules"
      />
      <van-field
        v-if="showMainGroup || showReinforce"
        v-model="form.battleConsume.fuel.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fuel"
        label="燃油(升)："
        placeholder="请输入燃油量"
        :rules="form.battleConsume.fuel.rules"
      />
    </template>
    <!-- 灭火器材耗损 -->
    <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
      <van-field
        v-model="form.battleConsume.waterPump.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="waterPump"
        label="机动消防泵(含浮艇泵)(台)："
        label-width="130px"
        placeholder="请输入机动消防泵数量"
        :rules="form.battleConsume.waterPump.rules"
      />
      <van-field
        v-model="form.battleConsume.hoseReel.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="hoseReel"
        label="移动式水带卷盘或水带槽(个)："
        label-width="130px"
        placeholder="请输入移动式水带卷盘或水带槽数量"
        :rules="form.battleConsume.hoseReel.rules"
      />
      <van-field
        v-model="form.battleConsume.fireGun.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireGun"
        label="移动式消防炮(个)："
        label-width="138px"
        placeholder="请输入移动式消防炮数量"
        :rules="form.battleConsume.fireGun.rules"
      />
      <van-field
        v-model="form.battleConsume.airForm.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="airForm"
        label="空气泡沫枪(个)："
        label-width="120px"
        placeholder="请输入空气泡沫枪数量"
        :rules="form.battleConsume.airForm.rules"
      />
      <van-field
        v-model="form.battleConsume.formTank.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="formTank"
        label="泡沫液桶(个)："
        label-width="110px"
        placeholder="请输入泡沫液桶数量"
        :rules="form.battleConsume.formTank.rules"
      />
      <van-field
        v-model="form.battleConsume.ladder.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="ladder"
        label="梯子(把)："
        placeholder="请输入梯子数量"
        :rules="form.battleConsume.ladder.rules"
      />
      <van-field
        v-model="form.battleConsume.waterBand.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="waterBand"
        label="水带(米)："
        placeholder="请输入水带长度"
        :rules="form.battleConsume.waterBand.rules"
      />
      <van-field
        v-model="form.battleConsume.fireHydrantHandle.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireHydrantHandle"
        label="消防栓扳手(把)："
        label-width="120px"
        placeholder="请输入消防栓扳手数量"
        :rules="form.battleConsume.fireHydrantHandle.rules"
      />
      <van-field
        v-model="form.battleConsume.waterGun.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="waterGun"
        label="水枪(个)："
        placeholder="请输入水枪数量"
        :rules="form.battleConsume.waterGun.rules"
      />
      <van-field
        v-model="form.battleConsume.waterMainfold.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="waterMainfold"
        label="分水器(只)："
        placeholder="请输入分水器数量"
        :rules="form.battleConsume.waterMainfold.rules"
      />
      <van-field
        v-model="form.battleConsume.entryTool.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="entryTool"
        label="破拆工具(个)："
        label-width="110px"
        placeholder="请输入破拆工具数量"
        :rules="form.battleConsume.entryTool.rules"
      />
      <van-field
        v-model="form.battleConsume.fireExtinguisher.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireExtinguisher"
        label="灭火机(只)："
        placeholder="请输入灭火机数量"
        :rules="form.battleConsume.fireExtinguisher.rules"
      />
      <van-field
        v-model="form.battleConsume.firePump.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="firePump"
        label="手抬泵(个)："
        placeholder="请输入手抬泵量"
        :rules="form.battleConsume.firePump.rules"
      />
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
          name="wastageTruckExplain"
          label="其他物品(名称)："
          label-width="130px"
          placeholder="请输入其他物品名称"
          :rules="form.battleConsume.otherName.rules"
        />
        <van-field
          v-model="item.otherAmount"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="20"
          name="fuel"
          label="数量："
          placeholder="请输入数量"
          :rules="form.battleConsume.otherAmount.rules"
        />
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
        type="number"
        maxlength="20"
        name="fireHat"
        label="消防头盔(个)："
        label-width="110px"
        placeholder="请输入消防头盔数量"
        :rules="form.battleConsume.fireHat.rules"
      />
      <van-field
        v-model="form.battleConsume.protectiveSuit.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="protectiveSuit"
        label="消防员灭火防护服(套)："
        label-width="130px"
        placeholder="请输入消防员灭火防护服数量"
        :rules="form.battleConsume.protectiveSuit.rules"
      />
      <van-field
        v-model="form.battleConsume.fireGlove.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireGlove"
        label="消防手套(副)："
        label-width="110px"
        placeholder="请输入消防手套数量"
        :rules="form.battleConsume.fireGlove.rules"
      />
      <van-field
        v-model="form.battleConsume.lapBelt.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="lapBelt"
        label="消防安全腰带(根)："
        label-width="138px"
        placeholder="请输入消防安全腰带数量"
        :rules="form.battleConsume.lapBelt.rules"
      />
      <van-field
        v-model="form.battleConsume.protectiveBoots.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="protectiveBoots"
        label="消防员灭火防护靴(双)："
        label-width="168px"
        placeholder="请输入消防员灭火防护靴数量"
        :rules="form.battleConsume.protectiveBoots.rules"
      />
      <van-field
        v-model="form.battleConsume.fireRebreather.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireRebreather"
        label="双正式压消防空气呼吸器(副)："
        label-width="130px"
        placeholder="请输入双正式压消防空气呼吸器数量"
        :rules="form.battleConsume.fireRebreather.rules"
      />
      <van-field
        v-model="form.battleConsume.fireLight.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireLight"
        label="佩戴式防爆照灯(个)："
        label-width="156px"
        placeholder="请输入佩戴式防爆照灯数量"
        :rules="form.battleConsume.fireLight.rules"
      />
      <van-field
        v-model="form.battleConsume.fireRescuer.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireRescuer"
        label="消防员呼救器(个)："
        label-width="136px"
        placeholder="请输入消防员呼救器数量"
        :rules="form.battleConsume.fireRescuer.rules"
      />
      <van-field
        v-model="form.battleConsume.positionLamp.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="positionLamp"
        label="方位灯(个)："
        placeholder="请输入方位灯数量"
        :rules="form.battleConsume.positionLamp.rules"
      />
      <van-field
        v-model="form.battleConsume.safetyRope.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="safetyRope"
        label="消防安全绳(根)："
        label-width="120px"
        placeholder="请输入消防安全绳数量"
        :rules="form.battleConsume.safetyRope.rules"
      />
      <van-field
        v-model="form.battleConsume.fireAxe.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="fireAxe"
        label="消防腰斧(个)："
        label-width="110px"
        placeholder="请输入消防腰斧数量"
        :rules="form.battleConsume.fireAxe.rules"
      />
      <van-field
        v-model="form.battleConsume.interphone.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="interphone"
        label="对讲机(个)："
        placeholder="请输入对讲机数量"
        :rules="form.battleConsume.interphone.rules"
      />
      <van-field
        v-model="form.battleConsume.transferImage.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="transferImage"
        label="图传(个)："
        placeholder="请输入图传数量"
        :rules="form.battleConsume.transferImage.rules"
      />
      <van-field
        v-model="form.battleConsume.uav.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="uav"
        label="无人机(架)："
        placeholder="请输入无人机数量"
        :rules="form.battleConsume.uav.rules"
      />
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
          name="wastageTruckExplain"
          label="其他物品(名称)："
          label-width="130px"
          placeholder="请输入其他物品名称"
          :rules="form.battleConsume.otherName.rules"
        />
        <van-field
          v-model="item.otherAmount"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="20"
          name="fuel"
          label="数量："
          placeholder="请输入数量"
          :rules="form.battleConsume.otherAmount.rules"
        />
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
        maxlength="20"
        name="foamLiquid"
        label="泡沫液(千克)："
        label-width="110px"
        placeholder="请输入泡沫液量"
        :rules="form.battleConsume.foamLiquid.rules"
      />
      <van-field
        v-model="form.battleConsume.dryPowder.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="dryPowder"
        label="干粉(千克)："
        placeholder="请输入干粉量"
        :rules="form.battleConsume.dryPowder.rules"
      />
      <van-field
        v-model="form.battleConsume.carbonDioxide.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="carbonDioxide"
        label="二氧化碳(千克)："
        label-width="120px"
        placeholder="请输入二氧化碳量"
        :rules="form.battleConsume.carbonDioxide.rules"
      />
      <van-field
        v-model="form.battleConsume.haloalkane.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="haloalkane"
        label="卤代烷(升)："
        placeholder="请输入卤代烷量"
        :rules="form.battleConsume.haloalkane.rules"
      />
    </template>
    <div v-if="(showDealSituation && !showFalsePolice) || showHeadquarter" class="block-dynamic">
      <div v-for="(item, index) in form.battleConsume.lossOtherAgent" :key="index" class="block-dynamic-item">
        <div class="title">物品{{  index + 1 }}<van-icon name="cross" v-if="!isDetail" @click="handleDeleteAgent(index)" /></div>
        <van-field
          v-model="item.otherName"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="100"
          name="wastageTruckExplain"
          label="其他物品(名称)："
          label-width="130px"
          placeholder="请输入其他物品名称"
          :rules="form.battleConsume.otherName.rules"
        />
        <van-field
          v-model="item.otherAmount"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="20"
          name="fuel"
          label="数量："
          placeholder="请输入数量"
          :rules="form.battleConsume.otherAmount.rules"
        />
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
        maxlength="20"
        name="totalFlow"
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
        maxlength="20"
        name="firefightingWater"
        label="灭火用水(吨)："
        label-width="104px"
        placeholder="请输入灭火用水量"
        :rules="form.battleConsume.firefightingWater.rules"
      />
      <van-field
        v-model="form.battleConsume.coolingWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="coolingWater"
        label="冷却水(吨)："
        label-width="104px"
        placeholder="请输入冷却水量"
        :rules="form.battleConsume.coolingWater.rules"
      />
      <van-field
        v-model="form.battleConsume.totalWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="totalWater"
        label="用水总量(吨)："
        label-width="104px"
        placeholder="请输入用水总量"
        :rules="form.battleConsume.totalWater.rules"
      />
      <van-field
        v-model="form.battleConsume.waterInterrupt.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        name="waterInterrupt"
        label="无故供水中断(次)："
        label-width="136px"
        placeholder="请输入无故供水中断次数"
        :rules="form.battleConsume.waterInterrupt.rules"
      />
      <van-cell title="水渍损失：" v-preview-text="showPreview" class="field-radio-label">
        <template #default>
          <van-radio-group
            v-model="form.battleConsume.waterDamage.value"
            icon-size="16px"
            direction="horizontal"
          >
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </template>
  </van-cell-group>
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
