<script setup>
const props = defineProps({
  searchInfo: {
    type: Object,
    default: () => {},
  },
  searchType: {
    type: Number,
    default: 1,
  },
  toolTip: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="search-info" :class="{ 'tool-tip-wrap': toolTip }">
    <div v-if="searchType === 1">
      查询结果：共查询到<span>{{ searchInfo.warningCount || "0" }}</span>起警情记录，
      同比<span>{{ searchInfo.warningCountTb || "0" }}</span>；
      其中火灾扑救<span>{{ searchInfo.fireFighting || "0" }}</span>起，
      同比<span>{{ searchInfo.hzCountTb || "0" }}</span>；
      抢险救援<span>{{ searchInfo.emergencyRescue || "0" }}</span>起，
      同比<span>{{ searchInfo.qxCountTb || "0" }}</span>；
      社会救助<span>{{ searchInfo.socialAssistance || "0" }}</span>起、
      安保勤务<span>{{ searchInfo.securityService || "0" }}</span>起、
      虚假警<span>{{ searchInfo.falseAlarm || "0" }}</span>起。
      共出动队伍<span>{{ searchInfo.dispatchGroups || "0" }}</span>队次，
      出动车辆<span>{{ searchInfo.dispatchTrucks || "0" }}</span>辆次、
      出动人员<span>{{ searchInfo.dispatchNums || "0" }}</span>人次
    </div>
    <div v-else-if="searchType === 2">
      查询结果：共查询到<span>{{ searchInfo.dispatchCount || "0" }}</span>次出动记录，
      同比<span>{{ searchInfo.dispatchCountTb || "0" }}</span>；
      涉及警情<span>{{ searchInfo.warningCount || "0" }}</span>起，
      同比<span>{{ searchInfo.warningCountTb || "0" }}</span>；
      出动车辆<span>{{ searchInfo.dispatchTruckCounts || "0" }}</span>辆，
      出动警力<span>{{ searchInfo.dispatchPersonCounts || "0" }}</span>人，
      抢救被困人员<span>{{ searchInfo.rescueCount || "0" }}</span>人，
      疏散被困人员<span>{{ searchInfo.evacuateNumSum || "0" }}</span>人，
      抢救财产价值<span>{{ searchInfo.emergencyNumSum || "0" }}</span>元，
      保护财产价值<span>{{ searchInfo.protectNumSum || "0" }}</span>元，
      参战人员死亡<span>{{ searchInfo.firedeathNumSum || "0" }}</span>人，
      受伤<span>{{ searchInfo.fireInjuryNumSum || "0" }}</span>人。
    </div>
    <div v-if="searchType === 3">
      查询结果：共查询到<span>{{ searchInfo.dispatchCount || "0" }}</span>次全勤指挥部出动记录，
      同比<span>{{ searchInfo.dispatchCountTb || "0" }}</span>；
      涉及警情<span>{{ searchInfo.warningCount || "0" }}</span>起，
      同比<span>{{ searchInfo.warningCountTb || "0" }}</span>；
      出动指挥车辆<span>{{ searchInfo.dispatchTruckCounts || "0" }}</span>辆，
      出动指挥人员<span>{{ searchInfo.commanderNums || "0" }}</span>人，
      指挥人员死亡<span>{{ searchInfo.headDeathNumSum || "0" }}</span>人，
      受伤<span>{{ searchInfo.headInjuryNumSum || "0" }}</span>人。
    </div>
    <div v-if="searchType === 4">
      查询结果：共查询到<span>{{ searchInfo.fireCount || "0" }}</span>起火灾调查报告，
      同比<span>{{ searchInfo.fireCountTb || "0" }}</span>；
      死亡<span>{{ searchInfo.deathCounts || "0" }}</span>人，
      受伤<span>{{ searchInfo.zsCounts + searchInfo.qsCounts || "0" }}</span>人，
      重伤<span>{{ searchInfo.zsCounts || "0" }}</span>人，
      轻伤<span>{{ searchInfo.qsCounts || "0" }}</span>人，
      直接财产损失<span>{{ searchInfo.directDamages || "0" }}</span>元，
      过火面积<span>{{ searchInfo.burnedAreas || "0" }}</span>平方米，
      受灾户数<span>{{ searchInfo.affectedHouses || "0" }}</span>户
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-info {
  padding: 6px 6px;
  margin: 10px 12px 0 12px;
  background-color: white;
  span {
    color: #FF4D16;
    margin: 0 5px;
  }
}
</style>
