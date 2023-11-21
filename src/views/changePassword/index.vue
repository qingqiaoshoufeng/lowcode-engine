<script setup>
import { ref, onMounted } from "vue";
import { useSubmit } from "@castle/castle-use";
import { showToast, showLoadingToast, closeToast } from "vant";
import { useRouter } from "vue-router";
import { updatePwd, getUserDetail } from "@/apis/index.js";
import { validatePwd } from "@/utils/validate.js";
import HeaderTitle from "@/component/HeaderTitle/index.vue";

const form = ref({
  userId: "",
  password: null,
  confirmPassword: null,
  oldPassword: null,
});

const router = useRouter();

const { loading, submit } = useSubmit(
  () => {
    showToast("修改成功");
    router.go(-1);
  },
  {
    submitFn: () => {
      const { password, oldPassword } = form.value;
      const params = {
        userId: form.value?.userId,
        password,
        oldPassword,
      };
      return updatePwd(params);
    },
  }
);

const validatePassword = (value, rule) => {
  if (!value) {
    return "请输入新密码";
  } else if (!validatePwd(value)) {
    return "长度为8到20位，至少包含一个数字、一个小写字母、一个大写字母、一个特殊字符（@#$%^&+=）";
  } else {
    return "";
  }
};

const validateConfirmPassword = (value, rule) => {
  if (!value) {
    return "";
  } else if (value !== form.value.password) {
    return "两次输入的密码不一致";
  } else {
    return "";
  }
};

const onSubmit = () => {
  submit();
};

onMounted(() => {
  getUserDetail().then((res) => {
    if (res) {
      form.value.userId = res.userId;
    }
  });
});
</script>

<template>
  <div class="change-password">
    <HeaderTitle title="修改密码" />
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="form.oldPassword"
          required
          :type="form.oldPasswordShow ? '' : 'password'"
          maxlength="20"
          name="oldPassword"
          label="旧密码："
          placeholder="旧密码"
          :rules="[{ required: true, message: '请输入旧密码' }]"
        >
          <template #button>
            <span @click="() => (form.oldPasswordShow = !form.oldPasswordShow)">
              <van-icon name="closed-eye" v-if="!form.oldPasswordShow" />
              <van-icon name="eye-o" v-else />
            </span>
          </template>
        </van-field>
        <van-field
          v-model="form.password"
          required
          :type="form.passwordShow ? '' : 'password'"
          maxlength="20"
          name="password"
          label="新密码："
          placeholder="新密码"
          :rules="[
            { required: true, message: '请输入新密码' },
            { validator: validatePassword, trigger: 'onBlur' },
          ]"
        >
          <template #button>
            <span @click="() => (form.passwordShow = !form.passwordShow)">
              <van-icon name="closed-eye" v-if="!form.passwordShow" />
              <van-icon name="eye-o" v-else />
            </span>
          </template>
        </van-field>
        <van-field
          v-model="form.confirmPassword"
          required
          :type="form.confirmPasswordShow ? '' : 'password'"
          maxlength="20"
          name="confirmPassword"
          label="确认密码："
          placeholder="确认密码"
          :rules="[
            { required: true, message: '请输入确认密码' },
            { validator: validateConfirmPassword, trigger: 'onBlur' },
          ]"
        >
        <template #button>
            <span @click="() => (form.confirmPasswordShow = !form.confirmPasswordShow)">
              <van-icon name="closed-eye" v-if="!form.confirmPasswordShow" />
              <van-icon name="eye-o" v-else />
            </span>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          :loading="loading"
          type="primary"
          native-type="submit"
        >
          保存
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.change-password {
}
</style>
