<template>
  <div class="list-wrapper">
    <Vue3SeamlessScroll :list="list" hover wheel step="0.5">
      <div class="marquee-box">
        <van-cell v-for="item in list" :key="item.noticeTitle" title="单元格">
            <template #title>
                <div class="title">
                    <div class="label">{{ item.noticeTitle }}</div>
                </div>
            </template> 
        </van-cell>
      </div>
    </Vue3SeamlessScroll>
    <img class="arrow" src="@/assets/images/arrow.png" alt="">
  </div>
</template>
  
<script setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
const props = defineProps({
  list:{
    type:Array,
    default:()=>([])
  },
})
</script>
<script>
export default {
  name:'DisplayCard'
}
</script>
  
<style scoped lang="scss">
.list-wrapper{
  height: 32px;
  overflow: hidden;
  position: relative;
}
// .marquee-container {
//   /* position: relative; */
//   width: 100%;
//   height: 32px;
//   overflow: hidden;
//   padding: 0 9px;
//   border-left: 16px #fff solid;
//   border-right: 16px #fff solid;
//   background: #fff;
//   display: flex;
//   align-items: center;
// }
.marquee-box {
  /* position: absolute; */
  // display: inline-block;
  // color: #fff;
  // white-space: nowrap;
  // animation: marquee 3s linear infinite; /* 跑马灯动画 */
.title{
    display: flex;
    align-items: center
  }
}
.img{
        height: 14px;
        width: 14px;
        display: block;
        margin-right: 11px;
        position: relative;
        .dot{
          width: 6px;
          height: 6px;
          background: #FF3131;
          position: absolute;
          right: 0;
          top: 0;
          border-radius: 50%;
          transform: translate(50%,-50%);
        }
        img{
          width: 100%;
          height: 100%;
          display: block;
        }
    }
.marquee-container {
    // position: relative;
}
.marquee-box {
    // position: absolute;
    width: 100%;
    // overflow: hidden;
}
.arrow{
  height: 12px;
  position: absolute;
  right: 20px;
  top: 10px;
}

::v-deep .van-cell{
  padding: 0;
  height: 32px;
  display: flex;
  align-items: center;
  background: #F7F8FF;
  padding: 0 9px;
}
@keyframes marquee {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
</style>
  