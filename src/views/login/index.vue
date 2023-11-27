<template>
    <div class="login">
        <img class="logo" src="@/assets/images/login-logo.png" alt="">
        <div class="title" @click="handleSwitch">全国火灾与警情统计系统</div>
        <div class="form">
            <van-form @failed="onFailed">
                <van-field 
                    v-model="loginForm.loginid" 
                    left-icon="manager"
                    name="validatorMessage" 
                    placeholder="请输入账号"
                    :required="true"
                />
                <van-field 
                    v-model="loginForm.password" 
                    left-icon="lock"
                    name="validatorMessage" 
                    placeholder="请输入密码"
                    type="password"
                    :required="true"
                />
                <div class="validator">
                  <van-field 
                    class="verification"
                    v-model="loginForm.jcaptchaCode" 
                    :left-icon="verification"
                    name="validatorMessage" 
                    placeholder="请输入验证码"
                    :rules="[{ required: true, message: '请输入验证码' }]"
                    type="number"
                  />
                  <div class="img" @click="getCode"><img :src="imgUrl" alt="" /></div>
                </div>
                <van-button 
                    class="submit" 
                    round 
                    block 
                    type="primary" 
                    native-type="submit"
                    @click="handleUserLogin"
                >登录</van-button>
            </van-form>
        </div>
    </div>
</template>
  
<script setup>
import { reactive, getCurrentInstance, ref ,onMounted} from "vue";
import verification from '@/assets/images/verification.png'
import useRequest from '@/hooks/useRequest.js'
import { loginIn,getVerificationCode} from '@/apis/index.js'
import router from '@/router/index.js'
import { encrypt } from '@/utils/tools.js'
import { useStore } from "vuex";
import { showToast } from "vant";
const store = useStore()
const imgUrl = ref(null)
const clickNumber = ref(0)
console.log(store);
const loginForm = ref({
  loginid: '',
  password: 'Xf119@119',
  jcaptchaCode: '',
  ssoTag: 'abcdefg', // 跳过验证码验证
})

const initStore = async () => {
  const storeList = ['rules', 'userInfo', 'dict','menuInfo']
  const isInited = await Promise.all(
    storeList.map(item => {
      return store.dispatch(item + '/init')
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
  localStorage.token = res.token
  await initStore()
  router.replace({
    name:'Home'
  })
};

const getCode = async ()=>{
  imgUrl.value = await getVerificationCode()
}

onMounted(()=>{
  getCode()
})

const handleSwitch = () => {
  clickNumber.value += 1
  if (clickNumber.value > 7) {
    window.__axios.defaults.baseURL = 'http://10.13.5.47:8080';
    getCode()
    showToast('已切换为测试环境')
  }
}
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
    .img{
      width: 105px;
      height: 40px;
      margin-top: 17px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .validator{
      display:flex;
      justify-content:space-between;
      align-items:center;
      .verification{
        margin-right:12px;
        
      }
    }
    .verification{
      ::v-deep(.van-field__left-icon){
        margin-top: 3px;
      }
    }
}
</style>
  