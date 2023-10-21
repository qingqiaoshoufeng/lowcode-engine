<template>
 <div class="marquee-container">
    <div class="marquee-box">
      <van-cell v-for="item in list" :key="item.label" title="单元格" is-link>
          <template #title>
              <div class="title">
                  <div class="img">
                    <div class="dot"></div>
                    <img src="@/assets/images/home-notice.png" alt="">
                  </div>
                  <div class="label">{{ item.noticeTitle }}</div>
              </div>
          </template> 
      </van-cell>
    </div>
</div>
</template>
  
<script setup>
import {cardList} from '../config.js'
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
.marquee-container {
  /* position: relative; */
  width: 100%;
  height: 32px;
  overflow: hidden;
  padding: 0 16px;
  background: #FFFFFF;
  background: #fff;
}
.marquee-box {
  /* position: absolute; */
  display: inline-block;
  color: #fff;
  white-space: nowrap;
  animation: marquee 3s linear infinite; /* 跑马灯动画 */
.title{
    display: flex;
    align-items: center;
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
  }
}
.marquee-container {
    // position: relative;
}
.marquee-box {
    // position: absolute;
    width: 100%;
    overflow: hidden;
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
  