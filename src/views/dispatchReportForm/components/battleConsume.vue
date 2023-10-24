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
  const ids = dispatchTruckListOptions.value.map((item) => item.value).join(",");
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
    dispatchTruckListOptions.value.push(...filterCar(deployEquipment.headTruckList.value));
  }
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.boardingTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.kitchenTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.toiletTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.refrigerateTruckZqList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.airfeedTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.oilTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.steamThawingTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.foamTransferTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.wreckTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.modularTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.mobileCommunicateTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.communicateEquipTruckList.value));
  dispatchTruckListOptions.value.push(...filterCar(deployEquipment.quietCommunicateTruckList.value));
  if (length !== dispatchTruckListOptions.value?.length && notFirst) {
    form.value.battleConsume.wastageTruck.value = undefined;
  }
};

watch(() => form.value.deployEquipment, () => {
  initOptions(true);
}, { deep: true });

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
        :options="showHeadquarter ? dispatchTruckListOptions : form.investForce.dispatchTruckList.value"
        :field-names="{ value: 'value', label: 'label' }"
        :rules="form.battleConsume.wastageTruck.rules"
        :required="true"
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
        required
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
        required
        name="fuel"
        label="燃油："
        placeholder="请输入燃油量"
        :rules="form.battleConsume.fuel.rules"
      >
        <template #extra>升</template>
      </van-field>
    </template>
    <!-- 灭火器材耗损 -->
    <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
      <van-field
        v-model="form.battleConsume.waterPump.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="waterPump"
        label="机动消防泵（含浮艇泵）："
        placeholder="请输入机动消防泵数量"
        :rules="form.battleConsume.waterPump.rules"
      >
        <template #extra>台</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.hoseReel.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="hoseReel"
        label="移动式水带卷盘或水带槽："
        placeholder="请输入移动式水带卷盘或水带槽数量"
        :rules="form.battleConsume.hoseReel.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireGun.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireGun"
        label="移动式消防炮："
        placeholder="请输入移动式消防炮数量"
        :rules="form.battleConsume.fireGun.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.airForm.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="airForm"
        label="空气泡沫枪："
        placeholder="请输入空气泡沫枪数量"
        :rules="form.battleConsume.airForm.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.formTank.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="formTank"
        label="泡沫液桶："
        placeholder="请输入泡沫液桶数量"
        :rules="form.battleConsume.formTank.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.ladder.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="ladder"
        label="梯子："
        placeholder="请输入梯子数量"
        :rules="form.battleConsume.ladder.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.waterBand.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="waterBand"
        label="水带："
        placeholder="请输入水带长度"
        :rules="form.battleConsume.waterBand.rules"
      >
        <template #extra>米</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireHydrantHandle.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireHydrantHandle"
        label="消防栓扳手："
        placeholder="请输入消防栓扳手数量"
        :rules="form.battleConsume.fireHydrantHandle.rules"
      >
        <template #extra>把</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.waterGun.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="waterGun"
        label="水枪："
        placeholder="请输入水枪数量"
        :rules="form.battleConsume.waterGun.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.waterMainfold.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="waterMainfold"
        label="分水器："
        placeholder="请输入分水器数量"
        :rules="form.battleConsume.waterMainfold.rules"
      >
        <template #extra>只</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.entryTool.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="entryTool"
        label="破拆工具："
        placeholder="请输入破拆工具数量"
        :rules="form.battleConsume.entryTool.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireExtinguisher.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireExtinguisher"
        label="灭火机："
        placeholder="请输入灭火机数量"
        :rules="form.battleConsume.fireExtinguisher.rules"
      >
        <template #extra>只</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.firePump.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="firePump"
        label="手抬泵："
        placeholder="请输入手抬泵量"
        :rules="form.battleConsume.firePump.rules"
      >
        <template #extra>个</template>
      </van-field>
    </template>
    <!-- 个人装备耗损 -->
    <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
      <van-field
        v-model="form.battleConsume.fireHat.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireHat"
        label="消防头盔："
        placeholder="请输入消防头盔"
        :rules="form.battleConsume.fireHat.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.protectiveSuit.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="protectiveSuit"
        label="消防员灭火防护服："
        placeholder="请输入消防员灭火防护服"
        :rules="form.battleConsume.protectiveSuit.rules"
      >
        <template #extra>套</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireGlove.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireGlove"
        label="消防手套："
        placeholder="请输入消防手套"
        :rules="form.battleConsume.fireGlove.rules"
      >
        <template #extra>副</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.lapBelt.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="lapBelt"
        label="消防安全腰带："
        placeholder="请输入消防安全腰带"
        :rules="form.battleConsume.lapBelt.rules"
      >
        <template #extra>根</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.protectiveBoots.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="protectiveBoots"
        label="消防员灭火防护靴："
        placeholder="请输入消防员灭火防护靴"
        :rules="form.battleConsume.protectiveBoots.rules"
      >
        <template #extra>双</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireRebreather.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireRebreather"
        label="双正式压消防空气呼吸器："
        placeholder="请输入双正式压消防空气呼吸器"
        :rules="form.battleConsume.fireRebreather.rules"
      >
        <template #extra>副</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireLight.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireLight"
        label="佩戴式防爆照灯："
        placeholder="请输入佩戴式防爆照灯"
        :rules="form.battleConsume.fireLight.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireRescuer.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireRescuer"
        label="消防员呼救器："
        placeholder="请输入消防员呼救器"
        :rules="form.battleConsume.fireRescuer.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.positionLamp.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="positionLamp"
        label="方位灯："
        placeholder="请输入方位灯"
        :rules="form.battleConsume.positionLamp.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.safetyRope.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="safetyRope"
        label="消防安全绳："
        placeholder="请输入消防安全绳"
        :rules="form.battleConsume.safetyRope.rules"
      >
        <template #extra>根</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.fireAxe.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="fireAxe"
        label="消防腰斧："
        placeholder="请输入消防腰斧"
        :rules="form.battleConsume.fireAxe.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.interphone.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="interphone"
        label="对讲机："
        placeholder="请输入对讲机"
        :rules="form.battleConsume.interphone.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.transferImage.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="transferImage"
        label="图传："
        placeholder="请输入图传数量"
        :rules="form.battleConsume.transferImage.rules"
      >
        <template #extra>个</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.uav.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="uav"
        label="无人机："
        placeholder="请输入无人机数量"
        :rules="form.battleConsume.uav.rules"
      >
        <template #extra>架</template>
      </van-field>
    </template>
    <!-- 灭火药剂耗损 -->
    <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
      <van-field
        v-model="form.battleConsume.foamLiquid.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="foamLiquid"
        label="泡沫液："
        placeholder="请输入泡沫液"
        :rules="form.battleConsume.foamLiquid.rules"
      >
        <template #extra>千克</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.dryPowder.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="dryPowder"
        label="干粉："
        placeholder="请输入干粉"
        :rules="form.battleConsume.dryPowder.rules"
      >
        <template #extra>千克</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.carbonDioxide.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="carbonDioxide"
        label="二氧化碳："
        placeholder="请输入二氧化碳"
        :rules="form.battleConsume.carbonDioxide.rules"
      >
        <template #extra>千克</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.haloalkane.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="haloalkane"
        label="卤代烷："
        placeholder="请输入卤代烷"
        :rules="form.battleConsume.haloalkane.rules"
      >
        <template #extra>升</template>
      </van-field>
    </template>
    <!-- 消防用水量情况 -->
    <template v-if="(showDealSituation && !showFalsePolice) || showHeadquarter">
      <van-field
        v-model="form.battleConsume.totalFlow.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="totalFlow"
        label="总流量："
        placeholder="请输入总流量"
        :rules="form.battleConsume.totalFlow.rules"
      >
        <template #extra>升/秒</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.firefightingWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="firefightingWater"
        label="灭火用水："
        placeholder="请输入灭火用水"
        :rules="form.battleConsume.firefightingWater.rules"
      >
        <template #extra>吨</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.coolingWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="coolingWater"
        label="灭火用水："
        placeholder="请输入灭火用水"
        :rules="form.battleConsume.coolingWater.rules"
      >
        <template #extra>吨</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.totalWater.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="totalWater"
        label="用水总量："
        placeholder="请输入用水总量"
        :rules="form.battleConsume.totalWater.rules"
      >
        <template #extra>吨</template>
      </van-field>
      <van-field
        v-model="form.battleConsume.waterInterrupt.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        maxlength="20"
        required
        name="waterInterrupt"
        label="无故供水中断："
        label-width="118px"
        placeholder="请输入无故供水中断"
        :rules="form.battleConsume.waterInterrupt.rules"
      >
        <template #extra>次</template>
      </van-field>
      <van-cell
        title="水渍损失："
        required
        class="field-radio field-radio-label"
      >
        <template #default>
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
      </van-cell>
    </template>
  </van-cell-group>
</template>

<style lang="scss" scoped>
.field-radio-label {
  :deep(.van-cell__title) {
    flex: unset;
    margin-right: 10px;
  }
}
</style>
