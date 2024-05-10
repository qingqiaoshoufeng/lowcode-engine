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
      <div v-html="form.noticeBody"></div>
      <div class="bottom" >
        <div v-for="item in form?.attach || []" :key="item.url">
          <!-- <a :href="item.url" :download="item.name"> -->
            <div class="left">
              <img src="~@/assets/images/filetip.png" alt="">
              <span>{{ item.name }}</span>
            </div>
            <img src="~@/assets/images/down-loading.png" alt="" @click="downLoad(item)">
          <!-- </a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getNoticeDetail,updateNotice,getAttachmentFile} from '@/apis/index.js'
import {downLoad} from '@/utils/download.js'
import {ref} from 'vue'
import dayjs from 'dayjs';
import {useRoute} from 'vue-router'
import { Item } from '@castle/ant-design-vue/lib/menu';
const form = ref({})
const route = useRoute()
defineProps()


const getFIleList = (res)=>{
  if (res.boUserNoticeId) {
    getAttachmentFile({
      businessObjId: res.boUserNoticeId,
      businessType: 'file',
    }).then((res) => {
      form.value.attach = res.data.map((item) => {
        return {
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `${ ['production','test', 'production-h5','test-h5'].includes(process.env.NODE_ENV) ? process.env.VUE_APP_BASE_URL : ''}/acws/rest/app/attachments/${item.attachmentId}`,
        }
      })
    })
  }
}
const getDetail = ()=>{
  getNoticeDetail({id:route.query.id}).then((res) => {
    if (res) {
      form.value.noticeTitle = res.noticeTitle
      form.value.noticeType = res.noticeType
      form.value.noticeStatus = res.noticeStatus
      form.value.noticeBody = res.noticeBody
      if(res.noticeStatus !== '1'){
        updateNotice({id:route.query.id})
      }
    }
    getFIleList(res)
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
  position: absolute;
  bottom: 49px;
  // display: flex;
  justify-content: flex-end;
  >div{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 343px;
    height: 36px;
    background: #F6F7F8;
    border-radius: 4px;
    margin-top: 6px;
    padding: 0 13px 0 9px;
    >div{
      display:flex;
      align-items: center;
      img{
        margin-right: 5px;
      }
    }
    img{
      width: 14px;
      height: 14px;
    }
  }
  // margin-top:
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
