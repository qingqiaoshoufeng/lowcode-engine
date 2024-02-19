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
      查询结果：共查询到<span>{{ searchInfo.warningCount }}</span>起警情记录，
      同比<span>{{ searchInfo.warningCountTb }}</span>；
      其中火灾扑救<span>{{ searchInfo.fireFighting }}</span>起，
      同比<span>{{ searchInfo.hzCountTb }}</span>；
      抢险救援<span>{{ searchInfo.emergencyRescue }}</span>起，
      同比<span>{{ searchInfo.qxCountTb }}</span>；
      社会救助<span>{{ searchInfo.socialAssistance }}</span>起、
      安保勤务<span>{{ searchInfo.securityService }}</span>起、
      虚假警<span>{{ searchInfo.falseAlarm }}</span>起。
      共出动队伍<span>{{ searchInfo.dispatchGroups }}</span>队次，
      出动车辆<span>{{ searchInfo.dispatchTrucks }}</span>辆次、
      出动人员<span>{{ searchInfo.dispatchNums }}</span>人次
      <span class="tip_per">(“-”表示同、环期无数据或者数据为0，无法计算出同环比)</span>
    </div>
    <div v-else-if="searchType === 2">
      查询结果：共查询到<span>{{ searchInfo.dispatchCount }}</span>次出动记录，
      同比<span>{{ searchInfo.dispatchCountTb }}</span>；
      涉及警情<span>{{ searchInfo.warningCount }}</span>起，
      同比<span>{{ searchInfo.warningCountTb }}</span>；
      出动车辆<span>{{ searchInfo.dispatchTruckCounts }}</span>辆，
      出动警力<span>{{ searchInfo.dispatchPersonCounts }}</span>人，
      抢救被困人员<span>{{ searchInfo.rescueCount }}</span>人，
      疏散被困人员<span>{{ searchInfo.evacuateNumSum }}</span>人，
      抢救财产价值<span>{{ searchInfo.emergencyNumSum }}</span>元，
      保护财产价值<span>{{ searchInfo.protectNumSum }}</span>元，
      参战人员死亡<span>{{ searchInfo.firedeathNumSum || searchInfo.fireDeathNumSum }}</span>人，
      受伤<span>{{ searchInfo.fireInjuryNumSum }}</span>人。
      <span class="tip_per">(“-”表示同、环期无数据或者数据为0，无法计算出同环比)</span>
    </div>
    <div v-if="searchType === 3">
      查询结果：共查询到<span>{{ searchInfo.dispatchCount }}</span>次全勤指挥部出动记录，
      同比<span>{{ searchInfo.dispatchCountTb }}</span>；
      涉及警情<span>{{ searchInfo.warningCount }}</span>起，
      同比<span>{{ searchInfo.warningCountTb }}</span>；
      出动指挥车辆<span>{{ searchInfo.dispatchTruckCounts }}</span>辆，
      出动指挥人员<span>{{ searchInfo.commanderNums }}</span>人，
      指挥人员死亡<span>{{ searchInfo.headDeathNumSum || searchInfo.fireDeathNumSum }}</span>人，
      受伤<span>{{ searchInfo.headInjuryNumSum || searchInfo.fireInjuryNumSum }}</span>人。
      <span class="tip_per">(“-”表示同、环期无数据或者数据为0，无法计算出同环比)</span>
    </div>
    <div v-if="searchType === 4">
      查询结果：共查询到<span>{{ searchInfo.fireCount }}</span>起火灾调查报告，
      同比<span>{{ searchInfo.fireCountTb }}</span>；
      死亡<span>{{ searchInfo.deathCounts }}</span>人，
      受伤<span>{{ searchInfo.zsCounts + searchInfo.qsCounts }}</span>人，
      重伤<span>{{ searchInfo.zsCounts }}</span>人，
      轻伤<span>{{ searchInfo.qsCounts }}</span>人，
      直接财产损失<span>{{ searchInfo.directDamages }}</span>元，
      过火面积<span>{{ searchInfo.burnedAreas }}</span>平方米，
      受灾户数<span>{{ searchInfo.affectedHouses }}</span>户
      <span class="tip_per">(“-”表示同、环期无数据或者数据为0，无法计算出同环比)</span>
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
