<template>
  <div class="info_card" @click="handleEnter">
    <img class="avatar" v-if="avatarUrl" :src="avatarUrl">
    <img class="avatar" v-else src="@/assets/images/avatar.png">
    <div class="info">
      <div class="top">
        <div class="name">{{info.userName}}</div> 
        <div class="editor" @click.stop="handleEdit" v-if="!isInsert">
          <span>编辑资料</span>
          <van-icon name="edit" color="#1E86FE" />
        </div>
      </div>
      <div class="organization">{{info.orgName}}</div>
    </div>
  </div>
</template>
    
<script setup>
import { ref, computed, onMounted } from 'vue'
import store from '@/store/index.js'
import dayjs from 'dayjs'
import { getAttachmentFile } from '@/apis/index.js';
import { useRouter } from "vue-router";
import { getAttachUrl } from '@/utils/tools.js'
import { inject } from 'vue';

const router = useRouter();

const isInsert = inject('isInsert')

const info = computed(()=>{
  return store.state.userInfo.userInfo.USERMESSAGE
})

const avatarUrl = ref('')
 
const handleEnter = () => {
  router.push({
    path: '/personInfo',
  })
}

const handleEdit = () => {
  router.replace({
    path: '/personInfoEdit',
  })
}

const getAvatar = () => {
  getAttachmentFile({
    businessObjId: info.value.userId,
    businessType: 'userImage',
  }).then((res) => {
    if (res.data.length > 0) {
      const imgs = res.data.map(item => {
        return {
          ...item,
          createDate: dayjs(item.createDate)?.valueOf(),
        }
      }).sort((a, b) => {
        return b.createDate - a.createDate
      })
      avatarUrl.value = `${getAttachUrl()}/acws/rest/app/attachments/${imgs?.[0]?.attachmentId}`
    }
    else {
      avatarUrl.value = ''
    }
  })
}

onMounted(() => {
  getAvatar()
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
    