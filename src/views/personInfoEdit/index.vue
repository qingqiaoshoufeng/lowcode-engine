<script setup>
import { ref, onMounted } from "vue";
import { useSubmit } from '@castle/castle-use';
import { showToast, showLoadingToast, closeToast } from "vant";
import { useRouter } from "vue-router";
import { addUser, getUserDetail } from '@/apis/index.js';
import { validateEmails, validateTelePhone } from '@/utils/validate.js'
import HeaderTitle from "@/component/HeaderTitle/index.vue";

const form = ref({
  userId: null,
  userName: null,
  mobile: null,
  email: null,
});

const router = useRouter();

const { loading, submit } = useSubmit(() => {
  showToast('保存成功')
  router.go(-1)
}, {
  submitFn: () => {
    const { userId, userName, mobile, email } = form.value
    const params = {
      userId,
      userName,
      mobile,
      email,
    }
    return addUser(params)
  },
})

const validateFireTel = (value, rule) => {
  if (!value) {
    return "请输入手机号码";
  } else if (!validateTelePhone(value)) {
    return "请输入正确手机号码";
  } else {
    return ''
  }
};

const validateEmail = (value, rule) => {
  if (!value) {
    return "";
  } else if (!validateEmails(value)) {
    return "请输入正确邮箱";
  } else {
    return ''
  }
};

const onSubmit = () => {
  submit()
};

onMounted(() => {
  getUserDetail().then(res => {
    if (res) {
      form.value.userId = res.userId
      form.value.userName = res.userName
      form.value.mobile = res.mobile
      form.value.email = res.email
    }
  })
})
</script>

<template>
  <div class="person-info-edit">
    <HeaderTitle title="编辑资料" />
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="form.userName"
          required
          maxlength="50"
          name="userName"
          label="用户名称："
          placeholder="用户名称"
          :rules="[{ required: true, message: '请输入用户名称' }]"
        />
        <van-field
          v-model="form.mobile"
          required
          maxlength="11"
          name="mobile"
          label="手机号码："
          placeholder="手机号码"
          :rules="[{ required: true, message: '请输入手机号码' }, { validator: validateFireTel, trigger: 'onBlur' },]"
        />
        <van-field
          v-model="form.email"
          :maxlength="18"
          name="email"
          label="邮箱："
          placeholder="邮箱"
          :rules="[{ required: false, message: '请输入邮箱' }, { validator: validateEmail, trigger: 'onBlur' },]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block :loading="loading" type="primary" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.person-info-edit {
}
</style>
