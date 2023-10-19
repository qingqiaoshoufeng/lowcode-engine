<template>
    <div class="login">
        <img class="logo" src="@/assets/images/login-logo.png" alt="">
        <div class="title">全国火灾与警情统计系统</div>
        <div class="form">
            <van-form @failed="onFailed">
                <van-field 
                    v-model="loginForm.loginid" 
                    left-icon="manager"
                    name="validatorMessage" 
                    placeholder="校验函数返回错误提示"
                    :rules="[{ validator: validatorMessage }]" 
                />
                <van-field 
                    v-model="loginForm.password" 
                    left-icon="lock"
                    name="validatorMessage" 
                    placeholder="校验函数返回错误提示"
                    :rules="[{ validator: validatorMessage }]" 
                />
                <van-button 
                    class="submit" 
                    round 
                    block 
                    type="primary" 
                    native-type="submit"
                    @click="handleUserLogin"
                >提交</van-button>
            </van-form>
        </div>
    </div>
</template>
  
<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import useRequest from '@/hooks/useRequest.js'
import { loginIn } from '@/apis/index.js'
import router from '@/router/index.js'
import { encrypt } from '@/utils/tools.js'
import { useStore } from "vuex";
const store = useStore()
console.log(store);
const loginForm = ref({
  loginid: 'admin@ln',
  password: 'Xf119@119',
  jcaptchaCode: 3195
})
const handleUserRegister = () => { }
const initStore = async () => {
  const storeList = ['rules', 'userInfo', 'dict','menuInfo']
  const isInited = await Promise.all(
    storeList.map(item => {
      store.dispatch(item + '/init')
    })
  )
  return isInited
}
const handleUserLogin = async () => {
  const { loginid, password, jcaptchaCode } = loginForm.value
  const params = {
    loginid: encrypt(loginid),
    password: encrypt(password),
    jcaptchaCode
  }
  const res = await loginIn(params)
  await initStore()
  localStorage.token = res.token
  router.push({
    name:'Home'
  })
};

</script>

  
<style scoped lang="scss">
.login {
    background: url('~@/assets/images/login-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0% 0%;
    overflow: hidden;
    background-color: #fff;

    .logo {
        height: 66px;
        width: 68px;
        margin: 50px auto 11px;
        display: block;
    }

    .title {
        width: 264px;
        height: 33px;
        font-size: 24px;
        font-family: STKaitiSC-Bold, STKaitiSC;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 33px;
        text-align: center;
        width: 100%;
    }
    .form {
        border-radius: 32px  32px  0px  0px;
        background: #fff;
        padding:46px 16px 0 16px;
        margin-top: 26px;
    }
    ::v-deep .van-field{
        background-color: #F0F5F8 !important;
        margin-top: 16px;
    }
    .submit{
        margin-top: 65px;
        background-color: #7485CB !important;
        height: 36px;
    }
}
</style>
  