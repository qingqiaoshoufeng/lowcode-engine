<template>
  <div class="notice_detail">
    <HeaderTitle title="通知公告"/>
    <div class="info">
      <div class="title">{{ 
        form.noticeTitle
         }}</div>
      <div class="header">
        <div class="org">{{ form.publishOrganization }}</div>
        <div class="time">{{ dayjs(form.createDate).format('YYYY-MM-DD')}}</div>
      </div>
      <div>{{ form.noticeBody }}</div>
      <div class="bottom">
        <van-button icon="plus" plain  type="primary">下载</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getNoticeDetail} from '@/apis/index.js'
import {ref} from 'vue'
import dayjs from 'dayjs';
import {useRoute} from 'vue-router'
const form = ref({})
const route = useRoute()
defineProps()
const getDetail = ()=>{
  getNoticeDetail({id:route.query.id}).then((res) => {
    if (res) {
      form.value.noticeTitle = res.noticeTitle
      form.value.noticeType = res.noticeType
      form.value.noticeStatus = res.noticeStatus
      form.value.noticeBody = res.noticeBody
    }
    return res
  })
}
getDetail()

</script>


<style scoped lang="scss">
.notice_detail{
  background-color: #fff;

 .info{
  padding: 16px;
  .title{
    width: 121px;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0E203C;
    line-height: 22px;
  }
  .header{
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #7A7A7A;
    line-height: 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
 }
 .bottom{
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  .van-button{
    width: 92px;
    height: 28px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #0095FF;
  }

 }
}
</style>
