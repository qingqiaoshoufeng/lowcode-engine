<template>
  <div class="desc">
    <div v-if="type===1">
      <strong>警情超时定义：</strong>
      <br>
      （1）任务派发超时。最后一支队伍归队后，12个小时内未完成警情派发，计为超时。
      <br>
      （2）警情确认超时。跨省警情信息完成创建后，24小时内未完成全部环节确认，计为超时，若被退回至警情录入员，则从重新送审开始计时。
    </div>
    <div v-if="type===2">
      <strong>出动超时定义：</strong>
      <br>
      （1）出动填报超时。本队伍归队后，24小时内未完成填报计为填报超时；对于本队伍归队后24小时还未派发填报任务的，不计为填报超时。
      <br>
      （2）出动审核超时。出动填报送审后，48小时内完成全部环节审核（只计首次审核），未完成计为超时，若被退回至填报员，则从重新送审开始计时。
    </div>
    <div v-if="type===3">
      <strong>火灾超时定义：</strong>
      <br>
      （1）火灾填报超时。最后一支队归队后，48小时内未完成填报计为超时；对于最后一只队伍归队后48小时还未派发填报任务的，不计为填报超时。
      <br>
      （2）火灾审核超时。火灾报告填报送审后，48小时内完成全部环节审核（只计首次审核），未完成计为超时，若被退回至填报员，则从重新送审开始计时。
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  type:{
    type:Number,
  }
})
</script>
<style lang="scss" scoped>
.desc{
  >div{
    padding-bottom: 20px;
  }
}
</style>