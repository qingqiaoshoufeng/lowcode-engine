<template>
    <div class="info_card">
        <img class="avatar" v-if="info?.img" :src="info?.img">
        <img class="avatar" v-else src="@/assets/images/avatar.png">
        <div class="info">
            <div class="top">
                <div class="name">{{info.userName}}</div> 
                <div class="editor">
                    <span>编辑资料</span>
                    <van-icon name="edit" color="#1E86FE" />
                </div>
            </div>
            <div class="organization">{{info.orgName}}</div>
        </div>
    </div>
  </template>
    
<script setup>
import {ref,computed} from 'vue'
import store from '@/store/index.js'
console.log(store);
const info = computed(()=>{
  return store.state.userInfo.userInfo.USERMESSAGE
})
 
</script>
    
<style scoped lang="scss">
.info_card{
   height: 140px;
   width: 100%;
   background-color: #fff;
   border-radius: 8px;
   display: flex;
   align-items: center;
   padding-left: 19px;
   padding-right: 15px;
   .avatar{
        width: 64px;
        height: 64px;
        margin-right: 14px;
        border-radius: 50%;
   }
   .info{
        flex: 1;
        height: 64px;
        // padding-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 3px;
        .top{
            color: span;
            display: flex;
            justify-content: space-between;
            margin-bottom: 7px;
            .name{
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #0E203C;
            }
            .editor{
                font-size: 14px;
                font-family: PingFang-SC-Medium, PingFang-SC;
                font-weight: 500;
                color: #1E86FE;
              
            }
        }
        .organization{
            font-size: 14px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #0E203C;
        }
   }
}
</style>
    