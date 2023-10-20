<template>
 <div class="marquee-container">
    <div class="marquee-box">
      <van-cell v-for="item in cardList" :key="item.label" title="单元格" is-link>
          <template #title>
              <div class="title">
                  <img src="@/assets/images/home-notice.png" alt="">
                  <div class="label">{{ item.title }}</div>
              </div>
          </template> 
      </van-cell>
    </div>
</div>
</template>
  
<script setup>
import {cardList} from '../config.js'
const props = defineProps({
  info:{
    type:Object,
    default:()=>({
      title:'标题',
      number:'数量',
      percent:'百分比',
    })
  },
  color:{
    type:String
  }
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
    img{
        height: 14px;
        width: 14px;
        display: block;
        margin-right: 11px;
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
  