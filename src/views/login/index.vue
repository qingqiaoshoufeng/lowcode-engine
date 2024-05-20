<template>
	<div class="login">
		<img class="logo" src="@/assets/images/login-logo.png" alt="">
		<div class="title" @click="handleSwitch">
			全国火灾与警情统计系统
			<span v-if="systemEnv" style="font-size: 12px;">({{ systemEnv }})</span>
		</div>
		<div class="form">
			<van-form @submit="handleUserLogin">
				<van-field
					v-model="loginForm.loginid"
					left-icon="manager"
					name="loginid"
					placeholder="请输入用户名"
					maxlength="20"
					:required="true"
					:rules="[{ required: true, message: '请输入用户名' }]"
				/>
				<van-field
					v-model="loginForm.password"
					left-icon="lock"
					name="password"
					placeholder="请输入密码"
					maxlength="20"
					:type="pswType ? '' : 'password'"
					:required="true"
					:rules="[{ required: true, message: '请输入密码' }]"
				>
					<template #button>
						<span @click="() => (pswType = !pswType)">
							<van-icon name="closed-eye" v-if="!pswType" />
							<van-icon name="eye-o" v-else />
						</span>
					</template>
				</van-field>
				<div class="validator">
					<van-field
						class="verification"
						v-model="loginForm.jcaptchaCode"
						:left-icon="verification"
						name="jcaptchaCode"
						placeholder="请输入验证码"
						maxlength="6"
						:required="true"
						:rules="[{ required: true, message: '请输入验证码' }]"
						type="number"
					/>
					<div class="img" @click="getCode"><img :src="imgUrl" alt="" /></div>
				</div>
				<van-field
					v-if="needSmsCheck"
					v-model="loginForm.phone"
					left-icon="phone"
					name="phone"
					placeholder="请输入手机号"
					maxlength="20"
					:required="false"
					:disabled="true"
					:rules="[{ required: false, message: '请输入手机号' }]"
				/>
				<van-field
					v-if="needSmsCheck"
					class="verification"
					v-model="loginForm.smsCode"
					:left-icon="verification"
					name="smsCode"
					placeholder="请输入手机验证码"
					maxlength="6"
					:required="true"
					:rules="[{ required: true, message: '请输入手机验证码' }]"
					type="number"
				>
					<template #button>
						<van-button
							size="small"
							type="primary"
							:disabled="countdown.disabled"
							@click="startCountdown"
						>
							{{ countdown.innerText }}
						</van-button>
					</template>
				</van-field>
				<div class="isRemember">
					<van-checkbox v-model="isRemember" shape="square">记住账号</van-checkbox>
				</div>
				<van-button
					class="submit"
					:class="{ 'submit-phone': needSmsCheck }"
					round
					block
					type="primary"
					native-type="submit"
				>
					登录
				</van-button>
			</van-form>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref ,onMounted, computed, onUnmounted } from "vue";
import verification from '@/assets/images/verification.png';
import { loginIn, getVerificationCode, getMsgCode } from '@/apis/index.js';
import router from '@/router/index.js';
import { encrypt, maskPhoneNumber } from '@/utils/tools.js';
import { validatePhone } from '@/utils/validate.js';
import { useStore } from "vuex";
import { showToast, closeToast, showFailToast  } from "vant";

const store = useStore()

const imgUrl = ref(null)

const clickNumber = ref(0)

const pswType = ref(false)

const isRemember = ref(false)

const needSmsCheck = ref(false)

const countdownFn = ref(null)

const countdown = ref({ disabled: false, innerText: '发送验证码' })

const systemEnv = ref(localStorage.SYSTEM_ENV)

const loginForm = ref({
	loginid: '',
	password: '',
	jcaptchaCode: '',
	phone: '',
	smsCode: '',
// ssoTag: 'abcdefg', // 跳过验证码验证
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
	showToast({
		message:'登录中...',
		duration:0,
		forbidClick:true
	})
	const { loginid, password, jcaptchaCode, smsCode } = loginForm.value
	const params = {
		loginid: encrypt(loginid),
		password: encrypt(password),
		jcaptchaCode,
		loginType: needSmsCheck.value ? 2 : undefined,
		smsCode: needSmsCheck.value ? smsCode : undefined,
	}
	const res = await loginIn(params).catch(error => {
		if (error) {
			getCode()
		}
	})
	if (res?.code === 401 && res?.data) {
		showFailToast(res?.msg)
		loginForm.value.phone = maskPhoneNumber(res?.data)
		loginForm.value.jcaptchaCode = ''
		needSmsCheck.value = true
		getCode()
	}
	else if (res?.token) {
		localStorage.token = res.token
		const { jcaptchaCode,password, ...rest } = loginForm.value
		isRemember.value && localStorage.setItem('loginForm',JSON.stringify(rest))
		await initStore()
		closeToast()
		router.replace({
			name:'Home'
		})
	} else if ((res?.code === 401 || res?.code === 409)) {
		showFailToast(res?.msg || '用户信息输入有误，请检查后重试！')
		loginForm.value.jcaptchaCode = ''
		loginForm.value.smsCode = ''
		getCode()
	}
};

const getCode = async ()=>{
	imgUrl.value = await getVerificationCode()
}

const autoLoginInfo = ()=> {
	const info = localStorage.getItem('loginForm')
	if(info){
		loginForm.value = JSON.parse(info)
	}
}

const startCountdown = () => {
	if (!loginForm.value.loginid) {
		showToast('请输入用户名')
		return
	}
	let seconds = 60
	countdownFn.value = setInterval(() => {
		seconds -= 1
		if (seconds > 0) {
			countdown.value.disabled = true
			countdown.value.innerText = `${seconds}秒后重新发送`
		}
		else {
			clearInterval(countdownFn.value)
			countdown.value.disabled = false
			countdown.value.innerText = '发送验证码'
		}
	}, 1000)
	getMsgCode({ username: encrypt(loginForm.value.loginid) })
}

onMounted(() => {
	autoLoginInfo()
	getCode()
})

onUnmounted(() => {
	clickNumber.value === 0
})

const handleSwitch = () => {
	clickNumber.value += 1
	if (process.env.NODE_ENV === 'test') {
		if (clickNumber.value === 7) {
			localStorage.SYSTEM_ENV = systemEnv.value = '预发布环境'
			localStorage.SYSTEM_BASE_URL = 'http://stat.119.gov.cn/staging';
			window.__axios.defaults.baseURL = 'http://stat.119.gov.cn/staging';
			getCode()
			showToast('已切换为预发布环境')
			window.checkAppVersion(false)
		} else if (clickNumber.value === 10) {
			localStorage.SYSTEM_ENV = systemEnv.value = '压测环境'
			localStorage.SYSTEM_BASE_URL = 'http://10.13.5.100';
			window.__axios.defaults.baseURL = 'http://10.13.5.100';
			getCode()
			showToast('已切换为压测环境')
			window.checkAppVersion(false)
		} else if (clickNumber.value === 15) {
			localStorage.SYSTEM_ENV = systemEnv.value = '测试环境'
			localStorage.SYSTEM_BASE_URL = 'http://10.13.5.47:8080';
			window.__axios.defaults.baseURL = 'http://10.13.5.47:8080';
			getCode()
			showToast('已切换为测试环境')
			window.checkAppVersion(false)
		}
	}
}
</script>

<style scoped lang="scss">
.login {
	height: 100%;
	background: url('~@/assets/images/login-bg.png');
	background-size: 100%;
	background-repeat: no-repeat;
	background-position: 0% 0%;
	overflow: auto;
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
	.isRemember {
		margin-top: 21px;
		font-size: 16px;
		::v-deep(.van-checkbox__label) {
			font-size: 14px;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			color: #545A66;
		}
	}
	::v-deep .van-field {
		background-color: #F0F5F8 !important;
		margin-top: 16px;
	}
	.submit {
		margin-top: 60px;
		margin-bottom: 20px;
		background-color: #7485CB !important;
		height: 36px;
	}
	.submit-phone {
		margin-top: 30px;
	}
	.img {
		width: 105px;
		height: 40px;
		margin-top: 17px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.validator {
		display:flex;
		justify-content:space-between;
		align-items:center;
		.verification {
			margin-right:12px;
		}
	}
	.verification {
		align-items: center;
	}
}
</style>
