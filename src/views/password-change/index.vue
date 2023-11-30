<template>
  <div class="password-change">
    <HeaderTitle title="修改密码" />
    <van-form>
     <van-cell v-for="item in fromConfig" :key="item.label">
      <van-field
        v-model="form[item.key]"
        :label="item.label"
        right-icon="warning-o"
        :placeholder="item.placeholder"
        required='auto'
        type="password"
      />
     </van-cell>
     <!-- <van-cell>
      <van-field
        v-model="value1"
        label="新密码"
        right-icon="warning-o"
        placeholder="请输入新密码"
        required='auto'
      />
    </van-cell>
    <van-cell>
      <van-field
        v-model="value1"
        label="确认密码"
        right-icon="warning-o"
        placeholder="请输入确认密码"
        required='auto'
      />
    </van-cell> -->
    </van-form>
    <div class="submit-wrapper">
      <van-button 
        class="submit" 
        round 
        block 
        type="primary" 
        native-type="submit"
        @click="change"
      >保存</van-button>
    </div>
  </div>
</template>
<script setup>
import {fromConfig} from './config'
import {ref } from 'vue'
const form  = ref({})
const change = ()=>{
}
</script>
<style lang="scss" scoped>
.submit-wrapper{
  padding: 20px;
  .submit{
    margin-top: 65px;
    background-color: #7485CB !important;
    height: 36px;
    
  }
}


</style>