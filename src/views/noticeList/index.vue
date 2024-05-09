<template>
  <div class="noticeList">
    <HeaderTitle title="通知列表"/>
    <van-tabs v-model:active="currentTab" ref="tabRef">
      <van-tab :title="item.label" v-for="item in tabList" :name="item.value" :key="item.label" :before-change="getNotice" @click-tab="getNotice">
        <div class="list">
          <div class="wrap">
            <div class="item" v-for="item in list" :key="item.boUserNoticeId" @click="goDetail(item)">
              <div class="top">
                <div class="left">
                  <div class="img">
                    <div class="dot" v-if="item.readFlag === '1'"></div>
                    <img src="~@/assets/images/message1.png" />
                  </div>
                  <div class="name">{{ item.noticeTitle }}</div>
                </div>
                <van-icon name="arrow" />
              </div>
              <div class="bottom">
                <div class="organization">{{ item.publishOrganization }}</div>
                <div class="organization">{{ dayjs(item.createDate).format('YYYY-MM-DD') }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { getFireNotice} from '@/apis/index.js'
import router from '@/router/index.js'
import dayjs from 'dayjs';
import {ref} from 'vue'
import useTab from './hooks/useTab.js'
import { watch } from 'vue';
const tabRef = ref(0)
const getNotice = async(params= {})=>{
  list.value = await getFireNotice(params)
}
const list = ref([])
const {
  currentTab,
  tabList,tabChange} = useTab({
  list:[
    {
      label:'全部',
      value:'0',
    },
    {
      label:'未查看',
      value:'1',
    },
    {
      label:'已查看',
      value:'2',
    },
  ],
  defaultTab:'1',
  // handleChange:getNotice,
  paramsKey:'annual'
})
watch(()=>tabRef.value.active,(val)=>{
  let paramsMap = [
    { 
    },
    {
      status: 1
    },
    { 
      status: 0
    },
  ]
  getNotice(paramsMap[val])
})
getNotice( {status: 1})
const goDetail = (item)=>{
  router.push({
    path:'/noticeDetail',
    query:{
      id:item.boUserNoticeId
    }
  })
}
</script>


<style scoped lang="scss">
.van-tabs{
  height: 100%;
  ::v-deep(.van-tabs__content){
    height: calc(100% - 90px);
    overflow-y: scroll;
  }
}
.list{
  overflow-y: scroll;
  height: 100%;
  .wrap{
    width: 100%;
    padding: 10px 16px 10px;
  }
  .item{
    width: 343px;
    background: #FFFFFF;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    .top{
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 7px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #0E203C;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      .left{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .img{
          display: flex;
          align-items: center;
          position: relative;
          .dot{
            position: absolute;
            right: 3px;
            top: 0;
            width: 6px;
            height:6px;
            border-radius: 50%;
            background: #FF3131;
          }
        }
        img{
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }
    }
    .bottom{
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
